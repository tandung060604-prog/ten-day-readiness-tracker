import { requestNotificationPermission } from '../utils/notifications'

const workerUrl = (import.meta.env.VITE_PUSH_WORKER_URL || '').replace(/\/$/, '')

type PushConfig = { vapidPublicKey: string }

export type PushSubscriptionResult = 'enabled' | 'not-configured' | 'not-supported' | 'denied' | 'failed'

export function isBackgroundPushConfigured() {
  return Boolean(workerUrl)
}

export function urlBase64ToUint8Array(value: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - value.length % 4) % 4)
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

export async function subscribeToReleasePush(): Promise<PushSubscriptionResult> {
  if (!workerUrl) return 'not-configured'
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'not-supported'
  if (await requestNotificationPermission() !== 'granted') return 'denied'

  try {
    const registration = await navigator.serviceWorker.ready
    const configResponse = await fetch(`${workerUrl}/v1/config`, { cache: 'no-store' })
    const config = await configResponse.json() as PushConfig
    if (!configResponse.ok || !config.vapidPublicKey) return 'failed'
    const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey) })
    const response = await fetch(`${workerUrl}/v1/subscriptions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(subscription) })
    return response.ok ? 'enabled' : 'failed'
  } catch {
    return 'failed'
  }
}
