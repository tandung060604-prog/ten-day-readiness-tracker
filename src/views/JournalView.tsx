import type { DailyLog } from '../types'

type Props = {
  logs: DailyLog[]
  day: number
  updateLog: (fn: (l: DailyLog) => DailyLog) => void
  setMetric: (key: 'energy' | 'mood' | 'stress' | 'soreness', value: number) => void
}

export function JournalView({ logs, day, updateLog, setMetric }: Props) {
  const log = logs.find((l) => l.dayNumber === day) || logs[day - 1]

  return (
    <div className="view-container animate-fade-in">
      <div className="grid-2 journal-layout">
        {/* Daily reflection form */}
        <section className="card">
          <div className="section-head">
            <div>
              <small>NHẬT KÝ NGÀY {day}</small>
              <h3>Ghi chép & Đánh giá cảm nhận</h3>
            </div>
            <span className="soft-badge">Evening Check-in</span>
          </div>

          <div className="slider-grid">
            <label>
              <span>
                Năng lượng (Energy) <b>{log.energy ?? 5}/10</b>
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={log.energy ?? 5}
                onChange={(e) => setMetric('energy', Number(e.target.value))}
              />
            </label>

            <label>
              <span>
                Tâm trạng (Mood) <b>{log.mood ?? 5}/10</b>
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={log.mood ?? 5}
                onChange={(e) => setMetric('mood', Number(e.target.value))}
              />
            </label>

            <label>
              <span>
                Căng thẳng (Stress) <b>{log.stress ?? 5}/10</b>
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={log.stress ?? 5}
                onChange={(e) => setMetric('stress', Number(e.target.value))}
              />
            </label>

            <label>
              <span>
                Đau mỏi cơ (Soreness) <b>{log.soreness ?? 5}/10</b>
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={log.soreness ?? 5}
                onChange={(e) => setMetric('soreness', Number(e.target.value))}
              />
            </label>
          </div>

          <label className="journal-box">
            <span>Ghi chú suy ngẫm cuối ngày</span>
            <textarea
              value={log.journal || ''}
              onChange={(e) => updateLog((l) => ({ ...l, journal: e.target.value }))}
              placeholder={
                '• Hôm nay cơ thể cảm thấy thế nào?\n• Buổi tập có quá tải hay vừa sức?\n• Dinh dưỡng và nước uống đã đạt chuẩn chưa?\n• Cần điều chỉnh điều gì cho ngày mai?'
              }
              rows={6}
            />
          </label>
        </section>

        {/* 10-day history timeline */}
        <section className="card">
          <div className="section-head">
            <div>
              <small>LỊCH SỬ 10 NGÀY</small>
              <h3>Tiến trình cảm nhận cơ thể</h3>
            </div>
          </div>

          <div className="feelings-timeline">
            {logs.map((l) => {
              const energy = l.energy || 5
              const opacity = 0.3 + (energy / 10) * 0.7
              const isSelected = l.dayNumber === day

              return (
                <div
                  key={l.dayNumber}
                  className={`feeling-row ${isSelected ? 'selected' : ''}`}
                >
                  <span className="feeling-day">D{l.dayNumber}</span>
                  <div
                    className="feeling-dot"
                    style={{
                      opacity,
                      backgroundColor: energy >= 7 ? 'var(--primary)' : energy >= 4 ? 'var(--warn)' : 'var(--danger)'
                    }}
                    title={`Năng lượng: ${energy}/10`}
                  />
                  <strong className="feeling-score">{energy}/10</strong>
                  <p className="feeling-snippet">
                    {l.journal
                      ? l.journal.length > 70
                        ? l.journal.slice(0, 70) + '...'
                        : l.journal
                      : 'Chưa có ghi chép nhật ký.'}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
