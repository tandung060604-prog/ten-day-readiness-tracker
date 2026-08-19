import { useEffect, useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

const STANDUP_EXERCISES = [
  { name: 'Xoay cổ & vai 360°', desc: 'Thả lỏng cơ thang, xoay tròn cổ và cuộn vai 10 vòng.', icon: '🔄' },
  { name: 'Mở khớp háng & Đứng dậy', desc: 'Đứng thẳng, xoay hông và duỗi căng cơ gấp háng (Hip Flexor).', icon: '🦵' },
  { name: 'Quy tắc 20-20-20 cho mắt', desc: 'Nhìn xa 6 mét (20 feet) trong 20 giây để thư giãn điều tiết mắt.', icon: '👀' },
  { name: 'Duỗi cột sống thắt lưng', desc: 'Đưa 2 tay lên cao, hít sâu và ngả nhẹ người ra sau 15 giây.', icon: '🧘' }
]

type Props = {
  breaks: string[][] | [string, string][]
  completedBreaks: string[]
  onToggleBreak: (time: string) => void
}

export function DeskBreakTracker({ breaks, completedBreaks, onToggleBreak }: Props) {
  const completedCount = completedBreaks.length
  const total = breaks.length

  // 60-minute work standup timer
  const [timerSeconds, setTimerSeconds] = useState(60 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    if (!isTimerRunning) return
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          triggerHaptic('warning')
          alert('🔔 Đã hết 60 phút làm việc! Hãy đứng dậy vận động 1 phút để giải phóng cột sống.')
          return 60 * 60
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [isTimerRunning])

  const toggleTimer = () => {
    triggerHaptic('light')
    setIsTimerRunning(v => !v)
  }

  const resetTimer = () => {
    triggerHaptic('light')
    setIsTimerRunning(false)
    setTimerSeconds(60 * 60)
  }

  const mins = Math.floor(timerSeconds / 60)
  const secs = timerSeconds % 60

  return (
    <div className="desk-breaks-wrapper">
      <div className="section-head">
        <div>
          <small>WORK & POSTURE RECOVERY</small>
          <h3>Đứng dậy & Vận động mỗi giờ</h3>
        </div>
        <span className="soft-badge">
          {completedCount}/{total} Hoàn thành
        </span>
      </div>

      {/* 60-Minute Focus / Stand-up Timer */}
      <div className="standup-timer-card">
        <div className="standup-timer-info">
          <strong>Đồng hồ nhắc đứng dậy (60 Phút)</strong>
          <small>Cứ sau mỗi 60 phút ngồi làm việc, chuông sẽ rung nhắc bạn đứng dậy.</small>
        </div>
        <div className="standup-timer-controls">
          <div className="standup-countdown">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="timer-btn-group">
            <button className={isTimerRunning ? 'secondary compact' : 'primary compact'} onClick={toggleTimer}>
              {isTimerRunning ? 'Tạm dừng' : 'Bắt đầu đếm'}
            </button>
            <button className="secondary compact" onClick={resetTimer}>
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stand-up Movements */}
      <div className="standup-movement-grid">
        {STANDUP_EXERCISES.map((item, idx) => (
          <div key={idx} className="standup-movement-card">
            <div className="movement-icon">{item.icon}</div>
            <div className="movement-text">
              <strong>{item.name}</strong>
              <small>{item.desc}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Schedule */}
      <div className="desk-grid mt-3">
        {breaks.map(([time, label]) => {
          const isDone = completedBreaks.includes(time)
          return (
            <button
              key={time}
              type="button"
              className={`desk-break-btn ${isDone ? 'done' : ''}`}
              onClick={() => {
                triggerHaptic('light')
                onToggleBreak(time)
              }}
            >
              <div className="desk-time">{time}</div>
              <div className="desk-label">{label}</div>
              <div className={`desk-status ${isDone ? 'done' : ''}`}>
                {isDone ? '✓ Đã đứng dậy' : 'Chưa'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
