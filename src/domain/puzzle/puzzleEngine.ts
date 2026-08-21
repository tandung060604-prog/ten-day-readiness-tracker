import type {
  BlockerType,
  BoardTile,
  LevelDefinition,
  LevelObjective,
  MatchGroup,
  SpecialType,
  TileType,
  TurnResolution
} from './types'

let tileCounter = 1

export function createSeededRandom(seed: number): () => number {
  let value = (seed >>> 0) || 1
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

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
export function generateBoard(level: LevelDefinition, random = level.seed === undefined ? Math.random : createSeededRandom(level.seed)): BoardTile[][] {
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
        chosenType = palette[Math.floor(random() * palette.length)]
      } while (
        (c >= 2 && rowList[c - 1]?.type === chosenType && rowList[c - 2]?.type === chosenType) ||
        (r >= 2 && board[r - 1][c]?.type === chosenType && board[r - 2][c]?.type === chosenType)
      )

      // Place wooden crates for levels that have crate blockers
      let blocker: BlockerType = 'none'
      const hasCrates = level.objectives.some(o => o.type === 'clear_blockers' && o.blockerType === 'crate')
      if (hasCrates) {
        const midR = Math.floor(rows / 2)
        const midC = Math.floor(cols / 2)
        if ((r === midR || r === midR - 1) && (c === midC || c === midC - 1 || c === midC + 1)) {
          blocker = 'crate'
        }
      }

      rowList.push(createTile(r, c, chosenType, 'none', blocker))
    }
    board.push(rowList)
  }

  // A freshly opened level should always offer a move. Recursive retry is
  // bounded by the very low probability of a random deadlock.
  return hasValidMove(board) ? board : generateBoard(level, random)
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

export function hasValidMove(board: BoardTile[][]): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (c + 1 < board[r].length && isValidSwap(board, r, c, r, c + 1)) return true
      if (r + 1 < board.length && isValidSwap(board, r, c, r + 1, c)) return true
    }
  }
  return false
}

export function reshuffleBoard(board: BoardTile[][], palette: TileType[], random = Math.random): BoardTile[][] {
  const movable = board.flat().filter(tile => tile.blocker === 'none')
  for (let attempt = 0; attempt < 80; attempt++) {
    const shuffled = [...movable].sort(() => random() - 0.5)
    let index = 0
    const next = board.map(row => row.map(tile => {
      if (tile.blocker !== 'none') return { ...tile }
      const source = shuffled[index++] ?? createTile(tile.row, tile.col, palette[0])
      return { ...source, id: `tile_${tileCounter++}`, row: tile.row, col: tile.col, isMatched: false, isNew: true }
    }))
    if (findMatches(next).length === 0 && hasValidMove(next)) return next
  }
  // ponytail: rare fallback regenerates a clean board; preserve blocker layouts with a seeded sampler if level shapes expand.
  return generateBoard({
    levelNumber: 0, chapter: 1, chapterTitle: '', title: '', subtitle: '', storyBeat: '',
    gridRows: board.length, gridCols: board[0].length, allowedTileTypes: palette, maxMoves: 1,
    starThresholds: [0, 0, 0], objectives: [], companionIntro: { character: 'chiikawa', dialogue: '' },
    rewards: { stars: 0, coins: 0, xp: 0, hearts: 0 }
  })
}

export function resolveTurn(
  board: BoardTile[][],
  level: LevelDefinition,
  selected: { r: number; c: number },
  target: { r: number; c: number },
  movesRemaining: number,
  score: number,
  objectives: LevelObjective[],
  loveLinkCharge: number
): TurnResolution {
  if (!isValidSwap(board, selected.r, selected.c, target.r, target.c)) {
    return { board, score, objectives, movesRemaining, loveLinkCharge, comboCount: 0, animationFrames: [], outcome: 'invalid' }
  }

  let nextBoard = swapTiles(board, selected.r, selected.c, target.r, target.c)
  let nextScore = score
  let nextObjectives = objectives.map(obj => ({ ...obj }))
  let charge = loveLinkCharge
  let comboCount = 0
  const animationFrames: TurnResolution['animationFrames'] = [
    { kind: 'swap', board: nextBoard, durationMs: 140 }
  ]

  while (true) {
    const matches = findMatches(nextBoard)
    if (matches.length === 0) break
    comboCount++
    const resolved = resolveMatches(nextBoard, matches)
    nextScore += resolved.pointsEarned * comboCount
    const clearedCount = resolved.clearedTileCount
    charge = Math.min(100, charge + clearedCount * 5 + (comboCount >= 2 ? 15 : 0))
    nextObjectives = updateObjectives(nextObjectives, resolved.clearedTiles, resolved.clearedBlockers, resolved.specialsActivated).nextObjectives
    animationFrames.push({ kind: 'clear', board: resolved.nextBoard, durationMs: 160 })
    const random = level.seed === undefined ? Math.random : createSeededRandom(level.seed + nextScore + comboCount * 101)
    nextBoard = applyGravity(resolved.nextBoard, level.allowedTileTypes, random)
    animationFrames.push({ kind: 'fall', board: nextBoard, durationMs: 180 })
  }

  const won = nextObjectives.every(obj => obj.currentCount >= obj.targetCount)
  const nextMoves = Math.max(0, movesRemaining - 1)
  const outcome: TurnResolution['outcome'] = won ? 'won' : nextMoves === 0 ? 'lost' : 'playing'
  if (outcome === 'playing' && !hasValidMove(nextBoard)) {
    const random = level.seed === undefined ? Math.random : createSeededRandom(level.seed + nextScore + 997)
    nextBoard = reshuffleBoard(nextBoard, level.allowedTileTypes, random)
    animationFrames.push({ kind: 'reshuffle', board: nextBoard, durationMs: 220 })
  }
  return {
    board: nextBoard,
    score: nextScore,
    objectives: nextObjectives,
    movesRemaining: nextMoves,
    loveLinkCharge: charge,
    comboCount,
    animationFrames,
    outcome
  }
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
  clearedTileCount: number
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
  const specialSpawns: MatchGroup['specialToSpawn'][] = []

  for (const group of matchGroups) {
    tileCounts[group.type] += group.tiles.length
    if (group.specialToSpawn) specialSpawns.push(group.specialToSpawn)
    for (const t of group.tiles) {
      if (!group.specialToSpawn || t.row !== group.specialToSpawn.row || t.col !== group.specialToSpawn.col) {
        toClear.add(`${t.row}:${t.col}`)
      }

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

  for (const key of toClear) {
    const [row, col] = key.split(':').map(Number)
    if (next[row][col].blocker === 'crate') {
      next[row][col].blocker = 'none'
      clearedBlockers++
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

  for (const spawn of specialSpawns) {
    if (!spawn) continue
    const source = next[spawn.row]?.[spawn.col]
    if (source) next[spawn.row][spawn.col] = { ...source, special: spawn.type, isMatched: false }
  }

  const pointsEarned = toClear.size * 50 + clearedBlockers * 100 + specialsActivated * 200

  return {
    nextBoard: next,
    clearedTiles: Object.entries(tileCounts).map(([type, count]) => ({
      type: type as TileType,
      count
    })),
    clearedTileCount: toClear.size,
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
  palette: TileType[],
  random = Math.random
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
      const randomType = palette[Math.floor(random() * palette.length)]
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
    }
  }
  return next
}
