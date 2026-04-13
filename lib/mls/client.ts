const MLS_GRID_BASE = 'https://api.mlsgrid.com/v2/';

export async function mlsGridFetch(pathOrUrl: string) {
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${MLS_GRID_BASE}${pathOrUrl}`;

  console.log('[MLS Grid] Fetching:', url);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.MLS_GRID_TOKEN!}`,
      'Accept-Encoding': 'gzip,deflate',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MLS Grid ${res.status}: ${body}`);
  }

  return res.json();
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
