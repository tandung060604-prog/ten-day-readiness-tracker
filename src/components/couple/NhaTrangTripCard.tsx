import { useEffect, useState } from 'react'
import type { CoupleProfile } from '../../domain/couple/types'

const TOTAL_FUND = 8000000
const DUNG_FUND = 5000000

// Exact 6 romantic itinerary spots for Dũng & Lover in Nha Trang
const NHA_TRANG_DESTINATIONS = [
  {
    tag: '🏖️ Tour 3 Đảo',
    title: 'Mini Beach Nha Trang',
    desc: 'Thiên đường bãi biển riêng tư cát trắng mịn như nhung, nước biển trong vắt màu ngọc bích.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlight: 'Check-in xích đu biển & tắm nắng'
  },
  {
    tag: '🤿 Tour 3 Đảo',
    title: 'Đảo Hòn Mun',
    desc: 'Khu bảo tồn biển san hô đẹp nhất Việt Nam, cùng em lặn ngắm những rạn san hô kỳ ảo và đàn cá rực rỡ.',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    highlight: 'Lặn ngắm san hô đôi'
  },
  {
    tag: '🦞 Tour 3 Đảo',
    title: 'Làng Chài Bè Nổi',
    desc: 'Trải nghiệm nhà bè nổi giữa vịnh, tự tay chọn hải sản tươi sống và thưởng thức bữa trưa biển nồng nàn.',
    img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    highlight: 'Ăn hải sản tươi sống trên bè'
  },
  {
    tag: '🍸 Bữa Tối Lãng Mạn',
    title: 'Queen Ann Sky Lounge',
    desc: 'Lounge sang trọng trên tầng cao ngắm trọn vịnh Nha Trang lấp lánh ánh đèn đêm, cùng em nâng ly cocktail ngọt ngào.',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    highlight: 'Ngắm vịnh đêm & Dinner đôi'
  },
  {
    tag: '🎨 Nghệ Thuật Check-in',
    title: 'Làng Bức Họa Vĩnh Trường',
    desc: 'Những bức tranh tường 3D sống động về cuộc sống ngư dân miền biển, lưu giữ bộ ảnh kỷ niệm thanh xuân của 2 đứa.',
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    highlight: 'Chụp ảnh kỷ niệm ngọt ngào'
  },
  {
    tag: '🐠 Khám Phá Đại Dương',
    title: 'Viện Hải Dương Học',
    desc: 'Thủy cung cổ kính trăm tuổi với đường hầm kính sinh vật biển khổng lồ, rùa biển và những đàn cá đại dương.',
    img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    highlight: 'Đường hầm kính đại dương'
  }
]

