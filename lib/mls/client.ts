const MLS_GRID_BASE = 'https://api.mlsgrid.com/v2/';

/**
 * Encode a path+query for MLS Grid. Spaces and single quotes in the
 * OData $filter must be percent-encoded; $-prefixed param names must not.
 */
function encodeODataUrl(pathAndQuery: string): string {
  const [path, qs] = pathAndQuery.split('?');
  if (!qs) return `${MLS_GRID_BASE}${path}`;

  const encoded = qs
    .replace(/ /g, '%20')
    .replace(/'/g, '%27');

  return `${MLS_GRID_BASE}${path}?${encoded}`;
}

export async function mlsGridFetch(pathOrUrl: string) {
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : encodeODataUrl(pathOrUrl);

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
