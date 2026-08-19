import { useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import type { LocationId, MapBuilding, TransitionType } from '../types'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
  loveDays: number
}

export const MAP_BUILDINGS: MapBuilding[] = [
  {
    id: 'home',
    name: 'Nhà Của Chúng Mình',
    subtitle: 'Tổ Ấm & 10 Ngày Sẵn Sàng',
    icon: '🏡',
    img: './assets/buildings/house.jpg',
    transition: 'heart',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.5)',
    tag: 'Tổ Ấm',
    size: 110,
    x: 13.5,
    y: 25.0
  },
  {
    id: 'gym',
    name: 'Nhà Tập (Gym Dojo)',
    subtitle: 'Thể Lực & Đẩy Tạ',
    icon: '🏋️',
    img: './assets/buildings/gym.jpg',
    transition: 'cloud',
    color: '#ffd166',
    glow: 'rgba(255,209,102,0.5)',
    tag: 'Thể Lực',
    size: 100,
    x: 32.5,
    y: 19.5
  },
  {
    id: 'water',
    name: 'Đài Uống Nước',
    subtitle: 'Bù Nước & Điện Giải',
    icon: '⛲',
    img: './assets/buildings/water.jpg',
    transition: 'water',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.5)',
    tag: 'Bù Nước',
    size: 98,
    x: 52.0,
    y: 17.5
  },
  {
    id: 'journal',
    name: 'Thư Viện Nhật Ký',
    subtitle: 'Cảm Xúc & Ký Ức',
    icon: '📖',
    img: './assets/buildings/library.jpg',
    transition: 'book',
    color: '#cdb4db',
    glow: 'rgba(205,180,219,0.5)',
    tag: 'Nhật Ký',
    size: 105,
    x: 69.5,
    y: 20.5
  },
  {
    id: 'album',
    name: 'Album Kỷ Niệm',
    subtitle: 'Ảnh & Khoảnh Khắc',
    icon: '📸',
    img: './assets/buildings/album.jpg',
    transition: 'camera',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.5)',
    tag: 'Ảnh Đôi',
    size: 105,
    x: 85.5,
    y: 29.5
  },
  {
    id: 'sleep',
    name: 'Trung Tâm Giấc Ngủ',
    subtitle: 'Ngủ Ngon & Chu Kỳ 90m',
    icon: '🌙',
    img: './assets/buildings/sleep.jpg',
    transition: 'moon',
    color: '#7b68ee',
    glow: 'rgba(123,104,238,0.5)',
    tag: 'Giấc Ngủ',
    size: 108,
    x: 13.5,
    y: 54.0
  },
  {
    id: 'quests',
    name: 'Quảng Trường Quest',
    subtitle: 'Mục Tiêu & Thói Quen',
    icon: '🎪',
    img: './assets/buildings/quest.jpg',
    transition: 'cloud',
    color: '#e0aa4d',
    glow: 'rgba(224,170,77,0.5)',
    tag: 'Nhiệm Vụ',
    size: 95,
    x: 50.0,
    y: 39.5
  },
  {
    id: 'market',
    name: 'Chợ Nhỏ Dinh Dưỡng',
    subtitle: 'Bữa Ăn & Macro Sạch',
    icon: '🛒',
    img: './assets/buildings/market.jpg',
    transition: 'cloud',
    color: '#38b283',
    glow: 'rgba(56,178,131,0.5)',
    tag: 'Dinh Dưỡng',
    size: 102,
    x: 75.5,
    y: 44.5
  },
  {
    id: 'restaurant',
    name: 'Nhà Hàng Hẹn Hò',
    subtitle: 'Bữa Tối Lãng Mạn',
    icon: '🍷',
    img: './assets/buildings/restaurant.jpg',
    transition: 'heart',
    color: '#e57385',
    glow: 'rgba(229,115,133,0.5)',
    tag: 'Hẹn Hò',
    size: 108,
    x: 26.5,
    y: 74.0
  },
  {
    id: 'settings',
    name: 'Tòa Thị Chính',
    subtitle: 'Cài Đặt & Dữ Liệu',
    icon: '🏛️',
    img: './assets/buildings/townhall.jpg',
    transition: 'gear',
    color: '#a8dadc',
    glow: 'rgba(168,218,220,0.5)',
    tag: 'Hệ Thống',
    size: 116,
    x: 48.5,
    y: 77.0
  },
  {
    id: 'airport',
    name: 'Sân Bay Quốc Tế',
    subtitle: 'Chuyến Bay Nha Trang 27/08',
    icon: '✈️',
    img: './assets/buildings/airport.jpg',
    transition: 'plane',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.5)',
    tag: 'Chuyến Bay',
    size: 110,
    x: 71.5,
    y: 67.5
  },
  {
    id: 'beach',
    name: 'Bãi Biển Nha Trang',
    subtitle: 'Tour 3 Đảo & San Hô',
    icon: '🏖️',
    img: './assets/buildings/beach.jpg',
    transition: 'water',
    color: '#4ee1aa',
    glow: 'rgba(78,225,170,0.5)',
    tag: 'Nha Trang',
    size: 112,
    x: 88.5,
    y: 72.5
  }
]

