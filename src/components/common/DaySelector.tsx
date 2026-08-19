import type { DailyLog } from '../../types'
import { readiness } from '../../utils/readiness'

type Props = {
  currentDay: number
  logs: DailyLog[]
  waterTarget: number
  onSelectDay: (day: number) => void
}

export function DaySelector({ currentDay, logs, waterTarget, onSelectDay }: Props) {
  return (
    <div className="day-selector-bar">
      <div className="day-selector-scroll">
        {Array.from({ length: 10 }, (_, i) => {
          const dayNum = i + 1
          const log = logs.find(l => l.dayNumber === dayNum) || logs[i]
          const isCurrent = dayNum === currentDay
          const score = log ? readiness(log, waterTarget) : 0
          const isDone = log?.workout?.completed && (log.checklist.filter(c => c.done).length >= log.checklist.length / 2)

          let statusClass = 'pending'
          if (score >= 80) statusClass = 'optimal'
          else if (score >= 60) statusClass = 'good'
          else if (score > 0) statusClass = 'fair'

          return (
            <button
              key={dayNum}
              className={`day-pill-btn ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => onSelectDay(dayNum)}
            >
              <div className="day-pill-header">
                <span className="day-num-badge">D{dayNum}</span>
                {isDone && <span className="day-check-icon">✓</span>}
              </div>
              <div className="day-pill-score">
                <span className={`score-dot ${statusClass}`} />
                <strong>{score}</strong>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
