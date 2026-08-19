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
    subtitle: 'Tình Yêu & Kế Hoạch 10 Ngày Sẵn Sàng',
    icon: '🏡',
    img: './assets/buildings/house.png',
    transition: 'heart',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.6)',
    tag: 'Tổ Ấm',
    size: 124,
    x: 14.0,
    y: 28.0
  },
  {
    id: 'gym',
    name: 'Nhà Tập (Gym & Dojo)',
    subtitle: 'Luyện Tập Thể Lực & Bài Tập Mỗi Ngày',
    icon: '🏋️',
    img: './assets/buildings/gym.png',
    transition: 'cloud',
    color: '#ffd166',
    glow: 'rgba(255,209,102,0.6)',
    tag: 'Thể Lực',
    size: 114,
    x: 32.0,
    y: 22.0
  },
  {
    id: 'water',
    name: 'Đài Uống Nước',
    subtitle: 'Theo Dõi Lượng Nước & Bù Điện Giải',
    icon: '⛲',
    img: './assets/buildings/water.png',
    transition: 'water',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.6)',
    tag: 'Bù Nước',
    size: 108,
    x: 52.0,
    y: 19.0
  },
  {
    id: 'journal',
    name: 'Thư Viện Nhật Ký',
    subtitle: 'Cảm Xúc, Suy Ngẫm & Ký Ức Đôi Ta',
    icon: '📖',
    img: './assets/buildings/library.png',
    transition: 'book',
    color: '#cdb4db',
    glow: 'rgba(205,180,219,0.6)',
    tag: 'Nhật Ký',
    size: 120,
    x: 69.0,
    y: 23.0
  },
  {
    id: 'album',
    name: 'Album Kỷ Niệm',
    subtitle: 'Bộ Sưu Tập Ảnh & Khoảnh Khắc Hẹn Hò',
    icon: '📸',
    img: './assets/buildings/album.png',
    transition: 'camera',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.6)',
    tag: 'Ảnh Kỷ Niệm',
    size: 120,
    x: 84.0,
    y: 28.0
  },
  {
    id: 'sleep',
    name: 'Trung Tâm Giấc Ngủ',
    subtitle: 'Theo Dõi Giấc Ngủ & Chu Kỳ 90 Phút',
    icon: '🌙',
    img: './assets/buildings/sleep.png',
    transition: 'moon',
    color: '#7b68ee',
    glow: 'rgba(123,104,238,0.6)',
    tag: 'Giấc Ngủ',
    size: 122,
    x: 13.0,
    y: 56.0
  },
  {
    id: 'quests',
    name: 'Quảng Trường Quest',
    subtitle: 'Danh Sách Nhiệm Vụ & Thói Quen Hôm Nay',
    icon: '🎪',
    img: './assets/buildings/quest.png',
    transition: 'cloud',
    color: '#e0aa4d',
    glow: 'rgba(224,170,77,0.6)',
    tag: 'Nhiệm Vụ',
    size: 100,
    x: 50.0,
    y: 38.0
  },
  {
    id: 'market',
    name: 'Chợ Nhỏ Dinh Dưỡng',
    subtitle: 'Nhật Ký Bữa Ăn & Macro Chuẩn',
    icon: '🛒',
    img: './assets/buildings/market.png',
    transition: 'cloud',
    color: '#38b283',
    glow: 'rgba(56,178,131,0.6)',
    tag: 'Dinh Dưỡng',
    size: 114,
    x: 74.0,
    y: 47.0
  },
  {
    id: 'restaurant',
    name: 'Nhà Hàng Hẹn Hò',
    subtitle: 'Không Gian Bữa Tối Lãng Mạn 2 Người',
    icon: '🍷',
    img: './assets/buildings/restaurant.png',
    transition: 'heart',
    color: '#e57385',
    glow: 'rgba(229,115,133,0.6)',
    tag: 'Hẹn Hò',
    size: 124,
    x: 25.0,
    y: 76.0
  },
  {
    id: 'settings',
    name: 'Tòa Thị Chính',
    subtitle: 'Cài Đặt, Mã PIN Bảo Mật & Dữ Liệu',
    icon: '🏛️',
    img: './assets/buildings/townhall.png',
    transition: 'gear',
    color: '#a8dadc',
    glow: 'rgba(168,218,220,0.6)',
    tag: 'Cài Đặt',
    size: 134,
    x: 48.0,
    y: 79.0
  },
  {
    id: 'airport',
    name: 'Sân Bay Quốc Tế',
    subtitle: 'Đếm Ngược Chuyến Bay Nha Trang 27/08',
    icon: '✈️',
    img: './assets/buildings/airport.png',
    transition: 'plane',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.6)',
    tag: 'Chuyến Bay',
    size: 130,
    x: 71.0,
    y: 70.0
  },
  {
    id: 'beach',
    name: 'Bãi Biển Nha Trang',
    subtitle: 'Tour 3 Đảo, Lặn Biển & Điểm Hẹn Biển Xanh',
    icon: '🏖️',
    img: './assets/buildings/beach.png',
    transition: 'water',
    color: '#4ee1aa',
    glow: 'rgba(78,225,170,0.6)',
    tag: 'Nha Trang',
    size: 130,
    x: 88.0,
    y: 74.0
  }
]

