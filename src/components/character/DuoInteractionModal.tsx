import { useState } from 'react'
import { Modal } from '../common/Modal'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { getUnlockedBondPerks, triggerLittleDaysMiracle, calculateBondProgress } from '../../domain/character/bondProgression'
import { useGameState } from '../../context/GameStateContext'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { LoveLinkState, DuoInteractionType } from '../../domain/character/types'

interface DuoInteractionModalProps {
  isOpen: boolean
  onClose: () => void
  bondXp?: number
}

export function DuoInteractionModal({
  isOpen,
  onClose,
  bondXp = 450
}: DuoInteractionModalProps) {
  const { state: gameState, grantReward } = useGameState()
  const [loveLink, setLoveLink] = useState<LoveLinkState>({
    currentCharge: 80,
    maxCharge: 100,
    isMiracleReady: false
  })
  const [activeAnim, setActiveAnim] = useState<DuoInteractionType>('wave')
  const [feedbackMessage, setFeedbackMessage] = useState('Chiikawa & Usagi đang vẫy tay chào bạn!')

  const bondProgress = calculateBondProgress(bondXp || gameState.progression.bondXp)
  const perks = getUnlockedBondPerks(bondProgress.level)

  if (!isOpen) return null

  const handleSelectInteraction = (interaction: DuoInteractionType, title: string) => {
    audioSystem.playClick('pop')
    setActiveAnim(interaction)

    if (interaction === 'highFive') {
      setFeedbackMessage('Bẹp! Chiikawa & Usagi vừa đập tay ăn mừng cực ngầu! ✨')
      triggerConfetti()
    } else if (interaction === 'sitTogether') {
      setFeedbackMessage('Hai bé đang ngồi tựa vào nhau uống trà chiều ấm áp... 🛋️🍵')
    } else if (interaction === 'holdHands') {
      setFeedbackMessage('Hai bé nắm chặt tay nhau cùng dạo bước qua thị trấn! 🤝💖')
      triggerConfetti()
    } else if (interaction === 'warmHug') {
      setFeedbackMessage('Vòng tay ôm ấm áp tràn ngập yêu thương và hạnh phúc! 🤗🌸')
      triggerConfetti()
    } else {
      setFeedbackMessage(`${title}: Hai bé gửi lời chào tràn ngập niềm vui! 👋`)
    }
  }

  const handleTriggerMiracle = () => {
    audioSystem.playAchievement('level')
    triggerConfetti()

    const { nextMeter, rewards } = triggerLittleDaysMiracle(loveLink)
    setLoveLink(nextMeter)

    grantReward({
      hearts: rewards.hearts,
      coins: rewards.coins,
      xp: rewards.xp,
      source: 'little_days_miracle'
    })

    setFeedbackMessage('🌈 PHÉP MÀU TÌNH YÊU ĐÃ ĐƯỢC KÍCH HOẠT! +100 Tim, +100 Xu, +150 XP! ✨')
  }

  const handleChargeLinkTest = () => {
    audioSystem.playClick('wood')
    const nextCharge = Math.min(100, loveLink.currentCharge + 20)
    setLoveLink({
      ...loveLink,
      currentCharge: nextCharge,
      isMiracleReady: nextCharge >= 100
    })
  }

  return (
    <Modal title="Tương Tác Cặp Đôi (Chiikawa & Usagi)" onClose={onClose}>
      <div className="duo-modal-container">
        {/* Duo Stage Stage Visual */}
        <div className={`duo-stage-backdrop anim-${activeAnim}`}>
          <div className="duo-mascots-stage-row">
            <div className="stage-mascot mascot-left animate-bounce-gentle">
              <ChiikawaSVG character="chiikawa" size={68} />
              <span className="stage-name-pill">Haru (Chiikawa)</span>
            </div>

            <div className="stage-heart-bond">
              <span className="stage-heart-icon">💖</span>
              <span className="stage-bond-level">Cấp Thân Thiết Lv.{bondProgress.level}</span>
            </div>

            <div className="stage-mascot mascot-right animate-bounce-gentle">
              <ChiikawaSVG character="usagi" size={68} />
              <span className="stage-name-pill">Mai Trang (Usagi)</span>
            </div>
          </div>

          <div className="duo-feedback-banner">
            <span>{feedbackMessage}</span>
          </div>
        </div>

        {/* Love Link Meter & Miracle Activation */}
        <div className="love-link-gauge-card">
          <div className="gauge-header">
            <span className="gauge-title">⚡ THANH NĂNG LƯỢNG ĐÔI (LOVE LINK)</span>
            <span className="gauge-val">{loveLink.currentCharge} / {loveLink.maxCharge} Pts</span>
          </div>

          <div className="love-link-bar">
            <div 
              className="love-link-fill" 
              style={{ width: `${(loveLink.currentCharge / loveLink.maxCharge) * 100}%` }} 
            />
          </div>

          <div className="gauge-actions-row">
            <button 
              className="charge-test-btn"
              onClick={handleChargeLinkTest}
              disabled={loveLink.currentCharge >= 100}
            >
              💖 Nạp Năng Lượng (+20 Pts)
            </button>

            <button 
              className={`miracle-trigger-btn ${loveLink.currentCharge >= 100 ? 'ready animate-pulse' : ''}`}
              onClick={handleTriggerMiracle}
              disabled={loveLink.currentCharge < 100}
            >
              🌈 Kích Hoạt Phép Màu Tình Yêu!
            </button>
          </div>
        </div>

        {/* Bond Perks List */}
        <div className="bond-perks-section">
          <h3>🌸 Các Cử Chỉ Gắn Kết Đã Mở Khóa</h3>
          <div className="bond-perks-grid">
            {perks.map(perk => (
              <div 
                key={perk.level}
                className={`perk-card ${perk.unlocked ? 'unlocked' : 'locked'} ${activeAnim === perk.interaction ? 'active' : ''}`}
                onClick={() => perk.unlocked && handleSelectInteraction(perk.interaction, perk.title)}
              >
                <div className="perk-icon">{perk.icon}</div>
                <div className="perk-info">
                  <h4>Lv.{perk.level} • {perk.title}</h4>
                  <p>{perk.description}</p>
                </div>
                <div className="perk-status">
                  {perk.unlocked ? '✨ Dùng' : '🔒 Khóa'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
