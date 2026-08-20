import { useEffect, useState } from 'react'
import { soundscapes } from '../../utils/soundscapes'
import { triggerHaptic } from '../../utils/haptics'
import type { SleepEntry } from '../../types'

type Props = {
  sleep?: SleepEntry
  targetBedtime?: string
  targetWaketime?: string
  onOpenSleepModal: () => void
}

export function SleepTrackerPro({
  sleep,
  targetBedtime: _targetBedtime = '23:00',
  targetWaketime: _targetWaketime = '07:00',
  onOpenSleepModal
}: Props) {
  const [activeSound, setActiveSound] = useState<'rain' | 'ocean' | '432hz' | null>(null)
  const [soundTimerMinutes, setSoundTimerMinutes] = useState<number | null>(null)

  const hours = sleep?.nightHours || 0
  const cycles = (hours / 1.5).toFixed(1) // 90 mins = 1.5 hours
  const fullCycles = Math.floor(hours / 1.5)

  // Quality score calculation (0 - 100)
  const calculateSleepScore = () => {
    if (!sleep) return null
    let score = (sleep.quality / 5) * 50 // up to 50
    if (hours >= 7.5 && hours <= 8.5) score += 35
    else if (hours >= 6.5) score += 25
    else score += 10
    if (sleep.napMinutes && sleep.napMinutes >= 15 && sleep.napMinutes <= 30) score += 15
    return Math.min(100, Math.round(score))
  }

  const sleepScore = calculateSleepScore()

  const toggleSoundscape = (mode: 'rain' | 'ocean' | '432hz') => {
    triggerHaptic('medium')
    if (activeSound === mode) {
      soundscapes.stop()
      setActiveSound(null)
      setSoundTimerMinutes(null)
    } else {
      soundscapes.play(mode)
      setActiveSound(mode)
      setSoundTimerMinutes(30) // default 30 mins
    }
  }

  // Timer auto-stop
  useEffect(() => {
    if (!activeSound || !soundTimerMinutes) return
    const timer = window.setTimeout(() => {
      soundscapes.stop()
      setActiveSound(null)
      setSoundTimerMinutes(null)
    }, soundTimerMinutes * 60 * 1000)
    return () => window.clearTimeout(timer)
  }, [activeSound, soundTimerMinutes])

  return (
    <section className="card sleep-pro-card">
      <div className="section-head">
        <div>
          <small>SLEEP LAB PRO · CHU KỲ & RU NGỦ</small>
          <h3>Phân tích giấc ngủ sâu</h3>
        </div>
        <button className="quick-edit-btn" onClick={onOpenSleepModal}>
          ✎ {sleep ? 'Chỉnh sửa' : 'Nhập giấc ngủ'}
        </button>
      </div>

      {/* Main Sleep Metric Display */}
      <div className="sleep-metrics-summary-grid">
        <div className="sleep-summary-box main-time">
          <small>THỜI LƯỢNG NGỦ ĐÊM</small>
          <div className="sleep-hours-val">
            {hours > 0 ? hours : '—'} <span>giờ</span>
          </div>
          <span className="sleep-cycle-pill">
            {hours > 0 ? `⚡ ${cycles} chu kỳ (Chuẩn 90m)` : 'Mục tiêu: 5 chu kỳ (7.5h)'}
          </span>
        </div>

        <div className="sleep-summary-box score-box">
          <small>ĐIỂM CHẤT LƯỢNG (SLEEP SCORE)</small>
          <div className="sleep-score-val" style={{ color: (sleepScore || 0) >= 80 ? 'var(--primary)' : 'var(--warn)' }}>
            {sleepScore !== null ? `${sleepScore}/100` : '—'}
          </div>
          <span className="sleep-status-tag">
            {sleepScore && sleepScore >= 80 ? '🌟 Hồi phục tuyệt vời' : sleepScore ? '⚡ Hồi phục khá' : 'Chưa nhập tối qua'}
          </span>
        </div>
      </div>

      {/* Sleep Stages Hypnogram Curve Visual */}
      <div className="sleep-hypnogram-section">
        <div className="hypnogram-header">
          <span className="hypnogram-title">🌊 Mô phỏng sóng các giai đoạn giấc ngủ (Hypnogram):</span>
          <small>{fullCycles >= 4 ? `Đạt ${fullCycles} chu kỳ sâu trọn vẹn` : 'Chu kỳ 90 phút tối ưu'}</small>
        </div>

        <div className="hypnogram-visual-container">
          <svg viewBox="0 0 400 90" className="hypnogram-svg">
            {/* Background Stage Lines */}
            <line x1="0" y1="15" x2="400" y2="15" stroke="var(--line)" strokeDasharray="4 4" />
            <text x="5" y="12" fill="var(--muted)" fontSize="9">Thức (Awake)</text>

            <line x1="0" y1="40" x2="400" y2="40" stroke="var(--line)" strokeDasharray="4 4" />
            <text x="5" y="37" fill="var(--muted)" fontSize="9">REM / Mơ</text>

            <line x1="0" y1="65" x2="400" y2="65" stroke="var(--line)" strokeDasharray="4 4" />
            <text x="5" y="62" fill="var(--muted)" fontSize="9">Ngủ sâu (Deep Sleep)</text>

            {/* Simulated Dynamic Hypnogram Wave */}
            <path
              d="M 10 15 Q 30 15 45 65 T 85 40 T 120 70 T 160 38 T 200 70 T 240 38 T 280 68 T 320 35 T 360 45 T 390 15"
              fill="none"
              stroke="url(#sleepGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            <defs>
              <linearGradient id="sleepGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#67b7ff" />
                <stop offset="50%" stopColor="#4ee1aa" />
                <stop offset="100%" stopColor="#cc8fff" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="hypnogram-legend">
          <span><i className="legend-dot deep" /> Ngủ sâu (Deep Sleep - Tiết hormone tăng trưởng)</span>
          <span><i className="legend-dot rem" /> REM (Phục hồi não bộ)</span>
        </div>
      </div>

      {/* Wind-down Soundscape Ambient Generator */}
      <div className="soundscapes-player-box">
        <div className="soundscape-header">
          <div>
            <strong>🎵 Âm thanh ru ngủ thư giãn (Wind-down Soundscapes)</strong>
            <small>Tạo sóng âm thanh tự nhiên giúp thư giãn não bộ trước khi ngủ.</small>
          </div>
          {activeSound && (
            <span className="sound-playing-badge">
              ● Đang phát ({soundTimerMinutes}p)
            </span>
          )}
        </div>

        <div className="soundscape-buttons-grid">
          <button
            type="button"
            className={`sound-btn ${activeSound === 'rain' ? 'active' : ''}`}
            onClick={() => toggleSoundscape('rain')}
          >
            <span className="sound-icon">🌧</span>
            <div>
              <strong>Tiếng Mưa Rơi</strong>
              <small>Rain Soundscape</small>
            </div>
          </button>

          <button
            type="button"
            className={`sound-btn ${activeSound === 'ocean' ? 'active' : ''}`}
            onClick={() => toggleSoundscape('ocean')}
          >
            <span className="sound-icon">🌊</span>
            <div>
              <strong>Sóng Biển Vỗ</strong>
              <small>Ocean Waves</small>
            </div>
          </button>

          <button
            type="button"
            className={`sound-btn ${activeSound === '432hz' ? 'active' : ''}`}
            onClick={() => toggleSoundscape('432hz')}
          >
            <span className="sound-icon">✨</span>
            <div>
              <strong>Tần Số 432Hz</strong>
              <small>Deep Meditation</small>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
