import { syncProperty, syncMember, syncOffice, syncOpenHouse } from '@/lib/mls/sync';
import { processUndownloadedMedia } from '@/lib/mls/media';

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

  const results: Record<string, string> = {};

  try {
    await syncProperty();
    results.property = 'success';
  } catch (e) {
    results.property = e instanceof Error ? e.message : 'unknown error';
  }

  try {
    await syncMember();
    results.member = 'success';
  } catch (e) {
    results.member = e instanceof Error ? e.message : 'unknown error';
  }

  try {
    await syncOffice();
    results.office = 'success';
  } catch (e) {
    results.office = e instanceof Error ? e.message : 'unknown error';
  }

  try {
    await syncOpenHouse();
    results.openHouse = 'success';
  } catch (e) {
    results.openHouse = e instanceof Error ? e.message : 'unknown error';
  }

  // Process any undownloaded media
  try {
    const mediaProcessed = await processUndownloadedMedia(50);
    results.mediaProcessed = String(mediaProcessed);
  } catch (e) {
    results.mediaProcessed = e instanceof Error ? e.message : 'unknown error';
  }

  return Response.json({ ok: true, results });
}
