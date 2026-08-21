import { describe, it, expect } from 'vitest'
import { DEFAULT_PIN_HASH, hashPin, verifyPin } from '../utils/security'

describe('Security & PIN Hashing', () => {
  it('correctly hashes a 4-digit PIN deterministically', async () => {
    const hash1 = await hashPin('1234')
    const hash2 = await hashPin('1234')
    expect(hash1).toBe(hash2)
    expect(hash1.length).toBe(64) // SHA-256 hex string length
  })

  it('keeps the default app PIN aligned with its stored hash', async () => {
    expect(await hashPin('0601')).toBe(DEFAULT_PIN_HASH)
  })

  it('produces different hashes for different PINs', async () => {
    const hash1 = await hashPin('1234')
    const hash2 = await hashPin('5678')
    expect(hash1).not.toBe(hash2)
  })

  it('verifies correct PIN against stored hash', async () => {
    const hash = await hashPin('9999')
    const isValid = await verifyPin('9999', hash)
    expect(isValid).toBe(true)
  })

  it('rejects incorrect PIN against stored hash', async () => {
    const hash = await hashPin('9999')
    const isValid = await verifyPin('0000', hash)
    expect(isValid).toBe(false)
  })
})
