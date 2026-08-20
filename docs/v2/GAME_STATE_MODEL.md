# LITTLE DAYS V2 — GAME STATE DATA MODEL SPECIFICATION

**Schema Version:** 1.0  
**Phase:** Phase 02 — Game State Architecture  
**Storage Key:** `localStorage['little_days_game_state_v1']`  

---

## 1. Domain Entities & Schemas

### 1.1 Progression & Bond (`CoupleProgress`)
Tracks individual level, collective couple Bond Level, and XP progression curves.

```typescript
export interface CoupleProgress {
  level: number               // Current player level (Starts at 1)
  xp: number                  // Current XP within current level
  xpToNextLevel: number       // Required XP: Math.floor(100 * Math.pow(1.25, level - 1))
  bondLevel: number           // Collective intimacy & bond level (Starts at 1)
  bondXp: number              // Current Bond XP
  bondXpToNextLevel: number   // Required Bond XP: Math.floor(100 * Math.pow(1.2, bondLevel - 1))
  totalActivitiesCompleted: number
}
```

### 1.2 In-Game Currencies (`CurrencyBalances`)
Strictly in-game earned rewards with no real-money purchases.

| Currency | Symbol | Primary Sources | Primary Sinks |
|---|---|---|---|
| **Hearts** | ❤️ | Intimacy, habit tracking, partner care notes, daily check-ins | Buying romantic gifts, unlocking couple photo frames |
| **Stars** | ⭐ | Perfect days, completing all daily checklists, milestones | Upgrading buildings, unlocking town monuments |
| **Coins** | 🪙 | Completing workouts, mini-games, market trades | Purchasing recipes, ingredients, and town decorations |

### 1.3 Authoritative Inventory (`InventorySlot` & `InventoryCategory`)
8 structured categories with stack limits and attributes:

```typescript
export type InventoryCategory =
  | 'ingredients'  // Fresh items for cooking (strawberry, milk, honey)
  | 'food'         // Prepared meals & drinks (bento, ramen, boba tea)
  | 'decorations'  // Town & home decorations (cherry pot, fairy lantern)
  | 'memories'     // Romantic tokens & keepsakes (polaroid frame, flight ticket)
  | 'boosters'     // Energy & wellness buffs (ginger tea, coffee, lavender oil)
  | 'collectibles' // Badges, plushies, crowns (chiikawa badge, usagi plushie)
  | 'souvenirs'    // Vacation keepsakes (Nha Trang seashell, pearl keychain)
  | 'materials'    // Construction items (pine wood, river stone, golden nails)

export interface InventorySlot {
  itemId: string
  quantity: number
  acquiredAt: string // ISO 8601 Timestamp
}
```

### 1.4 Town Buildings (`BuildingProgress`)
Progression for all 13 town buildings across 3 upgrade tiers:

```typescript
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
```

### 1.5 Adventure Campaign Engine (`AdventureDefinition`)
A generic campaign system that supports multi-chapter adventures (e.g. 10-Day Nha Trang Countdown, 30-Day Couple Challenge, Seasonal Holiday Trips):

```typescript
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
```
