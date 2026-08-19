type Props = {
  breaks: [string, string][]
  completedBreaks: string[]
  onToggleBreak: (time: string) => void
}

export function DeskBreakTracker({ breaks, completedBreaks, onToggleBreak }: Props) {
  const completedCount = completedBreaks.length
  const total = breaks.length

  return (
    <div className="desk-breaks-wrapper">
      <div className="section-head">
        <div>
          <small>CODER & DESK WORK MODE</small>
          <h3>Giãn cơ định kỳ (Desk Breaks)</h3>
        </div>
        <span className="soft-badge">
          {completedCount}/{total} Hoàn thành
        </span>
      </div>

      <div className="desk-grid">
        {breaks.map(([time, label]) => {
          const isDone = completedBreaks.includes(time)
          return (
            <button
              key={time}
              type="button"
              className={`desk-break-btn ${isDone ? 'done' : ''}`}
              onClick={() => onToggleBreak(time)}
            >
              <div className="desk-time">{time}</div>
              <div className="desk-label">{label}</div>
              <div className={`desk-status ${isDone ? 'done' : ''}`}>
                {isDone ? '✓ Đã xong' : 'Chưa'}
              </div>
            </button>
          )
        })}
      </div>
      <p className="desk-note">
        💡 Mỗi 90–120 phút hãy đứng dậy, nhìn xa 20m, xoay cổ tay và hít thở sâu 30 giây để giải phóng áp lực cột sống.
      </p>
    </div>
  )
}
