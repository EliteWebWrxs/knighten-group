# MLS Grid API notes

## Base URL
https://api.mlsgrid.com/v2/

## Stellar MLS system name
`mfrmls` (My Florida Regional MLS). Confirm exact value during MLS Grid onboarding.

## Required headers
- `Authorization: Bearer {token}`
- `Accept-Encoding: gzip,deflate`
- `Accept: application/json`

## Rate limits (hard caps)
- 2 requests per second
- 7,200 requests per hour
- 4 GB per hour
- 40,000 requests per 24 hours
- 60 GB per 24 hours

## Request construction rules
- Always include `$filter=OriginatingSystemName eq 'mfrmls' and MlgCanView eq true`
- Use `$top=5000` (max page size), follow `@odata.nextLink` until absent
- Use `$expand=Media,Rooms,UnitTypes` on Property resource
- Use `in` statements, never `or`
- Do not wrap OriginatingSystemName, MlgCanView, or ModificationTimestamp in parens
- Never use `$top=0`
- Never range-query ModificationTimestamp
- Never multi-thread replication requests

## Initial import
Email support@mlsgrid.com before first full pull to request a Grace Period on rate caps.

## Incremental sync
Every 15 minutes:
```
/v2/Property?$filter=OriginatingSystemName eq 'mfrmls' and MlgCanView eq true and ModificationTimestamp gt {MAX_TS}&$expand=Media,Rooms,UnitTypes&$top=5000
```
Then repeat for Member, Office, OpenHouse (no $expand on those).

## Deletion handling
When `MlgCanView = false` arrives on an existing record, soft-delete locally. Keep the row for audit, but do not display.
