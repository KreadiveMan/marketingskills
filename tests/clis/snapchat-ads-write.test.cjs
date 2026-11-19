const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const cli = path.resolve(__dirname, '../../tools/clis/snapchat-ads.js')
function run(argv, response = "throw new Error('unexpected network request')", env = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'marketing-cli-'))
  const mock = path.join(tmp, 'fetch.cjs')
  fs.writeFileSync(mock, `const assert = require('node:assert/strict'); let calls = 0; global.fetch = async (url, opts) => { calls++; ${response} };`)
  try {
    return spawnSync(process.execPath, ['--require', mock, cli, ...argv], {
      env: { ...process.env, SNAPCHAT_ACCESS_TOKEN: 'fixture-token', SNAPCHAT_AD_ACCOUNT_ID: 'acc-1', ...env },
      encoding: 'utf8', timeout: 10000,
    })
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}
const ok = body => `return new Response(JSON.stringify(${JSON.stringify(body)}), {status: 200})`

test('campaign create posts a PAUSED campaign with micro budget to the ad account', () => {
  const result = run(['campaigns', 'create', '--name', 'Spring', '--objective', 'WEB_CONVERSION', '--daily-budget', '50'], `
    assert.equal(url, 'https://adsapi.snapchat.com/v1/adaccounts/acc-1/campaigns');
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers.Authorization, 'Bearer fixture-token');
    const c = JSON.parse(opts.body).campaigns[0];
    assert.equal(c.status, 'PAUSED'); assert.equal(c.daily_budget_micro, 50000000); assert.equal(c.objective, 'WEB_CONVERSION');
    ${ok({ request_status: 'SUCCESS', campaigns: [{ sub_request_status: 'SUCCESS', campaign: { id: 'c1' } }] })}`)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).campaigns[0].campaign.id, 'c1')
})

test('creating an ACTIVE entity without --confirm is refused before any request', () => {
  const result = run(['campaigns', 'create', '--name', 'X', '--status', 'ACTIVE'])
  assert.equal(result.status, 1)
  assert.match(JSON.parse(result.stdout).error, /--confirm/)
})

test('activate and delete require --confirm', () => {
  for (const sub of ['activate', 'delete']) {
    const result = run(['ads', sub, '--id', 'a1'])
    assert.equal(result.status, 1)
    assert.match(JSON.parse(result.stdout).error, /--confirm/)
  }
})

test('update fetches the entity, merges the patch and PUTs to the parent collection', () => {
  const result = run(['adsquads', 'update', '--id', 's1', '--daily-budget', '30'], `
    if (calls === 1) {
      assert.equal(url, 'https://adsapi.snapchat.com/v1/adsquads/s1'); assert.equal(opts.method, 'GET');
      ${ok({ request_status: 'SUCCESS', adsquads: [{ adsquad: { id: 's1', campaign_id: 'c1', name: 'Old', daily_budget_micro: 20000000, created_at: 'x' } }] })}
    }
    assert.equal(url, 'https://adsapi.snapchat.com/v1/campaigns/c1/adsquads'); assert.equal(opts.method, 'PUT');
    const s = JSON.parse(opts.body).adsquads[0];
    assert.equal(s.daily_budget_micro, 30000000); assert.equal(s.name, 'Old'); assert.equal(s.created_at, undefined);
    ${ok({ request_status: 'SUCCESS', adsquads: [{ sub_request_status: 'SUCCESS', adsquad: { id: 's1' } }] })}`)
  assert.equal(result.status, 0, result.stderr)
})

test('a sub-request error exits nonzero and keeps the payload', () => {
  const body = { request_status: 'PARTIAL', adsquads: [{ sub_request_status: 'ERROR', sub_request_error_reason: 'no funding source' }] }
  const result = run(['adsquads', 'create', '--campaign-id', 'c1', '--name', 'S'], ok(body))
  assert.equal(result.status, 1)
  assert.deepEqual(JSON.parse(result.stdout), body)
})

test('dry-run sends nothing and hides the token', () => {
  const result = run(['campaigns', 'delete', '--id', 'c1', '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  const preview = JSON.parse(result.stdout)
  assert.equal(preview._dry_run, true); assert.equal(preview.method, 'DELETE')
  assert.equal(preview.headers.Authorization, 'Bearer ***')
})

test('a 401 refreshes the token once and retries', () => {
  const result = run(['me'], `
    if (url.startsWith('https://accounts.snapchat.com')) {
      assert.match(opts.body, /grant_type=refresh_token/);
      return new Response(JSON.stringify({ access_token: 'fresh', expires_in: 1800 }), { status: 200 });
    }
    if (opts.headers.Authorization === 'Bearer fixture-token') return new Response('{}', { status: 401 });
    assert.equal(opts.headers.Authorization, 'Bearer fresh');
    ${ok({ request_status: 'SUCCESS', me: { id: 'u1' } })}`,
  { SNAPCHAT_CLIENT_ID: 'id', SNAPCHAT_CLIENT_SECRET: 'secret', SNAPCHAT_REFRESH_TOKEN: 'refresh' })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).me.id, 'u1')
})

test('creative headline over 34 characters is rejected locally', () => {
  const result = run(['creatives', 'create', '--name', 'C', '--headline', 'x'.repeat(35)])
  assert.equal(result.status, 1)
})
