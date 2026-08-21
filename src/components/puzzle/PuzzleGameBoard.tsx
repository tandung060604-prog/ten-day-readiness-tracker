import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import {
  applyCarrotRocket, applyGravity, applyMemorySpark, findMatches, generateBoard,
  hasValidMove, resolveMatches, resolveTurn, reshuffleBoard, updateObjectives
} from '../../domain/puzzle/puzzleEngine'
import { PuzzleVictoryModal } from './PuzzleVictoryModal'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { audioManager } from '../../domain/audio/audioManager'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { OrientationPrompt } from '../../game/components/OrientationPrompt'
import type { BoardTile, LevelDefinition, LevelObjective } from '../../domain/puzzle/types'

interface PuzzleGameBoardProps { level: LevelDefinition; onClose: () => void }
const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

export function PuzzleGameBoard({ level, onClose }: PuzzleGameBoardProps) {
  const [board, setBoard] = useState<BoardTile[][]>(() => generateBoard(level))
  const [moves, setMoves] = useState(level.maxMoves)
  const [score, setScore] = useState(0)
  const [objectives, setObjectives] = useState<LevelObjective[]>(level.objectives)
  const [loveLinkCharge, setLoveLinkCharge] = useState(0)
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [comboBanner, setComboBanner] = useState<string | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const [shakeCell, setShakeCell] = useState<string | null>(null)
  const pointerStart = useRef<{ x: number; y: number; r: number; c: number } | null>(null)

  useEffect(() => {
    setBoard(generateBoard(level)); setMoves(level.maxMoves); setScore(0)
    setObjectives(level.objectives.map(objective => ({ ...objective }))); setLoveLinkCharge(0)
    setSelectedCell(null); setIsGameOver(false); setIsWon(false)
    if (level.companionIntro.character === 'usagi') audioManager.playVocalization('usagi_yaha')
    else audioManager.playVocalization('chiikawa_squeak')
  }, [level])

  const processCascades = async (startBoard: BoardTile[][], startObjectives: LevelObjective[], startScore: number) => {
    setIsProcessing(true); let currentBoard = startBoard; let currentObjectives = startObjectives
    let currentScore = startScore; let combo = 0
    while (true) {
      const markedTiles = currentBoard.flat().filter(tile => tile.isMatched)
      if (markedTiles.length > 0) {
        const clearedTiles = markedTiles.reduce<{ type: BoardTile['type']; count: number }[]>((items, tile) => {
          const current = items.find(item => item.type === tile.type)
          if (current) current.count += 1
          else items.push({ type: tile.type, count: 1 })
          return items
        }, [])
        const clearedBlockers = markedTiles.filter(tile => tile.blocker !== 'none').length
        currentScore += markedTiles.length * 50 + clearedBlockers * 100
        currentObjectives = updateObjectives(currentObjectives, clearedTiles, clearedBlockers, 0).nextObjectives
        setScore(currentScore); setObjectives(currentObjectives)
        currentBoard = applyGravity(currentBoard, level.allowedTileTypes)
        setBoard(currentBoard); await wait(180); continue
      }
      const matches = findMatches(currentBoard); if (matches.length === 0) break
      combo++; const resolved = resolveMatches(currentBoard, matches)
      currentScore += resolved.pointsEarned * combo
      const cleared = resolved.clearedTileCount
      setLoveLinkCharge(value => Math.min(100, value + cleared * 5 + (combo >= 2 ? 15 : 0)))
      currentObjectives = updateObjectives(currentObjectives, resolved.clearedTiles, resolved.clearedBlockers, resolved.specialsActivated).nextObjectives
      setScore(currentScore); setObjectives(currentObjectives); setBoard(resolved.nextBoard)
      if (combo >= 2) setComboBanner(combo === 2 ? '✨ Ngọt Ngào!' : combo === 3 ? '🔥 Tuyệt Đỉnh!' : '🌈 Siêu Cấp!')
      await wait(160); currentBoard = applyGravity(resolved.nextBoard, level.allowedTileTypes); setBoard(currentBoard); await wait(180)
    }
    if (currentObjectives.every(objective => objective.currentCount >= objective.targetCount)) { setIsWon(true); setIsGameOver(true) }
    else if (!hasValidMove(currentBoard)) { setBoard(reshuffleBoard(currentBoard, level.allowedTileTypes)); setComboBanner('Bàn cờ đã được xáo lại — vẫn còn nước đi!') }
    setIsProcessing(false); window.setTimeout(() => setComboBanner(null), 1400)
  }

  const handleTileClick = async (r: number, c: number) => {
    if (isProcessing || isGameOver) return
    if (!selectedCell) { audioSystem.playClick('soft'); setSelectedCell({ r, c }); return }
    const first = selectedCell; setSelectedCell(null)
    if (first.r === r && first.c === c) return
    const resolution = resolveTurn(board, level, first, { r, c }, moves, score, objectives, loveLinkCharge)
    if (resolution.outcome === 'invalid') {
      audioSystem.playClick('wood'); setShakeCell(`${r}:${c}`); window.setTimeout(() => setShakeCell(null), 220); return
    }
    setIsProcessing(true); audioSystem.playClick('pop')
    for (const frame of resolution.animationFrames) { setBoard(frame.board); await wait(frame.durationMs) }
    setBoard(resolution.board); setScore(resolution.score); setMoves(resolution.movesRemaining)
    setObjectives(resolution.objectives); setLoveLinkCharge(resolution.loveLinkCharge)
    if (resolution.comboCount >= 2) setComboBanner(resolution.comboCount === 2 ? '✨ Ngọt Ngào!' : resolution.comboCount === 3 ? '🔥 Tuyệt Đỉnh!' : '🌈 Siêu Cấp!')
    if (resolution.outcome === 'won') { setIsWon(true); setIsGameOver(true) }
    else if (resolution.outcome === 'lost') setIsGameOver(true)
    else if (!hasValidMove(resolution.board)) { setBoard(reshuffleBoard(resolution.board, level.allowedTileTypes)); setComboBanner('Bàn cờ đã được xáo lại — vẫn còn nước đi!') }
    setIsProcessing(false); window.setTimeout(() => setComboBanner(null), 1400)
  }

  const handleAbility = async (ability: 'chiikawa' | 'usagi') => {
    if (isProcessing || isGameOver || loveLinkCharge < 100) return
    audioManager.playVocalization(ability === 'chiikawa' ? 'chiikawa_cheer' : 'usagi_rocket')
    const updated = ability === 'chiikawa' ? applyMemorySpark(board) : applyCarrotRocket(board, Math.floor(level.gridRows / 2))
    setLoveLinkCharge(0); setBoard(updated); await processCascades(updated, objectives, score)
  }

  const handleReplay = () => {
    setBoard(generateBoard(level)); setMoves(level.maxMoves); setScore(0)
    setObjectives(level.objectives.map(objective => ({ ...objective }))); setLoveLinkCharge(0)
    setSelectedCell(null); setIsGameOver(false); setIsWon(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, r: number, c: number) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); void handleTileClick(r, c) }
  }
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>, r: number, c: number) => {
    pointerStart.current = { x: event.clientX, y: event.clientY, r, c }
  }
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>, r: number, c: number) => {
    const start = pointerStart.current; pointerStart.current = null; if (!start) return
    const dx = event.clientX - start.x; const dy = event.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
    const target = Math.abs(dx) > Math.abs(dy) ? { r: start.r, c: start.c + (dx > 0 ? 1 : -1) } : { r: start.r + (dy > 0 ? 1 : -1), c: start.c }
    if (target.r >= 0 && target.r < level.gridRows && target.c >= 0 && target.c < level.gridCols) void handleTileClick(target.r, target.c)
    else void handleTileClick(r, c)
  }

  return (
    <div className="puzzle-board-fullscreen animate-fade-in" role="dialog" aria-label={`Màn ${level.levelNumber}`}>
      <OrientationPrompt />
      <header className="puzzle-top-hud">
        <button className="puzzle-back-btn" onClick={onClose}>← Về bản đồ</button>
        <div className="puzzle-title-block"><span className="puzzle-chapter-label">Chương {level.chapter}</span><h2 className="puzzle-level-title">Màn {level.levelNumber}: {level.title}</h2></div>
        <div className="puzzle-header-stats"><span className="puzzle-score-badge">Điểm <strong>{score.toLocaleString()}</strong></span><span className="puzzle-moves-left">Lượt <strong>{moves}</strong></span></div>
      </header>
      <main className="puzzle-game-layout">
        <aside className="puzzle-side-panel puzzle-objectives-panel"><p className="puzzle-panel-kicker">Mục tiêu</p><p className="puzzle-briefing">{level.subtitle}</p><div className="puzzle-objectives-list">
          {objectives.map((objective, index) => <div key={index} className={`obj-pill ${objective.currentCount >= objective.targetCount ? 'completed' : ''}`}><span>{objective.type === 'collect_tiles' ? '●' : objective.type === 'clear_blockers' ? '▣' : '✦'}</span><strong>{objective.currentCount}/{objective.targetCount}</strong></div>)}
        </div><p className="puzzle-dialogue-text">“{level.companionIntro.dialogue}”</p></aside>
        <section className="puzzle-grid-wrapper" aria-label="Bàn ghép hình">{comboBanner && <div className="combo-toast-banner animate-bounce-gentle" role="status">{comboBanner}</div>}
          <div className="puzzle-tile-grid" style={{ gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))` }}>{board.map((rowList, r) => rowList.map((tile, c) => {
            const isSelected = selectedCell?.r === r && selectedCell?.c === c
            return <div key={tile.id} className={`puzzle-tile ${isSelected ? 'selected' : ''} ${shakeCell === `${r}:${c}` ? 'shake' : ''} ${tile.blocker !== 'none' ? `blocker-${tile.blocker}` : ''} ${tile.isMatched ? 'matched' : ''}`} onClick={() => void handleTileClick(r, c)} onKeyDown={event => handleKeyDown(event, r, c)} onPointerDown={event => handlePointerDown(event, r, c)} onPointerUp={event => handlePointerUp(event, r, c)} role="button" tabIndex={0} aria-label={`Ô ${r + 1}, ${c + 1}`}>
              {tile.blocker === 'crate' ? <span className="tile-blocker-icon">▣</span> : <ChiikawaSVG character={tile.type} size={40} />}{tile.special !== 'none' && <span className="special-badge" aria-hidden="true">{tile.special === 'rainbow' ? '✦' : '↕'}</span>}
            </div>
          }))}</div>
        </section>
        <aside className="puzzle-side-panel puzzle-skills-panel"><div className="love-link-meter"><div className="love-link-heading"><span>Love Link</span><strong>{loveLinkCharge}%</strong></div><div className="love-link-track"><span style={{ width: `${loveLinkCharge}%` }} /></div><small>Ghép ô để nạp năng lượng</small></div>
          <button className="ability-btn ability-chiikawa" onClick={() => void handleAbility('chiikawa')} disabled={isProcessing || loveLinkCharge < 100}><span className="btn-icon">✦</span><span className="btn-label">Tia Sáng Chiikawa</span></button>
          <button className="ability-btn ability-usagi" onClick={() => void handleAbility('usagi')} disabled={isProcessing || loveLinkCharge < 100}><span className="btn-icon">↗</span><span className="btn-label">Tên Lửa Usagi</span></button>
        </aside>
      </main>
      {isGameOver && <PuzzleVictoryModal level={level} score={score} isWon={isWon} onClose={onClose} onReplay={handleReplay} />}
    </div>
  )
}
