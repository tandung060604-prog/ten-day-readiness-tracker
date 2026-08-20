import { BUILDING_UPGRADE_REGISTRY } from './buildingUpgradeRegistry'
import type { BuildingUpgradeCost, InventorySlot } from './types'

export function getItemQuantity(inventory: InventorySlot[], itemId: string): number {
  const slot = inventory.find(s => s.itemId === itemId)
  return slot ? slot.quantity : 0
}

export function addItem(
  inventory: InventorySlot[],
  itemId: string,
  quantity = 1
): InventorySlot[] {
  if (quantity <= 0) return [...inventory]

  const existingIndex = inventory.findIndex(s => s.itemId === itemId)
  if (existingIndex >= 0) {
    const next = [...inventory]
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: next[existingIndex].quantity + quantity
    }
    return next
  }

  return [...inventory, { itemId, quantity }]
}

export function removeItem(
  inventory: InventorySlot[],
  itemId: string,
  quantity = 1
): { nextInventory: InventorySlot[]; success: boolean } {
  if (quantity <= 0) return { nextInventory: [...inventory], success: true }

  const existingIndex = inventory.findIndex(s => s.itemId === itemId)
  if (existingIndex < 0 || inventory[existingIndex].quantity < quantity) {
    return { nextInventory: [...inventory], success: false }
  }

  const currentQty = inventory[existingIndex].quantity
  const next = [...inventory]

  if (currentQty === quantity) {
    next.splice(existingIndex, 1)
  } else {
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: currentQty - quantity
    }
  }

  return { nextInventory: next, success: true }
}

export function canAffordUpgrade(
  buildingId: string,
  targetTier: 2 | 3,
  coins: number,
  hearts: number,
  stars: number,
  inventory: InventorySlot[]
): {
  canAfford: boolean
  missingCoins: number
  missingHearts: number
  missingStars: number
  missingMaterials: { itemId: string; required: number; have: number; missing: number }[]
  cost: BuildingUpgradeCost
} {
  const def = BUILDING_UPGRADE_REGISTRY[buildingId]
  const defaultCost: BuildingUpgradeCost = { coins: 0, hearts: 0, stars: 0, requiredMaterials: [] }

  if (!def || !def.tiers[targetTier]) {
    return {
      canAfford: false,
      missingCoins: 0,
      missingHearts: 0,
      missingStars: 0,
      missingMaterials: [],
      cost: defaultCost
    }
  }

  const cost = def.tiers[targetTier].costToReach
  const missingCoins = Math.max(0, cost.coins - coins)
  const missingHearts = Math.max(0, cost.hearts - hearts)
  const missingStars = Math.max(0, cost.stars - stars)

  const missingMaterials: { itemId: string; required: number; have: number; missing: number }[] = []
  for (const mat of cost.requiredMaterials) {
    const have = getItemQuantity(inventory, mat.itemId)
    if (have < mat.quantity) {
      missingMaterials.push({
        itemId: mat.itemId,
        required: mat.quantity,
        have,
        missing: mat.quantity - have
      })
    }
  }

  const canAfford =
    missingCoins === 0 &&
    missingHearts === 0 &&
    missingStars === 0 &&
    missingMaterials.length === 0

  return {
    canAfford,
    missingCoins,
    missingHearts,
    missingStars,
    missingMaterials,
    cost
  }
}

export function executeBuildingUpgrade(
  buildingId: string,
  currentTier: 1 | 2 | 3,
  coins: number,
  hearts: number,
  stars: number,
  inventory: InventorySlot[]
): {
  success: boolean
  error?: string
  nextTier?: 1 | 2 | 3
  nextCoins: number
  nextHearts: number
  nextInventory: InventorySlot[]
  spentCost?: BuildingUpgradeCost
} {
  if (currentTier >= 3) {
    return {
      success: false,
      error: 'Công trình đã đạt cấp độ tối đa (Cấp 3)!',
      nextCoins: coins,
      nextHearts: hearts,
      nextInventory: inventory
    }
  }

  const targetTier = (currentTier + 1) as 2 | 3
  const affordability = canAffordUpgrade(buildingId, targetTier, coins, hearts, stars, inventory)

  if (!affordability.canAfford) {
    return {
      success: false,
      error: 'Chưa đủ tài nguyên hoặc vật liệu để nâng cấp công trình!',
      nextCoins: coins,
      nextHearts: hearts,
      nextInventory: inventory
    }
  }

  // Deduct currencies (Strict non-negative guard)
  const nextCoins = coins - affordability.cost.coins
  const nextHearts = hearts - affordability.cost.hearts

  // Deduct materials
  let nextInventory = [...inventory]
  for (const mat of affordability.cost.requiredMaterials) {
    const res = removeItem(nextInventory, mat.itemId, mat.quantity)
    if (!res.success) {
      return {
        success: false,
        error: `Không đủ vật liệu ${mat.itemId}!`,
        nextCoins: coins,
        nextHearts: hearts,
        nextInventory: inventory
      }
    }
    nextInventory = res.nextInventory
  }

  return {
    success: true,
    nextTier: targetTier,
    nextCoins,
    nextHearts,
    nextInventory,
    spentCost: affordability.cost
  }
}
