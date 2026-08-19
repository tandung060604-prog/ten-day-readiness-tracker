import { useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import type { LocationId, MapBuilding, TransitionType } from '../types'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
  loveDays: number
}

/*  ─── building positions match the reference image layout ──────────── */
export const MAP_BUILDINGS: MapBuilding[] = [
  // ── row 1 (top) ──
  { id: 'home',       name: 'Nhà Của\nChúng Mình',    icon: '🏡', transition: 'heart',  color: '#ff8da1', glow: 'rgba(255,141,161,.35)', x: 12, y: 18 },
  { id: 'gym',        name: 'Nhà Tập',                 icon: '🏋️', transition: 'cloud',  color: '#ffd166', glow: 'rgba(255,209,102,.35)', x: 30, y: 12 },
  { id: 'water',      name: 'Đài Uống\nNước',          icon: '⛲', transition: 'water',  color: '#67b7ff', glow: 'rgba(103,183,255,.35)', x: 48, y:  8 },
  { id: 'journal',    name: 'Thư Viện\nNhật Ký',       icon: '📖', transition: 'book',   color: '#cdb4db', glow: 'rgba(205,180,219,.35)', x: 72, y: 10 },

  // ── row 2 (middle) ──
  { id: 'quests',     name: 'Quảng Trường\nQuest',     icon: '🎪', transition: 'cloud',  color: '#e0aa4d', glow: 'rgba(224,170,77,.35)',  x: 42, y: 38 },
  { id: 'album',      name: 'Album\nKỷ Niệm',         icon: '📸', transition: 'camera', color: '#ff8da1', glow: 'rgba(255,141,161,.35)', x: 78, y: 28 },
  { id: 'market',     name: 'Chợ Nhỏ',                 icon: '🛒', transition: 'cloud',  color: '#38b283', glow: 'rgba(56,178,131,.35)',  x: 88, y: 18 },

  // ── row 3 (bottom-left inland) ──
  { id: 'sleep',      name: 'Trung Tâm\nGiấc Ngủ',    icon: '🌙', transition: 'moon',   color: '#7b68ee', glow: 'rgba(123,104,238,.35)', x:  6, y: 58 },
  { id: 'restaurant', name: 'Nhà Hàng\nHẹn Hò',       icon: '🍷', transition: 'heart',  color: '#e57385', glow: 'rgba(229,115,133,.35)', x: 18, y: 68 },
  { id: 'settings',   name: 'Tòa Thị Chính\n/ Cài Đặt', icon: '🏛️', transition: 'gear', color: '#a8dadc', glow: 'rgba(168,218,220,.35)', x: 42, y: 72 },
  { id: 'airport',    name: 'Sân Bay',                  icon: '✈️', transition: 'plane',  color: '#67b7ff', glow: 'rgba(103,183,255,.35)', x: 68, y: 55 },

  // ── far-right beach ──
  { id: 'beach',      name: 'Bãi Biển\nNha Trang',     icon: '🏖️', transition: 'water',  color: '#4ee1aa', glow: 'rgba(78,225,170,.35)',  x: 86, y: 68 },
]

/* ─── decorative trees, flowers, clouds ─────────────────────────────── */
const DECO_TREES = [
  { x: 3, y: 8, e: '🌳', s: 28 }, { x: 22, y: 6, e: '🌸', s: 22 },
  { x: 60, y: 4, e: '🌳', s: 26 }, { x: 92, y: 6, e: '🌴', s: 26 },
  { x: 96, y: 40, e: '🌴', s: 30 }, { x: 2, y: 42, e: '🌲', s: 26 },
  { x: 34, y: 60, e: '🌸', s: 20 }, { x: 56, y: 18, e: '🌷', s: 18 },
  { x: 80, y: 46, e: '🌺', s: 18 }, { x: 14, y: 38, e: '🌼', s: 16 },
  { x: 64, y: 30, e: '🌿', s: 18 }, { x: 50, y: 60, e: '🌳', s: 24 },
]

