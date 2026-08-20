export type { LocationId } from '../../game/types'
import type { LocationId } from '../../game/types'

// ─── 1. PROGRESSION & BOND ───
export interface CoupleProgress {
  level: number
  xp: number
  xpToNextLevel: number
  bondLevel: number
  bondXp: number
  bondXpToNextLevel: number
  totalActivitiesCompleted: number
}

// ─── 2. CURRENCIES (In-game Only, No Real-Money) ───
export interface CurrencyBalances {
  hearts: number // Earned through intimacy, daily love, habits, partner interactions
  stars: number  // Earned through quests, milestones, perfect day completions
  coins: number  // Friendship & town currency earned via activities, mini-games, markets
}

// ─── 3. AUTHORITATIVE INVENTORY ───
export type InventoryCategory =
  | 'ingredients'  // Fresh items for recipes (strawberry, milk, honey, eggs)
  | 'food'         // Cooked dishes & bento (strawberry cake, ramen, bubble tea)
  | 'decorations'  // Town & home decorations (flower pots, cherry tree, fairy lights)
  | 'memories'     // Love tokens & date keepsakes (polaroid frame, ticket stub)
  | 'boosters'     // Energy & focus boosts (herbal tea, coffee, soothing music)
  | 'collectibles' // Rare Chiikawa trinkets, badges, trophies
  | 'souvenirs'    // Special trip souvenirs (Nha Trang seashell, pearl keychain)
  | 'materials'    // Building upgrade materials (wood, stone, golden nails)

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface InventoryItemDefinition {
  id: string
  name: string
  category: InventoryCategory
  rarity: ItemRarity
  icon: string
  description: string
  maxStack: number
  sellValue?: number
  energyRestore?: number
  buffDescription?: string
}

export interface InventorySlot {
  itemId: string
  quantity: number
  acquiredAt: string // ISO 8601 Timestamp
}

// ─── 4. BUILDING PROGRESSION ───
export type BuildingLevel = 1 | 2 | 3

export interface BuildingProgress {
  buildingId: LocationId
  level: BuildingLevel
  xp: number
  xpToNextLevel: number
  unlockedFeatures: string[]
  decorations: string[]
  lastVisitedAt?: string
}

// ─── 5. QUESTS & ADVENTURES ───
export type QuestCategory = 'daily' | 'weekly' | 'story' | 'couple' | 'event'

export interface QuestReward {
  hearts?: number
  stars?: number
  coins?: number
  xp?: number
  bondXp?: number
  items?: { itemId: string; quantity: number }[]
}

export interface QuestDefinition {
  id: string
  title: string
  description: string
  category: QuestCategory
  icon: string
  targetCount: number
  currentCount: number
  completed: boolean
  claimed: boolean
  rewards: QuestReward
}

export interface AdventureChapter {
  id: string
  chapterNumber: number
  title: string
  description: string
  completed: boolean
  unlocked: boolean
  requiredLevel?: number
  rewards: QuestReward
}

export interface AdventureDefinition {
  id: string
  title: string
  description: string
  coverIcon: string
  startDate?: string
  endDate?: string
  currentChapterId: string
  chapters: AdventureChapter[]
  rewards: QuestReward
  completed: boolean
}

// ─── 6. REWARD DEFINITION ───
export interface RewardGrant {
  hearts?: number
  stars?: number
  coins?: number
  xp?: number
  bondXp?: number
  items?: { itemId: string; quantity: number }[]
  buildingXp?: { buildingId: LocationId; amount: number }[]
  source: string
}

// ─── 7. AGGREGATE GAME STATE ───
export interface GameState {
  version: number
  progression: CoupleProgress
  currencies: CurrencyBalances
  inventory: InventorySlot[]
  buildings: Record<LocationId, BuildingProgress>
  quests: QuestDefinition[]
  activeAdventure: AdventureDefinition
  updatedAt: string
}

// ─── 8. TYPED EVENT BUS DEFINITIONS ───
export type GameEventMap = {
  ACTIVITY_COMPLETED: { activityId: string; name: string; category: string }
  REWARD_GRANTED: { grant: RewardGrant; summary: string }
  LEVEL_UP: { newLevel: number; previousLevel: number }
  BOND_LEVEL_UP: { newBondLevel: number; previousBondLevel: number }
  BUILDING_UPGRADED: { buildingId: LocationId; newLevel: BuildingLevel }
  INVENTORY_UPDATED: { itemId: string; delta: number; newQuantity: number }
  QUEST_COMPLETED: { questId: string; title: string }
  ADVENTURE_CHAPTER_COMPLETED: { adventureId: string; chapterId: string }
  CURRENCY_CHANGED: { currency: keyof CurrencyBalances; delta: number; newBalance: number }
}
