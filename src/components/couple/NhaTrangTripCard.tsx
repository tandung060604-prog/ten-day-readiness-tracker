import { useEffect, useState } from 'react'

const NHA_TRANG_FLIGHT_DATE = new Date('2026-08-27T08:00:00')
const TOTAL_FUND = 8000000
const DUNG_FUND = 5000000

const NHA_TRANG_GALLERY = [
  {
    title: 'Bãi Biển Nha Trang & Nắng Vàng',
    desc: 'Bãi cát dài thoai thoải, nước biển trong vắt màu ngọc bích.',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'VinWonders & Cáp Treo Vượt Biển',
    desc: 'Lâu đài cổ tích trên đảo Hòn Tre ngắm trọn hoàng hôn.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Lặn Ngắm San Hô Hòn Mun',
    desc: 'Trải nghiệm lặn biển khám phá rạn san hô kỳ ảo cùng em.',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  }
]

export function NhaTrangTripCard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const diffMs = NHA_TRANG_FLIGHT_DATE.getTime() - now.getTime()
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
          <h3>Đếm ngược ngày bay: 27/08/2026</h3>
        </div>
        <span className="nha-trang-badge">✈️ Flight Confirmed</span>
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
            : `Còn ${days} ngày nữa thôi! Dũng đang nỗ lực hoàn thành 10 ngày thể lực để đưa em đi chơi thật trọn vẹn.`}
        </p>
      </div>

      {/* Real Nha Trang Travel Photos */}
      <div className="nha-trang-real-gallery">
        <span className="gallery-section-label">📸 Những địa điểm hai đứa mình sẽ cùng đi:</span>
        <div className="real-photos-grid">
          {NHA_TRANG_GALLERY.map((item, idx) => (
            <div key={idx} className="real-photo-card">
              <img src={item.img} alt={item.title} className="real-photo-thumb" loading="lazy" />
              <div className="real-photo-info">
                <strong>{item.title}</strong>
                <small>{item.desc}</small>
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
            <span>Dũng đã góp: <strong>5.000.000đ</strong></span>
            <span className="member-status done">✓ Đã chuyển</span>
          </div>
          <div className="fund-member-pill">
            <span className="member-avatar">👧</span>
            <span>Em yêu: <strong>3.000.000đ</strong></span>
            <span className="member-status pending">⏳ Đang gom quỹ</span>
          </div>
        </div>
      </div>
    </section>
  )
}
