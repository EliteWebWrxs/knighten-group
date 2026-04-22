import { createClient } from '@supabase/supabase-js';
import { mlsGridFetch, delay, getRequestCount } from './client';
import { suppressFields } from './filters';
import { downloadMediaBatch } from './media';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function ensureSyncState(resource: string) {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('sync_state')
    .select('*')
    .eq('resource', resource)
    .single();
  if (!data) {
    await supabase.from('sync_state').insert({ resource });
    return null;
  }
  // Normalize timestamp to Z format — Supabase may return +00:00 which
  // contains a '+' that breaks OData $filter URLs.
  if (data.greatest_modification_timestamp) {
    data.greatest_modification_timestamp = new Date(
      data.greatest_modification_timestamp
    ).toISOString();
  }
  return data;
}

async function updateSyncState(
  resource: string,
  greatestTs: Date,
  hasMore: boolean
) {
  const supabase = getServiceClient();
  await supabase
    .from('sync_state')
    .update({
      greatest_modification_timestamp: greatestTs.toISOString(),
      last_run_finished_at: new Date().toISOString(),
      last_run_status: 'success',
      last_error: null,
      has_more: hasMore,
    })
    .eq('resource', resource);
}

async function writeSyncLog(entry: {
  resource: string;
  fetched: number;
  kept: number;
  pagesWalked: number;
  startedAt: Date;
  error?: string;
  requestsUsed?: number;
}) {
  const supabase = getServiceClient();
  await supabase.from('sync_log').insert({
    resource: entry.resource,
    started_at: entry.startedAt.toISOString(),
    finished_at: new Date().toISOString(),
    records_fetched: entry.fetched,
    records_kept_after_filter: entry.kept,
    status: entry.error ? 'error' : 'success',
    error_message: entry.error || null,
    next_link_pages_walked: entry.pagesWalked,
    requests_used: entry.requestsUsed ?? null,
  });
}

function mapPropertyToRow(r: Record<string, unknown>) {
  return {
    listing_key: r.ListingKey,
    listing_id: r.ListingId ?? r.MLSListingId,
    originating_system_name: r.OriginatingSystemName,
    standard_status: r.StandardStatus,
    modification_timestamp: r.ModificationTimestamp,
    mlg_can_view: r.MlgCanView ?? true,
    internet_entire_listing_display_yn: r.InternetEntireListingDisplayYN,
    idx_participation_yn: r.IDXParticipationYN,
    delayed_distribution_yn: r.DelayedDistributionYN,
    office_exclusive_yn: r.OfficeExclusiveYN,
    internet_address_display_yn: r.InternetAddressDisplayYN,
    unparsed_address: r.UnparsedAddress,
    street_number: r.StreetNumber,
    street_name: r.StreetName,
    city: r.City,
    state_or_province: r.StateOrProvince,
    postal_code: r.PostalCode,
    county_or_parish: r.CountyOrParish,
    latitude: r.Latitude,
    longitude: r.Longitude,
    list_price: r.ListPrice,
    close_price: r.ClosePrice,
    original_list_price: r.OriginalListPrice,
    bedrooms_total: r.BedroomsTotal,
    bathrooms_total_integer: r.BathroomsTotalInteger,
    bathrooms_half: r.BathroomsHalf,
    living_area: r.LivingArea,
    lot_size_acres: r.LotSizeAcres,
    lot_size_square_feet: r.LotSizeSquareFeet,
    year_built: r.YearBuilt,
    property_type: r.PropertyType,
    property_sub_type: r.PropertySubType,
    stories: r.Stories,
    garage_spaces: r.GarageSpaces,
    pool_yn: r.PoolPrivateYN,
    waterfront_yn: r.WaterfrontYN,
    new_construction_yn: r.NewConstructionYN,
    hoa_fee: r.AssociationFee,
    hoa_fee_frequency: r.AssociationFeeFrequency,
    public_remarks: r.PublicRemarks,
    list_date: r.ListingContractDate,
    close_date: r.CloseDate,
    days_on_market: r.DaysOnMarket,
    list_agent_key: r.ListAgentKey,
    list_office_key: r.ListOfficeKey,
    buyer_agent_key: r.BuyerAgentKey,
    buyer_office_key: r.BuyerOfficeKey,
    raw: r,
    updated_at: new Date().toISOString(),
  };
}

