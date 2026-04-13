# The Knighten Group — Operations Runbook

## Rotating the MLS Grid token

1. Log in to MLS Grid dashboard.
2. Generate a new API token.
3. In Vercel dashboard, update `MLS_GRID_TOKEN` environment variable.
4. Redeploy (or wait for next cron run to pick up the new value).
5. Verify sync completes successfully in `/admin/sync`.
6. Revoke the old token in MLS Grid dashboard.

## Activating the kill switch

If you receive a termination notice or need to immediately stop displaying MLS data:

1. In Vercel dashboard, set `IDX_ENABLED=false`.
2. Trigger a redeploy (Settings > Deployments > Redeploy).
3. Verify all listing pages return 503.
4. Verify search, listing cards, and detail pages show no MLS data.

The kill switch takes effect within 1 minute of redeploy.

## Wiping all MLS data (post-termination)

Per TPDAA paragraph 17, all MLS data must be deleted within 5 days of termination.

1. Activate the kill switch first (see above).
2. Connect to the Supabase database.
3. Run the following SQL:

```sql
-- Delete in dependency order
delete from open_houses;
delete from listing_media;
delete from listings;
delete from members;
delete from offices;
delete from sync_state;
delete from sync_log;
```

4. Delete all files in the `listing-photos` Supabase Storage bucket.
5. Verify the site shows no MLS data.
6. Document the deletion date and method for compliance records.

## What to do when sync fails

1. Check the `sync_log` table for error messages.
2. The sync will automatically resume from the last successful `ModificationTimestamp` on next run.
3. If errors persist, check:
   - Is the MLS Grid token valid? (401 errors = expired token)
   - Is MLS Grid experiencing downtime? Check their status page.
   - Are we hitting rate limits? (429 errors = back off)
4. The 12-hour data freshness requirement means you have up to 12 hours to fix issues before non-compliance.
5. If the token needs rotation, follow the rotation procedure above.

## Monitoring

- Vercel Cron logs: Vercel dashboard > Cron Jobs
- Sync status: `/admin/sync` page (auth-gated)
- Database: Supabase dashboard > Table Editor > sync_log
- Uptime: Set up a Vercel/UptimeRobot monitor on the cron endpoint
