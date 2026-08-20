import type { PuzzleLevelProgress } from './types'

const STORAGE_KEY = 'little_days_puzzle_progress_v1'

export const puzzleProgressRepository = {
  loadAllProgress(): Record<number, PuzzleLevelProgress> {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // ignore
    }
    // Default unlocked level 1
    return {
      1: {
        levelNumber: 1,
        completed: false,
        stars: 0,
        highScore: 0,
        rewardClaimed: false
      }
    }
  },

  getLevelProgress(levelNumber: number): PuzzleLevelProgress {
    const all = this.loadAllProgress()
    return (
      all[levelNumber] || {
        levelNumber,
        completed: false,
        stars: 0,
        highScore: 0,
        rewardClaimed: false
      }
    )
  },

  recordLevelCompletion(
    levelNumber: number,
    score: number,
    stars: number
  ): { isFirstCompletion: boolean; progress: PuzzleLevelProgress } {
    const all = this.loadAllProgress()
    const existing = all[levelNumber]
    const isFirst = !existing || !existing.completed

    const updated: PuzzleLevelProgress = {
      levelNumber,
      completed: true,
      stars: Math.max(existing?.stars || 0, stars),
      highScore: Math.max(existing?.highScore || 0, score),
      rewardClaimed: existing?.rewardClaimed || false,
      completedAt: existing?.completedAt || new Date().toISOString()
    }

    all[levelNumber] = updated

    // Unlock next level
    const nextLevel = levelNumber + 1
    if (!all[nextLevel]) {
      all[nextLevel] = {
        levelNumber: nextLevel,
        completed: false,
        stars: 0,
        highScore: 0,
        rewardClaimed: false
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {
      // ignore
    }

    return { isFirstCompletion: isFirst, progress: updated }
  },

  claimReward(levelNumber: number): boolean {
    const all = this.loadAllProgress()
    const current = all[levelNumber]
    if (!current || !current.completed || current.rewardClaimed) {
      return false // cannot claim or already claimed
    }

    all[levelNumber] = {
      ...current,
      rewardClaimed: true
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {
      // ignore
    }

    return true
  }
}