export function NhaTrangTripCard({ profile }: { profile?: CoupleProfile }) {
  const tripDate = profile?.importantDates.find(date => date.category === 'trip')?.date
  const flightDate = new Date(`${tripDate || new Date().toISOString().slice(0, 10)}T08:00:00`)
  const tripDateLabel = flightDate.toLocaleDateString('vi-VN')
  const firstName = profile?.player1.nickname || 'mình'
  const secondName = profile?.player2.nickname || 'người thương'
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const diffMs = flightDate.getTime() - now.getTime()
  const isDeparted = diffMs <= 0

  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const minutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = Math.max(0, Math.floor((diffMs % (1000 * 60)) / 1000))

  const percent = Math.min(100, Math.round((DUNG_FUND / TOTAL_FUND) * 100))

  return (
    <section className="card nha-trang-trip-card animate-fade-in">
      <div className="section-head">
        <div>
          <small>CHUYẾN BAY DU LỊCH NHA TRANG 🌊</small>
          <h3>Đếm ngược ngày bay: {tripDateLabel}</h3>
        </div>
        <span className="nha-trang-badge">✈️ Flight Confirmed · 6 Điểm Đến</span>
      </div>

      {/* Real-time Countdown Display */}
      <div className="flight-countdown-container">
        <div className="flight-route-header">
          <div className="route-point">
            <strong>HÀ NỘI / SÀI GÒN</strong>
            <small>Điểm khởi hành</small>
          </div>
          <div className="route-plane-anim">
            <span className="plane-trail" />
            <span className="plane-icon">✈️</span>
          </div>
          <div className="route-point right">
            <strong>NHA TRANG BEACH</strong>
            <small>Biển xanh & Nắng vàng</small>
          </div>
        </div>

        <div className="countdown-timer-grid">
          <div className="countdown-digit-box">
            <span className="digit-val">{isDeparted ? '0' : days}</span>
            <span className="digit-label">NGÀY</span>
          </div>
          <div className="countdown-colon">:</div>
          <div className="countdown-digit-box">
            <span className="digit-val">{isDeparted ? '00' : String(hours).padStart(2, '0')}</span>
            <span className="digit-label">GIỜ</span>
          </div>
          <div className="countdown-colon">:</div>
          <div className="countdown-digit-box">
            <span className="digit-val">{isDeparted ? '00' : String(minutes).padStart(2, '0')}</span>
            <span className="digit-label">PHÚT</span>
          </div>
          <div className="countdown-colon">:</div>
          <div className="countdown-digit-box">
            <span className="digit-val">{isDeparted ? '00' : String(seconds).padStart(2, '0')}</span>
            <span className="digit-label">GIÂY</span>
          </div>
        </div>

        <p className="flight-countdown-hint">
          {isDeparted
            ? '🎉 Đã tới ngày bay Nha Trang! Chúc hai đứa mình có chuyến đi ngập tràn tiếng cười và kỷ niệm đẹp!'
            : `Còn ${days} ngày nữa thôi! ${firstName} & ${secondName} đang cùng hoàn thành 10 ngày thể lực.`}
        </p>
      </div>

      {/* 6 Exact Nha Trang Itinerary Spots */}
      <div className="nha-trang-real-gallery">
        <div className="gallery-header-row">
          <span className="gallery-section-label">🏝️ Lịch trình 6 địa điểm của {firstName} & {secondName}:</span>
          <span className="soft-badge">Tour 3 Đảo · Sky Lounge · Viện Hải Dương</span>
        </div>

        <div className="real-photos-grid-6">
          {NHA_TRANG_DESTINATIONS.map((spot, idx) => (
            <div key={idx} className="real-spot-card">
              <div className="spot-thumb-wrapper">
                <img src={spot.img} alt={spot.title} className="real-spot-thumb" loading="lazy" />
                <span className="spot-tag-chip">{spot.tag}</span>
              </div>
              <div className="real-spot-info">
                <div className="spot-title-row">
                  <strong>{spot.title}</strong>
                </div>
                <p className="spot-desc-text">{spot.desc}</p>
                <div className="spot-highlight-pill">
                  <span>✨ {spot.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MoMo Couple Travel Fund */}
      <div className="momo-fund-section">
        <div className="momo-fund-header">
          <div className="momo-brand-tag">
            <span className="momo-icon-circle">M</span>
            <div>
              <strong>Quỹ Du Lịch MoMo 2 Người</strong>
              <small>Mục tiêu chuyến đi: 8.000.000 VNĐ</small>
            </div>
          </div>
          <div className="momo-funded-amount">
            <strong>{DUNG_FUND.toLocaleString()}đ</strong>
            <small>/ {TOTAL_FUND.toLocaleString()}đ</small>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="momo-progress-track">
          <div
            className="momo-progress-fill"
            style={{ width: `${percent}%` }}
          >
            <span className="momo-percent-text">{percent}%</span>
          </div>
        </div>

        {/* Fund Breakdown details */}
        <div className="momo-breakdown-row">
          <div className="fund-member-pill">
            <span className="member-avatar">👦</span>
            <span>{firstName} đã góp: <strong>5.000.000đ</strong></span>
            <span className="member-status done">✓ Đã chuyển</span>
          </div>
          <div className="fund-member-pill">
            <span className="member-avatar">👧</span>
            <span>{secondName}: <strong>3.000.000đ</strong></span>
            <span className="member-status pending">⏳ Đang gom quỹ</span>
          </div>
        </div>
      </div>
    </section>
  )
}
