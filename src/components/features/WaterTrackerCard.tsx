import { useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

const WATER_SCHEDULE = [
  { time: '08:00', label: 'Cốc khởi động buổi sáng (Nước ấm)', target: 350 },
  { time: '10:00', label: 'Bổ sung năng lượng giữa buổi', target: 300 },
  { time: '13:30', label: 'Sau bữa trưa 30 phút', target: 350 },
  { time: '15:30', label: 'Chống buồn ngủ & Duy trì tuần hoàn', target: 300 },
  { time: '17:30', label: 'Bù nước trước / trong tập luyện', target: 500 },
  { time: '20:00', label: 'Cốc nhẹ buổi tối (ngụm nhỏ)', target: 200 }
]

type Props = {
  currentMl: number
  targetMl: number
  onAddWater: (amount: number) => void
}

export function WaterTrackerCard({ currentMl, targetMl, onAddWater }: Props) {
  const percent = Math.min(100, Math.round((currentMl / (targetMl || 2500)) * 100))
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([])

  const handleQuickAdd = (amount: number) => {
    triggerHaptic('light')
    onAddWater(amount)
  }

  const toggleMilestone = (time: string, suggestedAmount: number) => {
    triggerHaptic('light')
    if (checkedMilestones.includes(time)) {
      setCheckedMilestones(prev => prev.filter(t => t !== time))
    } else {
      setCheckedMilestones(prev => [...prev, time])
      onAddWater(suggestedAmount)
    }
  }

  return (
    <section className="card water-pro-card">
      <div className="section-head">
        <div>
          <small>HYDRATION PRO · QUẢN LÝ NƯỚC UỐNG</small>
          <h3>Theo dõi nước uống thông minh</h3>
        </div>
        <span className="water-percent-badge">{percent}% Mục tiêu</span>
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
            <button className="water-btn" onClick={() => handleQuickAdd(150)}>
              <span className="btn-icon">☕</span> +150ml <small>(Cốc nhỏ)</small>
            </button>
            <button className="water-btn" onClick={() => handleQuickAdd(250)}>
              <span className="btn-icon">🥛</span> +250ml <small>(Ly chuẩn)</small>
            </button>
            <button className="water-btn" onClick={() => handleQuickAdd(350)}>
              <span className="btn-icon">🥤</span> +350ml <small>(Cốc to)</small>
            </button>
            <button className="water-btn" onClick={() => handleQuickAdd(500)}>
              <span className="btn-icon">🍶</span> +500ml <small>(Bình lớn)</small>
            </button>
          </div>

          <div className="water-undo-row">
            <button
              className="secondary compact"
              onClick={() => handleQuickAdd(-250)}
              title="Trừ bớt 250ml nếu bấm nhầm"
            >
              ⌫ Trừ 250ml
            </button>
            <span className="water-remaining-txt">
              {currentMl >= targetMl
                ? '🎉 Đã đạt chuẩn nước trong ngày!'
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
