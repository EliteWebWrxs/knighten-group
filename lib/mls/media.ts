import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Downloads a photo from MLS Grid and uploads to Supabase Storage.
 * Returns the storage path. Per MLS Grid Best Practices paragraph 10,
 * we must not hotlink media URLs.
 */
export async function downloadAndStoreMedia(
  mediaKey: string,
  mediaUrl: string,
  listingKey: string
): Promise<string | null> {
  try {
    const res = await fetch(mediaUrl, {
      headers: {
        Authorization: `Bearer ${process.env.MLS_GRID_TOKEN!}`,
        'Accept-Encoding': 'gzip,deflate',
      },
    });

    if (!res.ok) return null;

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
 * Process all media for listings that have original URLs but no storage path.
 * Run this after sync to backfill photos.
 */
export async function processUndownloadedMedia(batchSize = 50) {
  const supabase = getServiceClient();

  const { data: media } = await supabase
    .from('listing_media')
    .select('media_key, media_url_original, listing_key')
    .is('storage_path', null)
    .not('media_url_original', 'is', null)
    .limit(batchSize);

  if (!media?.length) return 0;

  let processed = 0;
  for (const m of media) {
    const path = await downloadAndStoreMedia(
      m.media_key,
      m.media_url_original,
      m.listing_key
    );
    if (path) processed++;
    // Respect rate limits even for media downloads
    await new Promise((r) => setTimeout(r, 300));
  }

  return processed;
}
