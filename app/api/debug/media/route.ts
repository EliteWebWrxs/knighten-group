import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const diagnostics: Record<string, unknown> = {};

  // 1. Count total rows
  const { count: total, error: e1 } = await supabase
    .from('listing_media')
    .select('*', { count: 'exact', head: true });
  diagnostics.totalRows = total;
  diagnostics.totalError = e1?.message ?? null;

  // 2. Count rows with storage_path IS NULL
  const { count: nullStorage, error: e2 } = await supabase
    .from('listing_media')
    .select('*', { count: 'exact', head: true })
    .is('storage_path', null);
  diagnostics.nullStoragePath = nullStorage;
  diagnostics.nullStorageError = e2?.message ?? null;

  // 3. Count rows with media_url_original IS NOT NULL
  const { count: hasUrl, error: e3 } = await supabase
    .from('listing_media')
    .select('*', { count: 'exact', head: true })
    .not('media_url_original', 'is', null);
  diagnostics.hasUrl = hasUrl;
  diagnostics.hasUrlError = e3?.message ?? null;

  // 4. Try the combined query
  const { data: sample, error: e4 } = await supabase
    .from('listing_media')
    .select('media_key, media_url_original, listing_key, storage_path')
    .is('storage_path', null)
    .not('media_url_original', 'is', null)
    .limit(3);
  diagnostics.combinedQuery = { count: sample?.length ?? 0, error: e4?.message ?? null };
  diagnostics.sampleRows = sample;

  // 5. Try fetching just any 3 rows, no filters
  const { data: anyRows, error: e5 } = await supabase
    .from('listing_media')
    .select('media_key, media_url_original, storage_path')
    .limit(3);
  diagnostics.anyRows = { count: anyRows?.length ?? 0, error: e5?.message ?? null };
  diagnostics.anySample = anyRows;

  return Response.json(diagnostics);
}
