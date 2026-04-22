import { createClient } from '@supabase/supabase-js';
import {
  syncProperty,
  syncMember,
  syncOffice,
  syncOpenHouse,
} from '@/lib/mls/sync';
import { backfillMedia } from '@/lib/mls/media';
import { resetRequestCount, getRequestCount } from '@/lib/mls/client';

const RESOURCE_MAP: Record<
  string,
  () => Promise<{
    fetched: number;
    pagesWalked: number;
    hasMore: boolean;
    kept?: number;
  }>
> = {
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
 * Determine which resource to sync next using priority-based scheduling:
 *
 * 1. Any resource with has_more = true (Property prioritized over others)
 * 2. Any resource never synced (ordered: Property > Member > Office > OpenHouse)
 * 3. Round-robin by least recently finished (steady-state)
 */
async function pickNextResource(): Promise<string> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('sync_state')
    .select(
      'resource, greatest_modification_timestamp, last_run_finished_at, has_more'
    )
    .in('resource', Object.keys(RESOURCE_MAP));

  if (!data || data.length === 0) return 'Property';

  // Priority 1: Any resource that has more pages pending
  const withMore = data.filter((d) => d.has_more === true);
  if (withMore.length > 0) {
    const property = withMore.find((d) => d.resource === 'Property');
    if (property) return 'Property';
    return withMore[0].resource;
  }

  // Priority 2: Any resource never synced at all
  const resourceOrder = ['Property', 'Member', 'Office', 'OpenHouse'];
  const syncedResources = new Set(data.map((d) => d.resource));
  for (const r of resourceOrder) {
    if (!syncedResources.has(r)) return r;
  }
  const neverSynced = data.filter((d) => !d.greatest_modification_timestamp);
  if (neverSynced.length > 0) {
    for (const r of resourceOrder) {
      if (neverSynced.find((d) => d.resource === r)) return r;
    }
  }

  // Priority 3: Round-robin by least recently finished
  const sorted = [...data].sort((a, b) => {
    if (!a.last_run_finished_at) return -1;
    if (!b.last_run_finished_at) return 1;
    return (
      new Date(a.last_run_finished_at).getTime() -
      new Date(b.last_run_finished_at).getTime()
    );
  });

  return sorted[0].resource;
}

export async function GET(req: Request) {
  const startTime = Date.now();
  resetRequestCount();

  // Verify cron secret — Vercel Cron sends it via x-vercel-cron-auth-token,
  // manual triggers can use Authorization: Bearer <token>
  const vercelToken = req.headers.get('x-vercel-cron-auth-token');
  const bearerToken = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = vercelToken || bearerToken;
  if (token !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Kill switch
  if (process.env.IDX_ENABLED === 'false') {
    return Response.json({ ok: false, reason: 'IDX disabled via kill switch' });
  }

  const url = new URL(req.url);
  const requestedResource = url.searchParams.get('resource');

  // Allow triggering media backfill directly
  if (requestedResource === 'Media') {
    try {
      const mediaResult = await backfillMedia(50);
      return Response.json({
        ok: true,
        results: { resource: 'Media', ...mediaResult },
        meta: {
          durationMs: Date.now() - startTime,
          apiRequests: getRequestCount(),
        },
      });
    } catch (e) {
      return Response.json({
        ok: false,
        results: {
          resource: 'Media',
          error: e instanceof Error ? e.message : 'unknown error',
        },
        meta: {
          durationMs: Date.now() - startTime,
          apiRequests: getRequestCount(),
        },
      });
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

    // Backfill media if we have time and request budget remaining
    const elapsed = Date.now() - startTime;
    const remainingMs = 270_000 - elapsed;

    if (!syncResult.hasMore && remainingMs > 30_000 && getRequestCount() < 30) {
      try {
        // If no new data was synced, do an aggressive backfill
        const batchSize = syncResult.fetched === 0 ? 200 : 40;
        const mediaResult = await backfillMedia(batchSize);
        results.media = mediaResult;
      } catch (e) {
        results.mediaError = e instanceof Error ? e.message : 'unknown error';
      }
    }
  } catch (e) {
    results.error = e instanceof Error ? e.message : 'unknown error';
  }

  return Response.json({
    ok: !results.error,
    results,
    meta: {
      durationMs: Date.now() - startTime,
      apiRequests: getRequestCount(),
    },
  });
}
