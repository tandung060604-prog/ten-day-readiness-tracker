import { useState } from 'react'
import { Modal } from '../common/Modal'
import { getLevelsByChapter } from '../../domain/puzzle/levels'
import { getChapterSummary, getOverallCampaignProgress } from '../../domain/puzzle/campaignManager'
import { puzzleProgressRepository } from '../../domain/puzzle/puzzleProgressRepository'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import type { LevelDefinition } from '../../domain/puzzle/types'

interface PuzzleLevelSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectLevel: (level: LevelDefinition) => void
}

export function PuzzleLevelSelectModal({
  isOpen,
  onClose,
  onSelectLevel
}: PuzzleLevelSelectModalProps) {
  const [activeChapter, setActiveChapter] = useState<1 | 2 | 3>(1)
  const [progressMap] = useState(() => puzzleProgressRepository.loadAllProgress())

  if (!isOpen) return null

  const ch1 = getChapterSummary(1, progressMap)
  const ch2 = getChapterSummary(2, progressMap)
  const ch3 = getChapterSummary(3, progressMap)
  const currentChapterLevels = getLevelsByChapter(activeChapter)
  const overall = getOverallCampaignProgress(progressMap)

  const handleLevelClick = (level: LevelDefinition, isLocked: boolean) => {
    if (isLocked) return
    audioSystem.playClick('pop')
    onSelectLevel(level)
  }

  return (
    <Modal title="Thám Hiểm Giải Đố (30 Màn Chơi Chiến Dịch)" onClose={onClose}>
      <div className="level-select-container">
        {/* Campaign Overall Progress Bar */}
        <div className="campaign-overall-banner">
          <div className="campaign-stats-line">
            <span>⭐ Tổng Sao: <strong>{overall.totalEarnedStars} / {overall.maxPossibleStars}</strong></span>
            <span>🏆 Tiến Độ: <strong>{overall.totalCompletedLevels} / 30 Màn ({overall.completionPercentage}%)</strong></span>
          </div>
        </div>

        {/* 3 Chapter Selector Tabs */}
        <div className="chapter-tabs-row">
          <button 
            className={`chapter-tab-btn ${activeChapter === 1 ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveChapter(1); }}
          >
            <span className="tab-icon">🏡</span>
            <span className="tab-title">Chương 1 (1–10)</span>
            <span className="tab-stars">{ch1.earnedStars}/{ch1.maxStars} ⭐</span>
          </button>

          <button 
            className={`chapter-tab-btn ${activeChapter === 2 ? 'active' : ''} ${!ch2.isUnlocked ? 'locked-tab' : ''}`}
            onClick={() => {
              if (ch2.isUnlocked) {
                audioSystem.playClick('soft')
                setActiveChapter(2)
              }
            }}
          >
            <span className="tab-icon">{ch2.isUnlocked ? '🏘️' : '🔒'}</span>
            <span className="tab-title">Chương 2 (11–20)</span>
            <span className="tab-stars">{ch2.isUnlocked ? `${ch2.earnedStars}/${ch2.maxStars} ⭐` : 'Khóa'}</span>
          </button>

          <button 
            className={`chapter-tab-btn ${activeChapter === 3 ? 'active' : ''} ${!ch3.isUnlocked ? 'locked-tab' : ''}`}
            onClick={() => {
              if (ch3.isUnlocked) {
                audioSystem.playClick('soft')
                setActiveChapter(3)
              }
            }}
          >
            <span className="tab-icon">{ch3.isUnlocked ? '🏖️' : '🔒'}</span>
            <span className="tab-title">Chương 3 (21–30)</span>
            <span className="tab-stars">{ch3.isUnlocked ? `${ch3.earnedStars}/${ch3.maxStars} ⭐` : 'Khóa'}</span>
          </button>
        </div>

        {/* Active Chapter Stage List */}
        <div className="levels-stage-list">
          {currentChapterLevels.map(level => {
            const prog = progressMap[level.levelNumber]
            const isUnlocked = level.levelNumber === 1 || Boolean(progressMap[level.levelNumber - 1]?.completed)
            const stars = prog?.stars || 0

            return (
              <div 
                key={level.levelNumber}
                className={`level-stage-card ${isUnlocked ? 'unlocked' : 'locked'} ${level.levelNumber === 30 ? 'finale-card' : ''}`}
                onClick={() => handleLevelClick(level, !isUnlocked)}
              >
                <div className="stage-num-badge">
                  <span>{level.levelNumber}</span>
                </div>

                <div className="stage-info-col">
                  <h4>{level.title}</h4>
                  <p>{level.subtitle}</p>

                  <div className="stage-stars-row">
                    <span className={`star-item ${stars >= 1 ? 'earned' : ''}`}>⭐</span>
                    <span className={`star-item ${stars >= 2 ? 'earned' : ''}`}>⭐</span>
                    <span className={`star-item ${stars >= 3 ? 'earned' : ''}`}>⭐</span>
                    <span className="stage-stars-text">({stars}/3 Sao)</span>
                    {level.buildingImpact && (
                      <span className="stage-impact-badge">🏗️ {level.buildingImpact}</span>
                    )}
                  </div>
                </div>

                <div className="stage-action-col">
                  {isUnlocked ? (
                    <button className="play-stage-btn">
                      ▶️ Chơi
                    </button>
                  ) : (
                    <span className="lock-icon-badge">🔒</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