const ORIGINATING_SYSTEM =
  process.env.MLS_GRID_ORIGINATING_SYSTEM_NAME || 'mfrmls';

// Initial import date floor — only fetch listings modified since this date
// on the very first sync (no prior watermark). Ongoing syncs use the stored watermark.
const INITIAL_IMPORT_FLOOR = '2026-01-01T00:00:00.000Z';

// With $expand=Media, MLS Grid caps $top at 1,000.
// Without $expand (Member, Office, OpenHouse), max is 5,000.
const PROPERTY_PAGE_SIZE = 1000;
const OTHER_PAGE_SIZE = 5000;

// Max pages per invocation. With 1,000 records/page for Property,
// 5 pages = 5,000 records per run.
const MAX_PAGES_PER_RUN = 5;

// Safety margin: stop 30 seconds before Vercel 300s timeout.
const MAX_ELAPSED_MS = 270_000;

// Max MLS Grid API requests per invocation.
const MAX_REQUESTS_PER_RUN = 40;

export async function syncProperty() {
  const state = await ensureSyncState('Property');
  const startedAt = new Date();
  const runStart = Date.now();
  const isInitialImport = !state?.greatest_modification_timestamp;

  // Use stored watermark or fall back to the initial import floor date
  const tsValue = state?.greatest_modification_timestamp || INITIAL_IMPORT_FLOOR;
  const tsFilter = ` and ModificationTimestamp ge ${tsValue}`;

  let url: string | null =
    `Property?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}` +
    `&$expand=Media&$top=${PROPERTY_PAGE_SIZE}`;

  let pagesWalked = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(INITIAL_IMPORT_FLOOR);
  let kept = 0;
  let fetched = 0;
  let mediaDownloaded = 0;

  try {
    const supabase = getServiceClient();
    await supabase
      .from('sync_state')
      .update({
        last_run_started_at: startedAt.toISOString(),
        last_run_status: 'running',
      })
      .eq('resource', 'Property');

    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
      // Budget guards
      if (Date.now() - runStart > MAX_ELAPSED_MS) {
        console.warn('[Sync] Approaching Vercel timeout, stopping early');
        break;
      }
      if (getRequestCount() >= MAX_REQUESTS_PER_RUN) {
        console.warn('[Sync] Request budget exhausted, stopping early');
        break;
      }

      const page = await mlsGridFetch(url);
      const records: Record<string, unknown>[] = page.value ?? [];
      fetched += records.length;

      // Batch: collect rows to upsert
      const listingRows: ReturnType<typeof mapPropertyToRow>[] = [];
      const allMediaRows: Record<string, unknown>[][] = [];
      const toSoftDelete: string[] = [];
      const freshMediaForDownload: {
        mediaKey: string;
        mediaUrl: string;
        listingKey: string;
        isPrimary: boolean;
      }[] = [];

      for (const r of records) {
        if (r.MlgCanView === false) {
          toSoftDelete.push(r.ListingKey as string);
        } else {
          const suppressed = suppressFields(r);
          listingRows.push(mapPropertyToRow(suppressed));
          const media = (r.Media as Record<string, unknown>[]) ?? [];
          if (media.length > 0) {
            allMediaRows.push(
              media.map((m, i) => ({
                media_key: m.MediaKey as string,
                listing_key: r.ListingKey as string,
                media_url_original: m.MediaURL as string,
                order_index: (m.Order as number) ?? i,
                media_category: m.MediaCategory as string,
                is_primary: i === 0,
                modification_timestamp: m.ModificationTimestamp as string,
              }))
            );
            // Collect fresh URLs for download (only during incremental sync, not initial import)
            if (!isInitialImport) {
              media.forEach((m, i) => {
                if (m.MediaURL) {
                  freshMediaForDownload.push({
                    mediaKey: m.MediaKey as string,
                    mediaUrl: m.MediaURL as string,
                    listingKey: r.ListingKey as string,
                    isPrimary: i === 0,
                  });
                }
              });
            }
          }
          kept++;
        }

        const ts = new Date(r.ModificationTimestamp as string);
        if (ts > greatestTs) greatestTs = ts;
      }

      // Batch upsert listings
      if (listingRows.length > 0) {
        await supabase
          .from('listings')
          .upsert(listingRows, { onConflict: 'listing_key' });
      }

      // Batch upsert media
      const flatMedia = allMediaRows.flat();
      if (flatMedia.length > 0) {
        await supabase
          .from('listing_media')
          .upsert(flatMedia, { onConflict: 'media_key' });
      }

      // Batch soft deletes
      if (toSoftDelete.length > 0) {
        await supabase
          .from('listings')
          .update({ deleted_at: new Date().toISOString() })
          .in('listing_key', toSoftDelete);
      }

      // Download primary images while URLs are still fresh (they expire quickly).
      // Skip during initial import — backfill handles it after all data is loaded.
      if (!isInitialImport && freshMediaForDownload.length > 0) {
        try {
          const downloaded = await downloadMediaBatch(freshMediaForDownload);
          mediaDownloaded += downloaded;
        } catch (e) {
          console.error('[Sync] Media download batch error:', e);
        }
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;

      // Save progress after each page so we don't re-process on failure
      await updateSyncState('Property', greatestTs, /* hasMore */ !!url);

      // Small breathing room between pages for DB writes to settle.
      // Actual rate limiting is handled by throttle() inside mlsGridFetch.
      if (url) await delay(100);
    }

    const hasMore = !!url;
    await updateSyncState('Property', greatestTs, hasMore);
    await writeSyncLog({
      resource: 'Property',
      fetched,
      kept,
      pagesWalked,
      startedAt,
      requestsUsed: getRequestCount(),
    });

    return { fetched, kept, pagesWalked, hasMore, mediaDownloaded };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const supabase = getServiceClient();
    await supabase
      .from('sync_state')
      .update({ last_run_status: 'error', last_error: msg })
      .eq('resource', 'Property');
    await writeSyncLog({
      resource: 'Property',
      fetched,
      kept,
      pagesWalked,
      startedAt,
      error: msg,
      requestsUsed: getRequestCount(),
    });
    throw error;
  }
}

