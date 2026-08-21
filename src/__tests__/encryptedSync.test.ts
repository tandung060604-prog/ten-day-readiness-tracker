import { beforeEach, describe, expect, it } from 'vitest'
import { encryptedSync } from '../domain/privacy/encryptedSync'
import { backupManager } from '../domain/privacy/backupManager'
import type { BackupPayload } from '../domain/privacy/types'

const basePayload = (updatedAt: string, coins: number): BackupPayload => ({
  schemaVersion: 2, exportedAt: updatedAt, appVersion: '2.0.0', coupleProfile: { updatedAt, player1: { nickname: 'Haru' } },
  gameState: { updatedAt, currencies: { coins }, dailyChallengeClaims: { '2026-08-21': ['hydration'] } }, puzzleProgress: { 1: { stars: 2 } },
  answeredQuestions: {}, loveLetters: [{ id: 'letter-1' }], memoryCapsules: [], bucketList: [], privacySettings: { hideWellnessClinicOnMap: false, requirePinForJournal: false, requirePinForClinic: false, enablePrivacyBlur: false, optInPreciseGps: false }
})

describe('encrypted sync foundation', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips a local encrypted envelope', async () => {
    localStorage.setItem('little_days_game_state_v1', JSON.stringify({ currencies: { coins: 42 } }))
    const envelope = await encryptedSync.createEnvelope('sync-passphrase')
    const decrypted = await encryptedSync.decryptEnvelope(envelope, 'sync-passphrase')
    expect(envelope.kind).toBe('little-days-encrypted-sync')
    expect(decrypted.gameState).toEqual({ currencies: { coins: 42 } })
  })

  it('merges newer state while unioning daily claims and keeps the latest score payload', () => {
    const merged = encryptedSync.mergePayloads(basePayload('2026-08-21T10:00:00Z', 10), { ...basePayload('2026-08-21T11:00:00Z', 20), gameState: { updatedAt: '2026-08-21T11:00:00Z', currencies: { coins: 20 }, dailyChallengeClaims: { '2026-08-21': ['movement'] } } })
    expect(merged.gameState.currencies.coins).toBe(20)
    expect(merged.gameState.dailyChallengeClaims['2026-08-21']).toEqual(['hydration', 'movement'])
    expect(merged.puzzleProgress[1].stars).toBe(2)
  })

  it('reads the active repository keys when creating a backup', () => {
    localStorage.setItem('little_days_game_state_v1', JSON.stringify({ currencies: { coins: 99 } }))
    const payload = backupManager.generateBackupPayload()
    expect(payload.gameState).toEqual({ currencies: { coins: 99 } })
  })
})
