import { describe, expect, it } from 'vitest'
import { urlBase64ToUint8Array } from '../app/push'

describe('release push subscription', () => {
  it('converts the URL-safe VAPID public key format used by PushManager', () => {
    expect([...urlBase64ToUint8Array('AQIDBA')]).toEqual([1, 2, 3, 4])
  })
})