const DIALOG_LINES = [
  'Chào mừng Dũng & Em Yêu đến với thị trấn Little Days! ✨',
  'Hôm nay cùng hoàn thành mục tiêu để sẵn sàng cho Nha Trang 27/08 nhé! 🌴',
  'Chiikawa & Usagi luôn bên cạnh cổ vũ tình yêu của 2 đứa mình! 💖',
  'Nhấn vào bất kỳ địa điểm nào trên bản đồ để khám phá nha! 🚀'
]

export function WorldMap({ onSelectBuilding, loveDays }: Props) {
  const [activeModalBuilding, setActiveModalBuilding] = useState<MapBuilding | null>(null)
  const [hoveredBuilding, setHoveredBuilding] = useState<MapBuilding | null>(null)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [mascotBounce, setMascotBounce] = useState(false)

  const handleBuildingClick = (b: MapBuilding) => {
    audioSystem.playClick('pop')
    setActiveModalBuilding(b)
  }

  const handleEnterBuilding = () => {
    if (!activeModalBuilding) return
    const b = activeModalBuilding
    audioSystem.playClick('enter')
    setActiveModalBuilding(null)
    onSelectBuilding(b.id, b.transition)
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
        {/* 1. Clean High-Res Terrain Background (NO text, NO UI baked in) */}
        <img
          src="./assets/game_terrain.jpg"
          alt="Little Days Town Map"
          className="map-terrain-background"
          draggable={false}
        />

        {/* 2. Pure 3D Isometric Buildings (Clean, Transparent PNG, No permanent text) */}
        {MAP_BUILDINGS.map((b) => {
          const isHovered = hoveredBuilding?.id === b.id
          const isSelected = activeModalBuilding?.id === b.id

          return (
            <div
              key={b.id}
              className={`map-building-entity ${isHovered ? 'entity-hovered' : ''} ${isSelected ? 'entity-selected' : ''}`}
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
              title={b.name}
            >
              <div
                className="building-sprite-wrapper"
                style={{ width: `${b.size}px`, height: `${b.size}px` }}
              >
                <img
                  src={b.img}
                  alt={b.name}
                  className="building-3d-model"
                  draggable={false}
                />
                <div className="building-ambient-shadow" />
                <span className="building-hover-glow-indicator" />
              </div>
            </div>
          )
        })}

        {/* 3. Central Plaza Mascots (Chiikawa & Usagi) */}
        <div
          className={`central-mascots-group ${mascotBounce ? 'mascots-excited' : ''}`}
          onClick={handleMascotClick}
          title="Bé Chiikawa & Usagi vẫy chào bạn! (Nhấn để trò chuyện)"
        >
          <div className="mascot-pair">
            <ChiikawaSVG character="chiikawa" size={72} className="animate-bounce-gentle" />
            <span className="mascot-heart-badge">💖</span>
            <ChiikawaSVG character="usagi" size={72} className="animate-bounce-gentle" />
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

        {/* 5. Building Detail Modal (Appears only when user clicks a building) */}
        {activeModalBuilding && (
          <div className="building-dialog-backdrop animate-fade-in" onClick={() => setActiveModalBuilding(null)}>
            <div className="building-dialog-card animate-pop" onClick={(e) => e.stopPropagation()}>
              <button className="dialog-close-btn" onClick={() => setActiveModalBuilding(null)}>✕</button>

              <div className="dialog-header-row">
                <div className="dialog-icon-box" style={{ background: activeModalBuilding.glow }}>
                  <img src={activeModalBuilding.img} alt={activeModalBuilding.name} className="dialog-building-thumb" />
                </div>
                <div className="dialog-title-info">
                  <span className="dialog-tag-badge" style={{ backgroundColor: activeModalBuilding.color }}>
                    {activeModalBuilding.tag}
                  </span>
                  <h3>{activeModalBuilding.name}</h3>
                  <p>{activeModalBuilding.subtitle}</p>
                </div>
              </div>

              <div className="dialog-action-row">
                <button className="dialog-cancel-btn" onClick={() => setActiveModalBuilding(null)}>
                  Đóng
                </button>
                <button
                  className="dialog-enter-btn"
                  style={{ backgroundColor: activeModalBuilding.color }}
                  onClick={handleEnterBuilding}
                >
                  <span>Bước Vào Khám Phá</span>
                  <span className="enter-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
