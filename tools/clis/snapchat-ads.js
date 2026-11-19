#!/usr/bin/env node

// Snapchat Marketing API v1 CLI: read + write (campaigns, ad squads, ads, creatives, media).
// Safety defaults: everything is created PAUSED; activate and delete need --confirm;
// --dry-run previews every request without sending it.

const rawArgs = process.argv.slice(2)
const BASE_URL = 'https://adsapi.snapchat.com/v1'
const TOKEN_URL = 'https://accounts.snapchat.com/login/oauth2/access_token'
const AUTHORIZE_URL = 'https://accounts.snapchat.com/login/oauth2/authorize'
const DEFAULT_REDIRECT = 'https://localhost/callback'
const DEFAULT_SCOPE = 'snapchat-marketing-api'
let TOKEN = process.env.SNAPCHAT_ACCESS_TOKEN
const AD_ACCOUNT_ID = process.env.SNAPCHAT_AD_ACCOUNT_ID
const REFRESH = {
  client_id: process.env.SNAPCHAT_CLIENT_ID,
  client_secret: process.env.SNAPCHAT_CLIENT_SECRET,
  refresh_token: process.env.SNAPCHAT_REFRESH_TOKEN,
}
const canRefresh = () => Boolean(REFRESH.client_id && REFRESH.client_secret && REFRESH.refresh_token)

