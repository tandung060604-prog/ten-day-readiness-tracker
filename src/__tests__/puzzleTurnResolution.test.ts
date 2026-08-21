import { describe, expect, it } from 'vitest'
import { CANONICAL_PUZZLE_LEVELS } from '../domain/puzzle/levels'
import { createTile, findMatches, generateBoard, hasValidMove, resolveTurn } from '../domain/puzzle/puzzleEngine'
import type { BoardTile, LevelDefinition } from '../domain/puzzle/types'

const testLevel: LevelDefinition = {
  levelNumber: 1, chapter: 1, chapterTitle: 'Test', title: 'Test', subtitle: 'Test', storyBeat: 'Test',
  gridRows: 3, gridCols: 3, allowedTileTypes: ['chiikawa', 'usagi', 'hachiware'], maxMoves: 1,
  starThresholds: [50, 100, 150], objectives: [{ type: 'collect_tiles', tileType: 'chiikawa', targetCount: 3, currentCount: 0 }],
  companionIntro: { character: 'chiikawa', dialogue: 'Test' }, rewards: { stars: 1, coins: 1, xp: 1, hearts: 1 }
}

function boardFrom(types: string[][]): BoardTile[][] {
  return types.map((row, r) => row.map((type, c) => createTile(r, c, type as BoardTile['type'])))
}

describe('puzzle turn resolution', () => {
  it('creates playable, match-free boards for every campaign level', () => {
    for (const level of CANONICAL_PUZZLE_LEVELS) {
      const board = generateBoard(level)
      expect(findMatches(board)).toHaveLength(0)
      expect(hasValidMove(board)).toBe(true)
    }
  })

  it('does not spend a move on an invalid swap', () => {
    const board = boardFrom([['chiikawa', 'usagi', 'chiikawa'], ['hachiware', 'chiikawa', 'usagi'], ['hachiware', 'usagi', 'hachiware']])
    const result = resolveTurn(board, testLevel, { r: 0, c: 0 }, { r: 0, c: 1 }, 1, 0, testLevel.objectives, 0)
    expect(result.outcome).toBe('invalid')
    expect(result.movesRemaining).toBe(1)
    expect(result.score).toBe(0)
  })

  it('resolves a valid swap, completes the objective and returns a win snapshot', () => {
    const board = boardFrom([['chiikawa', 'usagi', 'chiikawa'], ['hachiware', 'chiikawa', 'usagi'], ['hachiware', 'usagi', 'hachiware']])
    const result = resolveTurn(board, testLevel, { r: 0, c: 1 }, { r: 1, c: 1 }, 1, 0, testLevel.objectives, 0)
    expect(result.outcome).toBe('won')
    expect(result.movesRemaining).toBe(0)
    expect(result.score).toBeGreaterThan(0)
    expect(result.objectives[0].currentCount).toBe(3)
    expect(result.animationFrames.map(frame => frame.kind)).toEqual(expect.arrayContaining(['swap', 'clear', 'fall']))
  })
})
