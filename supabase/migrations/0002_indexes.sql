-- Performance indexes for The Knighten Group

-- Listing search indexes
create index if not exists idx_listings_status on listings (standard_status);
create index if not exists idx_listings_city on listings (city);
create index if not exists idx_listings_price on listings (list_price);
create index if not exists idx_listings_property_type on listings (property_type);
create index if not exists idx_listings_property_sub_type on listings (property_sub_type);
create index if not exists idx_listings_bedrooms on listings (bedrooms_total);
create index if not exists idx_listings_bathrooms on listings (bathrooms_total_integer);
create index if not exists idx_listings_year_built on listings (year_built);
create index if not exists idx_listings_living_area on listings (living_area);
create index if not exists idx_listings_waterfront on listings (waterfront_yn);
create index if not exists idx_listings_new_construction on listings (new_construction_yn);
create index if not exists idx_listings_pool on listings (pool_yn);
create index if not exists idx_listings_deleted on listings (deleted_at);
create index if not exists idx_listings_modification on listings (modification_timestamp);
create index if not exists idx_listings_list_date on listings (list_date);

-- Composite indexes for common queries
create index if not exists idx_listings_active_display on listings (standard_status, internet_entire_listing_display_yn, idx_participation_yn, deleted_at)
  where deleted_at is null;

create index if not exists idx_listings_city_price on listings (city, list_price)
  where deleted_at is null and standard_status in ('Active', 'Pending');

-- Geo index (requires earthdistance extension)
-- create extension if not exists cube;
-- create extension if not exists earthdistance;
-- create index if not exists idx_listings_geo on listings using gist (ll_to_earth(latitude, longitude));

-- Media indexes
create index if not exists idx_media_listing on listing_media (listing_key);
create index if not exists idx_media_primary on listing_media (listing_key, is_primary) where is_primary = true;
create index if not exists idx_media_order on listing_media (listing_key, order_index);

-- Member indexes
create index if not exists idx_members_office on members (office_key);
create index if not exists idx_members_name on members (member_full_name);

-- Open house indexes
create index if not exists idx_open_houses_listing on open_houses (listing_key);
create index if not exists idx_open_houses_date on open_houses (open_house_start_time);

-- Sync log indexes
create index if not exists idx_sync_log_resource on sync_log (resource, started_at desc);

-- Lead indexes
create index if not exists idx_leads_created on leads (created_at desc);
create index if not exists idx_leads_source on leads (source);
