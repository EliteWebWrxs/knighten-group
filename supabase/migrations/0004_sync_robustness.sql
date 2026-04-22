-- Track whether a resource has more pages pending from its last sync run.
-- Used by the cron scheduler to prioritize resources during initial import.
alter table sync_state add column if not exists has_more boolean default false;

-- Track how many MLS Grid API requests each sync run consumed.
-- Useful for monitoring rate limit usage over time.
alter table sync_log add column if not exists requests_used int;

-- Partial index to speed up the backfill query that finds media records
-- still needing download (storage_path IS NULL but media_url_original exists).
create index if not exists idx_media_needs_backfill
  on listing_media (listing_key)
  where storage_path is null and media_url_original is not null;