export function WorldMap({ onSelectBuilding, loveDays }: Props) {
  const [selectedId, setSelectedId] = useState<LocationId | null>(null)
  const [speech, setSpeech] = useState('Cùng nhau hôm nay\ncòn tuyệt hơn hôm qua! ✨')

  const handleClick = (b: MapBuilding) => {
    setSelectedId(b.id)
    audioSystem.playClick('pop')
    setSpeech(`Đang tới ${b.name.replace('\n', ' ')}...`)

    setTimeout(() => {
      onSelectBuilding(b.id, b.transition)
      setSelectedId(null)
    }, 420)
  }

  return (
    <div className="gm-viewport">
      {/* ══════ sky + landscape bg ══════ */}
      <div className="gm-sky" />
      <div className="gm-rainbow" />

      {/* animated clouds */}
      <div className="gm-cloud c1" />
      <div className="gm-cloud c2" />
      <div className="gm-cloud c3" />

      {/* ocean area (right side) */}
      <div className="gm-ocean">
        <div className="gm-ocean-label">NHA TRANG</div>
      </div>

      {/* grass + path pattern */}
      <div className="gm-land" />
      <svg className="gm-paths" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {/* winding town paths */}
        <path d="M120 130 C200 180, 280 100, 420 250 S560 350, 680 340 S800 400, 860 420"
          fill="none" stroke="#f5e6d3" strokeWidth="28" strokeLinecap="round" opacity=".65" />
        <path d="M420 250 C400 350, 380 440, 420 460"
          fill="none" stroke="#f5e6d3" strokeWidth="24" strokeLinecap="round" opacity=".55" />
        <path d="M120 130 C100 250, 80 370, 180 420 S320 470, 420 460"
          fill="none" stroke="#f5e6d3" strokeWidth="22" strokeLinecap="round" opacity=".5" />
      </svg>

      {/* decorative trees & flowers */}
      {DECO_TREES.map((t, i) => (
        <span key={i} className="gm-deco" style={{ left: `${t.x}%`, top: `${t.y}%`, fontSize: t.s }}>
          {t.e}
        </span>
      ))}

      {/* floating sparkle particles */}
      <div className="gm-sparkles">
        <span className="gm-sp s1">✨</span>
        <span className="gm-sp s2">🌸</span>
        <span className="gm-sp s3">💫</span>
        <span className="gm-sp s4">🌸</span>
        <span className="gm-sp s5">✨</span>
      </div>

      {/* ══════ 12 interactive buildings ══════ */}
      {MAP_BUILDINGS.map((b) => (
        <button
          key={b.id}
          className={`gm-building ${selectedId === b.id ? 'gm-building--active' : ''}`}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            '--bldg-color': b.color,
            '--bldg-glow': b.glow,
          } as React.CSSProperties}
          onClick={() => handleClick(b)}
        >
          <span className="gm-building__icon">{b.icon}</span>
          <span className="gm-building__name">{b.name}</span>
        </button>
      ))}

      {/* ══════ central mascot duo ══════ */}
      <div className="gm-mascots" onClick={() => audioSystem.playClick('pop')}>
        <ChiikawaSVG character="chiikawa" size={68} className="gm-mascot-sprite" />
        <ChiikawaSVG character="usagi"    size={68} className="gm-mascot-sprite" />
      </div>

      {/* ══════ bottom-left love counter ══════ */}
      <div className="gm-love-counter">
        <span className="gm-love-heart">❤️</span>
        <div>
          <small>Đếm Ngày Yêu Nhau</small>
          <strong>{loveDays.toLocaleString()} ngày</strong>
        </div>
      </div>

      {/* ══════ bottom-right speech bubble ══════ */}
      <div className="gm-speech">
        <p>{speech}</p>
      </div>
    </div>
  )
}
