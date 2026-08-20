import { describe, it, expect, beforeEach } from 'vitest'
import { migrationManager } from '../domain/privacy/migrationManager'
import { backupManager } from '../domain/privacy/backupManager'
import { coupleStorage } from '../domain/couple/coupleStorage'
import { getTodayQuestion } from '../domain/couple/coupleFeatures'
import { CANONICAL_PUZZLE_LEVELS } from '../domain/puzzle/levels'
import { getItemQuantity, removeItem, canAffordUpgrade } from '../domain/economy/inventoryManager'
import type { InventorySlot } from '../domain/economy/types'

describe('End-to-End Release Readiness & Dry-Run Suite — Phase 13', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('1. E2E New User Boot & Couple Life Interaction Flow', () => {
    it('initializes clean profile, answers daily question, and stores record', () => {
      const todayQ = getTodayQuestion(1)
      expect(todayQ.id).toBe(1)

      coupleStorage.saveAnsweredQuestion({
        questionId: todayQ.id,
        answeredAt: new Date().toISOString(),
        user1Answer: 'Cùng nhau uống trà chiều và ngắm hoàng hôn.',
        isFavorite: true
      })

      const answers = coupleStorage.loadAnsweredQuestions()
      expect(answers[1]).toBeDefined()
      expect(answers[1].user1Answer).toContain('uống trà chiều')
    })
  })

  describe('2. E2E V1 Legacy Migration Simulation Flow', () => {
    it('detects legacy V1 profile, migrates to Schema V2, and maintains data integrity', () => {
      localStorage.setItem(
        'readiness_couple_profile',
        JSON.stringify({
          id: 'v1_legacy',
          partner1Name: 'Chiikawa Fan',
          partner2Name: 'Usagi Fan',
          relationshipStartDate: '2024-05-20'
        })
      )

      expect(migrationManager.detectV1Data()).toBe(true)
      const res = migrationManager.migrateV1ToV2()
      expect(res.migrated).toBe(true)
      expect(res.snapshotSaved).toBe(true)

      const profile = JSON.parse(localStorage.getItem('little_days_couple_profile_v2')!)
      expect(profile.schemaVersion).toBe(2)
      expect(profile.partner1Name).toBe('Chiikawa Fan')
      expect(profile.partner2Name).toBe('Usagi Fan')
    })
  })

  describe('3. E2E Campaign Progress to Building Upgrade Flow', () => {
    it('validates 30-level integrity and building upgrade transaction', () => {
      // 1. Verify 30 levels exist
      expect(CANONICAL_PUZZLE_LEVELS.length).toBe(30)
      const finale = CANONICAL_PUZZLE_LEVELS[29]
      expect(finale.levelNumber).toBe(30)
      expect(finale.title).toContain('Grand Sunset Finale')

      // 2. Simulate Inventory & Upgrade Cost
      let inventory: InventorySlot[] = [
        { itemId: 'item_sakura_wood', quantity: 10 },
        { itemId: 'item_home_blueprint', quantity: 2 }
      ]

      const afford = canAffordUpgrade('home', 2, 500, 200, 10, inventory)
      expect(afford.canAfford).toBe(true)

      // Deduct materials
      const rem = removeItem(inventory, 'item_sakura_wood', 4)
      expect(rem.success).toBe(true)
      inventory = rem.nextInventory

      const woodLeft = getItemQuantity(inventory, 'item_sakura_wood')
      expect(woodLeft).toBe(6)
    })
  })

  describe('4. E2E Encrypted Backup & Restore Flow', () => {
    it('exports encrypted backup, clears storage, and restores completely', async () => {
      // Setup initial data
      localStorage.setItem('little_days_gamestate', JSON.stringify({ coins: 777, stars: 12 }))
      const payload = backupManager.generateBackupPayload()

      const passphrase = 'MySuperSafePassword'
      const encrypted = await backupManager.encryptBackup(payload, passphrase)
      expect(encrypted.isEncrypted).toBe(true)

      // Clear storage
      localStorage.clear()
      expect(localStorage.getItem('little_days_gamestate')).toBeNull()

      // Decrypt and Restore
      const decrypted = await backupManager.decryptBackup(encrypted, passphrase)
      const restoreRes = backupManager.restoreBackupPayload(decrypted)
      expect(restoreRes.success).toBe(true)
    })
  })
})
