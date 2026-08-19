import { useState, useRef, useEffect, useCallback } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import { playChiikawaVoice } from '../../utils/chiikawaAudio'
import type { LocationId, MapBuilding, TransitionType } from '../types'
import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
  loveDays: number
}

interface BuildingActionDetail {
  character: ChiikawaCharacter
  charName: string
  actionLabel: string
  actionEmoji: string
  voiceChar: ChiikawaCharacter
  quote: string
  statsInfo: string
}

export const MAP_BUILDINGS: (MapBuilding & { action: BuildingActionDetail })[] = [
  {
    id: 'home',
    name: 'Nhà Của Chúng Mình',
    subtitle: 'Tổ Ấm & Hành Trình 10 Ngày Sẵn Sàng',
    icon: '🏡',
    img: './assets/buildings/house.png',
    transition: 'heart',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.65)',
    tag: 'Tổ Ấm',
    size: 130,
    x: 14.0,
    y: 28.0,
    action: {
      character: 'chiikawa',
      charName: 'Chiikawa',
      actionLabel: 'Đang tưới hoa & đón bạn về nhà',
      actionEmoji: '🌷',
      voiceChar: 'chiikawa',
      quote: 'Chào mừng Dũng & Em Yêu về tổ ấm! Cùng nhau rèn luyện thật chăm chỉ nhé~',
      statsInfo: 'Trạng thái chuẩn bị: 10 Ngày Sẵn Sàng & Đếm ngày yêu'
    }
  },
  {
    id: 'gym',
    name: 'Nhà Tập (Gym & Dojo)',
    subtitle: 'Luyện Tập Thể Lực & Đẩy Tạ Hết Mình',
    icon: '🏋️',
    img: './assets/buildings/gym.png',
    transition: 'cloud',
    color: '#ffd166',
    glow: 'rgba(255,209,102,0.65)',
    tag: 'Thể Lực',
    size: 120,
    x: 32.0,
    y: 22.0,
    action: {
      character: 'usagi',
      charName: 'Usagi HLV',
      actionLabel: 'Đang đẩy tạ siêu hăng say!',
      actionEmoji: '⚡🏋️',
      voiceChar: 'usagi',
      quote: 'Ya-haaa! Đẩy tạ 100% sức lực để chuẩn bị cơ bắp đi biển Nha Trang nào!',
      statsInfo: 'Chế độ luyện tập: HIIT, Tạ, Cardio & Bụng săn chắc'
    }
  },
  {
    id: 'water',
    name: 'Đài Uống Nước',
    subtitle: 'Theo Dõi Bù Nước & Điện Giải',
    icon: '⛲',
    img: './assets/buildings/water.png',
    transition: 'water',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.65)',
    tag: 'Bù Nước',
    size: 114,
    x: 52.0,
    y: 19.0,
    action: {
      character: 'hachiware',
      charName: 'Hachiware',
      actionLabel: 'Đang uống nước mát lạnh',
      actionEmoji: '💧🥤',
      voiceChar: 'hachiware',
      quote: 'Nanto kanaare! Uống đủ 2 - 2.5 lít nước mỗi ngày để da dẻ luôn căng mọng nhé!',
      statsInfo: 'Mục tiêu: 2,500ml/ngày · Bù nước điện giải đúng cữ'
    }
  },
  {
    id: 'journal',
    name: 'Thư Viện Nhật Ký',
    subtitle: 'Cảm Xúc, Suy Ngẫm & Ký Ức Đôi Ta',
    icon: '📖',
    img: './assets/buildings/library.png',
    transition: 'book',
    color: '#cdb4db',
    glow: 'rgba(205,180,219,0.65)',
    tag: 'Nhật Ký',
    size: 126,
    x: 69.0,
    y: 23.0,
    action: {
      character: 'hachiware',
      charName: 'Hachiware Học Giả',
      actionLabel: 'Đang đọc sách & ghi nhật ký',
      actionEmoji: '👓📜',
      voiceChar: 'hachiware',
      quote: 'Mỗi ngày trôi qua đều là một trang nhật ký tình yêu tuyệt đẹp của 2 bạn!',
      statsInfo: 'Nhật ký cảm xúc & Lời nhắn gửi mỗi ngày'
    }
  },
  {
    id: 'album',
    name: 'Album Kỷ Niệm',
    subtitle: 'Bộ Sưu Tập Ảnh & Khoảnh Khắc Hẹn Hò',
    icon: '📸',
    img: './assets/buildings/album.png',
    transition: 'camera',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.65)',
    tag: 'Ảnh Kỷ Niệm',
    size: 126,
    x: 84.0,
    y: 28.0,
    action: {
      character: 'chiikawa',
      charName: 'Chiikawa Nhiếp Ảnh',
      actionLabel: 'Đang chụp ảnh & lưu giữ kỷ niệm',
      actionEmoji: '🎈✨',
      voiceChar: 'chiikawa',
      quote: 'Cười lên nào! Tách! Tấm ảnh này của Dũng & Em Yêu đẹp quá đi à~',
      statsInfo: 'Thư viện hình ảnh & Dấu mốc kỷ niệm'
    }
  },
  {
    id: 'sleep',
    name: 'Trung Tâm Giấc Ngủ',
    subtitle: 'Theo Dõi Giấc Ngủ & Chu Kỳ 90 Phút',
    icon: '🌙',
    img: './assets/buildings/sleep.png',
    transition: 'moon',
    color: '#7b68ee',
    glow: 'rgba(123,104,238,0.65)',
    tag: 'Giấc Ngủ',
    size: 128,
    x: 13.0,
    y: 56.0,
    action: {
      character: 'kurimanju',
      charName: 'Kurimanju',
      actionLabel: 'Đang ngủ say trên giường mây',
      actionEmoji: '💤🌙',
      voiceChar: 'kurimanju',
      quote: 'Haaaa~ Ngủ đúng 5 chu kỳ 90 phút (7.5 tiếng) để phục hồi 100% năng lượng nhé.',
      statsInfo: 'Phân tích chu kỳ REM & Âm thanh ru ngủ thiên nhiên'
    }
  },
  {
    id: 'quests',
    name: 'Quảng Trường Quest',
    subtitle: 'Danh Sách Nhiệm Vụ & Thói Quen Hôm Nay',
    icon: '🎪',
    img: './assets/buildings/quest.png',
    transition: 'cloud',
    color: '#e0aa4d',
    glow: 'rgba(224,170,77,0.65)',
    tag: 'Nhiệm Vụ',
    size: 106,
    x: 50.0,
    y: 38.0,
    action: {
      character: 'rakko',
      charName: 'Sư Phụ Rakko',
      actionLabel: 'Đang kiểm tra checklist nhiệm vụ',
      actionEmoji: '⭐🗡️',
      voiceChar: 'rakko',
      quote: 'Yoshi! Hoàn thành 100% checklist hôm nay để tích thêm sao và đá quý!',
      statsInfo: 'Nhiệm vụ hàng ngày & Thói quen tích cực'
    }
  },
  {
    id: 'market',
    name: 'Chợ Nhỏ Dinh Dưỡng',
    subtitle: 'Nhật Ký Bữa Ăn & Macro Sạch',
    icon: '🛒',
    img: './assets/buildings/market.png',
    transition: 'cloud',
    color: '#38b283',
    glow: 'rgba(56,178,131,0.65)',
    tag: 'Dinh Dưỡng',
    size: 120,
    x: 74.0,
    y: 47.0,
    action: {
      character: 'momonga',
      charName: 'Momonga',
      actionLabel: 'Đang chọn trái cây & rau củ tươi',
      actionEmoji: '🍓🥕',
      voiceChar: 'momonga',
      quote: 'Nhìn đống dâu tây tươi này xem! Ăn đủ protein và vitamin để giữ dáng nha!',
      statsInfo: 'Theo dõi Calo, Đạm, Xơ & Bữa ăn dinh dưỡng'
    }
  },
  {
    id: 'restaurant',
    name: 'Nhà Hàng Hẹn Hò',
    subtitle: 'Không Gian Bữa Tối Lãng Mạn 2 Người',
    icon: '🍷',
    img: './assets/buildings/restaurant.png',
    transition: 'heart',
    color: '#e57385',
    glow: 'rgba(229,115,133,0.65)',
    tag: 'Hẹn Hò',
    size: 130,
    x: 25.0,
    y: 76.0,
    action: {
      character: 'chiikawa',
      charName: 'Chiikawa & Usagi',
      actionLabel: 'Đang thưởng thức bữa tối lãng mạn',
      actionEmoji: '🕯️🍝',
      voiceChar: 'chiikawa',
      quote: 'Bữa tối dưới ánh nến lung linh dành riêng cho Dũng & Em Yêu!',
      statsInfo: 'Queen Ann Sky Lounge & Gợi ý quán ăn Nha Trang'
    }
  },
  {
    id: 'settings',
    name: 'Tòa Thị Chính',
    subtitle: 'Cài Đặt, Mã PIN Bảo Mật & Dữ Liệu',
    icon: '🏛️',
    img: './assets/buildings/townhall.png',
    transition: 'gear',
    color: '#a8dadc',
    glow: 'rgba(168,218,220,0.65)',
    tag: 'Hệ Thống',
    size: 140,
    x: 48.0,
    y: 79.0,
    action: {
      character: 'rakko',
      charName: 'Thị Trưởng Rakko',
      actionLabel: 'Quản lý thị trấn & bảo mật',
      actionEmoji: '🔒📜',
      voiceChar: 'rakko',
      quote: 'Mọi dữ liệu tình yêu của 2 bạn đều được bảo mật an toàn bằng mã PIN!',
      statsInfo: 'Bảo mật riêng tư, Sao lưu dữ liệu & Giao diện'
    }
  },
  {
    id: 'airport',
    name: 'Sân Bay Quốc Tế',
    subtitle: 'Đếm Ngược Chuyến Bay Nha Trang 27/08',
    icon: '✈️',
    img: './assets/buildings/airport.png',
    transition: 'plane',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.65)',
    tag: 'Chuyến Bay',
    size: 136,
    x: 71.0,
    y: 70.0,
    action: {
      character: 'usagi',
      charName: 'Cơ Trưởng Usagi',
      actionLabel: 'Đang chuẩn bị cất cánh 27/08!',
      actionEmoji: '🛫🌴',
      voiceChar: 'usagi',
      quote: 'Uraaaa! Hành lý đã sẵn sàng, sắp bay đến thiên đường biển Nha Trang rồi!',
      statsInfo: 'Vé máy bay, Hành lý & Lịch trình khởi hành'
    }
  },
  {
    id: 'beach',
    name: 'Bãi Biển Nha Trang',
    subtitle: 'Tour 3 Đảo, Lặn Biển & Điểm Hẹn Biển Xanh',
    icon: '🏖️',
    img: './assets/buildings/beach.png',
    transition: 'water',
    color: '#4ee1aa',
    glow: 'rgba(78,225,170,0.65)',
    tag: 'Nha Trang',
    size: 136,
    x: 88.0,
    y: 74.0,
    action: {
      character: 'chiikawa',
      charName: 'Chiikawa Du Hí',
      actionLabel: 'Đang tắm nắng & uống nước dừa',
      actionEmoji: '🥥🏄',
      voiceChar: 'chiikawa',
      quote: 'Biển Nha Trang xanh ngắt, cát trắng mịn đang chờ đón 2 bạn nè!',
      statsInfo: 'Tour Hòn Mun, Mini Beach, Làng Chài & Viện Hải Dương Học'
    }
  }
]

