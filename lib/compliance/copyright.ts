/**
 * Returns the current-year MLS copyright string.
 * Displayed on every page that shows listing data.
 */
export function getMlsCopyright(year: number): string {
  return `\u00A9 ${year} Mid-Florida Regional Multiple Listing Service, Inc.`;
}

export function getSiteCopyright(year: number): string {
  return `\u00A9 ${year} The Knighten Group LLC`;
}

export function isIdxEnabled(): boolean {
  return process.env.IDX_ENABLED !== 'false';
}