export async function syncMember() {
  const state = await ensureSyncState('Member');
  const startedAt = new Date();
  const runStart = Date.now();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp ge ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `Member?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}&$top=${OTHER_PAGE_SIZE}`;

  const supabase = getServiceClient();
  let pagesWalked = 0;
  let fetched = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);

  try {
    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
      if (Date.now() - runStart > MAX_ELAPSED_MS) break;
      if (getRequestCount() >= MAX_REQUESTS_PER_RUN) break;

      const page = await mlsGridFetch(url);
      const records: Record<string, unknown>[] = page.value ?? [];
      fetched += records.length;

      const rows = records.map((r) => {
        const ts = new Date(r.ModificationTimestamp as string);
        if (ts > greatestTs) greatestTs = ts;
        return {
          member_key: r.MemberKey,
          member_mls_id: r.MemberMlsId,
          member_full_name: r.MemberFullName,
          member_first_name: r.MemberFirstName,
          member_last_name: r.MemberLastName,
          member_email: r.MemberEmail,
          member_phone: r.MemberPreferredPhone ?? r.MemberDirectPhone,
          member_type: r.MemberType,
          office_key: r.OfficeKey,
          modification_timestamp: r.ModificationTimestamp,
          raw: r,
        };
      });

      if (rows.length > 0) {
        await supabase
          .from('members')
          .upsert(rows, { onConflict: 'member_key' });
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;

      await updateSyncState(
        'Member',
        greatestTs,
        /* hasMore */ !!url
      );

      if (url) await delay(100);
    }

    const hasMore = !!url;
    await updateSyncState('Member', greatestTs, hasMore);
    await writeSyncLog({
      resource: 'Member',
      fetched,
      kept: fetched,
      pagesWalked,
      startedAt,
      requestsUsed: getRequestCount(),
    });
    return { fetched, pagesWalked, hasMore };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await writeSyncLog({
      resource: 'Member',
      fetched,
      kept: 0,
      pagesWalked,
      startedAt,
      error: msg,
      requestsUsed: getRequestCount(),
    });
    throw error;
  }
}

