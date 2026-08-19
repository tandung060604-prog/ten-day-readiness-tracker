import { useEffect, useState } from 'react'
import type { GameStats } from '../types'
import { audioSystem } from '../systems/GameAudioSystem'

type Props = {
  stats: GameStats
  onOpenSettings: () => void
  onOpenHome: () => void
}

export function TopHUD({ stats, onOpenSettings, onOpenHome }: Props) {
  const [timeStr, setTimeStr] = useState('')
  const [isNight, setIsNight] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const d = new Date()
      const hours = d.getHours()
      setIsNight(hours < 6 || hours >= 18)
      setTimeStr(d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="game-top-hud">
      {/* Couple Profile Chip */}
      <button
        className="hud-profile-btn"
        onClick={() => {
          audioSystem.playClick('pop')
          onOpenHome()
        }}
        title="Xem không gian Nhà Của Chúng Mình"
      >
        <div className="hud-avatars-duo">
          <img src="./assets/dung.jpg" alt="Dũng" className="hud-avatar-thumb" />
          <span className="hud-heart-connector">❤️</span>
          <img src="./assets/nguoiyeu.jpg" alt="Em Yêu" className="hud-avatar-thumb" />
        </div>
        <div className="hud-couple-info">
          <strong>Dũng & Em Yêu</strong>
          <small>Day {stats.day} / {stats.maxDays} · Ready Day</small>
        </div>
      </button>

      {/* Center Game Currencies */}
      <div className="hud-currencies-bar">
        <div className="hud-stat-pill heart-stat" title="Điểm Tình Yêu (Love Hearts)">
          <span className="stat-icon">💖</span>
          <span className="stat-val">{stats.hearts}</span>
        </div>

        <div className="hud-stat-pill star-stat" title="Ngôi Sao Kỷ Luật (Discipline Stars)">
          <span className="stat-icon">⭐</span>
          <span className="stat-val">{stats.stars}</span>
        </div>

        <div className="hud-stat-pill gem-stat" title="Ngọc Kỷ Niệm (Memory Gems)">
          <span className="stat-icon">💎</span>
          <span className="stat-val">{stats.gems}</span>
        </div>

        <div className="hud-stat-pill energy-stat" title="Năng Lượng Sẵn Sàng (Readiness Energy)">
          <span className="stat-icon">⚡</span>
          <div className="energy-bar-wrap">
            <div className="energy-bar-fill" style={{ width: `${stats.energy}%` }} />
          </div>
          <span className="stat-val">{stats.energy}%</span>
        </div>
      </div>

      {/* Right Time & Quick Settings */}
      <div className="hud-right-actions">
        <div className="hud-time-badge">
          <span>{isNight ? '🌙' : '☀️'}</span>
          <span>{timeStr}</span>
        </div>

        <button
          className="hud-action-btn"
          onClick={() => {
            audioSystem.playClick('soft')
            onOpenSettings()
          }}
          title="Tòa Thị Chính & Cài Đặt (Town Hall Settings)"
        >
          ⚙️
        </button>
      </div>
    </header>
  )
}
