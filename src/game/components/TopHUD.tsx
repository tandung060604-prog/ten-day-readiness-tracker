import { useEffect, useState } from 'react'
import type { GameStats } from '../types'
import { audioSystem } from '../systems/GameAudioSystem'
import { GameIcon } from '../../components/common/GameIcons'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { getPlayerByCharacter } from '../../domain/couple/selectors'
import type { CoupleProfile } from '../../domain/couple/types'

type Props = {
  stats: GameStats
  activeRole?: 'chiikawa' | 'usagi'
  profile?: CoupleProfile
  onOpenSettings: () => void
  onOpenHome: () => void
  onOpenQuests: () => void
}

export function TopHUD({
  stats,
  activeRole = 'chiikawa',
  profile,
  onOpenSettings,
  onOpenHome,
  onOpenQuests
}: Props) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const tick = () => setTimeStr(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 10_000)
    return () => clearInterval(t)
  }, [])

  const activePlayer = getPlayerByCharacter(profile, activeRole)
  const charLabel = activeRole === 'chiikawa' ? 'Chiikawa' : 'Usagi'

  return (
    <header className="hud-top">
      {/* ── left: couple profile chip with active character role ── */}
      <button className="hud-profile" onClick={() => { audioSystem.playClick('pop'); onOpenHome() }}>
        <div className="hud-profile__avatars" style={{ background: activeRole === 'chiikawa' ? '#fff0f3' : '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChiikawaSVG character={activeRole} size={28} />
          <span className="hud-char-role-badge">
            {activeRole === 'chiikawa' ? '🐹' : '🐰'}
          </span>
        </div>
        <div className="hud-profile__info">
          <strong>
            {activePlayer.nickname} ({charLabel}) <GameIcon name="heart" size={13} style={{ marginLeft: 3 }} />
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
            <GameIcon name="star" size={16} color="#ffd43b" />
          </span>
          <span className="hud-cur__val">{stats.stars.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
        <div className="hud-cur hud-cur--gem">
          <span className="hud-cur__icon">
            <GameIcon name="gem" size={16} color="#4dabf7" />
          </span>
          <span className="hud-cur__val">{stats.gems.toLocaleString()}</span>
          <button className="hud-cur__plus" onClick={() => audioSystem.playClick('soft')}>＋</button>
        </div>
      </div>

      {/* ── right: clock, day badge, settings gear ── */}
      <div className="hud-actions">
        <div className="hud-clock">
          <span className="hud-clock__time">{timeStr}</span>
          <span className="hud-clock__day">Ngày {stats.day}/{stats.maxDays}</span>
        </div>
        <button
          className="hud-action-btn hud-action-btn--settings"
          onClick={() => { audioSystem.playClick('pop'); onOpenSettings() }}
          title="Cài đặt & Tòa thị chính"
        >
          <GameIcon name="gear" size={18} />
        </button>
      </div>
    </header>
  )
}
