import { useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { GameIcon } from '../../components/common/GameIcons'
import { audioSystem } from '../systems/GameAudioSystem'
import { playChiikawaVoice } from '../../utils/chiikawaAudio'
import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'

type Props = {
  onEnterGame: (character: 'chiikawa' | 'usagi') => void
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

const CHARACTERS: CharacterCard[] = [
  {
    id: 'chiikawa',
    name: 'Chiikawa',
    jpName: 'ちいかわ',
    roleTitle: 'Chiến Binh Trắng · Dũng',
    genderTag: 'BẠN NAM (DŨNG)',
    color: '#ff8da1',
    glow: 'rgba(255, 141, 161, 0.4)',
    isLocked: false,
    desc: 'Đại diện cho Bạn Nam (Dũng). Tập trung rèn luyện thể lực cao độ, kỷ luật 10 ngày sẵn sàng và quản lý quỹ du lịch chuẩn bị cho kỳ nghỉ Nha Trang.',
    features: [
      '🏋️ Rèn luyện thể lực Gym / Dojo & Tạ mỗi ngày',
      '💧 Theo dõi lượng nước 2,500ml & Điện giải',
      '💰 Quản lý Quỹ MOMO du lịch 8 Triệu (Dũng góp 5tr)',
      '🎯 Checklist 10 Ngày Sẵn Sàng đi Nha Trang'
    ],
    quote: 'Waaah! Hãy cùng Dũng rèn luyện thật chăm chỉ và kiên định mỗi ngày nhé!'
  },
  {
    id: 'usagi',
    name: 'Usagi',
    jpName: 'うさぎ',
    roleTitle: 'Năng Lượng Siêu Cấp · Em Yêu',
    genderTag: 'BẠN NỮ (EM YÊU)',
    color: '#ffd166',
    glow: 'rgba(255, 209, 102, 0.4)',
    isLocked: false,
    desc: 'Đại diện cho Bạn Nữ (Em Yêu). Tập trung lưu giữ khoảnh khắc ngọt ngào, cảm xúc nhật ký, khám phá ẩm thực và lên kế hoạch hẹn hò lãng mạn.',
    features: [
      '📸 Bộ sưu tập Album Ảnh Hẹn Hò & Dấu Mốc Kỷ Niệm',
      '📖 Thư viện Nhật Ký Cảm Xúc & Lời Nhắn Yêu Thương',
      '🍷 Lên lịch Bữa Tối Lãng Mạn Queen Ann Sky Lounge',
      '🏖️ Khám phá Tour 3 Đảo Mini Beach, Hòn Mun & Viện Hải Dương Học',
      '🌙 Theo dõi Giấc Ngủ 90 Phút & Âm thanh thư giãn'
    ],
    quote: 'Ya-haaa! Uraaaa! Chuẩn bị tinh thần và trang phục đẹp để đi biển Nha Trang nào!'
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

export function SplashScreen({ onEnterGame }: Props) {
  const [screenStage, setScreenStage] = useState<'title' | 'select'>('title')
  const [selectedChar, setSelectedChar] = useState<'chiikawa' | 'usagi'>('chiikawa')
  const [lockedNotice, setLockedNotice] = useState<string | null>(null)

  const handleStartTitle = () => {
    audioSystem.initAudioContext()
    audioSystem.playClick('enter')
    setScreenStage('select')
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
    onEnterGame(selectedChar)
  }

  return (
    <div className="game-splash-screen animate-fade-in">
      {/* Parallax Landscape Background Layers */}
      <div className="splash-sky-layer" />
      <div className="splash-cloud-layer cloud-layer-1" />
      <div className="splash-cloud-layer cloud-layer-2" />

      {/* Volumetric Sunbeams */}
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
         STAGE 1: 16:9 LANDSCAPE TITLE SCREEN (Chiikawa Family Gathering)
         ══════════════════════════════════════════════════════════════════ */}
      {screenStage === 'title' && (
        <div className="splash-landscape-title-card animate-slide-up">
          <div className="title-top-badge">
            <GameIcon name="star" size={14} />
            <span>A COZY ANIME STORYBOOK ADVENTURE FOR OUR LOVE JOURNEY</span>
            <GameIcon name="star" size={14} />
          </div>

          <h1 className="title-game-brand">
            Little Days
          </h1>
          <h2 className="title-game-sub">
            THỊ TRẤN TÌNH YÊU & HÀNH TRÌNH NHA TRANG 27/08
          </h2>
          <p className="title-jp-banner">
            ちいかわの日々 · Dũng & Em Yêu Forever (Từ 11/06/2026)
          </p>

          {/* Entire Chiikawa Family Gathering Hero Illustration */}
          <div className="title-family-lineup">
            <div className="family-char-slot char-rakko" title="Sư Phụ Rakko">
              <ChiikawaSVG character="rakko" size={62} />
              <small>Rakko</small>
            </div>
            <div className="family-char-slot char-hachiware" title="Hachiware">
              <ChiikawaSVG character="hachiware" size={74} />
              <small>Hachiware</small>
            </div>
            <div className="family-char-slot char-chiikawa main-hero" title="Chiikawa (Dũng)">
              <ChiikawaSVG character="chiikawa" size={96} className="animate-bounce-gentle" />
              <span className="hero-crown-tag">👑 Dũng</span>
            </div>
            <div className="family-heart-connector">
              <GameIcon name="heart" size={28} />
            </div>
            <div className="family-char-slot char-usagi main-hero" title="Usagi (Em Yêu)">
              <ChiikawaSVG character="usagi" size={96} className="animate-bounce-gentle" />
              <span className="hero-crown-tag">👑 Em Yêu</span>
            </div>
            <div className="family-char-slot char-momonga" title="Momonga">
              <ChiikawaSVG character="momonga" size={74} />
              <small>Momonga</small>
            </div>
            <div className="family-char-slot char-kurimanju" title="Kurimanju">
              <ChiikawaSVG character="kurimanju" size={62} />
              <small>Kurimanju</small>
            </div>
          </div>

          {/* Action Button: Start Game */}
          <div className="title-action-box">
            <button className="title-start-btn animate-pop" onClick={handleStartTitle}>
              <GameIcon name="star" size={16} />
              <span>BẮT ĐẦU HÀNH TRÌNH (START GAME)</span>
              <span className="arrow-sym">→</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
         STAGE 2: CHARACTER SELECTION & ROLE ACCESS SCREEN
         ══════════════════════════════════════════════════════════════════ */}
      {screenStage === 'select' && (
        <div className="character-select-scene animate-slide-up">
          <div className="select-header-box">
            <span className="select-step-pill">BƯỚC 2 / 2 · CHỌN NHÂN VẬT ĐỒNG HÀNH</span>
            <h2 className="select-heading">Bạn Muốn Trải Nghiệm Cùng Ai?</h2>
            <p className="select-sub">
              Mỗi nhân vật sẽ mang lại góc nhìn và theo dõi những tính năng chuyên biệt trong hành trình chuẩn bị Nha Trang!
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
            {CHARACTERS.map((char) => {
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
                    <div className="card-active-badge">
                      <span>✓ ĐANG CHỌN</span>
                    </div>
                  ) : null}

                  {/* Character Avatar Box */}
                  <div className="card-avatar-stage">
                    <ChiikawaSVG character={char.id} size={isSelected ? 84 : 72} className="animate-bounce-gentle" />
                  </div>

                  {/* Character Metadata */}
                  <div className="card-meta-content">
                    <span className="card-gender-chip" style={{ backgroundColor: char.color }}>
                      {char.genderTag}
                    </span>
                    <h3 className="card-char-name">{char.name}</h3>
                    <small className="card-role-title">{char.roleTitle}</small>
                    <p className="card-desc-text">{char.desc}</p>

                    {/* Features List */}
                    {!char.isLocked && (
                      <ul className="card-features-list">
                        {char.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Confirmation Footer */}
          <div className="select-confirm-footer">
            <button className="select-back-btn" onClick={() => setScreenStage('title')}>
              ← Quay Lại
            </button>
            <button className="select-enter-btn animate-pop" onClick={handleConfirmStart}>
              <GameIcon name="star" size={16} />
              <span>BẮT ĐẦU VỚI {selectedChar.toUpperCase()}</span>
              <span className="arrow-sym">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Helper */}
      <footer className="splash-footer-note">
        <small>Mẹo: Trải nghiệm tốt nhất khi xoay ngang màn hình điện thoại hoặc máy tính · Âm thanh tự động kích hoạt 🎵</small>
      </footer>
    </div>
  )
}