export async function syncOffice() {
  const state = await ensureSyncState('Office');
  const startedAt = new Date();
  const runStart = Date.now();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp ge ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `Office?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}&$top=${OTHER_PAGE_SIZE}`;

  const supabase = getServiceClient();
  let pagesWalked = 0;
  let fetched = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);

  try {
    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
      if (Date.now() - runStart > MAX_ELAPSED_MS) break;
      if (getRequestCount() >= MAX_REQUESTS_PER_RUN) break;

      const page = await mlsGridFetch(url);
      const records: Record<string, unknown>[] = page.value ?? [];
      fetched += records.length;

      const rows = records.map((r) => {
        const ts = new Date(r.ModificationTimestamp as string);
        if (ts > greatestTs) greatestTs = ts;
        return {
          office_key: r.OfficeKey,
          office_mls_id: r.OfficeMlsId,
          office_name: r.OfficeName,
          office_phone: r.OfficePhone,
          office_email: r.OfficeEmail,
          office_address: r.OfficeAddress1,
          office_city: r.OfficeCity,
          office_state: r.OfficeStateOrProvince,
          office_postal_code: r.OfficePostalCode,
          modification_timestamp: r.ModificationTimestamp,
          raw: r,
        };
      });

      if (rows.length > 0) {
        await supabase
          .from('offices')
          .upsert(rows, { onConflict: 'office_key' });
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;

      await updateSyncState(
        'Office',
        greatestTs,
        /* hasMore */ !!url
      );

      if (url) await delay(100);
    }

    const hasMore = !!url;
    await updateSyncState('Office', greatestTs, hasMore);
    await writeSyncLog({
      resource: 'Office',
      fetched,
      kept: fetched,
      pagesWalked,
      startedAt,
      requestsUsed: getRequestCount(),
    });
    return { fetched, pagesWalked, hasMore };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await writeSyncLog({
      resource: 'Office',
      fetched,
      kept: 0,
      pagesWalked,
      startedAt,
      error: msg,
      requestsUsed: getRequestCount(),
    });
    throw error;
  }
}

export async function syncOpenHouse() {
  const state = await ensureSyncState('OpenHouse');
  const startedAt = new Date();
  const runStart = Date.now();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp ge ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `OpenHouse?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}&$top=${OTHER_PAGE_SIZE}`;

  const supabase = getServiceClient();
  let pagesWalked = 0;
  let fetched = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);

  try {
    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
      if (Date.now() - runStart > MAX_ELAPSED_MS) break;
      if (getRequestCount() >= MAX_REQUESTS_PER_RUN) break;

      const page = await mlsGridFetch(url);
      const records: Record<string, unknown>[] = page.value ?? [];
      fetched += records.length;

      const rows = records.map((r) => {
        const ts = new Date(r.ModificationTimestamp as string);
        if (ts > greatestTs) greatestTs = ts;
        return {
          open_house_key: r.OpenHouseKey,
          listing_key: r.ListingKey,
          open_house_date: r.OpenHouseDate,
          open_house_start_time: r.OpenHouseStartTime,
          open_house_end_time: r.OpenHouseEndTime,
          open_house_status: r.OpenHouseStatus,
          open_house_remarks: r.OpenHouseRemarks,
          modification_timestamp: r.ModificationTimestamp,
          raw: r,
        };
      });

      if (rows.length > 0) {
        await supabase
          .from('open_houses')
          .upsert(rows, { onConflict: 'open_house_key' });
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;

      await updateSyncState(
        'OpenHouse',
        greatestTs,
        /* hasMore */ !!url
      );

      if (url) await delay(100);
    }

    const hasMore = !!url;
    await updateSyncState('OpenHouse', greatestTs, hasMore);
    await writeSyncLog({
      resource: 'OpenHouse',
      fetched,
      kept: fetched,
      pagesWalked,
      startedAt,
      requestsUsed: getRequestCount(),
    });
    return { fetched, pagesWalked, hasMore };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await writeSyncLog({
      resource: 'OpenHouse',
      fetched,
      kept: 0,
      pagesWalked,
      startedAt,
      error: msg,
      requestsUsed: getRequestCount(),
    });
    throw error;
  }
}
