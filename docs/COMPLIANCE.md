# The Knighten Group — MLS Compliance Checklist

TPDAA: Docusign 8C687FE1-59FA-42E0-9670-B9A4827DA078
Data source: Stellar MLS via MLS Grid Web API (OData v2) — IDX feed
Broker: Earl Knighten, The Knighten Group LLC (260062690)

---

## Liquidated damages gate ($30,000 per incident)

- [ ] No API keys, tokens, or credentials in the repository. All secrets in Vercel env vars and `.env.local` (gitignored).
- [ ] Pre-commit hook (gitleaks or trufflehog) scanning for leaked secrets.
- [ ] MLS Grid token read server-side only. Never exposed to client bundle.
- [ ] Supabase service-role key only in server components and API routes.

## Data display rules (TPDAA Exhibit A)

- [ ] Only display listings where `StandardStatus` is Active, Pending, or Closed.
- [ ] Exclude from display: `InternetEntireListingDisplayYN = false`, `IDXParticipationYN = false`, `DelayedDistributionYN = true`, `OfficeExclusiveYN = true`.
- [ ] Suppress address when `InternetAddressDisplayYN = false`.
- [ ] Suppress buyer agent info when status is Pending.
- [ ] DB queries for public routes enforce all display filters plus `deleted_at is null`.
- [ ] `suppressDisplay()` helper applied at rendering layer (defense in depth).
- [ ] RLS policies enforce display rules at the database level.

## Attribution and logos (TPDAA Exhibit C)

- [ ] Copyright notice on every page showing listing data: `(c) {year} Mid-Florida Regional Multiple Listing Service, Inc.`
- [ ] Stellar MLS logo on every listing page, unmodified, aspect ratio preserved.
- [ ] Stellar logo not used as hyperlink (except to stellarmls.com), not in domain name.
- [ ] "Listing courtesy of {ListOfficeName}" on every listing detail.
- [ ] Last updated timestamp (ModificationTimestamp) on every listing detail.
- [ ] ComplianceAttribution component used in ListingPageShell wrapper.

## Data freshness (minimum every 12 hours)

- [ ] Sync runs every 15 minutes via Vercel Cron.
- [ ] `sync_state` table tracks greatest ModificationTimestamp per resource.
- [ ] `sync_log` table provides audit trail proving sync frequency.
- [ ] If sync errors mid-page, resume from stored timestamp (never restart from zero).

## Anti-scraping (TPDAA paragraph 9)

- [ ] Rate limiting on `/api/listings*` endpoints (60 req/min/IP).
- [ ] `robots.txt` disallows scrapers on listing detail pages.
- [ ] Bot detection headers on API routes.

## Media handling (MLS Grid Best Practices paragraph 10)

- [ ] Photos downloaded to Supabase Storage, never hotlinked from MLS Grid URLs.
- [ ] Image tags point at `/storage/...` paths, never `api.mlsgrid.com`.
- [ ] `media_url_original` column stores source URL for audit but is never exposed publicly.

## Kill switch and termination readiness (TPDAA paragraphs 17-18)

- [ ] `IDX_ENABLED` env var: when `false`, all listing routes return 503 and listing data is hidden site-wide.
- [ ] Documented wipe procedure: delete all MLS data within 5 days post-termination, including backups.
- [ ] Kill switch can be activated in under 1 minute via Vercel dashboard.

## MLS Grid API compliance

- [ ] Every request includes `$filter=OriginatingSystemName eq 'mfrmls'`.
- [ ] Every request includes `MlgCanView eq true`.
- [ ] `Accept-Encoding: gzip,deflate` header on all requests.
- [ ] Page size `$top=5000` with `@odata.nextLink` pagination.
- [ ] 500-700ms delay between paged requests (under 2 RPS).
- [ ] `$expand=Media,Rooms,UnitTypes` on Property resource.
- [ ] Using `in` statements, never `or` in filters.
- [ ] Never using `$top=0`, range queries on ModificationTimestamp, or multi-threaded replication.
- [ ] Soft-delete when `MlgCanView` flips to false (keep row, hide from display).

## Accessibility (ADA)

- [ ] WCAG 2.1 AA baseline: semantic HTML, alt text, focus states, keyboard nav, color contrast.
- [ ] UserWay accessibility widget on every page (bottom-left).
- [ ] Accessibility statement page at `/accessibility`.
