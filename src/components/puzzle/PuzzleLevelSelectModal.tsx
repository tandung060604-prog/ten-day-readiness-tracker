import { useState } from 'react'
import { Modal } from '../common/Modal'
import { CANONICAL_PUZZLE_LEVELS } from '../../domain/puzzle/levels'
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
  const [progressMap] = useState(() => puzzleProgressRepository.loadAllProgress())

  if (!isOpen) return null

  const handleLevelClick = (level: LevelDefinition, isLocked: boolean) => {
    if (isLocked) return
    audioSystem.playClick('pop')
    onSelectLevel(level)
  }

  return (
    <Modal title="Thám Hiểm Giải Đố (Little Adventure)" onClose={onClose}>
      <div className="level-select-container">
        <p className="level-select-intro">
          Vượt qua các thử thách ghép nối kỳ thú cùng Chiikawa & Usagi để nhận thêm Ngôi Sao, Xu vàng và vật liệu xây dựng thị trấn! 🌟
        </p>

        <div className="levels-stage-list">
          {CANONICAL_PUZZLE_LEVELS.map(level => {
            const prog = progressMap[level.levelNumber]
            const isUnlocked = level.levelNumber === 1 || Boolean(progressMap[level.levelNumber - 1]?.completed)
            const stars = prog?.stars || 0

            return (
              <div 
                key={level.levelNumber}
                className={`level-stage-card ${isUnlocked ? 'unlocked' : 'locked'}`}
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