const DIALOG_LINES = [
  'Chào mừng Dũng & Em Yêu đến với thị trấn Little Days! ✨',
  'Hôm nay cùng rèn luyện chăm chỉ để sẵn sàng cho Nha Trang 27/08 nhé! 🌴',
  'Chiikawa & Usagi luôn bên cạnh cổ vũ 2 đứa mình! 💖',
  'Nhấn vào từng tòa nhà để bắt đầu các nhiệm vụ nha! 🚀'
]

export function WorldMap({ onSelectBuilding, loveDays }: Props) {
  const [selectedId, setSelectedId] = useState<LocationId | null>(null)
  const [hoveredBuilding, setHoveredBuilding] = useState<MapBuilding | null>(null)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [mascotBounce, setMascotBounce] = useState(false)

  const handleBuildingClick = (b: MapBuilding) => {
    setSelectedId(b.id)
    audioSystem.playClick('pop')
    setTimeout(() => {
      onSelectBuilding(b.id, b.transition)
      setSelectedId(null)
    }, 380)
  }

  const handleMascotClick = () => {
    audioSystem.playClick('enter')
    setMascotBounce(true)
    setDialogIdx((prev) => (prev + 1) % DIALOG_LINES.length)
    setTimeout(() => setMascotBounce(false), 800)
  }

  return (
    <div className="game-world-map-viewport">
      <div className="game-map-canvas">
        {/* 1. High Quality Clean Terrain Background */}
        <img
          src="./assets/game_terrain.jpg"
          alt="Little Days Game Map Terrain"
          className="map-terrain-background"
          draggable={false}
        />

        {/* 2. Interactive 3D Building Game Entities */}
        {MAP_BUILDINGS.map((b) => (
          <div
            key={b.id}
            className={`map-building-entity ${selectedId === b.id ? 'entity-selected' : ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              '--bldg-theme-color': b.color,
              '--bldg-theme-glow': b.glow
            } as React.CSSProperties}
            onClick={() => handleBuildingClick(b)}
            onMouseEnter={() => {
              setHoveredBuilding(b)
              audioSystem.playClick('soft')
            }}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            {/* 3D Model Sprite Container */}
            <div className="building-sprite-wrapper" style={{ width: `${b.size}px`, height: `${b.size}px` }}>
              <img
                src={b.img}
                alt={b.name}
                className="building-3d-model"
                draggable={false}
              />
              <div className="building-ambient-shadow" />
            </div>

            {/* Wooden Signboard Label */}
            <div className="building-signboard animate-slide-up">
              <span className="signboard-icon">{b.icon}</span>
              <span className="signboard-text">{b.name}</span>
            </div>
          </div>
        ))}

        {/* 3. Central Plaza Mascots (Chiikawa & Usagi) */}
        <div
          className={`central-mascots-group ${mascotBounce ? 'mascots-excited' : ''}`}
          onClick={handleMascotClick}
          title="Bé Chiikawa & Usagi vẫy chào bạn! (Nhấn để trò chuyện)"
        >
          <div className="mascot-pair">
            <ChiikawaSVG character="chiikawa" size={68} className="animate-bounce-gentle" />
            <span className="mascot-heart-badge">💖</span>
            <ChiikawaSVG character="usagi" size={68} className="animate-bounce-gentle" />
          </div>
          <div className="mascot-dialog-bubble">
            <p>{DIALOG_LINES[dialogIdx]}</p>
          </div>
        </div>

        {/* 4. Bottom Left Love Counter Widget */}
        <div className="game-love-counter-chip animate-slide-up">
          <span className="love-chip-icon">💖</span>
          <div className="love-chip-content">
            <small>Đếm Ngày Yêu Nhau</small>
            <strong>{loveDays.toLocaleString()} <span>ngày</span></strong>
          </div>
        </div>

        {/* 5. Bottom Right Building Hover Details Tooltip */}
        {hoveredBuilding && (
          <div className="building-hover-hud animate-slide-up">
            <span className="hud-badge" style={{ backgroundColor: hoveredBuilding.color }}>
              {hoveredBuilding.tag}
            </span>
            <h4>{hoveredBuilding.name}</h4>
            <p>{hoveredBuilding.subtitle}</p>
            <span className="hud-tap-prompt">Nhấp để bước vào →</span>
          </div>
        )}
      </div>
    </div>
  )
}
