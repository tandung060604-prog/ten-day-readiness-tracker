import type {
  BlockerType,
  BoardTile,
  LevelDefinition,
  LevelObjective,
  MatchGroup,
  SpecialType,
  TileType
} from './types'

let tileCounter = 1

export function createTile(
  row: number,
  col: number,
  type: TileType,
  special: SpecialType = 'none',
  blocker: BlockerType = 'none'
): BoardTile {
  return {
    id: `tile_${tileCounter++}`,
    row,
    col,
    type,
    special,
    blocker
  }
}

/**
 * Generates initial board without auto-matches.
 */
export function generateBoard(level: LevelDefinition): BoardTile[][] {
  const rows = level.gridRows
  const cols = level.gridCols
  const palette = level.allowedTileTypes
  const board: BoardTile[][] = []

  for (let r = 0; r < rows; r++) {
    const rowList: BoardTile[] = []
    for (let c = 0; c < cols; c++) {
      // Pick random type ensuring no 3-in-a-row on spawn
      let chosenType: TileType
      do {
        chosenType = palette[Math.floor(Math.random() * palette.length)]
      } while (
        (c >= 2 && rowList[c - 1]?.type === chosenType && rowList[c - 2]?.type === chosenType) ||
        (r >= 2 && board[r - 1][c]?.type === chosenType && board[r - 2][c]?.type === chosenType)
      )

      // Place wooden crates for level 3 around the center
      let blocker: 'crate' | 'none' = 'none'
      if (level.levelNumber === 3) {
        if ((r === 3 || r === 4) && (c === 2 || c === 3 || c === 4 || c === 5)) {
          blocker = 'crate'
        }
      }

      rowList.push(createTile(r, c, chosenType, 'none', blocker))
    }
    board.push(rowList)
  }

  return board
}

/**
 * Checks if two cells are orthogonally adjacent.
 */
export function isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  const dRow = Math.abs(r1 - r2)
  const dCol = Math.abs(c1 - c2)
  return (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)
}

/**
 * Scans board for 3+ horizontal and vertical matches.
 */
export function findMatches(board: BoardTile[][]): MatchGroup[] {
  const rows = board.length
  const cols = board[0].length
  const matchGroups: MatchGroup[] = []
  const matchedSet = new Set<string>()

  // Horizontal scan
  for (let r = 0; r < rows; r++) {
    let matchLength = 1
    for (let c = 0; c < cols; c++) {
      const current = board[r][c]
      const next = c < cols - 1 ? board[r][c + 1] : null

      if (next && current.type === next.type && current.blocker === 'none' && next.blocker === 'none') {
        matchLength++
      } else {
        if (matchLength >= 3) {
          const tiles: { row: number; col: number }[] = []
          for (let i = 0; i < matchLength; i++) {
            tiles.push({ row: r, col: c - matchLength + 1 + i })
            matchedSet.add(`${r}:${c - matchLength + 1 + i}`)
          }

          const specialToSpawn = matchLength === 4
            ? { type: 'rocket_row' as const, row: r, col: c - Math.floor(matchLength / 2) }
            : matchLength >= 5
            ? { type: 'rainbow' as const, row: r, col: c - Math.floor(matchLength / 2) }
            : undefined

          matchGroups.push({
            tiles,
            type: board[r][c].type,
            specialToSpawn
          })
        }
        matchLength = 1
      }
    }
  }

  // Vertical scan
  for (let c = 0; c < cols; c++) {
    let matchLength = 1
    for (let r = 0; r < rows; r++) {
      const current = board[r][c]
      const next = r < rows - 1 ? board[r + 1][c] : null

      if (next && current.type === next.type && current.blocker === 'none' && next.blocker === 'none') {
        matchLength++
      } else {
        if (matchLength >= 3) {
          const tiles: { row: number; col: number }[] = []
          for (let i = 0; i < matchLength; i++) {
            tiles.push({ row: r - matchLength + 1 + i, col: c })
            matchedSet.add(`${r - matchLength + 1 + i}:${c}`)
          }

          const specialToSpawn = matchLength === 4
            ? { type: 'rocket_col' as const, row: r - Math.floor(matchLength / 2), col: c }
            : matchLength >= 5
            ? { type: 'rainbow' as const, row: r - Math.floor(matchLength / 2), col: c }
            : undefined

          matchGroups.push({
            tiles,
            type: board[r][c].type,
            specialToSpawn
          })
        }
        matchLength = 1
      }
    }
  }

  return matchGroups
}

/**
 * Validates if swapping (r1, c1) with (r2, c2) produces a valid match or activates a special tile.
 */
