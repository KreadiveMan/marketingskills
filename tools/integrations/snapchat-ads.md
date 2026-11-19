# Snapchat Ads

Advertising platform for Snapchat's vertical-video audience (Story, Discover, Spotlight placements).

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Marketing API v1: campaigns, ad squads, ads, creatives, media, pixels, stats |
| MCP | ✓ | Official Snap Ads MCP server; read-only on most connections (no create/update tools) |
| CLI | ✓ | [snapchat-ads.js](../clis/snapchat-ads.js): read **and write** |
| SDK | - | No official SDK |

Use the MCP for reporting and the CLI when you need to create or change something.

## Authentication

- **Type**: OAuth 2.0 bearer token
- **Header**: `Authorization: Bearer {access_token}`
- **Token lifetime**: access tokens expire after about 30 minutes. Store the long-lived refresh token instead.
- **Setup**: Business Manager → Business Details → OAuth App. Note the client ID and secret, authorize once with scope `snapchat-marketing-api`, keep the refresh token.

| Variable | Purpose |
|----------|---------|
| `SNAPCHAT_ACCESS_TOKEN` | Short-lived token (optional if refresh vars are set) |
| `SNAPCHAT_CLIENT_ID`, `SNAPCHAT_CLIENT_SECRET`, `SNAPCHAT_REFRESH_TOKEN` | The CLI refreshes automatically and retries once on HTTP 401 |
| `SNAPCHAT_AD_ACCOUNT_ID` | Default ad account (or pass `--ad-account-id`) |

## API rules that shape every call

- **Money is micro-currency**: 1.00 = 1,000,000. The CLI takes `--daily-budget 50` (account currency) or `--daily-budget-micro 50000000`.
- **Writes are batched on the parent collection**: `POST /adaccounts/{id}/campaigns`, `/campaigns/{id}/adsquads`, `/adsquads/{id}/ads` with a body like `{"campaigns": [ ... ]}`.
- **Updates are `PUT` with the full object** on that parent collection. The CLI fetches the entity, merges your fields, strips read-only fields and sends it back.
- A 200 response can still contain failures: check `request_status` and each item's `sub_request_status`. The CLI exits 1 on either.
- Ad squads need a **funding source** on the ad account. `bid_micro` is required unless `bid_strategy` is `AUTO_BID`.
- Creatives: `headline` ≤ 34 chars, `brand_name` ≤ 32 chars, and most accounts need `profile_properties.profile_id`. Top Snap media is 1080×1920.

## CLI: Common Agent Operations

Every command accepts `--dry-run` (prints the request, sends nothing) and `--json '{...}'` (extra API fields merged into the body).

```bash
# Discover
node tools/clis/snapchat-ads.js organizations list
node tools/clis/snapchat-ads.js accounts list --org-id <ORG_ID>

# Build (everything is created PAUSED)
node tools/clis/snapchat-ads.js campaigns create --name "Ramadan Sale" --objective-v2 SALES --daily-budget 50
node tools/clis/snapchat-ads.js media create --name "Hero 9x16" --type VIDEO
node tools/clis/snapchat-ads.js media upload --id <MEDIA_ID> --file ./hero.mp4
node tools/clis/snapchat-ads.js creatives create --name "Hero" --type WEB_VIEW --media-id <MEDIA_ID> \
  --headline "Shop the Ramadan drop" --brand-name "Acme" --call-to-action SHOP_NOW \
  --url https://example.com/ramadan --profile-id <PROFILE_ID>
node tools/clis/snapchat-ads.js adsquads create --campaign-id <CAMPAIGN_ID> --name "KSA 18-34" \
  --countries sa --min-age 18 --max-age 34 --optimization-goal PIXEL_PURCHASE --pixel-id <PIXEL_ID> \
  --bid-strategy AUTO_BID --daily-budget 20
node tools/clis/snapchat-ads.js ads create --adsquad-id <AD_SQUAD_ID> --name "Hero ad" --creative-id <CREATIVE_ID>

# Change
node tools/clis/snapchat-ads.js adsquads update --id <AD_SQUAD_ID> --daily-budget 35
node tools/clis/snapchat-ads.js campaigns pause --id <CAMPAIGN_ID>
node tools/clis/snapchat-ads.js campaigns activate --id <CAMPAIGN_ID> --confirm   # goes live, spends money
node tools/clis/snapchat-ads.js ads delete --id <AD_ID> --confirm                  # permanent

# Report
node tools/clis/snapchat-ads.js stats get --level campaigns --id <CAMPAIGN_ID> --granularity DAY \
  --start-time 2026-11-01T00:00:00+03:00 --end-time 2026-11-18T00:00:00+03:00 --fields impressions,swipes,spend
```

## Safety

- New campaigns, ad squads and ads default to `PAUSED`. Creating anything `ACTIVE`, `activate`, and `delete` all refuse to run without `--confirm`.
- Show the user a `--dry-run` preview and get approval before any write that spends money.
- `pause` needs no confirmation, so it is the safe fast stop.

## Relevant Skills

- ads
- ad-creative
- conversion-tracking
