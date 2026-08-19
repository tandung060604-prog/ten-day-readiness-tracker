import { useEffect, useState } from 'react'

const NHA_TRANG_FLIGHT_DATE = new Date('2026-08-27T08:00:00')
const TOTAL_FUND = 8000000
const DUNG_FUND = 5000000

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
            ? '🎉 Đã tới ngày bay Nha Trang! Chúc 2 đứa mình có chuyến đi ngập tràn kỷ niệm!'
            : `Còn ${days} ngày để Dũng hoàn thành trọn vẹn 10 ngày Readiness chuẩn bị thể lực tốt nhất để đưa em đi chơi!`}
        </p>
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
