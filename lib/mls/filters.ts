const DISPLAYABLE_STATUSES = new Set(['Active', 'Pending']);

/**
 * Checks Exhibit A display rules. Returns true if the listing
 * is allowed to be shown publicly on the IDX site.
 * Defense-in-depth: these rules are ALSO enforced at the RLS layer.
 */
export function passesExhibitA(listing: Record<string, unknown>): boolean {
  return (
    listing.MlgCanView !== false &&
    DISPLAYABLE_STATUSES.has(listing.StandardStatus as string) &&
    listing.InternetEntireListingDisplayYN !== false &&
    listing.IDXParticipationYN !== false &&
    listing.DelayedDistributionYN !== true &&
    listing.OfficeExclusiveYN !== true
  );
}

/**
 * Applies field-level suppression rules before storing or displaying.
 * - Blanks address when InternetAddressDisplayYN is false
 * - Blanks buyer agent info when status is Pending
 */
export function suppressFields(
  listing: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...listing };

  if (listing.InternetAddressDisplayYN === false) {
    out.UnparsedAddress = null;
    out.StreetNumber = null;
    out.StreetName = null;
    // Keep city/zip/lat/long per Stellar guidance (street-level only)
  }

  if (listing.StandardStatus === 'Pending') {
    out.BuyerAgentKey = null;
    out.BuyerAgentFullName = null;
    out.BuyerAgentEmail = null;
    out.BuyerAgentDirectPhone = null;
    out.BuyerOfficeName = null;
  }

  return out;
}
