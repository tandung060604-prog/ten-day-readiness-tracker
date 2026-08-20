export type ItemCategory =
  | 'building_materials'
  | 'ingredients'
  | 'decorations'
  | 'memory_collectibles'
  | 'puzzle_boosters'
  | 'souvenirs'
  | 'event_items'

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface GameItem {
  id: string
  name: string
  category: ItemCategory
  rarity: ItemRarity
  icon: string
  description: string
  sellPriceCoins?: number
  buyPriceCoins?: number
}

export interface InventorySlot {
  itemId: string
  quantity: number
}

export interface BuildingUpgradeCost {
  coins: number
  hearts: number
  stars: number
  requiredMaterials: { itemId: string; quantity: number }[]
}

export interface BuildingTierConfig {
  tier: 1 | 2 | 3
  tierName: string
  description: string
  visualVariantId: string
  unlockedPerks: string[]
  dialogueCheer: {
    character: 'chiikawa' | 'usagi' | 'hachiware' | 'both'
    text: string
  }
  costToReach: BuildingUpgradeCost
}

export interface BuildingUpgradeDefinition {
  buildingId: string
  buildingName: string
  tiers: {
    1: BuildingTierConfig
    2: BuildingTierConfig
    3: BuildingTierConfig
  }
}

export interface BuildingUpgradeResult {
  success: boolean
  error?: string
  nextTier?: 1 | 2 | 3
  spentCost?: BuildingUpgradeCost
}
