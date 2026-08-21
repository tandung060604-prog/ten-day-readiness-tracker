import webpush from 'web-push'

type PushSubscriptionData = {
  endpoint: string
  expirationTime?: number | null
  keys: { p256dh: string; auth: string }
}

type ReleasePayload = {
  version: string
  kind: 'major' | 'bugfix'
  title: string
  body: string
  url: string
}

type Env = {
  APP_ORIGIN: string
  PUSH_SUBSCRIPTIONS: KVNamespace
  VAPID_PUBLIC_KEY: string
  VAPID_PRIVATE_KEY: string
  VAPID_SUBJECT: string
  PUSH_DISPATCH_TOKEN: string
}

const json = (data: unknown, status = 200, origin?: string) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    ...(origin ? { 'access-control-allow-origin': origin, vary: 'Origin' } : {})
  }
})

const matchesAppOrigin = (request: Request, env: Env) => request.headers.get('Origin') === env.APP_ORIGIN

const cors = (request: Request, env: Env) => matchesAppOrigin(request, env)
  ? new Response(null, { status: 204, headers: { 'access-control-allow-origin': env.APP_ORIGIN, 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type', vary: 'Origin' } })
  : new Response(null, { status: 403 })

const isSubscription = (value: unknown): value is PushSubscriptionData => {
  if (!value || typeof value !== 'object') return false
  const subscription = value as PushSubscriptionData
  try {
    return new URL(subscription.endpoint).protocol === 'https:' && Boolean(subscription.keys?.p256dh) && Boolean(subscription.keys?.auth)
  } catch {
    return false
  }
}

const subscriptionKey = async (endpoint: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint))
  return `subscription:${[...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')}`
}

const isReleasePayload = (value: unknown): value is ReleasePayload => {
  if (!value || typeof value !== 'object') return false
  const payload = value as ReleasePayload
  return ['major', 'bugfix'].includes(payload.kind) && [payload.version, payload.title, payload.body, payload.url].every(field => typeof field === 'string' && field.length > 0 && field.length <= 300)
}

async function subscribe(request: Request, env: Env) {
  if (!matchesAppOrigin(request, env)) return json({ error: 'Origin không được phép.' }, 403)
  const subscription = await request.json<unknown>().catch(() => null)
  if (!isSubscription(subscription)) return json({ error: 'Subscription không hợp lệ.' }, 400, env.APP_ORIGIN)
  await env.PUSH_SUBSCRIPTIONS.put(await subscriptionKey(subscription.endpoint), JSON.stringify(subscription))
  return json({ ok: true }, 201, env.APP_ORIGIN)
}

async function dispatch(request: Request, env: Env) {
  if (request.headers.get('authorization') !== `Bearer ${env.PUSH_DISPATCH_TOKEN}`) return json({ error: 'Không được phép.' }, 401)
  const payload = await request.json<unknown>().catch(() => null)
  if (!isReleasePayload(payload)) return json({ error: 'Release payload không hợp lệ.' }, 400)

  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY)
  let cursor: string | undefined
  let delivered = 0
  let removed = 0
  let failed = 0

  do {
    const page = await env.PUSH_SUBSCRIPTIONS.list({ prefix: 'subscription:', cursor })
    for (const key of page.keys) {
      const stored = await env.PUSH_SUBSCRIPTIONS.get(key.name, 'json')
      if (!isSubscription(stored)) {
        await env.PUSH_SUBSCRIPTIONS.delete(key.name)
        removed += 1
        continue
      }
      try {
        await webpush.sendNotification(stored, JSON.stringify(payload), { TTL: 60 * 60 * 24 })
        delivered += 1
      } catch (error) {
        const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error ? Number(error.statusCode) : 0
        if (statusCode === 404 || statusCode === 410) {
          await env.PUSH_SUBSCRIPTIONS.delete(key.name)
          removed += 1
        } else {
          failed += 1
        }
      }
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  return json({ delivered, removed, failed })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (request.method === 'OPTIONS') return cors(request, env)
    if (request.method === 'GET' && pathname === '/v1/config') return json({ vapidPublicKey: env.VAPID_PUBLIC_KEY }, 200, matchesAppOrigin(request, env) ? env.APP_ORIGIN : undefined)
    if (request.method === 'GET' && pathname === '/health') return json({ ok: true })
    if (request.method === 'POST' && pathname === '/v1/subscriptions') return subscribe(request, env)
    if (request.method === 'POST' && pathname === '/v1/dispatch') return dispatch(request, env)
    return json({ error: 'Không tìm thấy.' }, 404)
  }
}
