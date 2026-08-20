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
  isTimelineOpen?: boolean
  onToggleTimeline?: () => void
  onOpenSettings: () => void
  onOpenHome: () => void
  onOpenQuests: () => void
  onOpenLevelGuide?: () => void
  onOpenCurrenciesGuide?: () => void
}

export function TopHUD({
  stats,
  activeRole = 'chiikawa',
  profile,
  isTimelineOpen = false,
  onToggleTimeline,
  onOpenSettings,
  onOpenHome,
  onOpenQuests,
  onOpenLevelGuide,
  onOpenCurrenciesGuide
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
            <img src={activeRole === 'chiikawa' ? './assets/chiikawa.png' : './assets/usagi.png'} alt={activeRole} style={{ width: 18, height: 18, objectFit: 'contain', borderRadius: '50%' }} />
          </span>
        </div>
        <div className="hud-profile__info">
          <strong>
            {activePlayer.nickname} ({charLabel}) <GameIcon name="heart" size={13} style={{ marginLeft: 3 }} />
          </strong>
          <div
            className="hud-level-row"
            onClick={(e) => {
              e.stopPropagation()
              audioSystem.playClick('pop')
              onOpenLevelGuide?.()
            }}
            title="Bấm để xem hướng dẫn Cấp Độ & Cách Tích Lũy XP"
          >
            <span className="hud-level-tag">Level {stats.level} ℹ️</span>
            <div className="hud-level-bar"><div className="hud-level-fill" style={{ width: `${stats.levelProgress}%` }} /></div>
            <span className="hud-level-pct">{stats.levelProgress}%</span>
          </div>
        </div>
      </button>

      {/* ── center: currencies (clickable to see currency explanation & starter roadmap) ── */}
      <div
        className="hud-currencies"
        onClick={() => {
          audioSystem.playClick('soft')
          onOpenCurrenciesGuide?.()
        }}
        title="Bấm để xem hướng dẫn sử dụng Tim, Sao, Xu & Lộ trình bắt đầu"
      >
        <div className="hud-cur hud-cur--heart" title="Tim Yêu Thương">
          <span className="hud-cur__icon">
            <GameIcon name="heart" size={16} />
          </span>
          <span className="hud-cur__val">{stats.hearts.toLocaleString()}</span>
        </div>
        <div className="hud-cur hud-cur--star" title="Sao Thành Tích">
          <span className="hud-cur__icon">
            <GameIcon name="star" size={16} color="#ffd43b" />
          </span>
          <span className="hud-cur__val">{stats.stars.toLocaleString()}</span>
        </div>
        <div className="hud-cur hud-cur--gem" title="Xu Thị Trấn">
          <span className="hud-cur__icon">
            <GameIcon name="gem" size={16} color="#4dabf7" />
          </span>
          <span className="hud-cur__val">{stats.gems.toLocaleString()}</span>
        </div>
      </div>

      {/* ── right: 10-day timeline toggle button, quest button, clock, settings gear ── */}
      <div className="hud-actions">
        {/* 10-Day Timeline Interactive Toggle Button */}
        <button
          className={`hud-timeline-toggle-btn ${isTimelineOpen ? 'active' : ''}`}
          onClick={() => {
            audioSystem.playClick('pop')
            onToggleTimeline?.()
          }}
          title="Bấm để ẩn / hiện bảng Lộ Trình 10 Ngày"
        >
          <span>📅 Ngày {stats.day}/{stats.maxDays}</span>
          <span className="toggle-arrow">{isTimelineOpen ? '▲' : '▼'}</span>
        </button>

        <button
          className="hud-quest-bell"
          onClick={() => { audioSystem.playClick('soft'); onOpenQuests() }}
          title="Xem nhiệm vụ hàng ngày"
        >
          <GameIcon name="bell" size={16} color="#fd7e14" />
          <small>Nhiệm vụ</small>
        </button>

        <div className="hud-clock" title="Thời gian hiện tại">
          <span className="hud-clock__time">{timeStr}</span>
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
