import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const diagnostics: Record<string, unknown> = {};

  // Get one media row to test
  const { data: sample } = await supabase
    .from('listing_media')
    .select('media_key, media_url_original, listing_key')
    .is('storage_path', null)
    .not('media_url_original', 'is', null)
    .limit(1)
    .single();

  if (!sample) {
    return Response.json({ error: 'No media rows found' });
  }

  diagnostics.mediaKey = sample.media_key;
  diagnostics.url = sample.media_url_original;

  // Try fetching without auth
  try {
    const res1 = await fetch(sample.media_url_original);
    diagnostics.noAuth = {
      status: res1.status,
      statusText: res1.statusText,
      contentType: res1.headers.get('content-type'),
      body: res1.ok ? `(${res1.headers.get('content-length')} bytes)` : await res1.text().then(t => t.slice(0, 500)),
    };
  } catch (e) {
    diagnostics.noAuth = { error: String(e) };
  }

  // Try fetching with bearer token
  try {
    const res2 = await fetch(sample.media_url_original, {
      headers: { Authorization: `Bearer ${process.env.MLS_GRID_TOKEN!}` },
    });
    diagnostics.withAuth = {
      status: res2.status,
      statusText: res2.statusText,
      contentType: res2.headers.get('content-type'),
      body: res2.ok ? `(${res2.headers.get('content-length')} bytes)` : await res2.text().then(t => t.slice(0, 500)),
    };
  } catch (e) {
    diagnostics.withAuth = { error: String(e) };
  }

  // Try fetching with the URL reformatted — maybe needs ? instead of bare params
  const fixedUrl = sample.media_url_original.replace(
    'media.mlsgrid.com/token=',
    'media.mlsgrid.com/?token='
  );
  diagnostics.fixedUrl = fixedUrl;

  try {
    const res3 = await fetch(fixedUrl);
    diagnostics.fixedNoAuth = {
      status: res3.status,
      statusText: res3.statusText,
      contentType: res3.headers.get('content-type'),
      body: res3.ok ? `(${res3.headers.get('content-length')} bytes)` : await res3.text().then(t => t.slice(0, 500)),
    };
  } catch (e) {
    diagnostics.fixedNoAuth = { error: String(e) };
  }

  return Response.json(diagnostics);
}
