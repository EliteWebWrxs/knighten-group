import { createClient } from '@supabase/supabase-js';
import { mlsGridFetch, delay } from './client';
import { passesExhibitA, suppressFields } from './filters';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getSyncState(resource: string) {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('sync_state')
    .select('*')
    .eq('resource', resource)
    .single();
  return data;
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
  return data;
}

async function updateSyncState(resource: string, greatestTs: Date) {
  const supabase = getServiceClient();
  await supabase
    .from('sync_state')
    .update({
      greatest_modification_timestamp: greatestTs.toISOString(),
      last_run_finished_at: new Date().toISOString(),
      last_run_status: 'success',
      last_error: null,
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
  });
}

async function softDeleteListing(listingKey: string) {
  const supabase = getServiceClient();
  await supabase
    .from('listings')
    .update({ deleted_at: new Date().toISOString() })
    .eq('listing_key', listingKey);
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

// Max pages per invocation to stay under Vercel timeout.
// Each page = up to 200 records, ~600ms delay. 10 pages ~ 6s network + processing.
const MAX_PAGES_PER_RUN = 10;

export async function syncProperty() {
  const state = await ensureSyncState('Property');
  const startedAt = new Date();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp gt ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `Property?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}` +
    `&$expand=Media&$top=200`;

  let pagesWalked = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);
  let kept = 0;
  let fetched = 0;

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
      const page = await mlsGridFetch(url);
      const records: Record<string, unknown>[] = page.value ?? [];
      fetched += records.length;

      // Batch: collect rows to upsert
      const listingRows: ReturnType<typeof mapPropertyToRow>[] = [];
      const allMediaRows: Record<string, unknown>[][] = [];
      const toSoftDelete: string[] = [];

      for (const r of records) {
        if (r.MlgCanView === false) {
          toSoftDelete.push(r.ListingKey as string);
        } else if (passesExhibitA(r)) {
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
          }
          kept++;
        }

        const ts = new Date(r.ModificationTimestamp as string);
        if (ts > greatestTs) greatestTs = ts;
      }

      // Batch upsert listings
      if (listingRows.length > 0) {
        await supabase.from('listings').upsert(listingRows, { onConflict: 'listing_key' });
      }

      // Batch upsert media
      const flatMedia = allMediaRows.flat();
      if (flatMedia.length > 0) {
        await supabase.from('listing_media').upsert(flatMedia, { onConflict: 'media_key' });
      }

      // Batch soft deletes
      if (toSoftDelete.length > 0) {
        await supabase
          .from('listings')
          .update({ deleted_at: new Date().toISOString() })
          .in('listing_key', toSoftDelete);
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;

      // Stay well under 2 RPS
      if (url) await delay(600);
    }

    await updateSyncState('Property', greatestTs);
    await writeSyncLog({
      resource: 'Property',
      fetched,
      kept,
      pagesWalked,
      startedAt,
    });

    // Return whether there are more pages to process
    return { fetched, kept, pagesWalked, hasMore: !!url };
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
    });
    throw error;
  }
}

export async function syncMember() {
  const state = await ensureSyncState('Member');
  const startedAt = new Date();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp gt ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `Member?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}&$top=200`;

  const supabase = getServiceClient();
  let pagesWalked = 0;
  let fetched = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);

  try {
    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
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
        await supabase.from('members').upsert(rows, { onConflict: 'member_key' });
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;
      if (url) await delay(600);
    }

    await updateSyncState('Member', greatestTs);
    await writeSyncLog({ resource: 'Member', fetched, kept: fetched, pagesWalked, startedAt });
    return { fetched, pagesWalked, hasMore: !!url };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await writeSyncLog({ resource: 'Member', fetched, kept: 0, pagesWalked, startedAt, error: msg });
    throw error;
  }
}

export async function syncOffice() {
  const state = await ensureSyncState('Office');
  const startedAt = new Date();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp gt ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `Office?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}&$top=200`;

  const supabase = getServiceClient();
  let pagesWalked = 0;
  let fetched = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);

  try {
    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
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
        await supabase.from('offices').upsert(rows, { onConflict: 'office_key' });
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;
      if (url) await delay(600);
    }

    await updateSyncState('Office', greatestTs);
    await writeSyncLog({ resource: 'Office', fetched, kept: fetched, pagesWalked, startedAt });
    return { fetched, pagesWalked, hasMore: !!url };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await writeSyncLog({ resource: 'Office', fetched, kept: 0, pagesWalked, startedAt, error: msg });
    throw error;
  }
}

export async function syncOpenHouse() {
  const state = await ensureSyncState('OpenHouse');
  const startedAt = new Date();
  const tsFilter = state?.greatest_modification_timestamp
    ? ` and ModificationTimestamp gt ${state.greatest_modification_timestamp}`
    : '';

  let url: string | null =
    `OpenHouse?$filter=OriginatingSystemName eq '${ORIGINATING_SYSTEM}' and MlgCanView eq true${tsFilter}&$top=200`;

  const supabase = getServiceClient();
  let pagesWalked = 0;
  let fetched = 0;
  let greatestTs = state?.greatest_modification_timestamp
    ? new Date(state.greatest_modification_timestamp)
    : new Date(0);

  try {
    while (url && pagesWalked < MAX_PAGES_PER_RUN) {
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
        await supabase.from('open_houses').upsert(rows, { onConflict: 'open_house_key' });
      }

      pagesWalked++;
      url = page['@odata.nextLink'] ?? null;
      if (url) await delay(600);
    }

    await updateSyncState('OpenHouse', greatestTs);
    await writeSyncLog({ resource: 'OpenHouse', fetched, kept: fetched, pagesWalked, startedAt });
    return { fetched, pagesWalked, hasMore: !!url };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await writeSyncLog({ resource: 'OpenHouse', fetched, kept: 0, pagesWalked, startedAt, error: msg });
    throw error;
  }
}
