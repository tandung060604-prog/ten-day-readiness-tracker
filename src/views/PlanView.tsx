import { trainingPlan, defaultSettings } from '../data/plan'
import { readiness } from '../utils/readiness'
import { downloadCalendarICS } from '../utils/calendarSync'
import { triggerHaptic } from '../utils/haptics'
import type { DailyLog } from '../types'

type Props = {
  currentDay: number
  logs: DailyLog[]
  waterTarget: number
  onSelectDay: (day: number) => void
  onNavigateToTraining: () => void
}

export function PlanView({ currentDay, logs, waterTarget, onSelectDay, onNavigateToTraining }: Props) {
  const handleSyncCalendar = () => {
    triggerHaptic('success')
    downloadCalendarICS(defaultSettings)
  }

  return (
    <div className="view-container animate-fade-in">
      <section className="card">
        <div className="section-head">
          <div>
            <small>LỘ TRÌNH 10 NGÀY (10-DAY ARC)</small>
            <h3>Tích lũy · Giảm tải (Taper) · Sẵn sàng</h3>
          </div>
          <button className="secondary compact" onClick={handleSyncCalendar} title="Tải file .ics để thêm vào Lịch">
            📅 Đồng bộ vào Lịch (.ICS)
          </button>
        </div>

        <div className="plan-phase-guide">
          <div className="phase-card">
            <span className="phase-badge phase-1">Ngày 1 – 4: Build Phase</span>
            <p>Xây dựng nền tảng năng lượng, siết chặt kỷ luật giấc ngủ, dinh dưỡng đủ protein & carb sạch.</p>
          </div>
          <div className="phase-card">
            <span className="phase-badge phase-2">Ngày 5 – 7: Peak & Stabilize</span>
            <p>Duy trì khối lượng vận động ổn định, chú trọng mobility khớp háng và bài tập sàn chậu.</p>
          </div>
          <div className="phase-card">
            <span className="phase-badge phase-3">Ngày 8 – 10: Taper & Ready</span>
            <p>Giảm tải cường độ, loại bỏ mệt mỏi tích tụ, tối đa hóa giấc ngủ để bước vào phong độ cao nhất.</p>
          </div>
        </div>

        <div className="plan-list">
          {trainingPlan.map((p) => {
            const l = logs.find((x) => x.dayNumber === p.day)
            const isDone = l?.workout?.completed
            const score = l ? readiness(l, waterTarget) : 0
            const isCurrent = currentDay === p.day

            return (
              <button
                key={p.day}
                onClick={() => {
                  onSelectDay(p.day)
                  onNavigateToTraining()
                }}
                className={`plan-item-btn ${isCurrent ? 'current' : ''}`}
              >
                <div className={`day-node ${isDone ? 'done' : ''}`}>
                  {isDone ? '✓' : p.day}
                </div>

                <div className="plan-item-info">
                  <div className="plan-item-title-row">
                    <strong>Ngày {p.day}: {p.title}</strong>
                    {score > 0 && (
                      <span className="plan-readiness-chip">Readiness: {score}</span>
                    )}
                  </div>
                  <span>{p.subtitle}</span>
                </div>

                <div className="plan-status-col">
                  <span className={`status-pill ${isDone ? 'completed' : isCurrent ? 'today' : 'planned'}`}>
                    {isDone ? 'Đã hoàn thành' : isCurrent ? 'Hôm nay' : 'Theo lịch'}
                  </span>
                  <span className="arrow-icon">›</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
