import { useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import type { GameBuilding, LocationId, TransitionType } from '../types'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
}

export const WORLD_BUILDINGS: GameBuilding[] = [
  {
    id: 'home',
    name: 'Nhà Của Chúng Mình',
    subtitle: 'Tình yêu & Trạng thái 10 ngày',
    icon: '🏡',
    character: 'chiikawa',
    transition: 'heart',
    gridCol: 2,
    gridRow: 1,
    color: '#ff8da1',
    tag: 'Tổ Ấm'
  },
  {
    id: 'quests',
    name: 'Quảng Trường Quest',
    subtitle: 'Nhiệm vụ & Thói quen',
    icon: '🎪',
    character: 'hachiware',
    transition: 'cloud',
    gridCol: 3,
    gridRow: 1,
    color: '#67b7ff',
    tag: 'Mục Tiêu'
  },
  {
    id: 'gym',
    name: 'Nhà Tập (Gym & Dojo)',
    subtitle: 'Luyện tập & Đẩy tạ',
    icon: '🏋️',
    character: 'usagi',
    transition: 'cloud',
    gridCol: 4,
    gridRow: 1,
    color: '#ffd166',
    tag: 'Thể Lực'
  },
  {
    id: 'water',
    name: 'Đài Uống Nước',
    subtitle: 'Bù nước & Điện giải',
    icon: '⛲',
    character: 'hachiware',
    transition: 'water',
    gridCol: 1,
    gridRow: 2,
    color: '#4a90e2',
    tag: 'Bù Nước'
  },
  {
    id: 'sleep',
    name: 'Trung Tâm Giấc Ngủ',
    subtitle: 'Chu kỳ 90m & Ru ngủ',
    icon: '🌙',
    character: 'kurimanju',
    transition: 'moon',
    gridCol: 2,
    gridRow: 2,
    color: '#dfb15b',
    tag: 'Giấc Ngủ'
  },
  {
    id: 'journal',
    name: 'Thư Viện Nhật Ký',
    subtitle: 'Cảm xúc & Suy ngẫm',
    icon: '📖',
    character: 'chiikawa',
    transition: 'book',
    gridCol: 3,
    gridRow: 2,
    color: '#cdb4db',
    tag: 'Nhật Ký'
  },
  {
    id: 'album',
    name: 'Album Kỷ Niệm',
    subtitle: 'Ảnh chụp & Khoảnh khắc',
    icon: '📸',
    character: 'momonga',
    transition: 'camera',
    gridCol: 4,
    gridRow: 2,
    color: '#ff8da1',
    tag: 'Album'
  },
  {
    id: 'market',
    name: 'Chợ Nhỏ (Nutrition)',
    subtitle: 'Dinh dưỡng sạch & Bữa ăn',
    icon: '🛒',
    character: 'momonga',
    transition: 'cloud',
    gridCol: 1,
    gridRow: 3,
    color: '#38b283',
    tag: 'Ăn Uống'
  },
  {
    id: 'restaurant',
    name: 'Queen Ann Sky Lounge',
    subtitle: 'Bữa tối hẹn hò ngắm vịnh',
    icon: '🍷',
    character: 'chiikawa',
    transition: 'heart',
    gridCol: 2,
    gridRow: 3,
    color: '#e57385',
    tag: 'Hẹn Hò'
  },
  {
    id: 'airport',
    name: 'Sân Bay Quốc Tế',
    subtitle: 'Đếm ngược bay Nha Trang 27/08',
    icon: '✈️',
    character: 'rakko',
    transition: 'plane',
    gridCol: 3,
    gridRow: 3,
    color: '#67b7ff',
    tag: 'Chuyến Bay'
  },
  {
    id: 'beach',
    name: 'Bãi Biển Nha Trang',
    subtitle: 'Tour 3 Đảo & San hô',
    icon: '🏖️',
    character: 'usagi',
    transition: 'water',
    gridCol: 4,
    gridRow: 3,
    color: '#4ee1aa',
    tag: 'Du Lịch'
  },
  {
    id: 'settings',
    name: 'Tòa Thị Chính',
    subtitle: 'Mã PIN, Đồng bộ & Lịch',
    icon: '🏛️',
    character: 'rakko',
    transition: 'gear',
    gridCol: 1,
    gridRow: 1,
    color: '#a8dadc',
    tag: 'Cài Đặt'
  }
]

export function WorldMap({ onSelectBuilding }: Props) {
  const [selectedId, setSelectedId] = useState<LocationId | null>(null)
  const [activeSpeech, setActiveSpeech] = useState<string>('Chào mừng Dũng & Em Yêu đến với thị trấn Little Days! ✨')

  const handleBuildingClick = (building: GameBuilding) => {
    setSelectedId(building.id)
    audioSystem.playTransitionSFX(building.transition)
    setActiveSpeech(`Bé đang dẫn đường tới ${building.name}... ✨`)

    // Smooth camera focus & transition delay
    setTimeout(() => {
      onSelectBuilding(building.id, building.transition)
      setSelectedId(null)
    }, 450)
  }

  return (
    <div className="game-world-map-wrapper animate-fade-in">
      {/* Dynamic Town Sky & Nature Elements */}
      <div className="world-ambient-sky" />
      <div className="world-floating-particles">
        <span className="world-particle wp1">🌸</span>
        <span className="world-particle wp2">🍃</span>
        <span className="world-particle wp3">✨</span>
        <span className="world-particle wp4">🌸</span>
        <span className="world-particle wp5">💖</span>
      </div>

      {/* Center Town Mascot Duo Interactive Stage */}
      <div className="town-mascots-center">
        <div className="town-speech-bubble animate-pop">
          <p>{activeSpeech}</p>
          <span className="bubble-arrow" />
        </div>
        <div className="town-characters-row">
          <div className="town-char-sprite" onClick={() => audioSystem.playClick('pop')}>
            <ChiikawaSVG character="chiikawa" size={72} className="animate-bounce-gentle" />
          </div>
          <span className="town-love-badge">💕</span>
          <div className="town-char-sprite" onClick={() => audioSystem.playClick('pop')}>
            <ChiikawaSVG character="usagi" size={72} className="animate-bounce-gentle" />
          </div>
        </div>
      </div>

      {/* 12 Interactive Buildings Grid Map */}
      <div className="world-map-grid">
        {WORLD_BUILDINGS.map((b) => {
          const isSelected = selectedId === b.id

          return (
            <div
              key={b.id}
              className={`building-map-node ${isSelected ? 'selected-bounce' : ''}`}
              onClick={() => handleBuildingClick(b)}
              style={{
                borderColor: b.color
              }}
              title={`Khám phá ${b.name} (${b.subtitle})`}
            >
              {/* Building Top Tag */}
              <div className="building-node-top">
                <span className="building-tag" style={{ color: b.color, background: `${b.color}22` }}>
                  {b.tag}
                </span>
                <span className="building-char-avatar">
                  <ChiikawaSVG character={b.character} size={28} />
                </span>
              </div>

              {/* Building Big Icon & Glow */}
              <div className="building-icon-wrap" style={{ background: `radial-gradient(circle, ${b.color}28, transparent 70%)` }}>
                <span className="building-big-icon">{b.icon}</span>
              </div>

              {/* Building Text Details */}
              <div className="building-node-info">
                <strong className="building-title">{b.name}</strong>
                <small className="building-subtitle">{b.subtitle}</small>
              </div>

              <div className="building-hover-enter">
                <span>Vào →</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
