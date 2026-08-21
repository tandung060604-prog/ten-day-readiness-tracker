import type { CoupleProfile } from '../couple/types'
import type { LevelDefinition } from './types'
export { getLocalDateKey } from '../challenges/dailyChallenge'

export type EndlessPlayer = 'player1' | 'player2'
export interface EndlessScoreRecord {
  dateKey: string
  seed: number
  player1Best: number
  player2Best: number
  player1Attempts: number
  player2Attempts: number
  updatedAt: string
}

const STORAGE_KEY = 'little_days_endless_progress_v1'

function hashSeed(input: string): number {
  let hash = 2166136261
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function getCoupleSeedKey(profile?: CoupleProfile): string {
  if (!profile) return 'little-days-demo-couple'
  const names = [profile.player1.nickname, profile.player2.nickname].sort().join('|')
  return `${names}|${profile.relationshipStartDate ?? ''}`
}

export function createEndlessLevel(dateKey: string, coupleKey: string, player: EndlessPlayer = 'player1'): LevelDefinition {
  const seed = hashSeed(`${dateKey}|${coupleKey}`)
  return {
    levelNumber: 1000,
    chapter: 3,
    chapterTitle: 'Endless Couple Life',
    title: 'Thử Thách Vô Tận',
    subtitle: 'Bàn 8×8 · 30 lượt · ghi điểm cao cùng người thương',
    storyBeat: 'Mỗi ngày một seed mới, cùng một bàn chơi cho cả hai người.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 30,
    starThresholds: [3500, 6500, 9500],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 30, currentCount: 0 },
      { type: 'activate_specials', targetCount: 2, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Cùng seed, cùng bàn chơi — ai sẽ ghi điểm cao hơn hôm nay? ✨' },
    rewards: { stars: 0, coins: 0, xp: 0, hearts: 0 },
    mode: 'endless', seed, challengeDate: dateKey, endlessPlayer: player
  }
}

function emptyRecord(dateKey: string, seed: number): EndlessScoreRecord {
  return { dateKey, seed, player1Best: 0, player2Best: 0, player1Attempts: 0, player2Attempts: 0, updatedAt: new Date().toISOString() }
}

export function loadEndlessScore(dateKey: string, seed: number): EndlessScoreRecord {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) as Record<string, EndlessScoreRecord> : {}
    return parsed[dateKey]?.seed === seed ? parsed[dateKey] : emptyRecord(dateKey, seed)
  } catch {
    return emptyRecord(dateKey, seed)
  }
}

export function recordEndlessScore(dateKey: string, seed: number, player: EndlessPlayer, score: number): EndlessScoreRecord {
  const current = loadEndlessScore(dateKey, seed)
  const next = { ...current, updatedAt: new Date().toISOString() }
  if (player === 'player1') { next.player1Best = Math.max(next.player1Best, score); next.player1Attempts += 1 }
  else { next.player2Best = Math.max(next.player2Best, score); next.player2Attempts += 1 }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const all = saved ? JSON.parse(saved) as Record<string, EndlessScoreRecord> : {}
    all[dateKey] = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch { /* local-first storage can be unavailable in private mode */ }
  return next
}
