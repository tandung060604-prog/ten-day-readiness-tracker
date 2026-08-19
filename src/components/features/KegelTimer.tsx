import { useEffect, useState } from 'react'

type Props = {
  isCompleted: boolean
  onToggleComplete: () => void
}

export function KegelTimer({ isCompleted, onToggleComplete }: Props) {
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState<'slow' | 'fast'>('slow') // Slow (Hold 4s, Relax 5s) vs Fast (1s contract, 1s relax)
  const [seconds, setSeconds] = useState(0)
  const [repsDone, setRepsDone] = useState(0)

  // In slow mode: cycle is 9s (4s hold, 5s relax)
  // In fast mode: cycle is 2s (1s contract, 1s relax)
  const cycleDuration = mode === 'slow' ? 9 : 2
  const contractDuration = mode === 'slow' ? 4 : 1

  const currentPhaseTime = seconds % cycleDuration
  const isContracting = currentPhaseTime < contractDuration

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1
        if (next > 0 && next % cycleDuration === 0) {
          setRepsDone((r) => r + 1)
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running, cycleDuration])

  const handleReset = () => {
    setRunning(false)
    setSeconds(0)
    setRepsDone(0)
  }

  const handleFinish = () => {
    setRunning(false)
    if (!isCompleted) {
      onToggleComplete()
    }
  }

  return (
    <div className="kegel-trainer-card">
      <div className="section-head">
        <div>
          <small>PELVIC FLOOR TRAINER</small>
          <h3>Bài tập Kegel trực quan</h3>
        </div>
        <button
          className={`status-pill-btn ${isCompleted ? 'completed' : ''}`}
          onClick={onToggleComplete}
        >
          {isCompleted ? '✓ Đã hoàn thành' : 'Đánh dấu xong'}
        </button>
      </div>

      <div className="kegel-mode-selector">
        <button
          className={mode === 'slow' ? 'active' : ''}
          onClick={() => {
            setMode('slow')
            handleReset()
          }}
        >
          Nhịp Chậm (Hold 4s · Thả 5s)
        </button>
        <button
          className={mode === 'fast' ? 'active' : ''}
          onClick={() => {
            setMode('fast')
            handleReset()
          }}
        >
          Nhịp Nhanh (Co 1s · Thả 1s)
        </button>
      </div>

      <div className="kegel-visual-container">
        <div
          className={`kegel-pulse-orb ${running ? (isContracting ? 'contracting' : 'relaxing') : ''}`}
        >
          <div className="orb-inner">
            <span className="orb-phase-text">
              {running ? (isContracting ? '⚡ CO THẮT' : '🍃 THẢ LỎNG') : 'SẴN SÀNG'}
            </span>
            <small className="orb-timer">
              {running ? `${cycleDuration - currentPhaseTime}s` : 'Bấm bắt đầu'}
            </small>
          </div>
        </div>

        <div className="kegel-stats">
          <div className="kegel-stat-box">
            <span>Số hiệp đã tập</span>
            <strong>{repsDone} reps</strong>
          </div>
          <div className="kegel-stat-box">
            <span>Thời gian tập</span>
            <strong>
              {String(Math.floor(seconds / 60)).padStart(2, '0')}:
              {String(seconds % 60).padStart(2, '0')}
            </strong>
          </div>
        </div>
      </div>

      <div className="actions mt-3">
        <button
          className="primary"
          onClick={() => setRunning((v) => !v)}
        >
          {running ? 'Tạm dừng' : 'Bắt đầu đếm nhịp'}
        </button>
        <button onClick={handleReset}>Làm lại</button>
        {seconds >= 20 && (
          <button className="success" onClick={handleFinish}>
            Lưu vào nhật ký ngày
          </button>
        )}
      </div>
      <p className="kegel-tip-note">
        ✦ Lưu ý: Cơ sàn chậu cần được thư giãn hoàn toàn sau mỗi lần siết. Không gồng bụng hoặc nín thở khi tập.
      </p>
    </div>
  )
}
