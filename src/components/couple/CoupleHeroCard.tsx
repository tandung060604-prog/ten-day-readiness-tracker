import { useEffect, useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

const LOVE_START_DATE = new Date('2026-06-11T00:00:00')

export function CoupleHeroCard() {
  const [now, setNow] = useState(new Date())
  const [heartPulsing, setHeartPulsing] = useState(true)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Calculate days, hours, mins, secs since 11/06/2026
  const diffMs = now.getTime() - LOVE_START_DATE.getTime()
  const isAfterStart = diffMs >= 0
  const absDiff = Math.abs(diffMs)

  const totalDays = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000)

  const handleHeartClick = () => {
    triggerHaptic('success')
    setHeartPulsing(false)
    setTimeout(() => setHeartPulsing(true), 100)
  }

  // Use base URL for assets
  const dungImg = './assets/dung.jpg'
  const loveImg = './assets/nguoiyeu.jpg'

  return (
    <section className="card couple-hero-card animate-fade-in">
      {/* Cozy Decorative Header */}
      <div className="couple-card-top-glow" />

      <div className="couple-header-greeting">
        <div className="couple-badge">
          <span>💖 Góc Nhỏ Riêng Tư Của Dũng & Em Yêu</span>
        </div>
        <h2>Gửi em yêu của anh! ❤️</h2>
        <p className="couple-mission-story">
          Góc nhỏ này anh tự tay làm dành riêng cho hai đứa mình. Ở đây, anh rèn luyện kỷ luật ăn uống, giấc ngủ và thể lực trong 10 ngày để có năng lượng tốt nhất khi ở cạnh em. Từng khoảnh khắc chúng mình bên nhau từ ngày <strong>11/06/2026</strong> đều được đếm từng giây, và anh đang rất háo hức chờ đến ngày <strong>27/08</strong> để cùng em bay tới Nha Trang ngắm biển. Mong mỗi lần mở web lên, em đều mỉm cười thật tươi nhé!
        </p>
      </div>

      {/* Couple Avatars with Heart Connection */}
      <div className="couple-avatars-row">
        {/* Dũng */}
        <div className="couple-avatar-wrap">
          <div className="couple-avatar-ring dung-ring">
            <img src={dungImg} alt="Dũng" className="couple-avatar-img" />
          </div>
          <strong className="couple-name">Dũng</strong>
          <span className="couple-role-tag">Chàng trai của em</span>
        </div>

        {/* Animated Heart Center */}
        <div className="couple-heart-connector" onClick={handleHeartClick} title="Chạm để gửi tim!">
          <div className={`heart-beat-orb ${heartPulsing ? 'beating' : ''}`}>
            ❤️
          </div>
          <span className="love-days-label">
            {isAfterStart ? 'ĐÃ YÊU NHAU' : 'BẮT ĐẦU TỪ 11/06'}
          </span>
          <div className="love-days-count">
            {totalDays} <small>NGÀY</small>
          </div>
        </div>

        {/* Người Yêu */}
        <div className="couple-avatar-wrap">
          <div className="couple-avatar-ring love-ring">
            <img src={loveImg} alt="Người Yêu" className="couple-avatar-img" />
          </div>
          <strong className="couple-name">Em Yêu</strong>
          <span className="couple-role-tag">Công chúa nhỏ</span>
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

      {/* Cozy Note */}
      <div className="couple-footer-whisper">
        <span>✨ Bắt đầu từ ngày kỷ niệm: <strong>11/06/2026</strong> · Cùng nhau già đi! 🌿</span>
      </div>
    </section>
  )
}
