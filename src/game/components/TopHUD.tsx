import { useEffect, useState } from 'react'
import type { GameStats } from '../types'
import { audioSystem } from '../systems/GameAudioSystem'
import { GameIcon } from '../../components/common/GameIcons'

type Props = {
  stats: GameStats
  activeRole?: 'chiikawa' | 'usagi'
  onOpenSettings: () => void
  onOpenHome: () => void
  onOpenQuests: () => void
}

export function TopHUD({ stats, activeRole = 'chiikawa', onOpenSettings, onOpenHome, onOpenQuests }: Props) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const tick = () => setTimeStr(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 10_000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="hud-top">
      {/* ── left: couple profile chip with active character role ── */}
      <button className="hud-profile" onClick={() => { audioSystem.playClick('pop'); onOpenHome() }}>
        <div className="hud-profile__avatars">
          <img src={activeRole === 'chiikawa' ? './assets/dung.jpg' : './assets/nguoiyeu.jpg'} alt="Avatar" />
          <span className="hud-char-role-badge">
            {activeRole === 'chiikawa' ? '🐹' : '🐰'}
          </span>
        </div>
        <div className="hud-profile__info">
          <strong>
            {activeRole === 'chiikawa' ? 'Haru (Chiikawa)' : 'Mai Trang (Usagi)'} <GameIcon name="heart" size={13} style={{ marginLeft: 3 }} />
          </strong>
          <div className="hud-level-row">
            <span className="hud-level-tag">Level {stats.level}</span>
            <div className="hud-level-bar"><div className="hud-level-fill" style={{ width: `${stats.levelProgress}%` }} /></div>
            <span className="hud-level-pct">{stats.levelProgress}%</span>
          </div>
        </div>
        <button className="hud-quest-bell" onClick={(e) => { e.stopPropagation(); audioSystem.playClick('soft'); onOpenQuests() }}>
          <GameIcon name="bell" size={16} color="#fd7e14" />
          <small>Nhiệm vụ</small>
        </button>
      </button>

      {/* ── center: currencies ── */}
      <div className="hud-currencies">
        <div className="hud-cur hud-cur--heart">
          <span className="hud-cur__icon">
            <GameIcon name="heart" size={16} />
          </span>
          <span className="hud-cur__val">{stats.hearts.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--star">
          <span className="hud-cur__icon">
            <GameIcon name="star" size={16} />
          </span>
          <span className="hud-cur__val">{stats.stars.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--gem">
          <span className="hud-cur__icon">
            <GameIcon name="gem" size={16} />
          </span>
          <span className="hud-cur__val">{stats.gems.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--energy">
          <span className="hud-cur__icon">
            <GameIcon name="energy" size={16} />
          </span>
          <span className="hud-cur__val">{stats.energy}/{stats.energyMax}</span>
        </div>
      </div>

      {/* ── right: time + settings ── */}
      <div className="hud-right">
        <span className="hud-time">{timeStr}</span>
        <button className="hud-settings-btn" onClick={() => { audioSystem.playClick('soft'); onOpenSettings() }}>
          <GameIcon name="gear" size={18} color="#495057" />
        </button>
      </div>
    </header>
  )
}
