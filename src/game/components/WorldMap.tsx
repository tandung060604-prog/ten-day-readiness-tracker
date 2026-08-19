import { useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import type { LocationId, MapBuilding, TransitionType } from '../types'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
  loveDays: number
}

export const MAP_BUILDINGS: MapBuilding[] = [
  { id: 'home',       name: 'Nhà Của\nChúng Mình',    icon: '🏡', transition: 'heart',  color: '#ff8da1', glow: 'rgba(255,141,161,.45)', x: 13.8, y: 26.5 },
  { id: 'gym',        name: 'Nhà Tập',                 icon: '🏋️', transition: 'cloud',  color: '#ffd166', glow: 'rgba(255,209,102,.45)', x: 34.5, y: 21.0 },
  { id: 'water',      name: 'Đài Uống\nNước',          icon: '⛲', transition: 'water',  color: '#67b7ff', glow: 'rgba(103,183,255,.45)', x: 50.8, y: 19.5 },
  { id: 'journal',    name: 'Thư Viện\nNhật Ký',       icon: '📖', transition: 'book',   color: '#cdb4db', glow: 'rgba(205,180,219,.45)', x: 69.8, y: 21.0 },
  { id: 'album',      name: 'Album\nKỷ Niệm',         icon: '📸', transition: 'camera', color: '#ff8da1', glow: 'rgba(255,141,161,.45)', x: 85.5, y: 31.0 },
  { id: 'sleep',      name: 'Trung Tâm\nGiấc Ngủ',    icon: '🌙', transition: 'moon',   color: '#7b68ee', glow: 'rgba(123,104,238,.45)', x: 12.0, y: 56.5 },
  { id: 'quests',     name: 'Quảng Trường\nQuest',     icon: '🎪', transition: 'cloud',  color: '#e0aa4d', glow: 'rgba(224,170,77,.45)',  x: 50.0, y: 41.5 },
  { id: 'market',     name: 'Chợ Nhỏ',                 icon: '🛒', transition: 'cloud',  color: '#38b283', glow: 'rgba(56,178,131,.45)',  x: 82.0, y: 46.5 },
  { id: 'airport',    name: 'Sân Bay',                  icon: '✈️', transition: 'plane',  color: '#67b7ff', glow: 'rgba(103,183,255,.45)', x: 73.0, y: 64.5 },
  { id: 'restaurant', name: 'Nhà Hàng\nHẹn Hò',       icon: '🍷', transition: 'heart',  color: '#e57385', glow: 'rgba(229,115,133,.45)', x: 25.5, y: 75.5 },
  { id: 'settings',   name: 'Tòa Thị Chính\n/ Cài Đặt', icon: '🏛️', transition: 'gear', color: '#a8dadc', glow: 'rgba(168,218,220,.45)', x: 50.0, y: 77.5 },
  { id: 'beach',      name: 'Bãi Biển\nNha Trang',     icon: '🏖️', transition: 'water',  color: '#4ee1aa', glow: 'rgba(78,225,170,.45)',  x: 90.5, y: 75.5 },
]

const COUPLE_QUOTES = [
  'Cùng nhau hôm nay\ncòn tuyệt hơn hôm qua! 💕',
  'Đếm từng ngày để cùng bay\ntới Nha Trang 27/08! 🌴✈️',
  'Yêu em nhất trên đời, cùng\nnhau rèn luyện mỗi ngày nhé! ✨',
  'Bé Chiikawa & Usagi luôn cổ vũ\ncho tình yêu của 2 đứa mình! 🐹🐰',
  'Hôm nay hoàn thành đủ mục tiêu\nđể tích thêm tim nha! ❤️'
]

export function WorldMap({ onSelectBuilding, loveDays }: Props) {
  const [selectedId, setSelectedId] = useState<LocationId | null>(null)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [mascotSparkle, setMascotSparkle] = useState(false)

  const handleClick = (b: MapBuilding) => {
    setSelectedId(b.id)
    audioSystem.playClick('pop')
    setTimeout(() => {
      onSelectBuilding(b.id, b.transition)
      setSelectedId(null)
    }, 380)
  }

  const handleMascotClick = () => {
    audioSystem.playClick('enter')
    setMascotSparkle(true)
    setQuoteIdx((prev) => (prev + 1) % COUPLE_QUOTES.length)
    setTimeout(() => setMascotSparkle(false), 1200)
  }

  return (
    <div className="art-world-viewport">
      {/* ══════ 1. High-Res Artwork Illustration Canvas ══════ */}
      <div className="art-map-stage">
        <img
          src="./assets/game_world_map.jpg"
          alt="Little Days Town Map"
          className="art-map-image"
          draggable={false}
        />

        {/* ══════ 2. Clickable Building Hotspots ══════ */}
        {MAP_BUILDINGS.map((b) => (
          <button
            key={b.id}
            className={`art-building-hotspot ${selectedId === b.id ? 'art-building-hotspot--active' : ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              '--hotspot-glow': b.glow,
              '--hotspot-color': b.color
            } as React.CSSProperties}
            onClick={() => handleClick(b)}
            title={`Bước vào ${b.name.replace('\n', ' ')}`}
          >
            <span className="hotspot-pulse-ring" />
            <span className="hotspot-tap-badge">
              <span className="hotspot-icon">{b.icon}</span>
              <span className="hotspot-title">{b.name}</span>
            </span>
          </button>
        ))}

        {/* ══════ 3. Interactive Central Mascots (Chiikawa & Usagi) ══════ */}
        <div
          className={`art-mascots-center ${mascotSparkle ? 'mascot-sparkle-active' : ''}`}
          onClick={handleMascotClick}
          title="Nhấn để tương tác với Chiikawa & Usagi"
        >
          <div className="mascot-item mascot-left">
            <ChiikawaSVG character="chiikawa" size={72} className="animate-bounce-gentle" />
          </div>
          <span className="mascot-heart-pulse">💖</span>
          <div className="mascot-item mascot-right">
            <ChiikawaSVG character="usagi" size={72} className="animate-bounce-gentle" />
          </div>
        </div>

        {/* ══════ 4. Live Love Days Counter Overlay (Bottom Left) ══════ */}
        <div className="art-love-card animate-slide-up">
          <span className="love-card-heart">💖</span>
          <div>
            <small>Đếm Ngày Yêu Nhau</small>
            <strong>{loveDays.toLocaleString()} <span>ngày</span></strong>
          </div>
        </div>

        {/* ══════ 5. Dynamic Couple Sticky Note (Bottom Right) ══════ */}
        <div className="art-sticky-note animate-slide-up" onClick={() => setQuoteIdx((prev) => (prev + 1) % COUPLE_QUOTES.length)}>
          <span className="sticky-pin">📌</span>
          <p>{COUPLE_QUOTES[quoteIdx]}</p>
        </div>
      </div>
    </div>
  )
}
