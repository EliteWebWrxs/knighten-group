const MLS_GRID_BASE = 'https://api.mlsgrid.com/v2/';

// ---------- Rate-limit constants ----------
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const MIN_REQUEST_INTERVAL_MS = 550; // ~1.8 RPS, safely under the 2 RPS hard limit

// ---------- Per-invocation request counter ----------
// Module-level state that resets each Vercel cold/warm start.
let requestCount = 0;
let lastRequestTime = 0;

export function getRequestCount(): number {
  return requestCount;
}

export function resetRequestCount(): void {
  requestCount = 0;
  lastRequestTime = 0;
}

// ---------- Delay helper ----------
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Throttle: enforce minimum interval between requests ----------
async function throttle(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (lastRequestTime > 0 && elapsed < MIN_REQUEST_INTERVAL_MS) {
    await delay(MIN_REQUEST_INTERVAL_MS - elapsed);
  }
  lastRequestTime = Date.now();
}

// ---------- Jitter: randomize backoff to avoid thundering herd ----------
function backoffWithJitter(attempt: number): number {
  const exponential = BASE_BACKOFF_MS * Math.pow(2, attempt);
  const capped = Math.min(exponential, MAX_BACKOFF_MS);
  return Math.random() * capped;
}

// ---------- Main fetch with retry ----------
export async function mlsGridFetch(pathOrUrl: string) {
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${MLS_GRID_BASE}${pathOrUrl}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    await throttle();
    requestCount++;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.MLS_GRID_TOKEN!}`,
        'Accept-Encoding': 'gzip,deflate',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      return res.json();
    }

    // 429: Rate limited — respect Retry-After header or use backoff
    if (res.status === 429) {
      if (attempt === MAX_RETRIES) {
        throw new Error(`MLS Grid 429: Rate limited after ${MAX_RETRIES} retries`);
      }
      const retryAfter = res.headers.get('Retry-After');
      let waitMs: number;
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        waitMs = isNaN(seconds)
          ? Math.max(0, new Date(retryAfter).getTime() - Date.now())
          : seconds * 1_000;
      } else {
        waitMs = backoffWithJitter(attempt);
      }
      console.warn(
        `[MLS Grid] 429 on attempt ${attempt + 1}/${MAX_RETRIES + 1}, ` +
          `waiting ${Math.round(waitMs)}ms (Retry-After: ${retryAfter ?? 'none'})`
      );
      await delay(waitMs);
      continue;
    }

    // 5xx: Server error — retryable with backoff
    if (res.status >= 500) {
      if (attempt === MAX_RETRIES) {
        const body = await res.text().catch(() => '');
        throw new Error(
          `MLS Grid ${res.status} after ${MAX_RETRIES} retries: ${body}`
        );
      }
      const waitMs = backoffWithJitter(attempt);
      console.warn(
        `[MLS Grid] ${res.status} on attempt ${attempt + 1}/${MAX_RETRIES + 1}, ` +
          `waiting ${Math.round(waitMs)}ms`
      );
      await delay(waitMs);
      continue;
    }

    // 4xx (not 429): Non-retryable client error
    const body = await res.text().catch(() => '');
    throw new Error(`MLS Grid ${res.status}: ${body}`);
  }

  throw new Error('MLS Grid fetch: exhausted retries');
}
