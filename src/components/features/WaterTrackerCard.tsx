import { useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

const DRINK_TYPES = [
  { id: 'water', label: 'Nước lọc', icon: '💧', factor: 1.0 },
  { id: 'coconut', label: 'Nước dừa/Điện giải', icon: '🥥', factor: 1.0 },
  { id: 'tea', label: 'Trà xanh/Thảo mộc', icon: '🍵', factor: 0.85 },
  { id: 'protein', label: 'Sữa/Protein Shake', icon: '🥛', factor: 0.90 },
  { id: 'juice', label: 'Nước ép/Detox', icon: '🍊', factor: 0.80 },
  { id: 'coffee', label: 'Cà phê', icon: '☕', factor: 0.60 }
]

const WATER_SCHEDULE = [
  { time: '08:00', label: 'Khởi động sáng (Nước ấm)', target: 350 },
  { time: '10:00', label: 'Bổ sung giữa buổi', target: 300 },
  { time: '13:30', label: 'Sau ăn trưa 30p', target: 350 },
  { time: '15:30', label: 'Chống buồn ngủ & Tuần hoàn', target: 300 },
  { time: '17:30', label: 'Bù nước trước/trong tập', target: 500 },
  { time: '20:00', label: 'Ngụm nhỏ buổi tối', target: 200 }
]

type Props = {
  currentMl: number
  targetMl: number
  onAddWater: (amount: number) => void
}

export function WaterTrackerCard({ currentMl, targetMl, onAddWater }: Props) {
  const [selectedDrink, setSelectedDrink] = useState(DRINK_TYPES[0])
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([])

  const percent = Math.min(100, Math.round((currentMl / (targetMl || 2500)) * 100))

  const handleAddDrink = (baseAmount: number) => {
    triggerHaptic('light')
    const effectiveAmount = Math.round(baseAmount * selectedDrink.factor)
    onAddWater(effectiveAmount)
  }

  const toggleMilestone = (time: string, suggestedAmount: number) => {
    triggerHaptic('light')
    if (checkedMilestones.includes(time)) {
      setCheckedMilestones(prev => prev.filter(t => t !== time))
    } else {
      setCheckedMilestones(prev => [...prev, time])
      handleAddDrink(suggestedAmount)
    }
  }

  return (
    <section className="card water-pro-card">
      <div className="section-head">
        <div>
          <small>HYDRATION LAB PRO · ĐA DẠNG ĐỒ UỐNG</small>
          <h3>Quản lý nước uống thông minh</h3>
        </div>
        <span className="water-percent-badge">{percent}% Mục tiêu</span>
      </div>

      {/* Drink Type Selector */}
      <div className="drink-type-selector-row">
        <span className="drink-selector-label">Chọn loại đồ uống:</span>
        <div className="drink-pills-list">
          {DRINK_TYPES.map(drink => (
            <button
              key={drink.id}
              type="button"
              className={`drink-pill-btn ${selectedDrink.id === drink.id ? 'active' : ''}`}
              onClick={() => {
                triggerHaptic('light')
                setSelectedDrink(drink)
              }}
            >
              <span>{drink.icon}</span>
              <span>{drink.label}</span>
              <small>({Math.round(drink.factor * 100)}%)</small>
            </button>
          ))}
        </div>
      </div>

      <div className="water-glass-layout">
        {/* Animated Water Glass Visual */}
        <div className="water-glass-container">
          <div className="water-glass-body">
            <div
              className="water-wave-fill"
              style={{ height: `${percent}%` }}
            >
              <div className="water-wave-anim wave-1" />
              <div className="water-wave-anim wave-2" />
            </div>
            <div className="water-glass-text">
              <strong>{currentMl.toLocaleString()}</strong>
              <small>/ {targetMl.toLocaleString()} ml</small>
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="water-quick-actions">
          <div className="water-buttons-grid">
            <button className="water-btn" onClick={() => handleAddDrink(150)}>
              <span className="btn-icon">{selectedDrink.icon}</span> +150ml <small>(Cốc nhỏ)</small>
            </button>
            <button className="water-btn" onClick={() => handleAddDrink(250)}>
              <span className="btn-icon">{selectedDrink.icon}</span> +250ml <small>(Ly chuẩn)</small>
            </button>
            <button className="water-btn" onClick={() => handleAddDrink(350)}>
              <span className="btn-icon">{selectedDrink.icon}</span> +350ml <small>(Cốc to)</small>
            </button>
            <button className="water-btn" onClick={() => handleAddDrink(500)}>
              <span className="btn-icon">{selectedDrink.icon}</span> +500ml <small>(Bình lớn)</small>
            </button>
          </div>

          <div className="water-undo-row">
            <button
              className="secondary compact"
              onClick={() => {
                triggerHaptic('light')
                onAddWater(-250)
              }}
              title="Trừ bớt 250ml nếu bấm nhầm"
            >
              ⌫ Trừ 250ml
            </button>
            <span className="water-remaining-txt">
              {currentMl >= targetMl
                ? '🎉 Đã đạt 100% chuẩn nước hôm nay!'
                : `Còn thiếu ${(targetMl - currentMl).toLocaleString()} ml`}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Hourly Milestones */}
      <div className="water-schedule-section">
        <span className="water-schedule-title">⏱ Các mốc bổ sung nước khuyến nghị:</span>
        <div className="water-milestones-grid">
          {WATER_SCHEDULE.map((m) => {
            const isDone = checkedMilestones.includes(m.time)
            return (
              <button
                key={m.time}
                type="button"
                className={`water-milestone-chip ${isDone ? 'checked' : ''}`}
                onClick={() => toggleMilestone(m.time, m.target)}
              >
                <div className="milestone-time-row">
                  <span className="milestone-time">{m.time}</span>
                  <span className="milestone-check">{isDone ? '✓' : '＋'}</span>
                </div>
                <div className="milestone-desc">{m.label}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Smart Advice Box */}
      <div className="water-advice-box">
        <span className="advice-badge">💡 Lời khuyên tối ưu sinh lý:</span>
        <p>
          Uống từng ngụm nhỏ cách đều 45–60 phút để thận và tế bào hấp thụ trọn vẹn. Tránh uống dồn lượng lớn nước sát giờ đi ngủ để bảo vệ chu kỳ ngủ sâu (Deep Sleep).
        </p>
      </div>
    </section>
  )
}