function parseArgs(list) {
  const result = { _: [] }
  for (let i = 0; i < list.length; i++) {
    const arg = list[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = list[i + 1]
      if (next !== undefined && !next.startsWith('--')) { result[key] = next; i++ } else { result[key] = true }
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(rawArgs)
const [cmd, sub] = args._

if (!TOKEN && !canRefresh() && rawArgs.length > 0 && !args['dry-run'] && cmd !== 'auth') {
  console.error(JSON.stringify({ error: 'SNAPCHAT_ACCESS_TOKEN (or SNAPCHAT_CLIENT_ID + SNAPCHAT_CLIENT_SECRET + SNAPCHAT_REFRESH_TOKEN) environment variable required' }))
  process.exit(1)
}

function requestSignal() {
  const raw = args['timeout-ms'] ?? '120000'
  const ms = Number(raw)
  if (typeof raw !== 'string' || !/^\d+$/.test(raw) || !Number.isSafeInteger(ms) || ms < 1 || ms > 600000) {
    throw new Error('--timeout-ms must be an integer from 1 to 600000')
  }
  return AbortSignal.timeout(ms)
}

async function refreshToken() {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', ...REFRESH }).toString(),
    signal: requestSignal(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) throw new Error(`Token refresh failed (HTTP ${res.status}): ${data.error_description || data.error || 'no access_token'}`)
  TOKEN = data.access_token
  return data
}

function isApiError(result) {
  if (!result || typeof result !== 'object') return false
  if (result.request_status && result.request_status !== 'SUCCESS') return true
  for (const value of Object.values(result)) {
    if (Array.isArray(value) && value.some(item => item && item.sub_request_status && item.sub_request_status !== 'SUCCESS')) return true
  }
  return false
}

async function api(method, path, body, { form } = {}) {
  const url = `${BASE_URL}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { Authorization: 'Bearer ***', ...(form ? {} : { 'Content-Type': 'application/json' }) }, body: form ? { multipart: form.describe } : body || undefined }
  }
  if (!TOKEN) await refreshToken()
  const send = () => {
    const opts = { method, headers: { Authorization: `Bearer ${TOKEN}` }, signal: requestSignal() }
    if (form) opts.body = form.build()
    else if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body) }
    return fetch(url, opts)
  }
  let res = await send()
  if (res.status === 401 && canRefresh()) { await refreshToken(); res = await send() }
  const text = await res.text()
  let result
  try { result = JSON.parse(text) } catch { result = { status: res.status, body: text } }
  if (!res.ok || isApiError(result)) process.exitCode = 1
  return result
}

// ---------- helpers ----------

function adAccountId() { return args['ad-account-id'] || AD_ACCOUNT_ID }

function jsonArg(name) {
  if (!args[name]) return {}
  try {
    const parsed = JSON.parse(args[name])
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object')
    return parsed
  } catch (err) {
    throw new Error(`--${name} must be a JSON object (${err.message})`)
  }
}

// Money: --daily-budget 50 (account currency) or --daily-budget-micro 50000000.
function money(obj, flag, field) {
  if (args[`${flag}-micro`] !== undefined) obj[field] = Number(args[`${flag}-micro`])
  else if (args[flag] !== undefined) obj[field] = Math.round(Number(args[flag]) * 1e6)
  if (obj[field] !== undefined && (!Number.isSafeInteger(obj[field]) || obj[field] < 0)) throw new Error(`--${flag} must be a non-negative number`)
}

function setIf(obj, flag, field = flag.replace(/-/g, '_')) { if (args[flag] !== undefined && args[flag] !== true) obj[field] = args[flag] }

function stripReadOnly(entity) {
  const copy = { ...entity }
  for (const key of ['created_at', 'updated_at', 'delivery_status', 'review_status', 'review_status_reasons', 'render_type']) delete copy[key]
  return copy
}

const LEVELS = {
  campaigns: { one: 'campaign', key: 'campaigns', parentField: 'ad_account_id', parentPath: id => `/adaccounts/${id}/campaigns` },
  adsquads: { one: 'adsquad', key: 'adsquads', parentField: 'campaign_id', parentPath: id => `/campaigns/${id}/adsquads` },
  ads: { one: 'ad', key: 'ads', parentField: 'ad_squad_id', parentPath: id => `/adsquads/${id}/ads` },
  creatives: { one: 'creative', key: 'creatives', parentField: 'ad_account_id', parentPath: id => `/adaccounts/${id}/creatives` },
}

function unwrap(level, result) {
  const L = LEVELS[level]
  return result?.[L.key]?.[0]?.[L.one]
}

// Snap updates are PUT on the parent collection with the full object:
// fetch current entity, merge the patch, strip read-only fields, PUT back.
async function updateEntity(level, id, patch) {
  const L = LEVELS[level]
  if (args['dry-run']) {
    const parentId = args['parent-id'] || `<${L.parentField} of ${id}>`
    return {
      _dry_run: true,
      steps: [
        await api('GET', `/${level}/${id}`),
        { ...(await api('PUT', L.parentPath(parentId), { [L.key]: [{ id, ...patch }] })), note: 'body is merged onto the current entity at run time' },
      ],
    }
  }
  const current = await api('GET', `/${level}/${id}`)
  const entity = unwrap(level, current)
  if (!entity) { process.exitCode = 1; return { error: `Could not read ${L.one} ${id}`, response: current } }
  const merged = stripReadOnly({ ...entity, ...patch })
  return api('PUT', L.parentPath(entity[L.parentField]), { [L.key]: [merged] })
}

function requireConfirm(action) {
  if (args['dry-run'] || args.confirm) return null
  return { error: `${action} changes a live account. Re-run with --confirm (or preview with --dry-run).` }
}

function statusPatch(status) { return { status } }

// ---------- entity builders ----------

function buildCampaign(accountId) {
  const c = { ad_account_id: accountId, name: args.name, status: args.status || 'PAUSED', start_time: args['start-time'] || new Date().toISOString() }
  setIf(c, 'objective')
  setIf(c, 'end-time')
  setIf(c, 'buy-model')
  if (args['objective-v2']) c.objective_v2_properties = { objective_v2_type: args['objective-v2'] }
  money(c, 'daily-budget', 'daily_budget_micro')
  money(c, 'lifetime-budget', 'lifetime_spend_cap_micro')
  return { ...c, ...jsonArg('json') }
}

function buildAdSquad(campaignId) {
  const s = {
    campaign_id: campaignId,
    name: args.name,
    status: args.status || 'PAUSED',
    type: args.type || 'SNAP_ADS',
    billing_event: 'IMPRESSION',
    bid_strategy: args['bid-strategy'] || 'AUTO_BID',
    optimization_goal: args['optimization-goal'] || 'SWIPES',
    placement_v2: { config: 'AUTOMATIC' },
    targeting: { geos: (args.countries || 'us').split(',').map(code => ({ country_code: code.trim().toLowerCase() })) },
  }
  setIf(s, 'start-time')
  setIf(s, 'end-time')
  setIf(s, 'pixel-id')
  if (args['min-age'] || args['max-age'] || args.gender) {
    const demo = {}
    if (args['min-age']) demo.min_age = Number(args['min-age'])
    if (args['max-age']) demo.max_age = Number(args['max-age'])
    if (args.gender) demo.gender = args.gender
    s.targeting.demographics = [demo]
  }
  money(s, 'daily-budget', 'daily_budget_micro')
  money(s, 'lifetime-budget', 'lifetime_budget_micro')
  money(s, 'bid', 'bid_micro')
  const extra = jsonArg('json')
  if (extra.targeting) { s.targeting = { ...s.targeting, ...extra.targeting }; delete extra.targeting }
  return { ...s, ...extra }
}

function buildAd(adSquadId) {
  const a = { ad_squad_id: adSquadId, name: args.name, creative_id: args['creative-id'], status: args.status || 'PAUSED' }
  setIf(a, 'type')
  return { ...a, ...jsonArg('json') }
}

function buildCreative(accountId) {
  const c = { ad_account_id: accountId, name: args.name, type: args.type || 'WEB_VIEW', headline: args.headline, top_snap_media_id: args['media-id'] }
  setIf(c, 'brand-name')
  setIf(c, 'call-to-action')
  setIf(c, 'shareable')
  if (args['profile-id']) c.profile_properties = { profile_id: args['profile-id'] }
  if (args.url) c.web_view_properties = { url: args.url }
  if (c.headline && c.headline.length > 34) throw new Error('--headline must be 34 characters or fewer')
  if (c.brand_name && c.brand_name.length > 32) throw new Error('--brand-name must be 32 characters or fewer')
  return { ...c, ...jsonArg('json') }
}

function buildPatch() {
  const p = {}
  setIf(p, 'name')
  setIf(p, 'status')
  setIf(p, 'end-time')
  setIf(p, 'start-time')
  setIf(p, 'bid-strategy')
  setIf(p, 'optimization-goal')
  setIf(p, 'creative-id')
  money(p, 'daily-budget', 'daily_budget_micro')
  money(p, 'bid', 'bid_micro')
  if (cmd === 'campaigns') money(p, 'lifetime-budget', 'lifetime_spend_cap_micro')
  else money(p, 'lifetime-budget', 'lifetime_budget_micro')
  return { ...p, ...jsonArg('json') }
}

// ---------- commands ----------

async function entityCommand(level, parentFlag, parentRequired, build) {
  const L = LEVELS[level]
  const parentId = level === 'campaigns' || level === 'creatives' ? adAccountId() : args[parentFlag]
  switch (sub) {
    case 'list':
      if (!parentId) return { error: parentRequired }
      return api('GET', `${L.parentPath(parentId)}${args.limit ? `?limit=${encodeURIComponent(args.limit)}` : ''}`)
    case 'get':
      if (!args.id) return { error: '--id required' }
      return api('GET', `/${level}/${args.id}`)
    case 'create': {
      if (!parentId) return { error: parentRequired }
      const entity = build(parentId)
      if (!entity.name) return { error: '--name required' }
      if (entity.status === 'ACTIVE') { const block = requireConfirm('Creating an ACTIVE entity'); if (block) return block }
      return api('POST', L.parentPath(parentId), { [L.key]: [entity] })
    }
    case 'update': {
      if (!args.id) return { error: '--id required' }
      const patch = buildPatch()
      if (!Object.keys(patch).length) return { error: 'Nothing to update. Pass fields such as --name, --status, --daily-budget, --end-time or --json' }
      if (patch.status === 'ACTIVE') { const block = requireConfirm('Activating'); if (block) return block }
      return updateEntity(level, args.id, patch)
    }
    case 'pause':
      if (!args.id) return { error: '--id required' }
      return updateEntity(level, args.id, statusPatch('PAUSED'))
    case 'activate': {
      if (!args.id) return { error: '--id required' }
      const block = requireConfirm('Activating'); if (block) return block
      return updateEntity(level, args.id, statusPatch('ACTIVE'))
    }
    case 'delete': {
      if (!args.id) return { error: '--id required' }
      const block = requireConfirm('Deleting (permanent)'); if (block) return block
      return api('DELETE', `/${level}/${args.id}`)
    }
    default:
      return { error: `Unknown ${level} subcommand. Use: list, get, create, update, pause, activate, delete` }
  }
}

async function main() {
  let result
  switch (cmd) {
    case 'auth': {
      const clientId = args['client-id'] || REFRESH.client_id
      const redirectUri = args['redirect-uri'] || process.env.SNAPCHAT_REDIRECT_URI || DEFAULT_REDIRECT
      if (sub === 'url') {
        if (!clientId) { result = { error: 'SNAPCHAT_CLIENT_ID env or --client-id required' }; break }
        const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: args.scope || DEFAULT_SCOPE })
        if (args.state) params.set('state', args.state)
        result = {
          url: `${AUTHORIZE_URL}?${params}`,
          redirect_uri: redirectUri,
          next: 'Open the url, approve, then copy the whole address-bar URL (or just the code) and run: auth exchange --code "<it>" --env-file .env. The code is single-use and expires within minutes.',
        }
      } else if (sub === 'exchange') {
        const clientSecret = REFRESH.client_secret
        if (!clientId || !clientSecret) { result = { error: 'SNAPCHAT_CLIENT_ID and SNAPCHAT_CLIENT_SECRET environment variables required (the secret is never read from a flag)' }; break }
        if (!args.code || args.code === true) { result = { error: '--code required (the code, or the full redirected URL containing ?code=)' }; break }
        let code = args.code
        if (/^https?:\/\//.test(code)) {
          const parsed = new URL(code)
          if (parsed.searchParams.get('error')) { result = { error: `Authorization denied: ${parsed.searchParams.get('error')}` }; break }
          code = parsed.searchParams.get('code')
          if (!code) { result = { error: 'No code= parameter in that URL' }; break }
        }
        const form = { grant_type: 'authorization_code', code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri }
        if (args['dry-run']) { result = { _dry_run: true, method: 'POST', url: TOKEN_URL, body: { ...form, code: '***', client_secret: '***' } }; break }
        const res = await fetch(TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(form).toString(),
          signal: requestSignal(),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.refresh_token) {
          process.exitCode = 1
          result = { error: `Code exchange failed (HTTP ${res.status})`, reason: data.error_description || data.error || 'no refresh_token returned', hint: 'Codes are single-use and short-lived, and redirect_uri must match the app exactly. Run auth url again for a fresh code.' }
          break
        }
        if (args['env-file'] && args['env-file'] !== true) {
          const fs = require('node:fs')
          const file = args['env-file']
          const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(line => !/^SNAPCHAT_REFRESH_TOKEN=/.test(line)) : []
          while (lines.length && lines[lines.length - 1] === '') lines.pop()
          lines.push(`SNAPCHAT_REFRESH_TOKEN=${data.refresh_token}`, '')
          fs.writeFileSync(file, lines.join('\n'), { mode: 0o600 })
          fs.chmodSync(file, 0o600)
          result = { saved: file, variable: 'SNAPCHAT_REFRESH_TOKEN', access_token_expires_in: data.expires_in, scope: data.scope, note: 'Refresh token written to the file only (mode 600). Keep that file out of git.' }
        } else {
          result = { refresh_token: data.refresh_token, access_token_expires_in: data.expires_in, scope: data.scope, note: 'Store refresh_token as SNAPCHAT_REFRESH_TOKEN. Use --env-file .env to write it to a file instead of the terminal.' }
        }
      } else result = { error: 'Unknown auth subcommand. Use: url, exchange' }
      break
    }

    case 'token':
      if (sub !== 'refresh') { result = { error: 'Unknown token subcommand. Use: refresh' }; break }
      if (!canRefresh()) { result = { error: 'SNAPCHAT_CLIENT_ID, SNAPCHAT_CLIENT_SECRET and SNAPCHAT_REFRESH_TOKEN required' }; break }
      if (args['dry-run']) { result = { _dry_run: true, method: 'POST', url: TOKEN_URL, body: { grant_type: 'refresh_token', client_id: REFRESH.client_id, client_secret: '***', refresh_token: '***' } }; break }
      {
        const data = await refreshToken()
        result = { access_token: data.access_token, expires_in: data.expires_in, refresh_token_rotated: Boolean(data.refresh_token && data.refresh_token !== REFRESH.refresh_token) }
      }
      break

    case 'me':
      result = await api('GET', '/me')
      break

    case 'organizations':
      result = sub === 'list' ? await api('GET', '/me/organizations') : { error: 'Unknown organizations subcommand. Use: list' }
      break

    case 'accounts':
      if (sub === 'list') {
        if (!args['org-id']) { result = { error: '--org-id required' }; break }
        result = await api('GET', `/organizations/${args['org-id']}/adaccounts`)
      } else if (sub === 'get') {
        const id = args.id || adAccountId()
        if (!id) { result = { error: '--id or SNAPCHAT_AD_ACCOUNT_ID required' }; break }
        result = await api('GET', `/adaccounts/${id}`)
      } else result = { error: 'Unknown accounts subcommand. Use: list, get' }
      break

    case 'campaigns':
      result = await entityCommand('campaigns', null, 'SNAPCHAT_AD_ACCOUNT_ID env or --ad-account-id required', buildCampaign)
      break
    case 'adsquads':
      result = await entityCommand('adsquads', 'campaign-id', '--campaign-id required', buildAdSquad)
      break
    case 'ads':
      result = await entityCommand('ads', 'adsquad-id', '--adsquad-id required', buildAd)
      break

    case 'creatives':
      if (!['list', 'get', 'create'].includes(sub)) { result = { error: 'Unknown creatives subcommand. Use: list, get, create' }; break }
      result = await entityCommand('creatives', null, 'SNAPCHAT_AD_ACCOUNT_ID env or --ad-account-id required', buildCreative)
      break

    case 'media': {
      const accountId = adAccountId()
      if (sub === 'list') {
        if (!accountId) { result = { error: 'SNAPCHAT_AD_ACCOUNT_ID env or --ad-account-id required' }; break }
        result = await api('GET', `/adaccounts/${accountId}/media`)
      } else if (sub === 'get') {
        if (!args.id) { result = { error: '--id required' }; break }
        result = await api('GET', `/media/${args.id}`)
      } else if (sub === 'create') {
        if (!accountId || !args.name || !args.type) { result = { error: 'ad account, --name and --type (IMAGE|VIDEO) required' }; break }
        result = await api('POST', `/adaccounts/${accountId}/media`, { media: [{ ad_account_id: accountId, name: args.name, type: args.type }] })
      } else if (sub === 'upload') {
        if (!args.id || !args.file) { result = { error: '--id (media id) and --file <path> required' }; break }
        const fs = require('node:fs')
        const pathMod = require('node:path')
        const filePath = args.file
        if (!args['dry-run'] && !fs.existsSync(filePath)) { result = { error: `File not found: ${filePath}` }; break }
        const fileName = pathMod.basename(filePath)
        result = await api('POST', `/media/${args.id}/upload`, undefined, {
          form: {
            describe: { file: fileName },
            build: () => { const fd = new FormData(); fd.append('file', new Blob([fs.readFileSync(filePath)]), fileName); return fd },
          },
        })
      } else result = { error: 'Unknown media subcommand. Use: list, get, create, upload' }
      break
    }

    case 'pixels': {
      const accountId = adAccountId()
      if (sub !== 'list') { result = { error: 'Unknown pixels subcommand. Use: list' }; break }
      if (!accountId) { result = { error: 'SNAPCHAT_AD_ACCOUNT_ID env or --ad-account-id required' }; break }
      result = await api('GET', `/adaccounts/${accountId}/pixels`)
      break
    }

    case 'stats': {
      if (sub !== 'get') { result = { error: 'Unknown stats subcommand. Use: get' }; break }
      const level = args.level || 'campaigns'
      if (!['adaccounts', 'campaigns', 'adsquads', 'ads'].includes(level)) { result = { error: '--level must be adaccounts, campaigns, adsquads or ads' }; break }
      if (!args.id) { result = { error: '--id required' }; break }
      const params = new URLSearchParams({ granularity: args.granularity || 'TOTAL', fields: args.fields || (level === 'adaccounts' ? 'spend' : 'impressions,swipes,spend') })
      if (args['start-time']) params.set('start_time', args['start-time'])
      if (args['end-time']) params.set('end_time', args['end-time'])
      if (args.breakdown) params.set('breakdown', args.breakdown)
      for (const key of ['swipe-up-attribution-window', 'view-attribution-window']) if (args[key]) params.set(key.replace(/-/g, '_'), args[key])
      result = await api('GET', `/${level}/${args.id}/stats?${params}`)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        notes: 'Money flags take account currency (--daily-budget 50) or micros (--daily-budget-micro 50000000). New entities default to PAUSED. activate/delete need --confirm. --dry-run previews any request.',
        usage: {
          auth: 'auth url [--redirect-uri https://localhost/callback] | auth exchange --code <code or full redirected URL> [--env-file .env]',
          token: 'token refresh',
          me: 'me',
          organizations: 'organizations list',
          accounts: 'accounts [list --org-id <id> | get [--id <id>]]',
          campaigns: 'campaigns [list|get|create|update|pause|activate|delete] [--id <id>] [--name <n>] [--objective WEB_CONVERSION] [--objective-v2 SALES] [--daily-budget 50] [--start-time ISO] [--end-time ISO] [--json \'{...}\']',
          adsquads: 'adsquads [list|get|create|update|pause|activate|delete] --campaign-id <id> [--id <id>] [--name <n>] [--optimization-goal PIXEL_PURCHASE] [--bid-strategy AUTO_BID|LOWEST_COST_WITH_MAX_BID|TARGET_COST] [--bid 3] [--daily-budget 20] [--countries sa,ae] [--min-age 18] [--max-age 34] [--gender FEMALE] [--pixel-id <id>] [--json \'{...}\']',
          ads: 'ads [list|get|create|update|pause|activate|delete] --adsquad-id <id> [--id <id>] [--name <n>] [--creative-id <id>]',
          creatives: 'creatives [list|get|create] [--name <n>] [--type WEB_VIEW] [--media-id <id>] [--headline <=34 chars] [--brand-name <=32 chars] [--call-to-action SHOP_NOW] [--url https://...] [--profile-id <id>]',
          media: 'media [list|get|create|upload] [--name <n> --type IMAGE|VIDEO] [--id <media id> --file <path>]',
          pixels: 'pixels list',
          stats: 'stats get --level campaigns|adsquads|ads|adaccounts --id <id> [--granularity TOTAL|DAY|HOUR] [--start-time ISO --end-time ISO] [--fields impressions,swipes,spend]',
        },
      }
  }

  if (result?.error && rawArgs.length > 0) process.exitCode = 1
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
