import { createClient } from '@supabase/supabase-js';
import { mlsGridFetch, delay } from './client';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ORIGINATING_SYSTEM =
  process.env.MLS_GRID_ORIGINATING_SYSTEM_NAME || 'mfrmls';

// Cap images per cron run to avoid hitting media CDN rate limits
const MAX_IMAGES_PER_RUN = 50;

// Delay between image downloads — MLS Grid media CDN rate-limits aggressively.
// 1 image per second keeps us well under their threshold.
const IMAGE_DOWNLOAD_DELAY_MS = 1000;

/**
 * Downloads a photo from a fresh MLS Grid MediaURL and uploads to Supabase Storage.
 * Returns the storage path. MLS Grid MediaURLs are signed and expire quickly,
 * so this must be called with a freshly-obtained URL.
 */
export async function downloadAndStoreMedia(
  mediaKey: string,
  mediaUrl: string,
  listingKey: string
): Promise<string | null> {
  try {
    let res: Response | null = null;

    // Retry up to 3 times with backoff for 429/5xx on image downloads
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch(mediaUrl);

      if (res.ok) break;

      if (res.status === 429 || res.status >= 500) {
        const retryAfter = res.headers.get('Retry-After');
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000 || 2000
          : 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
        console.warn(
          `[Media] ${res.status} downloading ${mediaKey}, retrying in ${waitMs}ms (attempt ${attempt + 1}/3)`
        );
        await delay(waitMs);
        continue;
      }

      // Non-retryable error
      break;
    }

    if (!res || !res.ok) {
      const body = res ? await res.text().catch(() => '') : 'no response';
      console.error(
        `Media download failed ${mediaKey}: HTTP ${res?.status} - ${body.slice(0, 200)}`
      );
      return null;
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png' : 'jpg';
    const storagePath = `${listingKey}/${mediaKey}.${ext}`;

    const buffer = Buffer.from(await res.arrayBuffer());
    const supabase = getServiceClient();

    const { error } = await supabase.storage
      .from('listing-photos')
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Storage upload failed for ${mediaKey}:`, error.message);
      return null;
    }

    // Update the media record with the storage path
    await supabase
      .from('listing_media')
      .update({ storage_path: storagePath })
      .eq('media_key', mediaKey);

    return storagePath;
  } catch (err) {
    console.error(`Failed to download media ${mediaKey}:`, err);
    return null;
  }
}

/**
 * Download media for a batch of fresh Media records from the API response.
 * Called inline during syncProperty when we have fresh (non-expired) URLs.
 * Only downloads the primary (first) image per listing to stay within time limits.
 */
export async function downloadMediaBatch(
  mediaRecords: {
    mediaKey: string;
    mediaUrl: string;
    listingKey: string;
    isPrimary: boolean;
  }[],
  maxDownloads?: number
): Promise<number> {
  // Only download primary images during sync to stay within time budget
  const primaries = mediaRecords.filter((m) => m.isPrimary);
  const limit = maxDownloads ?? primaries.length;
  let downloaded = 0;

  for (const m of primaries.slice(0, limit)) {
    const path = await downloadAndStoreMedia(m.mediaKey, m.mediaUrl, m.listingKey);
    if (path) downloaded++;
    await delay(IMAGE_DOWNLOAD_DELAY_MS);
  }

  return downloaded;
}

/**
 * Backfill media for listings that have no downloaded images.
 * Uses batch OData query with `in` operator instead of per-listing API calls.
 * 20 listings per API call instead of 1.
 */
export async function backfillMedia(batchSize = 50): Promise<{
  processed: number;
  found: number;
  apiCalls: number;
}> {
  const supabase = getServiceClient();

  // Find listing_keys that have media but nothing downloaded yet
  const { data: media, error } = await supabase
    .from('listing_media')
    .select('listing_key')
    .is('storage_path', null)
    .not('media_url_original', 'is', null)
    .limit(batchSize * 5);

  if (error || !media?.length) return { processed: 0, found: 0, apiCalls: 0 };

  // Deduplicate to unique listing keys
  const uniqueKeys = [...new Set(media.map((m) => m.listing_key))].slice(
    0,
    batchSize
  );

  return await batchFetchAndDownload(uniqueKeys);
}

/**
 * Batch-fetch fresh media URLs for multiple listings using the OData `in` operator.
 * Chunks into groups of 20 listing keys per API request to keep URL length reasonable.
 */
async function batchFetchAndDownload(listingKeys: string[]): Promise<{
  processed: number;
  found: number;
  apiCalls: number;
}> {
  const CHUNK_SIZE = 20;
  let processed = 0;
  let apiCalls = 0;
  let totalDownloaded = 0;

  for (let i = 0; i < listingKeys.length; i += CHUNK_SIZE) {
    // Bandwidth guard
    if (totalDownloaded >= MAX_IMAGES_PER_RUN) {
      console.warn('[Backfill] Image download limit reached, stopping');
      break;
    }

    const chunk = listingKeys.slice(i, i + CHUNK_SIZE);

    // Build OData `in` filter: ListingKey in ('KEY1','KEY2',...)
    const inClause = chunk.map((k) => `'${k}'`).join(',');
    const url =
      `Property?$filter=ListingKey in (${inClause})` +
      ` and OriginatingSystemName eq '${ORIGINATING_SYSTEM}'` +
      `&$expand=Media&$top=1000`;

    try {
      const data = await mlsGridFetch(url);
      apiCalls++;

      const records: Record<string, unknown>[] = data.value ?? [];

      for (const record of records) {
        if (totalDownloaded >= MAX_IMAGES_PER_RUN) break;

        const listingKey = record.ListingKey as string;
        const mediaList = (record.Media ?? []) as Record<string, unknown>[];
        if (mediaList.length === 0) continue;

        // Download primary image only
        const primary = mediaList[0];
        const mediaUrl = primary.MediaURL as string;
        const mediaKey = primary.MediaKey as string;
        if (!mediaUrl || !mediaKey) continue;

        const path = await downloadAndStoreMedia(mediaKey, mediaUrl, listingKey);
        if (path) {
          processed++;
          totalDownloaded++;
        }

        await delay(IMAGE_DOWNLOAD_DELAY_MS);
      }
    } catch (err) {
      console.error(
        `[Backfill] Batch fetch failed for chunk starting at index ${i}:`,
        err
      );
      // Continue with remaining chunks rather than aborting entirely
    }
  }

  return { processed, found: listingKeys.length, apiCalls };
}
