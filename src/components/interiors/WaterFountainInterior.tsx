import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import { triggerHaptic } from '../../utils/haptics'
import type { DailyLog } from '../../types'

interface WaterFountainProps {
  log: DailyLog
  waterTargetMl: number
  addWater: (amount: number) => void
  updateLog?: (fn: (current: DailyLog) => DailyLog) => void
}

export function WaterFountainInterior({
  log,
  waterTargetMl,
  addWater
}: WaterFountainProps) {
  const [showHistory, setShowHistory] = useState(false)
  const currentMl = log.hydrationMl || 0
  const percentage = Math.min(100, Math.round((currentMl / Math.max(1, waterTargetMl)) * 100))

  const handlePourWater = (amount: number) => {
    audioSystem.playSplash()
    triggerHaptic('light')
    addWater(amount)

    if (currentMl + amount >= waterTargetMl && currentMl < waterTargetMl) {
      setTimeout(() => {
        triggerConfetti()
        audioSystem.playAchievement('quest')
      }, 300)
    }
  }

  // Dynamic status text and mood
  let stageDescription = 'Mặt nước đang tĩnh lặng. Hãy nạp ngụm nước đầu tiên!'
  let fountainEffect = 'low-water'
  if (percentage >= 100) {
    stageDescription = '🌈 Cực đại! Cầu vồng và các tinh thể nước lấp lánh quanh đài phun!'
    fountainEffect = 'rainbow-bloom'
  } else if (percentage >= 75) {
    stageDescription = '🌸 Hoa pha lê đang nở rộ quanh bờ đá cẩm thạch!'
    fountainEffect = 'flower-bloom'
  } else if (percentage >= 50) {
    stageDescription = '🐟 Đàn cá ánh sáng đang bơi lội tung tăng trong dòng nước trong vắt!'
    fountainEffect = 'fish-swim'
  } else if (percentage >= 25) {
    stageDescription = '💧 Dòng suối phép thuật đã bắt đầu tuôn trào róc rách!'
    fountainEffect = 'stream-flow'
  }

  return (
    <SceneShell
      sceneId="water-fountain"
      title="Đài Phun Nước Ma Thuật"
      subtitle="Dòng nước ngọt ngào duy trì sức sống và sự tươi tắn cho cả ngày"
      icon="⛲"
      companionRole="chiikawa"
      companionMessage={
        percentage >= 100
          ? 'Oaaa! Em đã uống đủ nước hôm nay rồi, giỏi quá đi thui! ✨'
          : `Đã uống ${currentMl} / ${waterTargetMl} ml (${percentage}%). Tiếp tục nạp nước nhé!`
      }
    >
      <div className="water-interior-container">
        {/* Main Focal Visual: Animated Magic Fountain */}
        <div className={`magic-fountain-stage ${fountainEffect}`}>
          {/* Animated Water Jet Effect */}
          <div className="fountain-jet-container">
            <div 
              className="fountain-water-spout" 
              style={{ height: `${Math.max(15, percentage * 0.8)}px` }}
            />
            {percentage >= 100 && <div className="fountain-rainbow-arc animate-pulse" />}
          </div>

          {/* Fountain Basin Basin Reservoir */}
          <div className="fountain-basin-outer">
            <div className="fountain-basin-water" style={{ height: `${Math.max(8, percentage)}%` }}>
              <div className="water-wave-layer wave-1" />
              <div className="water-wave-layer wave-2" />
              {percentage >= 50 && <div className="magic-fish fish-1">🐟</div>}
              {percentage >= 75 && <div className="magic-lotus lotus-1">🪷</div>}
            </div>
            
            {/* Center Fountain Stat Badge */}
            <div className="fountain-metric-overlay">
              <span className="fountain-percentage">{percentage}%</span>
              <span className="fountain-ml-reading">{currentMl} / {waterTargetMl} ml</span>
            </div>
          </div>

          {/* Environmental Stage Note */}
          <p className="fountain-stage-text">{stageDescription}</p>
        </div>

        {/* Quick Pour Action Buttons */}
        <div className="water-quick-actions">
          <h3>💧 Thêm Nước Ngay</h3>
          <div className="pour-buttons-row">
            <button 
              className="pour-btn cup-small"
              onClick={() => handlePourWater(200)}
            >
              <span className="pour-icon">🥛</span>
              <span className="pour-label">+200 ml</span>
              <small>Cốc nhỏ</small>
            </button>

            <button 
              className="pour-btn cup-medium"
              onClick={() => handlePourWater(300)}
            >
              <span className="pour-icon">🍵</span>
              <span className="pour-label">+300 ml</span>
              <small>Cốc trà</small>
            </button>

            <button 
              className="pour-btn bottle-large"
              onClick={() => handlePourWater(500)}
            >
              <span className="pour-icon">🍶</span>
              <span className="pour-label">+500 ml</span>
              <small>Bình thể thao</small>
            </button>
          </div>
        </div>

        {/* History / Stone Tablet Journal */}
        <div className="water-history-section">
          <button 
            className="toggle-water-journal-btn"
            onClick={() => { audioSystem.playClick('soft'); setShowHistory(!showHistory); }}
          >
            📜 {showHistory ? 'Ẩn Nhật Ký Nước Uống' : 'Xem Lịch Sử Uống Nước'}
          </button>

          {showHistory && (
            <div className="water-journal-tablet animate-slide-up">
              <h4>Bia Đá Ghi Nhớ Lượng Nước</h4>
              <p>Mục tiêu mỗi ngày: <strong>{waterTargetMl} ml</strong></p>
              <p>Trạng thái hôm nay: <strong>{currentMl >= waterTargetMl ? 'Đã Đạt Chuẩn 🌟' : 'Đang Hoàn Thiện 🌊'}</strong></p>
              <small>Tip: Uống một cốc nước ấm ngay sau khi thức dậy giúp tinh thần sảng khoái và làn da căng mịn!</small>
            </div>
          )}
        </div>
      </div>
    </SceneShell>
  )
}
