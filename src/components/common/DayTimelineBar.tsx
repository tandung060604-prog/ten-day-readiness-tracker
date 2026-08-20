import { audioSystem } from '../../game/systems/GameAudioSystem'

interface DayTimelineBarProps {
  currentDay: number
  maxDays?: number
  onSelectDay: (day: number) => void
  completedDays?: number[]
}

const DAY_TITLES = [
  'Khởi Đầu 🌸',
  'Chăm Sóc 💧',
  'Tâm Tình 💌',
  'Thư Giãn 🛏️',
  'Hẹn Hò 🍝',
  'Khám Phá 📸',
  'Gắn Kết 💞',
  'Chuẩn Bị ✈️',
  'Đến Biển 🏖️',
  'Hoàng Hôn 🎆'
]

export function DayTimelineBar({
  currentDay,
  maxDays = 10,
  onSelectDay,
  completedDays = [1, 2]
}: DayTimelineBarProps) {
  return (
    <div className="day-timeline-wrapper">
      <div className="day-timeline-label">
        <span>📅 Hành Trình 10 Ngày Đôi Lứa:</span>
        <strong className="active-day-badge">Đang xem: Ngày {currentDay} - {DAY_TITLES[currentDay - 1]}</strong>
      </div>

      <div className="day-timeline-scroll">
        {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => {
          const isSelected = d === currentDay
          const isDone = completedDays.includes(d)

          return (
            <button
              key={d}
              type="button"
              className={`day-chip-btn ${isSelected ? 'selected' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                audioSystem.playClick('soft')
                onSelectDay(d)
              }}
              title={`Xem nhật ký & hoạt động Ngày ${d}`}
            >
              <span className="day-chip-num">Ngày {d}</span>
              <span className="day-chip-title">{DAY_TITLES[d - 1]}</span>
              {isDone && <span className="day-done-check">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
