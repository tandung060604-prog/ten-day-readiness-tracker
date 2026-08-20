import { useEffect, useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { getCoupleDisplayName, getMilestoneCelebration } from '../../domain/couple/selectors'
import { DEMO_COUPLE_PROFILE } from '../../domain/couple/demoProfile'
import type { CoupleProfile } from '../../domain/couple/types'

interface Props {
  profile?: CoupleProfile
}

export function CoupleHeroCard({ profile = DEMO_COUPLE_PROFILE }: Props) {
  const [now, setNow] = useState(new Date())
  const [heartPulsing, setHeartPulsing] = useState(true)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const startDateStr = profile.relationshipStartDate || '2026-06-11'
  const startDate = new Date(`${startDateStr}T00:00:00`)
  const diffMs = now.getTime() - (isNaN(startDate.getTime()) ? Date.now() : startDate.getTime())
  const isAfterStart = diffMs >= 0
  const absDiff = Math.abs(diffMs)

  const totalDays = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000)

  const milestone = getMilestoneCelebration(totalDays)
  const coupleName = getCoupleDisplayName(profile)

  const p1 = profile.player1
  const p2 = profile.player2

  const handleHeartClick = () => {
    triggerHaptic('success')
    setHeartPulsing(false)
    setTimeout(() => setHeartPulsing(true), 100)
  }

  // Format date display (DD/MM/YYYY)
  const formattedStartDate = startDateStr.split('-').reverse().join('/')

  return (
    <section className="card couple-hero-card animate-fade-in">
      {/* Cozy Decorative Header */}
      <div className="couple-card-top-glow" />

      <div className="couple-header-greeting">
        <div className="couple-badge">
          <span>💖 Góc Nhỏ Riêng Tư Của {coupleName}</span>
        </div>
        <h2>Tổ ấm của {p1.nickname} &amp; {p2.nickname} ❤️</h2>
        <p className="couple-mission-story">
          Góc nhỏ bình yên dành riêng cho hai đứa mình. Ở đây, chúng mình cùng nhau rèn luyện thói quen tốt, theo dõi lộ trình sẵn sàng và đếm từng ngày hạnh phúc bên nhau.
          {milestone && (
            <span style={{ display: 'block', marginTop: '6px', color: '#e63956', fontWeight: 700 }}>
              🎉 {milestone.title} — {milestone.subtitle}
            </span>
          )}
        </p>
      </div>

      {/* Couple Avatars with Heart Connection (Real Photos of Couple) */}
      <div className="couple-avatars-row">
        {/* Player 1 - Dũng */}
        <div className="couple-avatar-wrap">
          <div className="couple-avatar-ring dung-ring">
            <img
              src="./assets/dung.jpg"
              alt={p1.nickname}
              className="couple-real-photo"
              onError={(e) => {
                // Fallback to character svg if image fails
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <strong className="couple-name">{p1.nickname}</strong>
          <span className="couple-role-tag">{p1.roleTitle || 'Người yêu thương em'}</span>
        </div>

        {/* Animated Heart Center */}
        <div className="couple-heart-connector" onClick={handleHeartClick} title="Chạm để gửi tim!">
          <div className={`heart-beat-orb ${heartPulsing ? 'beating' : ''}`}>
            ❤️
          </div>
          <span className="love-days-label">
            {isAfterStart ? 'ĐÃ YÊU NHAU' : `BẮT ĐẦU TỪ ${formattedStartDate}`}
          </span>
          <div className="love-days-count">
            {totalDays} <small>NGÀY</small>
          </div>
        </div>

        {/* Player 2 - Em Yêu */}
        <div className="couple-avatar-wrap">
          <div className="couple-avatar-ring love-ring">
            <img
              src="./assets/nguoiyeu.jpg"
              alt={p2.nickname}
              className="couple-real-photo"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <strong className="couple-name">{p2.nickname}</strong>
          <span className="couple-role-tag">{p2.roleTitle || 'Công chúa của anh'}</span>
        </div>
      </div>

      {/* Real-time Love Timer Breakdown */}
      <div className="love-timer-boxes-grid">
        <div className="love-time-box">
          <span className="time-val">{totalDays}</span>
          <span className="time-lbl">Ngày</span>
        </div>
        <div className="love-time-box">
          <span className="time-val">{String(hours).padStart(2, '0')}</span>
          <span className="time-lbl">Giờ</span>
        </div>
        <div className="love-time-box">
          <span className="time-val">{String(minutes).padStart(2, '0')}</span>
          <span className="time-lbl">Phút</span>
        </div>
        <div className="love-time-box">
          <span className="time-val">{String(seconds).padStart(2, '0')}</span>
          <span className="time-lbl">Giây</span>
        </div>
      </div>

      {/* Heartfelt Note: Vì Sao Anh Viết App Này Cho Em */}
      <div className="couple-heartfelt-letter-card">
        <div className="heartfelt-letter-header">
          <span className="letter-icon">💌</span>
          <h4>Vì Sao Anh Viết Ứng Dụng Này Dành Riêng Cho Em?</h4>
        </div>
        <p className="heartfelt-letter-body">
          "Gửi em yêu của anh! App này anh lập trình riêng tặng em để làm tổ ấm kỷ niệm của hai đứa mình. Anh muốn mỗi ngày đều có thể đồng hành, nhắc em uống đủ nước, ngủ đủ giấc, chăm sóc em từng ngày nhạy cảm và cùng nhau đếm ngược chuẩn bị chu đáo nhất cho chuyến đi biển Nha Trang 27/08. Yêu em thật nhiều! 💖✨"
        </p>
      </div>

      {/* Cozy Note */}
      <div className="couple-footer-whisper">
        <span>✨ Ngày kỷ niệm: <strong>{formattedStartDate}</strong> · Cùng nhau già đi! 🌿</span>
      </div>
    </section>
  )
}