export function isValidSwap(
  board: BoardTile[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  if (!isAdjacent(r1, c1, r2, c2)) return false
  if (board[r1][c1].blocker !== 'none' || board[r2][c2].blocker !== 'none') return false

  // Special tile activations are always valid swaps
  if (board[r1][c1].special !== 'none' || board[r2][c2].special !== 'none') return true

  // Clone board and simulate swap
  const cloned = board.map(row => row.map(tile => ({ ...tile })))
  const temp = cloned[r1][c1].type
  cloned[r1][c1].type = cloned[r2][c2].type
  cloned[r2][c2].type = temp

  const matches = findMatches(cloned)
  return matches.length > 0
}

/**
 * Swaps two tiles on board.
 */
export function swapTiles(
  board: BoardTile[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): BoardTile[][] {
  const next = board.map(row => row.map(tile => ({ ...tile })))
  const temp = { ...next[r1][c1] }
  next[r1][c1] = { ...next[r2][c2], row: r1, col: c1 }
  next[r2][c2] = { ...temp, row: r2, col: c2 }
  return next
}

/**
 * Clears matched tiles and soft blockers, returning cleared stats and updated board.
 */
export function resolveMatches(
  board: BoardTile[][],
  matchGroups: MatchGroup[]
): {
  nextBoard: BoardTile[][]
  clearedTiles: { type: TileType; count: number }[]
  clearedBlockers: number
  specialsActivated: number
  pointsEarned: number
} {
  const rows = board.length
  const cols = board[0].length
  const next = board.map(row => row.map(tile => ({ ...tile })))
  const toClear = new Set<string>()
  const tileCounts: Record<TileType, number> = {
    chiikawa: 0,
    usagi: 0,
    hachiware: 0,
    momonga: 0,
    kurimanju: 0,
    rakko: 0
  }
  let clearedBlockers = 0
  let specialsActivated = 0

  for (const group of matchGroups) {
    tileCounts[group.type] += group.tiles.length
    for (const t of group.tiles) {
      toClear.add(`${t.row}:${t.col}`)

      // If tile had special power, trigger line clear
      if (next[t.row][t.col].special === 'rocket_row') {
        specialsActivated++
        for (let c = 0; c < cols; c++) toClear.add(`${t.row}:${c}`)
      } else if (next[t.row][t.col].special === 'rocket_col') {
        specialsActivated++
        for (let r = 0; r < rows; r++) toClear.add(`${r}:${t.col}`)
      }

      // Check 4 adjacent neighbors for soft crates to destroy
      const neighbors = [
        { r: t.row - 1, c: t.col },
        { r: t.row + 1, c: t.col },
        { r: t.row, c: t.col - 1 },
        { r: t.row, c: t.col + 1 }
      ]

      for (const n of neighbors) {
        if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols) {
          if (next[n.r][n.c].blocker === 'crate') {
            next[n.r][n.c].blocker = 'none'
            clearedBlockers++
          }
        }
      }
    }
  }

  // Mark tiles to clear as null/matched
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (toClear.has(`${r}:${c}`)) {
        next[r][c].isMatched = true
      }
    }
  }

  const pointsEarned = toClear.size * 50 + clearedBlockers * 100 + specialsActivated * 200

  return {
    nextBoard: next,
    clearedTiles: Object.entries(tileCounts).map(([type, count]) => ({
      type: type as TileType,
      count
    })),
    clearedBlockers,
    specialsActivated,
    pointsEarned
  }
}

/**
 * Drops tiles down under gravity and fills top rows with fresh tiles.
 */
export function applyGravity(
  board: BoardTile[][],
  palette: TileType[]
): BoardTile[][] {
  const rows = board.length
  const cols = board[0].length
  const next: BoardTile[][] = []

  for (let r = 0; r < rows; r++) {
    next.push(new Array(cols))
  }

  for (let c = 0; c < cols; c++) {
    let writeRow = rows - 1
    for (let r = rows - 1; r >= 0; r--) {
      const tile = board[r][c]
      if (!tile.isMatched) {
        next[writeRow][c] = { ...tile, row: writeRow, col: c }
        writeRow--
      }
    }

    // Spawn new tiles at top
    while (writeRow >= 0) {
      const randomType = palette[Math.floor(Math.random() * palette.length)]
      next[writeRow][c] = createTile(writeRow, c, randomType, 'none', 'none')
      next[writeRow][c].isNew = true
      writeRow--
    }
  }

  return next
}

/**
 * Updates level objectives progress and checks win condition.
 */
export function updateObjectives(
  objectives: LevelObjective[],
  clearedTiles: { type: TileType; count: number }[],
  clearedBlockers: number,
  specialsActivated: number
): { nextObjectives: LevelObjective[]; isAllCompleted: boolean } {
  const next = objectives.map(obj => {
    let add = 0
    if (obj.type === 'collect_tiles' && obj.tileType) {
      const found = clearedTiles.find(t => t.type === obj.tileType)
      if (found) add = found.count
    } else if (obj.type === 'clear_blockers') {
      add = clearedBlockers
    } else if (obj.type === 'activate_specials') {
      add = specialsActivated
    }

    return {
      ...obj,
      currentCount: Math.min(obj.targetCount, obj.currentCount + add)
    }
  })

  const isAllCompleted = next.every(o => o.currentCount >= o.targetCount)
  return { nextObjectives: next, isAllCompleted }
}

/**
 * Chiikawa's Ability: Memory Spark (converts 2 random tiles to create match).
 */
export function applyMemorySpark(board: BoardTile[][]): BoardTile[][] {
  const next = board.map(row => row.map(tile => ({ ...tile })))
  const targetType: TileType = 'chiikawa'

  // Turn top-left tiles into chiikawa
  if (next[0] && next[0][0]) next[0][0].type = targetType
  if (next[0] && next[0][1]) next[0][1].type = targetType
  if (next[0] && next[0][2]) next[0][2].type = targetType

  return next
}

/**
 * Usagi's Ability: Carrot Rocket (clears entire target row).
 */
export function applyCarrotRocket(board: BoardTile[][], targetRow: number): BoardTile[][] {
  const next = board.map(row => row.map(tile => ({ ...tile })))
  if (next[targetRow]) {
    for (let c = 0; c < next[targetRow].length; c++) {
      next[targetRow][c].isMatched = true
      if (next[targetRow][c].blocker === 'crate') {
        next[targetRow][c].blocker = 'none'
      }
    }
  }
  return next
}
