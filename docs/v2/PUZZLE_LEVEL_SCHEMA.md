# PUZZLE LEVEL DATA SCHEMA — LITTLE DAYS V2

## 1. Schema Definition (TypeScript)

```typescript
export interface LevelObjective {
  type: 'collect_tiles' | 'clear_blockers' | 'activate_specials'
  tileType?: TileType
  blockerType?: BlockerType
  targetCount: number
  currentCount: number
}

export interface LevelDefinition {
  levelNumber: number
  title: string
  subtitle: string
  gridRows: number
  gridCols: number
  allowedTileTypes: TileType[]
  maxMoves: number
  starThresholds: [number, number, number] // [1 Star, 2 Stars, 3 Stars]
  objectives: LevelObjective[]
  companionIntro: {
    character: 'chiikawa' | 'usagi' | 'both'
    dialogue: string
  }
  rewards: {
    stars: number
    coins: number
    xp: number
    hearts: number
    materials?: { itemId: string; quantity: number }[]
  }
}
```

---

## 2. First 3 Canonical Levels (Vertical Slice)

### Level 1: "Tia Sáng Đầu Tiên" (First Spark)
- **Grid**: 7x7
- **Max Moves**: 20
- **Allowed Tiles**: `heart`, `carrot`, `flower`, `star`
- **Objective**: Collect 15 `heart` tiles
- **Blockers**: None
- **Stars**: [600, 1200, 1800]
- **Companion**: Chiikawa
- **Reward**: 1 Star, 50 Coins, 50 XP, 25 Hearts

### Level 2: "Ý Tưởng Của Usagi" (Usagi's Big Idea)
- **Grid**: 7x7
- **Max Moves**: 22
- **Allowed Tiles**: `heart`, `carrot`, `flower`, `star`, `shell`
- **Objective**: Collect 20 `carrot` tiles + Activate 1 `rocket` special
- **Blockers**: None
- **Stars**: [800, 1600, 2400]
- **Companion**: Usagi
- **Reward**: 1 Star, 75 Coins, 75 XP, 35 Hearts

### Level 3: "Lời Hẹn Ước Hoa Nở" (Flower Promise)
- **Grid**: 8x8
- **Max Moves**: 25
- **Allowed Tiles**: `heart`, `carrot`, `flower`, `star`, `strawberry`
- **Objective**: Collect 25 `flower` tiles + Clear 6 `crate` soft blockers
- **Blockers**: 6 Wooden Crates placed around center
- **Stars**: [1200, 2400, 3600]
- **Companion**: Both (Chiikawa & Usagi)
- **Reward**: 1 Star, 100 Coins, 100 XP, 50 Hearts + 1 Sweet Dessert Material
