import { useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { GameIcon } from '../../components/common/GameIcons'
import { audioSystem } from '../systems/GameAudioSystem'
import { playChiikawaVoice } from '../../utils/chiikawaAudio'
import { getPlayerByCharacter } from '../../domain/couple/selectors'
import type { CoupleProfile } from '../../domain/couple/types'
import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'
import type { LocationId } from '../types'

type Props = {
  onEnterGame: (character: 'chiikawa' | 'usagi', targetLocation?: LocationId | 'map') => void
  profile?: CoupleProfile
}

interface CharacterCard {
  id: ChiikawaCharacter
  name: string
  jpName: string
  roleTitle: string
  genderTag: string
  color: string
  glow: string
  isLocked: boolean
  desc: string
  features: string[]
  quote: string
}

function getCharacterCards(profile?: CoupleProfile): CharacterCard[] {
  const pChiikawa = getPlayerByCharacter(profile, 'chiikawa')
  const pUsagi = getPlayerByCharacter(profile, 'usagi')

  return [
    {
      id: 'chiikawa',
      name: `${pChiikawa.nickname} (Chiikawa)`,
      jpName: 'ちいかわ',
      roleTitle: `${pChiikawa.roleTitle || 'Đồng hành yêu thương'} · ${pChiikawa.nickname}`,
      genderTag: pChiikawa.genderTag || 'BẠN ĐỒNG HÀNH',
      color: '#ff8da1',
      glow: 'rgba(255, 141, 161, 0.4)',
      isLocked: false,
      desc: `Đại diện cho ${pChiikawa.nickname}. Tập trung rèn luyện thể lực, thói quen tốt và chăm sóc tổ ấm mỗi ngày.`,
      features: [
        '🏋️ Rèn luyện thể lực Gym / Dojo & Tạ mỗi ngày',
        '💧 Theo dõi lượng nước 2,500ml & Điện giải',
        '🎯 Checklist 10 Ngày Sẵn Sàng',
        '💖 Đếm ngày yêu thương và gắn kết'
      ],
      quote: `Waaah! Hãy cùng ${pChiikawa.nickname} rèn luyện thật chăm chỉ và kiên định mỗi ngày nhé!`
    },
    {
      id: 'usagi',
      name: `${pUsagi.nickname} (Usagi)`,
      jpName: 'うさぎ',
      roleTitle: `${pUsagi.roleTitle || 'Năng Lượng Siêu Cấp'} · ${pUsagi.nickname}`,
      genderTag: pUsagi.genderTag || 'BẠN ĐỒNG HÀNH',
      color: '#ffd166',
      glow: 'rgba(255, 209, 102, 0.4)',
      isLocked: false,
      desc: `Đại diện cho ${pUsagi.nickname}. Tập trung lưu giữ khoảnh khắc ngọt ngào, cảm xúc nhật ký và khám phá ẩm thực.`,
      features: [
        '📸 Bộ sưu tập Album Ảnh Hẹn Hò & Dấu Mốc Kỷ Niệm',
        '📖 Thư viện Nhật Ký Cảm Xúc & Lời Nhắn Yêu Thương',
        '🍷 Lên lịch hẹn hò và địa điểm yêu thích',
        '🌙 Theo dõi Giấc Ngủ 90 Phút & Âm thanh thư giãn'
      ],
      quote: `Ya-haaa! Uraaaa! Cùng ${pUsagi.nickname} sẵn sàng cho những chuyến phiêu lưu tuyệt vời nào!`
    },
  {
    id: 'hachiware',
    name: 'Hachiware',
    jpName: 'ハチワレ',
    roleTitle: 'Mèo Tai Xanh Lạc Quan',
    genderTag: 'NHÂN VẬT BỔ TRỢ',
    color: '#67b7ff',
    glow: 'rgba(103, 183, 255, 0.4)',
    isLocked: true,
    desc: 'Nhân vật bổ trợ chuyên về Thói quen học tập, đọc sách và kết nối bạn bè.',
    features: ['📚 Chế độ Pomodoro', '🎵 Trình phát nhạc Lo-fi'],
    quote: 'Nanto kanaare! (Mọi chuyện rồi sẽ ổn thôi!)'
  },
  {
    id: 'momonga',
    name: 'Momonga',
    jpName: 'モモンガ',
    roleTitle: 'Sóc Bay Bông Xù Sang Chảnh',
    genderTag: 'NHÂN VẬT BỔ TRỢ',
    color: '#cdb4db',
    glow: 'rgba(205, 180, 219, 0.4)',
    isLocked: true,
    desc: 'Nhân vật quản lý Thực đơn Dinh Dưỡng, Ăn sạch & Đếm Calo chi tiết.',
    features: ['🥗 Công thức nấu ăn Healthy', '🍎 Phân tích Macro'],
    quote: 'Khen tôi đi! Hôm nay tôi đã chọn thực đơn rất chuẩn!'
  },
  {
    id: 'kurimanju',
    name: 'Kurimanju',
    jpName: 'くりまんじゅう',
    roleTitle: 'Rái Cá Thư Thái Trà Chiều',
    genderTag: 'NHÂN VẬT BỔ TRỢ',
    color: '#dfb15b',
    glow: 'rgba(223, 177, 91, 0.4)',
    isLocked: true,
    desc: 'Chuyên gia phục hồi năng lượng, thư giãn thiền định và giải tỏa căng thẳng.',
    features: ['🍵 Podcast thư giãn', '🌿 Hướng dẫn hít thở sâu'],
    quote: 'Haaaa~ Một ngụm trà ấm là xua tan mọi mỏi mệt.'
  },
  {
    id: 'rakko',
    name: 'Rakko',
    jpName: 'ラッコ',
    roleTitle: 'Sư Phụ Kiếm Sĩ Quản Trị',
    genderTag: 'NHÂN VẬT BỔ TRỢ',
    color: '#4ee1aa',
    glow: 'rgba(78, 225, 170, 0.4)',
    isLocked: true,
    desc: 'Người bảo hộ an ninh dữ liệu, khóa mã PIN và thống kê cấp độ thành tựu.',
    features: ['🏆 Bảng xếp hạng thành tựu', '🔐 Két sắt bảo mật dữ liệu'],
    quote: 'Kỷ luật và kiên trì là chìa khóa của mọi chiến thắng!'
  }
]
}

export function SplashScreen({ onEnterGame, profile }: Props) {
  const [screenStage, setScreenStage] = useState<'title' | 'select'>('title')
  const [selectedChar, setSelectedChar] = useState<'chiikawa' | 'usagi'>('chiikawa')
  const [targetLocation, setTargetLocation] = useState<LocationId | 'map'>('map')
  const [targetTitle, setTargetTitle] = useState<string>('Bản Đồ Thế Giới')
  const [lockedNotice, setLockedNotice] = useState<string | null>(null)
  const [mascotVoiceCheer, setMascotVoiceCheer] = useState<string | null>(null)

  const characters = getCharacterCards(profile)

  // Handle clicking on any interactive hotspot in the opening art
  const handleTriggerHotspot = (loc: LocationId | 'map', label: string) => {
    audioSystem.initAudioContext()
    audioSystem.playClick('pop')
    setTargetLocation(loc)
    setTargetTitle(label)
    setScreenStage('select')
  }

  // Mascots interactive voice
  const handleMascotsCheer = (e: React.MouseEvent) => {
    e.stopPropagation()
    audioSystem.initAudioContext()
    audioSystem.playClick('enter')
    playChiikawaVoice(selectedChar)
    const p1 = profile?.player1.nickname || 'Haru'
    const p2 = profile?.player2.nickname || 'Mai Trang'
    setMascotVoiceCheer(`💖 Ya-haa! ${p1} & ${p2} chúc bạn một ngày tràn đầy niềm vui!`)
    setTimeout(() => setMascotVoiceCheer(null), 3000)
  }

  const handleSelectCharacter = (char: CharacterCard) => {
    if (char.isLocked) {
      audioSystem.playClick('soft')
      setLockedNotice(`Nhân vật ${char.name} (${char.roleTitle}) hiện đang được phát triển trong bản cập nhật tiếp theo! ✨ Hãy chọn Chiikawa hoặc Usagi để trải nghiệm nhé!`)
      setTimeout(() => setLockedNotice(null), 3500)
      return
    }

    if (char.id === 'chiikawa' || char.id === 'usagi') {
      setSelectedChar(char.id)
      playChiikawaVoice(char.id)
    }
  }

  const handleConfirmStart = () => {
    audioSystem.playClick('enter')
    onEnterGame(selectedChar, targetLocation)
  }

  return (
    <div className="game-splash-screen animate-fade-in">
      {/* Parallax Landscape Background Layers */}
      <div className="splash-sky-layer" />
      <div className="splash-cloud-layer cloud-layer-1" />
      <div className="splash-cloud-layer cloud-layer-2" />

      {/* Volumetric Sunbeams & Sunlight Breath */}
      <div className="sunlight-god-rays" />

      {/* Floating Cherry Blossom & Sparkle Particles */}
      <div className="splash-particles-layer">
        <span className="particle p1">🌸</span>
        <span className="particle p2">✨</span>
        <span className="particle p3">🍃</span>
        <span className="particle p4">💖</span>
        <span className="particle p5">🌸</span>
        <span className="particle p6">✨</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
         STAGE 1: 16:9 INTERACTIVE LIVING MASTER TITLE SCREEN
         ══════════════════════════════════════════════════════════════════ */}
      {screenStage === 'title' && (
        <div className="splash-landscape-banner-wrap animate-slide-up">
          {/* Active Voice Bubble Notification on Mascots */}
          {mascotVoiceCheer && (
            <div className="title-mascot-voice-toast animate-bounce-gentle">
              <span>{mascotVoiceCheer}</span>
            </div>
          )}

          {/* Interactive Artwork Card Stage */}
          <div className="splash-banner-artwork-card living-title-stage">
            {/* Master Artwork Image */}
            <img
              src="./assets/opening_banner.png"
              alt="Little Days: 10-Day Readiness Adventure"
              className="splash-banner-img"
              draggable={false}
            />

            {/* ── LIVING DYNAMIC ANIMATIONS OVERLAY ── */}
            <div className="living-title-fx-layer">
              {/* Floating Hot Air Balloon in Sky */}
              <div className="fx-floating-balloon" title="Khinh khí cầu Little Days" />

              {/* Shimmering River Water Ripples under Stone Bridge */}
              <div className="fx-river-shimmer" />

              {/* Sunlight Lens Flare & Rainbow Prism */}
              <div className="fx-rainbow-glow" />

              {/* Sparkling Cherry Blossom Rain */}
              <div className="fx-sakura-rain">
                <span className="sakura-leaf sl1">🌸</span>
                <span className="sakura-leaf sl2">🌸</span>
                <span className="sakura-leaf sl3">✨</span>
                <span className="sakura-leaf sl4">🌸</span>
                <span className="sakura-leaf sl5">🍃</span>
              </div>
            </div>

            {/* ── INTERACTIVE CLICKABLE HOTSPOTS (Direct to Features via Character Select) ── */}
            <div className="title-interactive-hotspots-grid">
              {/* 1. Main Bottom Button: "Press A to Start Your Adventure!" */}
              <button
                className="title-hotspot-btn hotspot-start-adventure"
                onClick={() => handleTriggerHotspot('map', 'Bản Đồ Thị Trấn')}
                title="Bắt đầu chuyến phiêu lưu (Start Adventure)"
              >
                <span className="hotspot-pulse-ring" />
              </button>

              {/* 2. Signpost Board: "Plan" (Kế Hoạch & Quests) */}
              <button
                className="title-hotspot-btn hotspot-sign-plan"
                onClick={() => handleTriggerHotspot('quests', 'Kế Hoạch & Bảng Nhiệm Vụ')}
                title="Plan: Lập Kế Hoạch 10 Ngày & Checklist"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">📋 PLAN</span>
              </button>

              {/* 3. Signpost Board: "Practice" (Luyện Tập Gym Dojo) */}
              <button
                className="title-hotspot-btn hotspot-sign-practice"
                onClick={() => handleTriggerHotspot('gym', 'Luyện Tập Thể Lực & Gym')}
                title="Practice: Rèn Luyện Thể Lực & Đẩy Tạ"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">🏋️ PRACTICE</span>
              </button>

              {/* 4. Signpost Board: "Explore" (Khám Phá Biển Nha Trang) */}
              <button
                className="title-hotspot-btn hotspot-sign-explore"
                onClick={() => handleTriggerHotspot('beach', 'Khám Phá Tour 3 Đảo Nha Trang')}
                title="Explore: Khám Phá Bãi Biển Nha Trang"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">🧭 EXPLORE</span>
              </button>

              {/* 5. Signpost Board: "Grow" (Dinh Dưỡng & Ăn Uống) */}
              <button
                className="title-hotspot-btn hotspot-sign-grow"
                onClick={() => handleTriggerHotspot('market', 'Dinh Dưỡng Sạch & Bù Nước')}
                title="Grow: Dinh Dưỡng & Macro Sạch"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">🌱 GROW</span>
              </button>

              {/* 6. Bottom Right Button: "Settings" */}
              <button
                className="title-hotspot-btn hotspot-btn-settings"
                onClick={() => handleTriggerHotspot('settings', 'Cài Đặt & Quản Trị Hệ Thống')}
                title="Settings: Quản Trị Hệ Thống & Bảo Mật"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">⚙️ CÀI ĐẶT</span>
              </button>

              {/* 7. Bottom Right Button: "Diary" */}
              <button
                className="title-hotspot-btn hotspot-btn-diary"
                onClick={() => handleTriggerHotspot('journal', 'Thư Viện Nhật Ký Kỷ Niệm')}
                title="Diary: Viết Nhật Ký & Cảm Xúc Đôi Ta"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">📅 NHẬT KÝ</span>
              </button>

              {/* 8. Top Right: Airport "Chiikawa Air" */}
              <button
                className="title-hotspot-btn hotspot-airport"
                onClick={() => handleTriggerHotspot('airport', 'Sân Bay Khởi Hành Nha Trang 27/08')}
                title="Chiikawa Air: Đếm Ngược Chuyến Bay Nha Trang"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">✈️ SÂN BAY</span>
              </button>

              {/* 9. Left Cottage: "Nha Trang Island" Tổ Ấm */}
              <button
                className="title-hotspot-btn hotspot-cottage"
                onClick={() => handleTriggerHotspot('home', 'Tổ Ấm Yêu Thương Của Chúng Mình')}
                title="Nha Trang Island: Tổ Ấm Dũng & Em Yêu"
              >
                <span className="hotspot-pulse-ring" />
                <span className="hotspot-click-tag">🏡 TỔ ẤM</span>
              </button>

              {/* 10. Center Mascots (Chiikawa & Usagi) Interactive Cheer */}
              <div
                className="title-hotspot-mascots"
                onClick={handleMascotsCheer}
                title="Bấm vào Chiikawa & Usagi để tương tác!"
              >
                <span className="mascot-heart-float">💖</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
         STAGE 2: CHARACTER SELECTION & ROLE PERKS (Mandatory before entry)
         ══════════════════════════════════════════════════════════════════ */}
      {screenStage === 'select' && (
        <div className="character-select-scene animate-slide-up">
          <div className="select-header-box">
            <div className="select-target-pill">
              <span className="pill-dot">✦</span>
              <span>ĐIỂM ĐẾN TIẾP THEO: <strong>{targetTitle}</strong></span>
            </div>
            <h2 className="select-heading">Chọn Nhân Vật Đồng Hành Cùng Bạn</h2>
            <p className="select-sub">
              Mỗi nhân vật sẽ mang lại góc nhìn và đặc quyền theo dõi những tính năng chuyên biệt trong hành trình!
            </p>
          </div>

          {/* Locked Notice Alert Popup */}
          {lockedNotice && (
            <div className="locked-notice-banner animate-bounce-gentle">
              <GameIcon name="lock" size={16} color="#856404" />
              <p>{lockedNotice}</p>
            </div>
          )}

          {/* Characters Grid */}
          <div className="characters-selection-grid">
            {characters.map((char) => {
              const isSelected = selectedChar === char.id

              return (
                <div
                  key={char.id}
                  className={`char-select-card ${isSelected ? 'card-selected' : ''} ${char.isLocked ? 'card-locked' : 'card-active'}`}
                  style={{ '--char-color': char.color, '--char-glow': char.glow } as React.CSSProperties}
                  onClick={() => handleSelectCharacter(char)}
                >
                  {/* Lock Indicator or Selected Badge */}
                  {char.isLocked ? (
                    <div className="card-lock-badge">
                      <GameIcon name="lock" size={12} color="#ffd166" />
                      <small>Sắp ra mắt</small>
                    </div>
                  ) : isSelected ? (
                    <div className="card-active-check-badge">
                      <GameIcon name="star" size={12} />
                      <span>ĐANG CHỌN</span>
                    </div>
                  ) : null}

                  {/* Character Avatar */}
                  <div className="char-avatar-container">
                    <ChiikawaSVG
                      character={char.id}
                      size={char.isLocked ? 68 : 88}
                      className={isSelected ? 'animate-bounce-gentle' : ''}
                    />
                  </div>

                  {/* Character Meta Header */}
                  <div className="char-card-header">
                    <span className="char-gender-tag">{char.genderTag}</span>
                    <h3 className="char-card-name">
                      {char.name} <small>({char.jpName})</small>
                    </h3>
                    <span className="char-card-role">{char.roleTitle}</span>
                  </div>

                  {/* Character Description */}
                  <p className="char-card-desc">{char.desc}</p>

                  {/* Unique Role Features */}
                  <div className="char-features-list">
                    <span className="features-label">TÍNH NĂNG THEO DÕI:</span>
                    <ul>
                      {char.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dialogue Quote */}
                  <div className="char-quote-box">
                    <small>"{char.quote}"</small>
                  </div>

                  {/* Select Button */}
                  <button
                    className={`char-pick-btn ${isSelected ? 'btn-picked' : ''}`}
                    disabled={char.isLocked}
                  >
                    {char.isLocked
                      ? '🔒 Đang phát triển'
                      : isSelected
                      ? '✓ Đã chọn nhân vật này'
                      : 'Chọn nhân vật'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Action Row */}
          <div className="select-action-bar">
            <button className="select-back-btn" onClick={() => setScreenStage('title')}>
              ← Quay lại màn hình chính
            </button>
            <button className="select-confirm-btn animate-pop" onClick={handleConfirmStart}>
              <GameIcon name="star" size={18} />
              <span>TIẾP TỤC ĐẾN {targetTitle.toUpperCase()} →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
