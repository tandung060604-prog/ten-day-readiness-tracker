import { useEffect, useState } from 'react'
import type { GameStats } from '../types'
import { audioSystem } from '../systems/GameAudioSystem'

type Props = {
  stats: GameStats
  onOpenSettings: () => void
  onOpenHome: () => void
  onOpenQuests: () => void
}

export function TopHUD({ stats, onOpenSettings, onOpenHome, onOpenQuests }: Props) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const tick = () => setTimeStr(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 10_000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="hud-top">
      {/* ── left: couple profile chip ── */}
      <button className="hud-profile" onClick={() => { audioSystem.playClick('pop'); onOpenHome() }}>
        <div className="hud-profile__avatars">
          <img src="./assets/dung.jpg" alt="Dũng" />
          <img src="./assets/nguoiyeu.jpg" alt="Em Yêu" className="hud-profile__av2" />
        </div>
        <div className="hud-profile__info">
          <strong>Nhà Của Dũng &amp; Gấu <span className="hud-heart-mini">❤️</span></strong>
          <div className="hud-level-row">
            <span className="hud-level-tag">Level {stats.level}</span>
            <div className="hud-level-bar"><div className="hud-level-fill" style={{ width: `${stats.levelProgress}%` }} /></div>
            <span className="hud-level-pct">{stats.levelProgress}%</span>
          </div>
        </div>
        <button className="hud-quest-bell" onClick={(e) => { e.stopPropagation(); audioSystem.playClick('soft'); onOpenQuests() }}>
          <span>🔔</span>
          <small>Nhiệm vụ</small>
        </button>
      </button>

      {/* ── center: currencies ── */}
      <div className="hud-currencies">
        <div className="hud-cur hud-cur--heart">
          <span className="hud-cur__icon">❤️</span>
          <span className="hud-cur__val">{stats.hearts.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--star">
          <span className="hud-cur__icon">⭐</span>
          <span className="hud-cur__val">{stats.stars.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--gem">
          <span className="hud-cur__icon">💎</span>
          <span className="hud-cur__val">{stats.gems.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--energy">
          <span className="hud-cur__icon">⚡</span>
          <span className="hud-cur__val">{stats.energy}/{stats.energyMax}</span>
        </div>
      </div>

      {/* ── right: time + settings ── */}
      <div className="hud-right">
        <span className="hud-time">{timeStr}</span>
        <button className="hud-settings-btn" onClick={() => { audioSystem.playClick('soft'); onOpenSettings() }}>⚙️</button>
      </div>
    </header>
  )
}
