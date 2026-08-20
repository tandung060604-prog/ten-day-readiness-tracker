import { describe, it, expect, beforeEach } from 'vitest'
import { migrationManager } from '../domain/privacy/migrationManager'
import { backupManager } from '../domain/privacy/backupManager'
import { vaultManager } from '../domain/privacy/vaultManager'
import type { BackupPayload } from '../domain/privacy/types'

describe('Privacy, Backup & V1->V2 Migration Suite — Phase 11', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('1. V1 to V2 Data Migration', () => {
    it('detects legacy V1 profile data and creates safety rollback snapshot', () => {
      localStorage.setItem(
        'readiness_couple_profile',
        JSON.stringify({
          id: 'v1_profile',
          user1Name: 'Minh',
          user2Name: 'Hoa',
          relationshipStartDate: '2023-10-10'
        })
      )

      expect(migrationManager.detectV1Data()).toBe(true)

      const result = migrationManager.migrateV1ToV2()
      expect(result.migrated).toBe(true)
      expect(result.snapshotSaved).toBe(true)
      expect(migrationManager.isMigrationCompleted()).toBe(true)

      // Verify V2 Profile structure
      const v2ProfileRaw = localStorage.getItem('little_days_couple_profile_v2')
      expect(v2ProfileRaw).toBeDefined()
      const v2Profile = JSON.parse(v2ProfileRaw!)
      expect(v2Profile.schemaVersion).toBe(2)
      expect(v2Profile.partner1Name).toBe('Minh')
      expect(v2Profile.partner2Name).toBe('Hoa')
    })

    it('tolerates corrupt legacy data gracefully without throwing unhandled exceptions', () => {
      localStorage.setItem('readiness_couple_profile', 'invalid_json{')
      expect(migrationManager.detectV1Data()).toBe(true)

      const result = migrationManager.migrateV1ToV2()
      expect(result.migrated).toBe(true)
    })
  })

  describe('2. Backup Validation & Restore Safety', () => {
    it('generates standard JSON payload and validates schema', () => {
      const payload = backupManager.generateBackupPayload()
      expect(payload.schemaVersion).toBe(2)
      expect(payload.appVersion).toBe('2.0.0')

      const validation = backupManager.validateBackupPayload(payload)
      expect(validation.isValid).toBe(true)
      expect(validation.summary).toContain('Schema V2')
    })

    it('rejects invalid backup structures prior to mutation', () => {
      const invalid = { invalidField: true }
      const validation = backupManager.validateBackupPayload(invalid)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBeDefined()

      const res = backupManager.restoreBackupPayload(invalid as any)
      expect(res.success).toBe(false)
    })

    it('creates safety snapshot before executing restore', () => {
      localStorage.setItem('little_days_gamestate', 'existing_state')

      const samplePayload: BackupPayload = {
        schemaVersion: 2,
        exportedAt: new Date().toISOString(),
        appVersion: '2.0.0',
        coupleProfile: { partner1Name: 'TestUser1' },
        gameState: { coins: 500 },
        puzzleProgress: {},
        answeredQuestions: {},
        loveLetters: [],
        memoryCapsules: [],
        bucketList: [],
        privacySettings: {
          hideWellnessClinicOnMap: false,
          requirePinForJournal: false,
          requirePinForClinic: false,
          enablePrivacyBlur: false,
          optInPreciseGps: false
        }
      }

      const res = backupManager.restoreBackupPayload(samplePayload)
      expect(res.success).toBe(true)
      expect(localStorage.getItem('little_days_pre_restore_snapshot')).toBeDefined()
    })
  })

  describe('3. Web Crypto AES-GCM Encrypted Backup Roundtrip', () => {
    it('encrypts and decrypts payload correctly with passphrase', async () => {
      const samplePayload: BackupPayload = {
        schemaVersion: 2,
        exportedAt: '2026-08-20T12:00:00Z',
        appVersion: '2.0.0',
        coupleProfile: { partner1Name: 'Dũng', partner2Name: 'Hương' },
        gameState: { coins: 999 },
        puzzleProgress: {},
        answeredQuestions: {},
        loveLetters: [],
        memoryCapsules: [],
        bucketList: [],
        privacySettings: {
          hideWellnessClinicOnMap: false,
          requirePinForJournal: false,
          requirePinForClinic: false,
          enablePrivacyBlur: false,
          optInPreciseGps: false
        }
      }

      const passphrase = 'SecretPassword123'
      const encrypted = await backupManager.encryptBackup(samplePayload, passphrase)

      expect(encrypted.isEncrypted).toBe(true)
      expect(encrypted.ciphertextHex.length).toBeGreaterThan(20)
      expect(encrypted.saltHex.length).toBe(32) // 16 bytes hex

      // Decrypt successfully
      const decrypted = await backupManager.decryptBackup(encrypted, passphrase)
      expect(decrypted.schemaVersion).toBe(2)
      expect(decrypted.coupleProfile.partner1Name).toBe('Dũng')

      // Fail with wrong passphrase
      await expect(
        backupManager.decryptBackup(encrypted, 'WrongPassword')
      ).rejects.toThrow()
    })
  })

  describe('4. Privacy Vault & PIN Management', () => {
    it('sets and verifies 4-digit PIN accurately', () => {
      expect(vaultManager.loadVaultConfig().hasPin).toBe(false)

      const setRes = vaultManager.setPin('1234')
      expect(setRes.success).toBe(true)
      expect(vaultManager.loadVaultConfig().hasPin).toBe(true)

      expect(vaultManager.verifyPin('1234')).toBe(true)
      expect(vaultManager.verifyPin('9999')).toBe(false)

      vaultManager.clearPin()
      expect(vaultManager.loadVaultConfig().hasPin).toBe(false)
    })

    it('rejects invalid PIN formats', () => {
      const fail1 = vaultManager.setPin('123') // 3 digits
      expect(fail1.success).toBe(false)

      const fail2 = vaultManager.setPin('12a4') // letters
      expect(fail2.success).toBe(false)
    })
  })
})
