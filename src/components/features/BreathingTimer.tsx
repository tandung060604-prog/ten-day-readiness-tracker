import { useEffect, useState } from 'react'

type Props = {
  onMinutes?: (minutes: number) => void
}

export function BreathingTimer({ onMinutes }: Props) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  // 4s Inhale, 6s Exhale (10s total cycle)
  const cycle = seconds % 10
  const inhale = cycle < 4
  const phaseSecondsLeft = inhale ? 4 - cycle : 10 - cycle

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const reset = () => {
    setRunning(false)
    setSeconds(0)
  }

  const logSession = () => {
    const mins = Math.max(1, Math.round(seconds / 60))
    onMinutes?.(mins)
    reset()
  }

  return (
    <div className="breath-card">
      <div className={`breath-orb ${running ? (inhale ? 'inhale' : 'exhale') : ''}`}>
        <div className="breath-orb-content">
          <span>{running ? (inhale ? 'Hít vào' : 'Thở ra') : '4 : 6'}</span>
          {running && <small className="breath-countdown">{phaseSecondsLeft}s</small>}
        </div>
      </div>

      <div className="breath-info">
        <div className="section-head mb-1">
          <div>
            <small>RECOVERY & PARASYMPATHETIC</small>
            <h3>Tập Thở 4:6 (Deep Breathing)</h3>
          </div>
        </div>
        <p className="muted-text">Hít nhẹ bằng mũi trong 4s · Thở ra từ từ bằng miệng 6s · Thả lỏng hoàn toàn vai và hàm.</p>

        <div className="timer-display">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </div>

        <div className="actions">
          <button className="primary" onClick={() => setRunning((v) => !v)}>
            {running ? 'Tạm dừng' : 'Bắt đầu thở'}
          </button>
          <button onClick={reset}>Làm lại</button>
          {seconds >= 30 && (
            <button className="success" onClick={logSession}>
              Lưu {Math.max(1, Math.round(seconds / 60))} phút thở
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
