import { useEffect, useState } from 'react'

type Props = { onMinutes?: (minutes: number) => void }

export function BreathingTimer({ onMinutes }: Props) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const cycle = seconds % 10
  const inhale = cycle < 4

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const reset = () => { setRunning(false); setSeconds(0) }
  const log = () => onMinutes?.(Math.max(1, Math.round(seconds / 60)))

  return (
    <div className="breath-card">
      <div className={`breath-orb ${running ? (inhale ? 'inhale' : 'exhale') : ''}`}>
        <span>{running ? (inhale ? 'Hít vào' : 'Thở ra') : '4 : 6'}</span>
      </div>
      <div>
        <h3>Breathing 4:6</h3>
        <p>Hít nhẹ 4 giây · thở ra 6 giây · vai và hàm thả lỏng.</p>
        <div className="timer">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div>
        <div className="actions">
          <button className="primary" onClick={() => setRunning((v) => !v)}>{running ? 'Pause' : 'Start'}</button>
          <button onClick={reset}>Reset</button>
          {seconds >= 30 && <button onClick={log}>Log session</button>}
        </div>
      </div>
    </div>
  )
}
