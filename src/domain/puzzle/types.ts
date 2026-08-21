import type { MascotCharacter } from '../couple/types'

// ─── 1. TILE & BLOCKER DEFINITIONS ───
export type TileType = 'chiikawa' | 'usagi' | 'hachiware' | 'momonga' | 'kurimanju' | 'rakko'

export type SpecialType = 'rocket_row' | 'rocket_col' | 'rainbow' | 'none'

export type BlockerType = 'crate' | 'ice' | 'none'

export interface BoardTile {
  id: string
  row: number
  col: number
  type: TileType
  special: SpecialType
  blocker: BlockerType
  isMatched?: boolean
  isNew?: boolean
}

// ─── 2. OBJECTIVES & LEVEL DEFINITIONS ───
export type ObjectiveType = 'collect_tiles' | 'clear_blockers' | 'activate_specials'

export interface LevelObjective {
  type: ObjectiveType
  tileType?: TileType
  blockerType?: BlockerType
  targetCount: number
  currentCount: number
}

export interface LevelDefinition {
  levelNumber: number
  chapter: 1 | 2 | 3
  chapterTitle: string
  title: string
  subtitle: string
  storyBeat: string
  gridRows: number
  gridCols: number
  allowedTileTypes: TileType[]
  maxMoves: number
  starThresholds: [number, number, number]
  objectives: LevelObjective[]
  companionIntro: {
    character: MascotCharacter | 'both'
    dialogue: string
  }
  rewards: {
    stars: number
    coins: number
    xp: number
    hearts: number
    materials?: { itemId: string; quantity: number }[]
  }
  buildingImpact?: string
  mode?: 'campaign' | 'endless'
  seed?: number
  challengeDate?: string
  endlessPlayer?: 'player1' | 'player2'
}

// ─── 3. MATCH & GAME STATE ───
export interface MatchGroup {
  tiles: { row: number; col: number }[]
  type: TileType
  specialToSpawn?: {
    type: SpecialType
    row: number
    col: number
  }
}

export interface PuzzleGameState {
  level: LevelDefinition
  board: BoardTile[][]
  movesRemaining: number
  score: number
  objectives: LevelObjective[]
  isWon: boolean
  isLost: boolean
  comboCount: number
  loveLinkCharge: number
}

export type TurnOutcome = 'playing' | 'won' | 'lost' | 'invalid'

export interface TurnAnimationFrame {
  kind: 'swap' | 'clear' | 'fall' | 'reshuffle'
  board: BoardTile[][]
  durationMs: number
}

/** Complete result of one user action. The UI only replays this snapshot. */
export interface TurnResolution {
  board: BoardTile[][]
  score: number
  objectives: LevelObjective[]
  movesRemaining: number
  loveLinkCharge: number
  comboCount: number
  animationFrames: TurnAnimationFrame[]
  outcome: TurnOutcome
}

export interface PuzzleLevelProgress {
  levelNumber: number
  completed: boolean
  stars: number
  highScore: number
  rewardClaimed: boolean
  completedAt?: string
}
