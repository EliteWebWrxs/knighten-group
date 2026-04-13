import { createClient } from '@/lib/supabase/server';
import { isIdxEnabled } from '@/lib/compliance/copyright';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (!isIdxEnabled()) {
    return new Response('IDX data temporarily unavailable', { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '24')));
  const offset = (page - 1) * limit;

  const city = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const beds = searchParams.get('beds');
  const baths = searchParams.get('baths');
  const propertyType = searchParams.get('propertyType');
  const allowedStatuses = new Set(['Active', 'Pending']);
  const requestedStatuses = (searchParams.get('status') || 'Active')
    .split(',')
    .filter((s) => allowedStatuses.has(s));
  const status = requestedStatuses.length > 0 ? requestedStatuses.join(',') : 'Active';
  const sort = searchParams.get('sort') || 'list_date';
  const order = searchParams.get('order') === 'asc' ? true : false;

  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(`
      listing_key,
      listing_id,
      standard_status,
      unparsed_address,
      city,
      state_or_province,
      postal_code,
      internet_address_display_yn,
      list_price,
      bedrooms_total,
      bathrooms_total_integer,
      bathrooms_half,
      living_area,
      lot_size_acres,
      year_built,
      property_type,
      property_sub_type,
      pool_yn,
      waterfront_yn,
      new_construction_yn,
      days_on_market,
      list_date,
      modification_timestamp,
      list_office_key,
      listing_media!inner (
        storage_path,
        order_index,
        is_primary
      )
    `, { count: 'exact' })
    .is('deleted_at', null)
    .eq('mlg_can_view', true)
    .in('standard_status', status.split(','))
    .not('internet_entire_listing_display_yn', 'is', false)
    .not('idx_participation_yn', 'is', false)
    .not('delayed_distribution_yn', 'is', true)
    .not('office_exclusive_yn', 'is', true);

  if (city) query = query.eq('city', city);
  if (minPrice) query = query.gte('list_price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('list_price', parseFloat(maxPrice));
  if (beds) query = query.gte('bedrooms_total', parseInt(beds));
  if (baths) query = query.gte('bathrooms_total_integer', parseInt(baths));
  if (propertyType) query = query.eq('property_type', propertyType);

  const validSorts = ['list_price', 'list_date', 'bedrooms_total', 'living_area', 'days_on_market'];
  const sortField = validSorts.includes(sort) ? sort : 'list_date';

  query = query.order(sortField, { ascending: order }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    listings: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
