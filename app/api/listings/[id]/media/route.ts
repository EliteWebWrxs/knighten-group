import { createClient } from '@supabase/supabase-js';
import { mlsGridFetch } from '@/lib/mls/client';
import { downloadAndStoreMedia } from '@/lib/mls/media';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/listings/[id]/media
 * Fetches fresh media URLs from MLS Grid and downloads all images
 * for a listing that don't already have a storage_path.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listingKey } = await params;
  const supabase = getServiceClient();

  // Check which media already has storage_path
  const { data: existing } = await supabase
    .from('listing_media')
    .select('media_key, storage_path')
    .eq('listing_key', listingKey);

  const alreadyDownloaded = new Set(
    (existing || []).filter((m) => m.storage_path).map((m) => m.media_key)
  );

  // If all media is already downloaded, return early
  const totalMedia = existing?.length || 0;
  if (totalMedia > 0 && alreadyDownloaded.size === totalMedia) {
    return Response.json({ downloaded: 0, total: totalMedia, status: 'complete' });
  }

  // Fetch fresh URLs from MLS Grid
  let media: Record<string, unknown>[];
  try {
    const data = await mlsGridFetch(`Property('${listingKey}')?$expand=Media`);
    media = (data.Media ?? []) as Record<string, unknown>[];
  } catch (err) {
    console.error(`Failed to fetch media for ${listingKey}:`, err);
    return Response.json(
      { error: 'Failed to fetch media URLs' },
      { status: 502 }
    );
  }

  if (media.length === 0) {
    return Response.json({ downloaded: 0, total: 0, status: 'no_media' });
  }

  // Download images that aren't in storage yet
  let downloaded = 0;
  for (const m of media) {
    const mediaKey = m.MediaKey as string;
    const mediaUrl = m.MediaURL as string;

    if (!mediaKey || !mediaUrl) continue;
    if (alreadyDownloaded.has(mediaKey)) continue;

    const path = await downloadAndStoreMedia(mediaKey, mediaUrl, listingKey);
    if (path) downloaded++;

    // Small delay between downloads to avoid rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  return Response.json({
    downloaded,
    total: media.length,
    alreadyCached: alreadyDownloaded.size,
    status: 'ok',
  });
}