const DIALOG_LINES = [
  'Chào mừng Dũng & Em Yêu đến với thị trấn Little Days! ✨',
  'Hôm nay cùng hoàn thành mục tiêu để sẵn sàng cho Nha Trang 27/08 nhé! 🌴',
  'Chiikawa & Usagi luôn bên cạnh cổ vũ tình yêu của 2 đứa mình! 💖',
  'Nhấn vào bất kỳ địa điểm nào trên bản đồ để khám phá nha! 🚀'
]

export function WorldMap({ onSelectBuilding, loveDays }: Props) {
  const [activeModalBuilding, setActiveModalBuilding] = useState<(typeof MAP_BUILDINGS)[0] | null>(null)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [mascotBounce, setMascotBounce] = useState(false)
  const [activeVoicePhrase, setActiveVoicePhrase] = useState<string | null>(null)

  // Zoom & Pan System
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const initialPanRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle Zoom In / Out
  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.max(0.75, Math.min(2.4, prev + delta))
      audioSystem.playClick('soft')
      return next
    })
  }

  const handleResetZoom = () => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    audioSystem.playClick('soft')
  }

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.12 : -0.12
    setZoom((prev) => Math.max(0.75, Math.min(2.4, prev + delta)))
  }

  // Pan Gestures (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    initialPanRef.current = { ...pan }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({
      x: initialPanRef.current.x + dx,
      y: initialPanRef.current.y + dy
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Click on Building -> Focus Camera & Play Voice
  const handleBuildingClick = (b: (typeof MAP_BUILDINGS)[0]) => {
    const phrase = playChiikawaVoice(b.action.voiceChar)
    setActiveVoicePhrase(`${b.action.charName}: "${phrase}"`)
    setActiveModalBuilding(b)

    // Smooth focus pan
    const targetX = (50 - b.x) * 8
    const targetY = (50 - b.y) * 6
    setPan({ x: targetX, y: targetY })
    setZoom(1.35)

    setTimeout(() => setActiveVoicePhrase(null), 3000)
  }

  const handleEnterBuilding = () => {
    if (!activeModalBuilding) return
    const b = activeModalBuilding
    audioSystem.playClick('enter')
    setActiveModalBuilding(null)
    onSelectBuilding(b.id, b.transition)
  }

  const handleMascotClick = () => {
    const phrase = playChiikawaVoice('usagi')
    setMascotBounce(true)
    setDialogIdx((prev) => (prev + 1) % DIALOG_LINES.length)
    setActiveVoicePhrase(`Usagi & Chiikawa: "${phrase}"`)
    setTimeout(() => {
      setMascotBounce(false)
      setActiveVoicePhrase(null)
    }, 2500)
  }

  return (
    <div
      className="game-world-map-viewport"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {/* ══════ LIVING ENVIRONMENT: Atmospheric Particles ══════ */}
      <div className="living-world-ambient-layer">
        <div className="ambient-clouds-drift cloud-1" />
        <div className="ambient-clouds-drift cloud-2" />
        <div className="ambient-sakura-particles">
          <span className="petal pt1">🌸</span>
          <span className="petal pt2">✨</span>
          <span className="petal pt3">🌸</span>
          <span className="petal pt4">🍃</span>
          <span className="petal pt5">✨</span>
          <span className="petal pt6">🌸</span>
        </div>
        <div className="ambient-butterflies">
          <span className="butterfly b1">🦋</span>
          <span className="butterfly b2">🦋</span>
        </div>
      </div>

      {/* ══════ MAIN INTERACTIVE MAP CANVAS (Zoom & Pan Layer) ══════ */}
      <div
        className="game-map-canvas"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* 1. Clean High-Res Terrain Background */}
        <img
          src="./assets/game_terrain.jpg"
          alt="Little Days Town Map"
          className="map-terrain-background"
          draggable={false}
        />

        {/* Dynamic Water & Waves Overlay */}
        <div className="terrain-water-shimmer" />
        <div className="beach-waves-animation" />

        {/* 2. Pure 3D Isometric Buildings with Living Character Actions */}
        {MAP_BUILDINGS.map((b) => {
          const isSelected = activeModalBuilding?.id === b.id

          return (
            <div
              key={b.id}
              className={`map-building-entity ${isSelected ? 'entity-selected' : ''}`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                '--bldg-theme-color': b.color,
                '--bldg-theme-glow': b.glow
              } as React.CSSProperties}
              onClick={(e) => {
                e.stopPropagation()
                handleBuildingClick(b)
              }}
              title={`${b.name} - Nhấn để xem`}
            >
              {/* Chimney Smoke Animation */}
              {(b.id === 'home' || b.id === 'gym' || b.id === 'restaurant' || b.id === 'journal') && (
                <div className="chimney-smoke-puff">
                  <span className="smoke s1" />
                  <span className="smoke s2" />
                </div>
              )}

              {/* 3D Building Sprite */}
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

              {/* Animated Character Activity at Location */}
              <div className="building-live-character-badge animate-bounce-gentle">
                <ChiikawaSVG character={b.action.character} size={34} />
                <span className="character-action-bubble">{b.action.actionEmoji}</span>
              </div>
            </div>
          )
        })}

        {/* 3. Central Plaza Mascots (Chiikawa & Usagi) */}
        <div
          className={`central-mascots-group ${mascotBounce ? 'mascots-excited' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            handleMascotClick()
          }}
          title="Bé Chiikawa & Usagi (Nhấn để trò chuyện)"
        >
          <div className="mascot-pair">
            <ChiikawaSVG character="chiikawa" size={76} className="animate-bounce-gentle" />
            <span className="mascot-heart-badge">💖</span>
            <ChiikawaSVG character="usagi" size={76} className="animate-bounce-gentle" />
          </div>
          <div className="mascot-dialog-bubble">
            <p>{DIALOG_LINES[dialogIdx]}</p>
          </div>
        </div>
      </div>

      {/* ══════ MAP OVERLAY HUD (Fixed UI Controls) ══════ */}

      {/* 1. Zoom Controls (Top Right) */}
      <div className="map-zoom-hud interactive-control">
        <button className="zoom-btn" onClick={() => handleZoom(0.25)} title="Phóng to">+</button>
        <span className="zoom-level-text">{Math.round(zoom * 100)}%</span>
        <button className="zoom-btn" onClick={() => handleZoom(-0.25)} title="Thu nhỏ">-</button>
        <button className="zoom-reset-btn" onClick={handleResetZoom} title="Đặt lại góc nhìn">🎯</button>
      </div>

      {/* 2. Active Character Voice Floating Notification */}
      {activeVoicePhrase && (
        <div className="voice-floating-chip animate-slide-up interactive-control">
          <span className="voice-sound-icon">🔊</span>
          <strong>{activeVoicePhrase}</strong>
        </div>
      )}

      {/* 3. Bottom Left Love Counter Widget */}
      <div className="game-love-counter-chip animate-slide-up interactive-control">
        <span className="love-chip-icon">💖</span>
        <div className="love-chip-content">
          <small>Đếm Ngày Yêu Nhau</small>
          <strong>{loveDays.toLocaleString()} <span>ngày</span></strong>
        </div>
      </div>

      {/* 4. RPG Style Building Quest Inspection Card (When clicked) */}
      {activeModalBuilding && (
        <div className="rpg-inspect-backdrop animate-fade-in" onClick={() => setActiveModalBuilding(null)}>
          <div className="rpg-inspect-card animate-pop" onClick={(e) => e.stopPropagation()}>
            <button className="rpg-card-close-btn" onClick={() => setActiveModalBuilding(null)}>✕</button>

            <div className="rpg-card-top">
              <div className="rpg-avatar-box" style={{ background: activeModalBuilding.glow }}>
                <img src={activeModalBuilding.img} alt={activeModalBuilding.name} className="rpg-thumb-img" />
              </div>
              <div className="rpg-info-meta">
                <div className="rpg-badge-row">
                  <span className="rpg-tag-chip" style={{ backgroundColor: activeModalBuilding.color }}>
                    {activeModalBuilding.tag}
                  </span>
                  <span className="rpg-companion-tag">
                    <ChiikawaSVG character={activeModalBuilding.action.character} size={20} />
                    <span>{activeModalBuilding.action.charName}</span>
                  </span>
                </div>
                <h3 className="rpg-building-title">{activeModalBuilding.name}</h3>
                <p className="rpg-building-subtitle">{activeModalBuilding.subtitle}</p>
              </div>
            </div>

            {/* Character Quote & Activity */}
            <div className="rpg-character-dialog-box">
              <div className="rpg-char-speech">
                <span className="rpg-quote-icon">💬</span>
                <p>"{activeModalBuilding.action.quote}"</p>
              </div>
              <div className="rpg-action-status-tag">
                <span>{activeModalBuilding.action.actionEmoji}</span>
                <small>{activeModalBuilding.action.actionLabel}</small>
              </div>
            </div>

            {/* Feature Function Details */}
            <div className="rpg-feature-details-box">
              <span className="feature-label">⚡ Chức Năng Tracker:</span>
              <p className="feature-desc">{activeModalBuilding.action.statsInfo}</p>
            </div>

            {/* Actions */}
            <div className="rpg-actions-footer">
              <button className="rpg-close-btn" onClick={() => setActiveModalBuilding(null)}>
                Đóng
              </button>
              <button
                className="rpg-enter-action-btn"
                style={{ backgroundColor: activeModalBuilding.color }}
                onClick={handleEnterBuilding}
              >
                <span>🌟 Bước Vào Khám Phá</span>
                <span className="rpg-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
