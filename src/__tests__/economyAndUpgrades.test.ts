import { describe, it, expect } from 'vitest'
import { getItem, getItemsByCategory, AUTHORITATIVE_ITEMS } from '../domain/economy/itemRegistry'
import { BUILDING_UPGRADE_REGISTRY } from '../domain/economy/buildingUpgradeRegistry'
import {
  addItem,
  removeItem,
  getItemQuantity,
  canAffordUpgrade,
  executeBuildingUpgrade
} from '../domain/economy/inventoryManager'
import type { InventorySlot } from '../domain/economy/types'

describe('Economy, Inventory & Building Upgrades Suite — Phase 09', () => {
  describe('1. Item Registry & Categorization', () => {
    it('defines authoritative catalog of items across all 7 categories', () => {
      expect(AUTHORITATIVE_ITEMS.length).toBeGreaterThanOrEqual(15)

      const wood = getItem('item_sakura_wood')
      expect(wood).toBeDefined()
      expect(wood?.name).toBe('Gỗ Hoa Anh Đào')
      expect(wood?.category).toBe('building_materials')

      const materials = getItemsByCategory('building_materials')
      expect(materials.length).toBeGreaterThanOrEqual(4)

      const souvenirs = getItemsByCategory('souvenirs')
      expect(souvenirs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('2. Inventory Transactions & Non-Negative Guards', () => {
    it('adds items and increases slot quantities correctly', () => {
      let inv: InventorySlot[] = []
      inv = addItem(inv, 'item_sakura_wood', 2)
      expect(getItemQuantity(inv, 'item_sakura_wood')).toBe(2)

      inv = addItem(inv, 'item_sakura_wood', 3)
      expect(getItemQuantity(inv, 'item_sakura_wood')).toBe(5)

      inv = addItem(inv, 'item_granite_stone', 1)
      expect(inv.length).toBe(2)
      expect(getItemQuantity(inv, 'item_granite_stone')).toBe(1)
    })

    it('removes items and cleans up empty slots', () => {
      let inv: InventorySlot[] = [
        { itemId: 'item_sakura_wood', quantity: 4 },
        { itemId: 'item_granite_stone', quantity: 2 }
      ]

      const res1 = removeItem(inv, 'item_sakura_wood', 2)
      expect(res1.success).toBe(true)
      expect(getItemQuantity(res1.nextInventory, 'item_sakura_wood')).toBe(2)

      const res2 = removeItem(res1.nextInventory, 'item_granite_stone', 2)
      expect(res2.success).toBe(true)
      expect(getItemQuantity(res2.nextInventory, 'item_granite_stone')).toBe(0)
      expect(res2.nextInventory.length).toBe(1)
    })

    it('strictly prevents removing more items than currently owned', () => {
      const inv: InventorySlot[] = [{ itemId: 'item_sakura_wood', quantity: 2 }]

      const res = removeItem(inv, 'item_sakura_wood', 5)
      expect(res.success).toBe(false)
      expect(res.nextInventory).toEqual(inv)
    })
  })

  describe('3. Building Upgrade Registry & Affordability', () => {
    it('contains valid 3-tier upgrade configurations for core buildings', () => {
      const home = BUILDING_UPGRADE_REGISTRY['home']
      expect(home).toBeDefined()
      expect(home.tiers[1].tierName).toBe('Nhà Gỗ Ấm Áp')
      expect(home.tiers[2].tierName).toContain('Vườn Hoa')
      expect(home.tiers[3].tierName).toContain('Biệt Thự Tình Yêu')

      expect(home.tiers[2].costToReach.coins).toBe(250)
      expect(home.tiers[2].costToReach.requiredMaterials.length).toBeGreaterThan(0)
    })

    it('checks affordability accurately for currency and material requirements', () => {
      const inv: InventorySlot[] = [{ itemId: 'item_sakura_wood', quantity: 2 }]

      // Missing blueprint, missing wood, missing coins/hearts/stars
      const check1 = canAffordUpgrade('home', 2, 100, 50, 2, inv)
      expect(check1.canAfford).toBe(false)
      expect(check1.missingCoins).toBe(150)
      expect(check1.missingHearts).toBe(50)
      expect(check1.missingStars).toBe(3)
      expect(check1.missingMaterials.length).toBeGreaterThan(0)

      // Fully funded
      const fundedInv: InventorySlot[] = [
        { itemId: 'item_sakura_wood', quantity: 4 },
        { itemId: 'item_home_blueprint', quantity: 1 }
      ]
      const check2 = canAffordUpgrade('home', 2, 300, 150, 10, fundedInv)
      expect(check2.canAfford).toBe(true)
      expect(check2.missingMaterials.length).toBe(0)
    })
  })

  describe('4. Building Upgrade Execution & Atomicity', () => {
    it('executes building upgrade cleanly deducting exact resources', () => {
      const startCoins = 400
      const startHearts = 200
      const startStars = 10
      const startInv: InventorySlot[] = [
        { itemId: 'item_sakura_wood', quantity: 6 },
        { itemId: 'item_home_blueprint', quantity: 1 }
      ]

      const res = executeBuildingUpgrade('home', 1, startCoins, startHearts, startStars, startInv)

      expect(res.success).toBe(true)
      expect(res.nextTier).toBe(2)
      expect(res.nextCoins).toBe(150) // 400 - 250
      expect(res.nextHearts).toBe(100) // 200 - 100
      expect(getItemQuantity(res.nextInventory, 'item_sakura_wood')).toBe(2) // 6 - 4
      expect(getItemQuantity(res.nextInventory, 'item_home_blueprint')).toBe(0) // 1 - 1
    })

    it('fails gracefully when attempting to upgrade beyond tier 3', () => {
      const res = executeBuildingUpgrade('home', 3, 1000, 1000, 50, [])
      expect(res.success).toBe(false)
      expect(res.error).toContain('tối đa')
    })
  })
})
