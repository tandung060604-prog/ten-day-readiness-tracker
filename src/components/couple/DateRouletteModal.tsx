import { useState } from 'react'
import { Modal } from '../common/Modal'
import { spinDateRoulette } from '../../domain/couple/coupleFeatures'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { DateRouletteOption } from '../../domain/couple/coupleFeatures'

interface DateRouletteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DateRouletteModal({ isOpen, onClose }: DateRouletteModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'romantic' | 'chill' | 'active' | 'food' | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState<'indoor' | 'outdoor' | 'any'>('any')
  const [result, setResult] = useState<DateRouletteOption | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  if (!isOpen) return null

  const handleSpin = () => {
    setIsSpinning(true)
    audioSystem.playClick('pop')

    setTimeout(() => {
      const picked = spinDateRoulette(selectedCategory, selectedLocation)
      setResult(picked)
      setIsSpinning(false)
      triggerConfetti()
    }, 700)
  }

  return (
    <Modal title="Vòng Quay Hẹn Hò & Ăn Gì (Date Roulette)" onClose={onClose}>
      <div className="date-roulette-container">
        <p className="roulette-intro">
          Không biết hôm nay nên ăn gì hoặc đi đâu? Hãy để Vòng Quay May Mắn chọn giúp hai bạn nhé! 🎡✨
        </p>

        {/* Filters */}
        <div className="roulette-filters-row">
          <div className="filter-group">
            <label>Tâm trạng:</label>
            <select
              value={selectedCategory || 'all'}
              onChange={e => setSelectedCategory(e.target.value === 'all' ? undefined : (e.target.value as any))}
            >
              <option value="all">Tất cả tâm trạng</option>
              <option value="romantic">🌹 Lãng mạn</option>
              <option value="chill">☕ Thư giãn</option>
              <option value="food">🍢 Ẩm thực</option>
              <option value="active">🎲 Năng động</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Không gian:</label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value as any)}
            >
              <option value="any">Tất cả không gian</option>
              <option value="indoor">🏠 Trong nhà</option>
              <option value="outdoor">🌳 Ngoài trời</option>
            </select>
          </div>
        </div>

        {/* Spinning Wheel / Result Card */}
        <div className="roulette-display-card">
          {isSpinning ? (
            <div className="spinning-state animate-pulse">
              <span className="wheel-spin-icon">🎡</span>
              <h4>Đang quay tìm ý tưởng hẹn hò...</h4>
            </div>
          ) : result ? (
            <div className="result-detail-view animate-fade-in">
              <span className="result-icon">{result.icon}</span>
              <h3>{result.title}</h3>
              <p className="result-desc">{result.description}</p>
              <div className="result-meta-line">
                <span>💰 Chi phí dự kiến: <strong>{result.estimatedCostVND}</strong></span>
                <span>📍 Không gian: <strong>{result.locationType === 'indoor' ? 'Trong nhà' : result.locationType === 'outdoor' ? 'Ngoài trời' : 'Linh hoạt'}</strong></span>
              </div>
            </div>
          ) : (
            <div className="empty-roulette-state">
              <span className="wheel-idle-icon">🎡</span>
              <h4>Bấm nút bên dưới để quay ngay!</h4>
            </div>
          )}
        </div>

        {/* Spin Button */}
        <div className="roulette-actions">
          <button
            className="spin-btn animate-bounce-gentle"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? 'Đang Quay...' : '🎲 Quay Ý Tưởng Hẹn Hò!'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
