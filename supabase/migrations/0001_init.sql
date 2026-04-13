-- The Knighten Group — Initial Database Schema
-- MLS Grid IDX Integration with Stellar MLS
-- RESO Data Dictionary field names where possible

-- listings (Property resource from MLS Grid)
create table if not exists listings (
  listing_key text primary key,
  listing_id text not null,
  originating_system_name text not null,
  standard_status text not null,
  modification_timestamp timestamptz not null,
  mlg_can_view boolean not null default true,

  -- display control flags (TPDAA Exhibit A)
  internet_entire_listing_display_yn boolean,
  idx_participation_yn boolean,
  delayed_distribution_yn boolean,
  office_exclusive_yn boolean,
  internet_address_display_yn boolean,

  -- address (render only when internet_address_display_yn = true)
  unparsed_address text,
  street_number text,
  street_name text,
  city text,
  state_or_province text,
  postal_code text,
  county_or_parish text,
  latitude double precision,
  longitude double precision,

  -- pricing
  list_price numeric,
  close_price numeric,
  original_list_price numeric,

  -- specs
  bedrooms_total int,
  bathrooms_total_integer int,
  bathrooms_half int,
  living_area numeric,
  lot_size_acres numeric,
  lot_size_square_feet numeric,
  year_built int,
  property_type text,
  property_sub_type text,
  stories int,
  garage_spaces numeric,
  pool_yn boolean,
  waterfront_yn boolean,
  new_construction_yn boolean,
  hoa_fee numeric,
  hoa_fee_frequency text,

  -- copy
  public_remarks text,

  -- dates
  list_date date,
  close_date date,
  days_on_market int,

  -- agent/office foreign keys
  list_agent_key text,
  list_office_key text,
  buyer_agent_key text,
  buyer_office_key text,

  -- raw JSON for anything else
  raw jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- media (from $expand=Media on Property)
create table if not exists listing_media (
  media_key text primary key,
  listing_key text references listings(listing_key) on delete cascade,
  media_url_original text,
  storage_path text,
  order_index int,
  media_category text,
  is_primary boolean default false,
  modification_timestamp timestamptz
);

-- members (agents)
create table if not exists members (
  member_key text primary key,
  member_mls_id text,
  member_full_name text,
  member_first_name text,
  member_last_name text,
  member_email text,
  member_phone text,
  member_type text,
  office_key text,
  modification_timestamp timestamptz,
  raw jsonb
);

-- offices
create table if not exists offices (
  office_key text primary key,
  office_mls_id text,
  office_name text,
  office_phone text,
  office_email text,
  office_address text,
  office_city text,
  office_state text,
  office_postal_code text,
  modification_timestamp timestamptz,
  raw jsonb
);

-- open houses
create table if not exists open_houses (
  open_house_key text primary key,
  listing_key text references listings(listing_key) on delete cascade,
  open_house_date date,
  open_house_start_time timestamptz,
  open_house_end_time timestamptz,
  open_house_status text,
  open_house_remarks text,
  modification_timestamp timestamptz,
  raw jsonb
);

-- sync_state — tracks greatest ModificationTimestamp per resource
create table if not exists sync_state (
  resource text primary key,
  greatest_modification_timestamp timestamptz,
  last_run_started_at timestamptz,
  last_run_finished_at timestamptz,
  last_run_status text,
  last_error text
);

-- sync_log — audit trail (proves we synced within 12h)
create table if not exists sync_log (
  id bigserial primary key,
  resource text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  records_fetched int,
  records_kept_after_filter int,
  status text,
  error_message text,
  next_link_pages_walked int
);

-- lead capture
create table if not exists leads (
  id bigserial primary key,
  source text,
  listing_key text,
  name text,
  email text,
  phone text,
  message text,
  address text,
  bedrooms int,
  bathrooms int,
  sqft numeric,
  property_condition text,
  timeline text,
  created_at timestamptz default now()
);

-- seed sync_state with initial rows
insert into sync_state (resource, greatest_modification_timestamp) values
  ('Property', null),
  ('Member', null),
  ('Office', null),
  ('OpenHouse', null)
on conflict (resource) do nothing;
