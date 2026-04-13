import { createClient } from '@supabase/supabase-js';
import { syncProperty, syncMember, syncOffice, syncOpenHouse } from '@/lib/mls/sync';
import { backfillMedia } from '@/lib/mls/media';

const RESOURCE_MAP: Record<string, () => Promise<{ fetched: number; pagesWalked: number; hasMore: boolean; kept?: number }>> = {
  Property: syncProperty,
  Member: syncMember,
  Office: syncOffice,
  OpenHouse: syncOpenHouse,
};

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Pick the resource whose sync is most overdue.
 * Returns the resource name that was synced least recently
 * (or hasn't been synced at all).
 */
async function pickNextResource(): Promise<string> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('sync_state')
    .select('resource, last_run_finished_at')
    .in('resource', Object.keys(RESOURCE_MAP))
    .order('last_run_finished_at', { ascending: true, nullsFirst: true })
    .limit(1);

  if (data && data.length > 0) {
    return data[0].resource;
  }

  // No sync_state rows exist yet — start with Property
  return 'Property';
}

export async function GET(req: Request) {
  // Verify cron secret
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Kill switch
  if (process.env.IDX_ENABLED === 'false') {
    return Response.json({ ok: false, reason: 'IDX disabled via kill switch' });
  }

  const url = new URL(req.url);
  const requestedResource = url.searchParams.get('resource');

  // Allow triggering media backfill directly — re-fetches fresh URLs from MLS Grid
  if (requestedResource === 'Media') {
    try {
      const mediaResult = await backfillMedia(20);
      return Response.json({ ok: true, results: { resource: 'Media', ...mediaResult } });
    } catch (e) {
      return Response.json({ ok: false, results: { resource: 'Media', error: e instanceof Error ? e.message : 'unknown error' } });
    }
  }

  // Determine which resource to sync
  let resource: string;
  if (requestedResource && RESOURCE_MAP[requestedResource]) {
    resource = requestedResource;
  } else {
    resource = await pickNextResource();
  }

  const syncFn = RESOURCE_MAP[resource];
  const results: Record<string, unknown> = { resource };

  try {
    const syncResult = await syncFn();
    results.sync = syncResult;

    // If this resource has no more pages, also backfill some media
    if (!syncResult.hasMore) {
      try {
        const mediaResult = await backfillMedia(10);
        results.media = mediaResult;
      } catch (e) {
        results.mediaError = e instanceof Error ? e.message : 'unknown error';
      }
    }
  } catch (e) {
    results.error = e instanceof Error ? e.message : 'unknown error';
  }

  return Response.json({ ok: !results.error, results });
}
