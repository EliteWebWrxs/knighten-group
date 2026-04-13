-- Row Level Security policies
-- Public (anon) can read displayable listings; service role does all writes

alter table listings enable row level security;
alter table listing_media enable row level security;
alter table members enable row level security;
alter table offices enable row level security;
alter table open_houses enable row level security;
alter table sync_state enable row level security;
alter table sync_log enable row level security;
alter table leads enable row level security;

-- Listings: anon can read only displayable, non-deleted listings
create policy "Public can view displayable listings"
  on listings for select
  to anon
  using (
    deleted_at is null
    and mlg_can_view = true
    and standard_status in ('Active', 'Pending')
    and internet_entire_listing_display_yn is not false
    and idx_participation_yn is not false
    and delayed_distribution_yn is not true
    and office_exclusive_yn is not true
  );

-- Media: anon can read media for displayable listings
create policy "Public can view listing media"
  on listing_media for select
  to anon
  using (
    listing_key in (
      select listing_key from listings
      where deleted_at is null
        and mlg_can_view = true
        and standard_status in ('Active', 'Pending')
        and internet_entire_listing_display_yn is not false
        and idx_participation_yn is not false
        and delayed_distribution_yn is not true
        and office_exclusive_yn is not true
    )
  );

-- Members: anon can read
create policy "Public can view members"
  on members for select
  to anon
  using (true);

-- Offices: anon can read
create policy "Public can view offices"
  on offices for select
  to anon
  using (true);

-- Open houses: anon can read for displayable listings
create policy "Public can view open houses"
  on open_houses for select
  to anon
  using (
    listing_key in (
      select listing_key from listings
      where deleted_at is null
        and mlg_can_view = true
        and standard_status in ('Active', 'Pending')
        and internet_entire_listing_display_yn is not false
        and idx_participation_yn is not false
    )
  );

-- Sync state/log: no public access
create policy "No public access to sync_state"
  on sync_state for select
  to anon
  using (false);

create policy "No public access to sync_log"
  on sync_log for select
  to anon
  using (false);

-- Leads: anon can insert (for contact forms) but not read
create policy "Public can submit leads"
  on leads for insert
  to anon
  with check (true);

create policy "No public read on leads"
  on leads for select
  to anon
  using (false);

-- Service role bypasses RLS automatically
