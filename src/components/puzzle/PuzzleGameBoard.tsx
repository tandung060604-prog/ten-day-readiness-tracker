import { useState, useEffect, useCallback } from 'react'
import {
  generateBoard,
  isValidSwap,
  swapTiles,
  findMatches,
  resolveMatches,
  applyGravity,
  updateObjectives,
  applyMemorySpark,
  applyCarrotRocket
} from '../../domain/puzzle/puzzleEngine'
import { PuzzleVictoryModal } from './PuzzleVictoryModal'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { audioManager } from '../../domain/audio/audioManager'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import type { BoardTile, LevelDefinition, LevelObjective, TileType } from '../../domain/puzzle/types'

interface PuzzleGameBoardProps {
  level: LevelDefinition
  onClose: () => void
}

export function PuzzleGameBoard({ level, onClose }: PuzzleGameBoardProps) {
  const [board, setBoard] = useState<BoardTile[][]>(() => generateBoard(level))
  const [moves, setMoves] = useState(level.maxMoves)
  const [score, setScore] = useState(0)
  const [objectives, setObjectives] = useState<LevelObjective[]>(level.objectives)
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [comboBanner, setComboBanner] = useState<string | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isWon, setIsWon] = useState(false)

  // Initialize board & intro dialogue
  useEffect(() => {
    setBoard(generateBoard(level))
    setMoves(level.maxMoves)
    setScore(0)
    setObjectives(level.objectives)
    setIsGameOver(false)
    setIsWon(false)

    // Play intro vocal
    if (level.companionIntro.character === 'usagi') {
      audioManager.playVocalization('usagi_yaha')
    } else {
      audioManager.playVocalization('chiikawa_squeak')
    }
  }, [level])

  // Resolve cascade loop
  const processCascades = useCallback(async (currentBoard: BoardTile[][], currentObjectives: LevelObjective[], currentScore: number) => {
    setIsProcessing(true)
    let b = currentBoard
    let objs = currentObjectives
    let s = currentScore
    let combo = 0

    while (true) {
      const matches = findMatches(b)
      if (matches.length === 0) break

      combo++
      audioSystem.playClick('pop')

      if (combo >= 2) {
        setComboBanner(combo === 2 ? '✨ Ngọt Ngào!' : combo === 3 ? '🔥 Tuyệt Đỉnh!' : '🌈 SIÊU CẤP!')
        setTimeout(() => setComboBanner(null), 1500)
      }

      const { nextBoard, clearedTiles, clearedBlockers, specialsActivated, pointsEarned } = resolveMatches(b, matches)
      s += pointsEarned * combo
      setScore(s)

      const { nextObjectives, isAllCompleted } = updateObjectives(objs, clearedTiles, clearedBlockers, specialsActivated)
      objs = nextObjectives
      setObjectives(objs)

      if (isAllCompleted) {
        setIsWon(true)
        setIsGameOver(true)
        setIsProcessing(false)
        return
      }

      setBoard(nextBoard)
      await new Promise(res => setTimeout(res, 250))

      // Apply Gravity
      b = applyGravity(nextBoard, level.allowedTileTypes)
      setBoard(b)
      await new Promise(res => setTimeout(res, 250))
    }

    setIsProcessing(false)
  }, [level])

  const handleTileClick = async (r: number, c: number) => {
    if (isProcessing || isGameOver) return

    // If no tile selected yet, select clicked tile
    if (!selectedCell) {
      audioSystem.playClick('soft')
      setSelectedCell({ r, c })
      return
    }

    const { r: r1, c: c1 } = selectedCell
    setSelectedCell(null)

    // If clicked same tile, deselect
    if (r1 === r && c1 === c) return

    // Validate swap
    if (!isValidSwap(board, r1, c1, r, c)) {
      audioSystem.playClick('wood')
      return
    }

    // Execute swap
    const nextMoves = moves - 1
    setMoves(nextMoves)

    const swapped = swapTiles(board, r1, c1, r, c)
    setBoard(swapped)

    await processCascades(swapped, objectives, score)

    // Check defeat if moves run out
    if (nextMoves <= 0 && !isWon) {
      setIsGameOver(true)
    }
  }

  // Trigger Chiikawa Memory Spark
  const handleUseMemorySpark = async () => {
    if (isProcessing || isGameOver) return
    audioManager.playVocalization('chiikawa_cheer')
    const updated = applyMemorySpark(board)
    setBoard(updated)
    await processCascades(updated, objectives, score)
  }

  // Trigger Usagi Carrot Rocket
  const handleUseCarrotRocket = async () => {
    if (isProcessing || isGameOver) return
    audioManager.playVocalization('usagi_rocket')
    const targetRow = Math.floor(level.gridRows / 2)
    const updated = applyCarrotRocket(board, targetRow)
    setBoard(updated)
    await processCascades(updated, objectives, score)
  }

  const handleReplay = () => {
    setBoard(generateBoard(level))
    setMoves(level.maxMoves)
    setScore(0)
    setObjectives(level.objectives)
    setIsGameOver(false)
    setIsWon(false)
  }

  return (
    <div className="puzzle-board-fullscreen animate-fade-in">
      {/* Top Status Header */}
      <div className="puzzle-top-hud">
        <div className="hud-left">
          <button className="puzzle-back-btn" onClick={onClose} title="Quay về thị trấn">
            ← Rời Khỏi
          </button>
          <div>
            <h2 className="puzzle-level-title">Màn {level.levelNumber}: {level.title}</h2>
            <span className="puzzle-moves-left">🎯 Còn lại: <strong>{moves}</strong> lượt đi</span>
          </div>
        </div>

        {/* Objectives Progress Pills */}
        <div className="puzzle-objectives-row">
          {objectives.map((obj, i) => (
            <div key={i} className={`obj-pill ${obj.currentCount >= obj.targetCount ? 'completed' : ''}`}>
              <span className="obj-icon">
                {obj.type === 'collect_tiles' && obj.tileType && (
                  <ChiikawaSVG character={obj.tileType} size={24} />
                )}
                {obj.type === 'clear_blockers' && '📦'}
                {obj.type === 'activate_specials' && '🚀'}
              </span>
              <span className="obj-count">{obj.currentCount} / {obj.targetCount}</span>
            </div>
          ))}
        </div>

        {/* Score Pill */}
        <div className="hud-right">
          <div className="puzzle-score-badge">
            <span>Điểm:</span>
            <strong>{score}</strong>
          </div>
        </div>
      </div>

      {/* Intro Dialogue Banner */}
      <div className="puzzle-dialogue-banner">
        <ChiikawaSVG 
          character={level.companionIntro.character === 'both' ? 'chiikawa' : level.companionIntro.character} 
          size={38} 
        />
        <p className="puzzle-dialogue-text">"{level.companionIntro.dialogue}"</p>
      </div>

      {/* Main Grid Board */}
      <div className="puzzle-grid-wrapper">
        {comboBanner && (
          <div className="combo-toast-banner animate-bounce-gentle">
            <span>{comboBanner}</span>
          </div>
        )}

        <div 
          className="puzzle-tile-grid"
          style={{
            gridTemplateColumns: `repeat(${level.gridCols}, minmax(40px, 56px))`,
            gridTemplateRows: `repeat(${level.gridRows}, minmax(40px, 56px))`
          }}
        >
          {board.map((rowList, r) =>
            rowList.map((tile, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c
              return (
                <div
                  key={tile.id}
                  className={`puzzle-tile ${isSelected ? 'selected' : ''} ${tile.blocker !== 'none' ? `blocker-${tile.blocker}` : ''} ${tile.isMatched ? 'matched' : ''}`}
                  onClick={() => handleTileClick(r, c)}
                  role="button"
                  tabIndex={0}
                >
                  {tile.blocker === 'crate' ? (
                    <span className="tile-blocker-icon">📦</span>
                  ) : tile.special === 'rocket_row' ? (
                    <div className="tile-special-wrap">
                      <ChiikawaSVG character={tile.type} size={36} />
                      <span className="special-badge">🚀↔️</span>
                    </div>
                  ) : tile.special === 'rocket_col' ? (
                    <div className="tile-special-wrap">
                      <ChiikawaSVG character={tile.type} size={36} />
                      <span className="special-badge">🚀↕️</span>
                    </div>
                  ) : tile.special === 'rainbow' ? (
                    <div className="tile-special-wrap rainbow-glow">
                      <ChiikawaSVG character={tile.type} size={36} />
                      <span className="special-badge">🌈</span>
                    </div>
                  ) : (
                    <div className="tile-character-wrap">
                      <ChiikawaSVG character={tile.type} size={40} />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Companion Ability Helper Bar */}
      <div className="puzzle-ability-bar">
        <button className="ability-btn ability-chiikawa" onClick={handleUseMemorySpark} disabled={isProcessing}>
          <span className="btn-icon">✨</span>
          <span className="btn-label">Tia Sáng Kỷ Niệm (Chiikawa)</span>
        </button>

        <button className="ability-btn ability-usagi" onClick={handleUseCarrotRocket} disabled={isProcessing}>
          <span className="btn-icon">🥕🚀</span>
          <span className="btn-label">Tên Lửa Cà Rốt (Usagi)</span>
        </button>
      </div>

      {/* Victory / Defeat Modal */}
      {isGameOver && (
        <PuzzleVictoryModal
          level={level}
          score={score}
          isWon={isWon}
          onClose={onClose}
          onReplay={handleReplay}
        />
      )}
    </div>
  )
}
