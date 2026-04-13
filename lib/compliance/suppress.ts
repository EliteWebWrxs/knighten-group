export interface ListingDisplay {
  listing_key: string;
  standard_status: string;
  internet_address_display_yn: boolean | null;
  unparsed_address: string | null;
  street_number: string | null;
  street_name: string | null;
  city: string | null;
  state_or_province: string | null;
  postal_code: string | null;
  buyer_agent_key: string | null;
  list_office_key: string | null;
  [key: string]: unknown;
}

/**
 * Client-side suppression helper. Defense in depth:
 * DB layer (RLS) handles primary filtering, but we also
 * suppress at the rendering layer per TPDAA requirements.
 */
export function suppressDisplay<T extends ListingDisplay>(listing: T): T {
  const out = { ...listing };

  // Suppress address when internet display is not allowed
  if (listing.internet_address_display_yn === false) {
    out.unparsed_address = null;
    out.street_number = null;
    out.street_name = null;
  }

  // Suppress buyer agent info when status is Pending
  if (listing.standard_status === 'Pending') {
    out.buyer_agent_key = null;
  }

  return out;
}

/**
 * Returns the display address for a listing, respecting suppression rules.
 */
export function getDisplayAddress(listing: ListingDisplay): string {
  if (listing.internet_address_display_yn === false) {
    const parts = [listing.city, listing.state_or_province, listing.postal_code].filter(Boolean);
    return parts.join(', ') || 'Address withheld';
  }

  if (listing.unparsed_address) {
    return listing.unparsed_address;
  }

  const parts = [
    [listing.street_number, listing.street_name].filter(Boolean).join(' '),
    listing.city,
    listing.state_or_province,
    listing.postal_code,
  ].filter(Boolean);

  return parts.join(', ') || 'Address not available';
}
