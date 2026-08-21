import { useState } from 'react'
import { Modal } from '../common/Modal'
import { getLevelsByChapter } from '../../domain/puzzle/levels'
import { getChapterSummary, getOverallCampaignProgress } from '../../domain/puzzle/campaignManager'
import { puzzleProgressRepository } from '../../domain/puzzle/puzzleProgressRepository'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import type { LevelDefinition } from '../../domain/puzzle/types'

interface PuzzleLevelSelectModalProps { isOpen: boolean; onClose: () => void; onSelectLevel: (level: LevelDefinition) => void }

export function PuzzleLevelSelectModal({ isOpen, onClose, onSelectLevel }: PuzzleLevelSelectModalProps) {
  const [activeChapter, setActiveChapter] = useState<1 | 2 | 3>(1)
  const [progressMap] = useState(() => puzzleProgressRepository.loadAllProgress())
  const [selectedLevelNumber, setSelectedLevelNumber] = useState(1)
  if (!isOpen) return null

  const summaries = [1, 2, 3].map(chapter => getChapterSummary(chapter as 1 | 2 | 3, progressMap))
  const levels = getLevelsByChapter(activeChapter)
  const selected = levels.find(level => level.levelNumber === selectedLevelNumber) ?? levels[0]
  const selectedProgress = progressMap[selected.levelNumber]
  const selectedUnlocked = selected.levelNumber === 1 || Boolean(progressMap[selected.levelNumber - 1]?.completed)
  const overall = getOverallCampaignProgress(progressMap)
  const activateChapter = (chapter: 1 | 2 | 3) => {
    const summary = summaries[chapter - 1]
    if (!summary.isUnlocked) return
    audioSystem.playClick('soft'); setActiveChapter(chapter)
    setSelectedLevelNumber(getLevelsByChapter(chapter)[0].levelNumber)
  }
  const objectiveText = selected.objectives.map(objective => objective.type === 'collect_tiles' ? `Thu thập ${objective.targetCount} ô ${objective.tileType}` : objective.type === 'clear_blockers' ? `Phá ${objective.targetCount} chướng ngại` : `Kích hoạt ${objective.targetCount} kỹ năng`).join(' · ')

  return (
    <Modal title="Phiêu lưu giải đố" onClose={onClose} maxWidth="760px">
      <div className="level-select-container campaign-selector">
        <div className="campaign-overall-banner"><div className="campaign-stats-line"><span>⭐ {overall.totalEarnedStars}/{overall.maxPossibleStars} sao</span><span>{overall.totalCompletedLevels}/30 màn · {overall.completionPercentage}%</span></div></div>
        <div className="chapter-tabs-row" role="tablist">{summaries.map(summary => <button key={summary.chapter} className={`chapter-tab-btn ${activeChapter === summary.chapter ? 'active' : ''} ${!summary.isUnlocked ? 'locked-tab' : ''}`} onClick={() => activateChapter(summary.chapter)} role="tab" aria-selected={activeChapter === summary.chapter}><span className="tab-icon">{summary.isUnlocked ? summary.icon : '🔒'}</span><span className="tab-title">Chương {summary.chapter}</span><span className="tab-stars">{summary.isUnlocked ? `${summary.earnedStars}/${summary.maxStars} ⭐` : 'Khóa'}</span></button>)}</div>
        <div className="levels-stage-path" aria-label={`Các màn chương ${activeChapter}`}>{levels.map(level => { const progress = progressMap[level.levelNumber]; const unlocked = level.levelNumber === 1 || Boolean(progressMap[level.levelNumber - 1]?.completed); return <button key={level.levelNumber} className={`stage-path-node ${selected.levelNumber === level.levelNumber ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} onClick={() => unlocked && setSelectedLevelNumber(level.levelNumber)} disabled={!unlocked}><span>{unlocked ? level.levelNumber : '🔒'}</span><small>{progress?.stars ? `${progress.stars}★` : '—'}</small></button> })}</div>
        <section className="level-briefing-panel"><div><span className="puzzle-panel-kicker">Màn {selected.levelNumber} · {selected.chapterTitle}</span><h3>{selected.title}</h3><p>{selected.subtitle}</p><p className="level-objective-copy">{objectiveText}</p></div><div className="level-briefing-stats"><span><strong>{selected.maxMoves}</strong><small>lượt</small></span><span><strong>{selectedProgress?.highScore ?? 0}</strong><small>điểm cao</small></span><span><strong>{selectedProgress?.stars ?? 0}/3</strong><small>sao</small></span></div><div className="level-reward-row"><span>Thưởng: ⭐ {selected.rewards.stars}</span><span>♥ {selected.rewards.hearts}</span><span>✦ {selected.rewards.coins}</span><button className="play-stage-btn" disabled={!selectedUnlocked} onClick={() => { audioSystem.playClick('pop'); onSelectLevel(selected) }}>Chơi màn này →</button></div></section>
      </div>
    </Modal>
  )
}
