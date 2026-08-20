import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateBoard,
  isAdjacent,
  isValidSwap,
  findMatches,
  resolveMatches,
  applyGravity,
  updateObjectives,
  applyMemorySpark,
  applyCarrotRocket,
  createTile
} from '../domain/puzzle/puzzleEngine'
import { CANONICAL_PUZZLE_LEVELS, getLevelDefinition } from '../domain/puzzle/levels'
import { puzzleProgressRepository } from '../domain/puzzle/puzzleProgressRepository'
import type { BoardTile, LevelObjective } from '../domain/puzzle/types'

describe('Puzzle Engine & Level Prototype Suite — Phase 07', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('1. Board Generation & Canonical Levels', () => {
    it('defines canonical adventure levels across chapters', () => {
      expect(CANONICAL_PUZZLE_LEVELS.length).toBeGreaterThanOrEqual(3)
      expect(getLevelDefinition(1)?.title).toContain('First Spark')
      expect(getLevelDefinition(2)?.title).toContain('Big Idea')
      expect(getLevelDefinition(3)?.title).toContain('Hachiware Cheer')
    })

    it('generates a 7x7 board for Level 1 without auto-matches on spawn', () => {
      const level1 = CANONICAL_PUZZLE_LEVELS[0]
      const board = generateBoard(level1)

      expect(board.length).toBe(7)
      expect(board[0].length).toBe(7)

      // Initial matches should be zero
      const matches = findMatches(board)
      expect(matches.length).toBe(0)
    })

    it('spawns wooden crates in Level 4 around the center', () => {
      const level4 = CANONICAL_PUZZLE_LEVELS[3]
      const board = generateBoard(level4)

      expect(board.length).toBe(7)
      expect(board[0].length).toBe(7)

      const crateCount = board.flat().filter(t => t.blocker === 'crate').length
      expect(crateCount).toBeGreaterThanOrEqual(4)
    })
  })

  describe('2. Swap Validation & Adjacency', () => {
    it('identifies orthogonal adjacency correctly', () => {
      expect(isAdjacent(2, 2, 2, 3)).toBe(true) // right
      expect(isAdjacent(2, 2, 2, 1)).toBe(true) // left
      expect(isAdjacent(2, 2, 1, 2)).toBe(true) // up
      expect(isAdjacent(2, 2, 3, 2)).toBe(true) // down

      expect(isAdjacent(2, 2, 3, 3)).toBe(false) // diagonal
      expect(isAdjacent(2, 2, 2, 4)).toBe(false) // too far
    })

    it('rejects swapping crate blockers', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'chiikawa', 'none', 'crate'), createTile(0, 1, 'usagi')],
        [createTile(1, 0, 'hachiware'), createTile(1, 1, 'momonga')]
      ]

      expect(isValidSwap(board, 0, 0, 0, 1)).toBe(false)
    })
  })

  describe('3. Match Detection & Specials Generation', () => {
    it('detects standard 3-in-a-row match', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'chiikawa'), createTile(0, 1, 'chiikawa'), createTile(0, 2, 'chiikawa')],
        [createTile(1, 0, 'usagi'), createTile(1, 1, 'hachiware'), createTile(1, 2, 'momonga')],
        [createTile(2, 0, 'kurimanju'), createTile(2, 1, 'rakko'), createTile(2, 2, 'usagi')]
      ]

      const matches = findMatches(board)
      expect(matches.length).toBe(1)
      expect(matches[0].type).toBe('chiikawa')
      expect(matches[0].tiles.length).toBe(3)
      expect(matches[0].specialToSpawn).toBeUndefined()
    })

    it('generates a rocket special for 4-in-a-row match', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'usagi'), createTile(0, 1, 'usagi'), createTile(0, 2, 'usagi'), createTile(0, 3, 'usagi')],
        [createTile(1, 0, 'hachiware'), createTile(1, 1, 'momonga'), createTile(1, 2, 'kurimanju'), createTile(1, 3, 'rakko')]
      ]

      const matches = findMatches(board)
      expect(matches.length).toBe(1)
      expect(matches[0].tiles.length).toBe(4)
      expect(matches[0].specialToSpawn?.type).toBe('rocket_row')
    })
  })

  describe('4. Cascade Resolution & Blocker Damage', () => {
    it('destroys adjacent wooden crates when tiles match', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'chiikawa'), createTile(0, 1, 'chiikawa'), createTile(0, 2, 'chiikawa')],
        [createTile(1, 0, 'usagi', 'none', 'crate'), createTile(1, 1, 'hachiware'), createTile(1, 2, 'momonga')]
      ]

      const matches = findMatches(board)
      const { nextBoard, clearedBlockers, pointsEarned } = resolveMatches(board, matches)

      expect(clearedBlockers).toBe(1)
      expect(nextBoard[1][0].blocker).toBe('none')
      expect(pointsEarned).toBeGreaterThan(0)
    })

    it('drops tiles down under gravity and spawns fresh tiles at top', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'chiikawa'), createTile(0, 1, 'usagi')],
        [createTile(1, 0, 'chiikawa'), createTile(1, 1, 'usagi')]
      ]
      board[1][0].isMatched = true // bottom-left tile cleared

      const dropped = applyGravity(board, ['chiikawa', 'usagi', 'hachiware'])
      expect(dropped[1][0].type).toBe('chiikawa') // top tile dropped to bottom
      expect(dropped[0][0].isNew).toBe(true) // fresh tile spawned at top
    })
  })

  describe('5. Objectives & Companion Abilities', () => {
    it('tracks objective progress and identifies full completion', () => {
      const objectives: LevelObjective[] = [
        { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 5, currentCount: 2 }
      ]

      const { nextObjectives, isAllCompleted } = updateObjectives(
        objectives,
        [{ type: 'chiikawa', count: 3 }],
        0,
        0
      )

      expect(nextObjectives[0].currentCount).toBe(5)
      expect(isAllCompleted).toBe(true)
    })

    it('executes Chiikawa Memory Spark ability to create a top match', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'usagi'), createTile(0, 1, 'hachiware'), createTile(0, 2, 'momonga')]
      ]

      const sparked = applyMemorySpark(board)
      expect(sparked[0][0].type).toBe('chiikawa')
      expect(sparked[0][1].type).toBe('chiikawa')
      expect(sparked[0][2].type).toBe('chiikawa')
    })

    it('executes Usagi Carrot Rocket ability to clear target row', () => {
      const board: BoardTile[][] = [
        [createTile(0, 0, 'chiikawa'), createTile(0, 1, 'usagi')],
        [createTile(1, 0, 'hachiware'), createTile(1, 1, 'momonga')]
      ]

      const rocketed = applyCarrotRocket(board, 0)
      expect(rocketed[0][0].isMatched).toBe(true)
      expect(rocketed[0][1].isMatched).toBe(true)
      expect(rocketed[1][0].isMatched).toBeFalsy()
    })
  })

  describe('6. Persistence & Anti-Exploit Rewards', () => {
    it('records level completion and unlocks next stage', () => {
      const { isFirstCompletion, progress } = puzzleProgressRepository.recordLevelCompletion(1, 1500, 3)

      expect(isFirstCompletion).toBe(true)
      expect(progress.stars).toBe(3)
      expect(progress.highScore).toBe(1500)

      const stage2 = puzzleProgressRepository.getLevelProgress(2)
      expect(stage2).toBeDefined()
    })

    it('prevents claiming duplicate rewards on replaying beaten levels', () => {
      puzzleProgressRepository.recordLevelCompletion(1, 1500, 3)

      // First claim succeeds
      const firstClaim = puzzleProgressRepository.claimReward(1)
      expect(firstClaim).toBe(true)

      // Second claim attempt is strictly blocked
      const secondClaim = puzzleProgressRepository.claimReward(1)
      expect(secondClaim).toBe(false)
    })
  })
})
