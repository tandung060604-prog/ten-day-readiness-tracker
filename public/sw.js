const RELEASE_PARAMS = new URL(self.location.href).searchParams
const RELEASE_VERSION = RELEASE_PARAMS.get('version') || 'dev'
const RELEASE_KIND = RELEASE_PARAMS.get('kind') || 'bugfix'
const CACHE_NAME = `little-days-shell-${RELEASE_VERSION}`
const BASE_URL = new URL('./', self.location.href)
const INDEX_URL = new URL('./index.html', BASE_URL).pathname
const APP_SHELL = ['index.html', 'manifest.json', 'favicon.svg', 'icon-192.png', 'icon-512.png']
  .map(file => new URL(`./${file}`, BASE_URL).pathname)

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    const hadPreviousRelease = keys.some(key => key.startsWith('little-days-shell-') && key !== CACHE_NAME)
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    await self.clients.claim()
    if (!hadPreviousRelease || !self.registration.showNotification) return

    const label = RELEASE_KIND === 'major' ? 'Bản cập nhật lớn' : 'Bản sửa lỗi'
    try {
      await self.registration.showNotification('Little Days đã cập nhật', {
        body: `${label} · phiên bản ${RELEASE_VERSION} đã sẵn sàng.`,
        icon: new URL('./icon-192.png', BASE_URL).href,
        badge: new URL('./icon-192.png', BASE_URL).href,
        tag: `little-days-release-${RELEASE_VERSION}`,
        data: { url: new URL('./', BASE_URL).href }
      })
    } catch {
      // Notification permission may be unavailable.
    }
  })())
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    const existing = clientList.find(client => 'focus' in client)
    if (existing) return existing.focus()
    return self.clients.openWindow(event.notification.data?.url || new URL('./', BASE_URL).href)
  }))
})

self.addEventListener('push', event => {
  const fallback = {
    title: 'Little Days đã cập nhật',
    body: 'Có một bản cập nhật mới đang chờ bạn.',
    url: new URL('./', BASE_URL).href
  }
  let payload = fallback
  try {
    payload = { ...fallback, ...event.data?.json() }
  } catch {
    // A malformed payload still receives a safe, visible notification.
  }
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: new URL('./icon-192.png', BASE_URL).href,
    badge: new URL('./icon-192.png', BASE_URL).href,
    tag: `little-days-release-${payload.version || 'latest'}`,
    data: { url: payload.url }
  }))
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return
  const isNavigation = event.request.mode === 'navigate'
  event.respondWith(
    isNavigation
      ? fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(INDEX_URL, copy)); return response }).catch(() => caches.match(INDEX_URL))
      : caches.match(event.request).then(cached => cached ?? fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response }))
  )
})
