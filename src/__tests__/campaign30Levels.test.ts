import { describe, it, expect } from 'vitest'
import { CANONICAL_PUZZLE_LEVELS, getLevelDefinition, getLevelsByChapter } from '../domain/puzzle/levels'
import { getChapterSummary, getOverallCampaignProgress } from '../domain/puzzle/campaignManager'
import type { PuzzleLevelProgress } from '../domain/puzzle/types'

describe('Full 30-Level Adventure Campaign Suite — Phase 08', () => {
  describe('1. Level Catalog & Chapter Partitioning', () => {
    it('contains exactly 30 canonical levels without duplicates or gaps', () => {
      expect(CANONICAL_PUZZLE_LEVELS.length).toBe(30)
      const levelNumbers = CANONICAL_PUZZLE_LEVELS.map(l => l.levelNumber)
      for (let i = 1; i <= 30; i++) {
        expect(levelNumbers).toContain(i)
        expect(getLevelDefinition(i)).toBeDefined()
      }
    })

    it('divides levels evenly into 3 chapters of 10 levels each', () => {
      const ch1Levels = getLevelsByChapter(1)
      const ch2Levels = getLevelsByChapter(2)
      const ch3Levels = getLevelsByChapter(3)

      expect(ch1Levels.length).toBe(10)
      expect(ch2Levels.length).toBe(10)
      expect(ch3Levels.length).toBe(10)

      expect(ch1Levels.map(l => l.levelNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      expect(ch2Levels.map(l => l.levelNumber)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
      expect(ch3Levels.map(l => l.levelNumber)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
    })
  })

  describe('2. Level Schema & Gameplay Integrity', () => {
    it('ensures every level config satisfies schema constraints', () => {
      const validCharacters = new Set(['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'])

      for (const level of CANONICAL_PUZZLE_LEVELS) {
        expect(level.title.length).toBeGreaterThan(0)
        expect(level.subtitle.length).toBeGreaterThan(0)
        expect(level.storyBeat.length).toBeGreaterThan(0)
        expect(level.gridRows).toBeGreaterThanOrEqual(7)
        expect(level.gridCols).toBeGreaterThanOrEqual(7)
        expect(level.maxMoves).toBeGreaterThanOrEqual(20)

        // Star thresholds ascending
        expect(level.starThresholds[0]).toBeLessThan(level.starThresholds[1])
        expect(level.starThresholds[1]).toBeLessThan(level.starThresholds[2])

        // Allowed tiles must all be valid Chiikawa characters
        expect(level.allowedTileTypes.length).toBeGreaterThanOrEqual(4)
        for (const tile of level.allowedTileTypes) {
          expect(validCharacters.has(tile)).toBe(true)
        }

        // Rewards must have positive values
        expect(level.rewards.stars).toBeGreaterThanOrEqual(1)
        expect(level.rewards.coins).toBeGreaterThanOrEqual(50)
        expect(level.rewards.xp).toBeGreaterThanOrEqual(50)
        expect(level.rewards.hearts).toBeGreaterThanOrEqual(25)

        // Objectives must be valid
        expect(level.objectives.length).toBeGreaterThanOrEqual(1)
        for (const obj of level.objectives) {
          expect(obj.targetCount).toBeGreaterThan(0)
          if (obj.type === 'collect_tiles' && obj.tileType) {
            expect(level.allowedTileTypes).toContain(obj.tileType)
          }
        }
      }
    })
  })

  describe('3. Chapter Unlock & Progression Logic', () => {
    it('manages chapter unlocks based on prerequisite milestones', () => {
      const freshProgress: Record<number, PuzzleLevelProgress> = {
        1: { levelNumber: 1, completed: false, stars: 0, highScore: 0, rewardClaimed: false }
      }

      const ch1Fresh = getChapterSummary(1, freshProgress)
      const ch2Fresh = getChapterSummary(2, freshProgress)
      const ch3Fresh = getChapterSummary(3, freshProgress)

      expect(ch1Fresh.isUnlocked).toBe(true)
      expect(ch2Fresh.isUnlocked).toBe(false)
      expect(ch3Fresh.isUnlocked).toBe(false)

      // Complete Level 10
      const afterL10Progress = {
        ...freshProgress,
        10: { levelNumber: 10, completed: true, stars: 3, highScore: 4000, rewardClaimed: true }
      }
      const ch2AfterL10 = getChapterSummary(2, afterL10Progress)
      expect(ch2AfterL10.isUnlocked).toBe(true)

      // Complete Level 20
      const afterL20Progress = {
        ...afterL10Progress,
        20: { levelNumber: 20, completed: true, stars: 3, highScore: 5000, rewardClaimed: true }
      }
      const ch3AfterL20 = getChapterSummary(3, afterL20Progress)
      expect(ch3AfterL20.isUnlocked).toBe(true)
    })

    it('aggregates total campaign star progress correctly', () => {
      const mockProgress: Record<number, PuzzleLevelProgress> = {}
      for (let i = 1; i <= 30; i++) {
        mockProgress[i] = {
          levelNumber: i,
          completed: true,
          stars: 3,
          highScore: 3000,
          rewardClaimed: true
        }
      }

      const overall = getOverallCampaignProgress(mockProgress)
      expect(overall.totalCompletedLevels).toBe(30)
      expect(overall.totalEarnedStars).toBe(90)
      expect(overall.isCampaignComplete).toBe(true)
      expect(overall.completionPercentage).toBe(100)
    })
  })

  describe('4. Level 30 Grand Sunset Finale', () => {
    it('verifies Level 30 spectacle finale rewards and Endless Life mode', () => {
      const level30 = getLevelDefinition(30)
      expect(level30).toBeDefined()
      expect(level30?.title).toContain('Grand Sunset Finale')
      expect(level30?.buildingImpact).toContain('Endless Couple Life')
      expect(level30?.rewards.stars).toBe(3)
      expect(level30?.rewards.coins).toBe(500)
      expect(level30?.rewards.xp).toBe(500)
      expect(level30?.rewards.hearts).toBe(300)
    })
  })
})
