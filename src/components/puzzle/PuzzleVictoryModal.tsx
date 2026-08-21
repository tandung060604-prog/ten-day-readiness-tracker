import { Modal } from '../common/Modal'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { triggerConfetti } from '../../utils/confetti'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { useGameState } from '../../context/GameStateContext'
import { puzzleProgressRepository } from '../../domain/puzzle/puzzleProgressRepository'
import { recordEndlessScore } from '../../domain/puzzle/endlessMode'
import type { LevelDefinition } from '../../domain/puzzle/types'

interface PuzzleVictoryModalProps {
  level: LevelDefinition
  score: number
  isWon: boolean
  onClose: () => void
  onReplay: () => void
}

export function PuzzleVictoryModal({
  level,
  score,
  isWon,
  onClose,
  onReplay
}: PuzzleVictoryModalProps) {
  const { grantReward } = useGameState()

  // Calculate stars earned (0 to 3)
  let stars = 0
  if (score >= level.starThresholds[2]) stars = 3
  else if (score >= level.starThresholds[1]) stars = 2
  else if (score >= level.starThresholds[0]) stars = 1
  if (isWon && stars === 0) stars = 1

  const handleClaimAndClose = () => {
    if (level.mode === 'endless') {
      if (level.challengeDate && level.seed !== undefined) {
        recordEndlessScore(level.challengeDate, level.seed, level.endlessPlayer ?? 'player1', score)
      }
      audioSystem.playAchievement('level')
      onClose()
      return
    }
    if (isWon) {
      audioSystem.playAchievement('level')
      triggerConfetti()

      // Record completion and claim reward if first time
      const { isFirstCompletion } = puzzleProgressRepository.recordLevelCompletion(
        level.levelNumber,
        score,
        stars
      )

      if (isFirstCompletion) {
        puzzleProgressRepository.claimReward(level.levelNumber)
        grantReward({
          stars: level.rewards.stars,
          coins: level.rewards.coins,
          xp: level.rewards.xp,
          hearts: level.rewards.hearts,
          source: `puzzle_level_${level.levelNumber}`
        })
      }
    }
    onClose()
  }

  return (
    <Modal title={isWon ? '🎉 Chiến Thắng Màn Chơi!' : '😢 Hết Lượt Đi Rồi!'} onClose={level.mode === 'endless' ? handleClaimAndClose : isWon ? handleClaimAndClose : onClose}>
      <div className="puzzle-victory-container animate-fade-in">
        {/* Companion Victory Pose */}
        <div className="victory-mascot-row animate-bounce-gentle">
          <ChiikawaSVG character={isWon ? 'chiikawa' : 'usagi'} size={72} />
        </div>

        {/* Stars Rating */}
        {isWon ? (
          <div className="stars-rating-banner">
            <span className={`star-icon ${stars >= 1 ? 'earned' : ''}`}>⭐</span>
            <span className={`star-icon ${stars >= 2 ? 'earned' : ''}`}>⭐</span>
            <span className={`star-icon ${stars >= 3 ? 'earned' : ''}`}>⭐</span>
          </div>
        ) : (
          <p className="defeat-note">Đừng nản lòng nhé! Hãy thử lại một lần nữa để vượt qua thử thách nào!</p>
        )}

        {/* Final Score */}
        <div className="victory-score-pill">
          <span>Điểm Đạt Được:</span>
          <strong>{score.toLocaleString()} Điểm</strong>
        </div>

        {/* Reward Summary */}
        {isWon && level.mode !== 'endless' && (
          <div className="victory-rewards-card">
            <h4>🎁 Phần Thưởng Nhận Được</h4>
            <div className="rewards-badges-row">
              <span className="reward-badge">⭐ +{level.rewards.stars} Sao</span>
              <span className="reward-badge">💰 +{level.rewards.coins} Xu</span>
              <span className="reward-badge">💖 +{level.rewards.hearts} Tim</span>
              <span className="reward-badge">✨ +{level.rewards.xp} XP</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="victory-actions-row">
          <button className="replay-btn" onClick={onReplay}>
            🔄 Chơi Lại
          </button>
          <button className="claim-return-btn" onClick={handleClaimAndClose}>
            {level.mode === 'endless' ? '📊 Lưu điểm & Về thị trấn' : isWon ? '🎁 Nhận Thưởng & Về Thị Trấn' : '🚪 Thoát Ra'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
