import { beforeEach, describe, expect, it } from 'vitest'
import { generateBoard } from '../domain/puzzle/puzzleEngine'
import { createEndlessLevel, loadEndlessScore, recordEndlessScore } from '../domain/puzzle/endlessMode'

describe('endless couple mode', () => {
  beforeEach(() => localStorage.clear())

  it('uses one stable seed and opening board for the same couple and date', () => {
    const first = createEndlessLevel('2026-08-21', 'haru|mai|2026-06-11', 'player1')
    const second = createEndlessLevel('2026-08-21', 'haru|mai|2026-06-11', 'player2')
    const boardA = generateBoard(first).map(row => row.map(tile => tile.type))
    const boardB = generateBoard(second).map(row => row.map(tile => tile.type))
    expect(first.seed).toBe(second.seed)
    expect(boardA).toEqual(boardB)
    expect(createEndlessLevel('2026-08-22', 'haru|mai|2026-06-11').seed).not.toBe(first.seed)
  })

  it('keeps a local two-player best-score ledger without lowering records', () => {
    const level = createEndlessLevel('2026-08-21', 'duo')
    recordEndlessScore('2026-08-21', level.seed!, 'player1', 1200)
    recordEndlessScore('2026-08-21', level.seed!, 'player1', 900)
    recordEndlessScore('2026-08-21', level.seed!, 'player2', 1500)
    const record = loadEndlessScore('2026-08-21', level.seed!)
    expect(record.player1Best).toBe(1200)
    expect(record.player2Best).toBe(1500)
    expect(record.player1Attempts).toBe(2)
    expect(record.player2Attempts).toBe(1)
  })
})
