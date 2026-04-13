import { createClient } from '@supabase/supabase-js';
import { mlsGridFetch, delay } from './client';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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
    const res = await fetch(mediaUrl);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`Media download failed ${mediaKey}: HTTP ${res.status} - ${body.slice(0, 200)}`);
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
  mediaRecords: { mediaKey: string; mediaUrl: string; listingKey: string; isPrimary: boolean }[]
): Promise<number> {
  // Only download primary images during sync to stay within time budget
  const primaries = mediaRecords.filter((m) => m.isPrimary);
  let downloaded = 0;

  for (const m of primaries) {
    const path = await downloadAndStoreMedia(m.mediaKey, m.mediaUrl, m.listingKey);
    if (path) downloaded++;
    // Small delay between downloads
    await new Promise((r) => setTimeout(r, 100));
  }

  return downloaded;
}

/**
 * Backfill media for listings that have no downloaded images.
 * Re-fetches fresh URLs from MLS Grid API since stored URLs expire.
 */
export async function backfillMedia(batchSize = 20) {
  const supabase = getServiceClient();

  // Find listing_keys that have media but nothing downloaded yet
  const { data: media, error } = await supabase
    .from('listing_media')
    .select('listing_key')
    .is('storage_path', null)
    .not('media_url_original', 'is', null)
    .limit(batchSize * 5);

  if (error || !media?.length) return { processed: 0, found: 0 };

  // Deduplicate to unique listing keys
  const uniqueKeys = [...new Set(media.map((m) => m.listing_key))].slice(0, batchSize);
  return await fetchAndDownloadForListings(uniqueKeys);
}

/**
 * For a set of listing keys, fetch fresh media URLs from MLS Grid
 * and download the primary image for each.
 */
async function fetchAndDownloadForListings(listingKeys: string[]) {
  let processed = 0;

  for (const listingKey of listingKeys) {
    try {
      // Fetch fresh media URLs from MLS Grid for this listing
      const url = `Property('${listingKey}')?$expand=Media`;
      const data = await mlsGridFetch(url);

      const media = (data.Media ?? []) as Record<string, unknown>[];
      if (media.length === 0) continue;

      // Download primary image (first one)
      const primary = media[0];
      const mediaUrl = primary.MediaURL as string;
      const mediaKey = primary.MediaKey as string;

      if (!mediaUrl || !mediaKey) continue;

      const path = await downloadAndStoreMedia(mediaKey, mediaUrl, listingKey);
      if (path) processed++;

      // Respect rate limits
      await delay(600);
    } catch (err) {
      console.error(`Backfill failed for ${listingKey}:`, err);
    }
  }

  return { processed, found: listingKeys.length };
}
