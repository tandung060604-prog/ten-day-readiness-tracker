import { useState } from 'react'
import { AppLogo } from '../components/common/AppLogo'
import { BackgroundMusicPlayer } from '../components/common/BackgroundMusicPlayer'
import { ChibiMascot, type MascotRole } from '../components/common/ChibiMascot'
import { CoupleHeroCard } from '../components/couple/CoupleHeroCard'
import { NhaTrangTripCard } from '../components/couple/NhaTrangTripCard'
import { CozyAtmosphere } from '../components/couple/CozyAtmosphere'
import { triggerHaptic } from '../utils/haptics'

type Props = {
  onEnterApp: () => void
}

export function LandingPage({ onEnterApp }: Props) {
  const [selectedMascot, setSelectedMascot] = useState<MascotRole>('guide')

  const handleStart = () => {
    triggerHaptic('success')
    onEnterApp()
  }

  return (
    <div className="landing-page-wrapper animate-fade-in">
      {/* Cozy Floating Leaves & Ambient Lighting */}
      <CozyAtmosphere />

      {/* Top Navbar */}
      <header className="landing-navbar">
        <AppLogo size={42} showText subtitle="Dũng & Em Yêu · 10-Day Readiness" />
        <div className="landing-navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BackgroundMusicPlayer defaultVolume={0.18} />
          <button className="primary compact landing-nav-btn" onClick={handleStart}>
            Vào ứng dụng →
          </button>
        </div>
      </header>

      {/* Couple Hero Card with Photos & Love Days Counter */}
      <CoupleHeroCard />

      {/* Flight Countdown & MoMo Couple Fund */}
      <NhaTrangTripCard />

      {/* Hero Section with Interactive Chibi Companion */}
      <section className="landing-hero-section">
        <div className="landing-hero-badge">
          <span>✦ Giao thức 10 Ngày Chuẩn Bị Toàn Diện Cho Chuyến Đi</span>
        </div>
        <h1 className="landing-hero-title">
          Build Energy. Track Recovery. <br />
          <span className="gradient-text">Ready For Nha Trang 27/08!</span>
        </h1>
        <p className="landing-hero-desc">
          Không gian riêng tư theo dõi 6 trụ cột hồi phục và sẵn sàng cao độ: Giấc ngủ sâu, Dinh dưỡng sạch, Tập luyện chuẩn form, Uống nước đều đặn, và Đếm từng khoảnh khắc yêu thương.
        </p>

        {/* Interactive Hero Chibi Mascot */}
        <div className="landing-hero-mascot-container">
          <ChibiMascot
            role={selectedMascot}
            size={150}
            interactive={true}
          />
          <div className="mascot-selector-pills">
            {(['guide', 'workout', 'healthy', 'nutrition', 'zen'] as MascotRole[]).map((r) => (
              <button
                key={r}
                className={`mascot-pill-btn ${selectedMascot === r ? 'active' : ''}`}
                onClick={() => {
                  triggerHaptic('light')
                  setSelectedMascot(r)
                }}
              >
                {r === 'guide' && '📋 Hướng dẫn'}
                {r === 'workout' && '🏋️ Đẩy tạ'}
                {r === 'healthy' && '🥑 Ăn Healthy'}
                {r === 'nutrition' && '💧 Nước uống'}
                {r === 'zen' && '🧘 Thiền thở'}
              </button>
            ))}
          </div>
        </div>

        <div className="landing-hero-actions">
          <button className="primary landing-cta-large" onClick={handleStart}>
            ⚡ Bắt đầu bảng theo dõi 10 ngày
          </button>
        </div>

        <div className="landing-hero-tags">
          <span>🔒 100% Cục bộ & Bảo mật</span>
          <span>🏖 Bay Nha Trang 27/08</span>
          <span>💖 Đếm ngày yêu từ 11/06</span>
          <span>💳 Quỹ MoMo 8 Triệu</span>
        </div>
      </section>

      {/* Meet the 4 Mascot Companions Section */}
      <section className="landing-mascots-showcase">
        <div className="landing-section-header">
          <small>BIỆT ĐỘI ĐỒNG HÀNH</small>
          <h2>Gặp Gỡ 4 Chibi Mascots Của Bạn</h2>
          <p className="section-subtext">Mỗi bé Chibi phụ trách một trụ cột giúp bạn duy trì kỷ luật và năng lượng vui vẻ mỗi ngày.</p>
        </div>

        <div className="chibi-showcase-grid">
          {/* Card 1: Healthy */}
          <div className="chibi-showcase-card">
            <ChibiMascot role="healthy" size={110} showSpeechBubble={false} interactive={false} />
            <div className="chibi-card-content">
              <span className="chibi-card-role">🥑 Chibi Healthy Chef</span>
              <h3>Ăn Uống Cân Bằng</h3>
              <p>Tự động nhận diện Protein, Carb chậm và Rau củ. Hướng dẫn cấu trúc đĩa ăn no lâu và tiêu hóa nhẹ nhàng.</p>
            </div>
          </div>

          {/* Card 2: Workout */}
          <div className="chibi-showcase-card">
            <ChibiMascot role="workout" size={110} showSpeechBubble={false} interactive={false} />
            <div className="chibi-card-content">
              <span className="chibi-card-role">🏋️ Chibi Gym Beast</span>
              <h3>Tập Luyện & Đẩy Tạ</h3>
              <p>Mô phỏng chuyển động động tác chuẩn từng rep, nhắc nhở giữ form lưng và bài tập sàn chậu Kegel.</p>
            </div>
          </div>

          {/* Card 3: Nutrition & Water */}
          <div className="chibi-showcase-card">
            <ChibiMascot role="nutrition" size={110} showSpeechBubble={false} interactive={false} />
            <div className="chibi-card-content">
              <span className="chibi-card-role">💧 Chibi Hydration Coach</span>
              <h3>Nước Uống & Vi Chất</h3>
              <p>Bình nước sóng dâng sinh động, chia 6 mốc giờ uống thông minh giúp tế bào hấp thụ trọn vẹn.</p>
            </div>
          </div>

          {/* Card 4: Zen Meditation */}
          <div className="chibi-showcase-card">
            <ChibiMascot role="zen" size={110} showSpeechBubble={false} interactive={false} />
            <div className="chibi-card-content">
              <span className="chibi-card-role">🧘 Chibi Zen Master</span>
              <h3>Thở 4:6 & Giấc Ngủ</h3>
              <p>Hướng dẫn bài thở nhịp phó giao cảm giải phóng căng thẳng, đưa bạn vào giấc ngủ sâu từ 7.5 đến 8 tiếng mỗi đêm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Phase Arc Preview */}
      <section className="landing-arc-section">
        <div className="landing-section-header">
          <small>LỘ TRÌNH KHOA HỌC</small>
          <h2>Lộ trình 3 Giai Đoạn Về Đích</h2>
        </div>

        <div className="landing-arc-grid">
          <div className="landing-arc-card">
            <div className="arc-step-num">01</div>
            <h3>Build Phase</h3>
            <span className="arc-day-tag">Ngày 1 – 4</span>
            <p>Xây dựng nền tảng năng lượng, siết chặt kỷ luật giấc ngủ 8h, bổ sung protein sạch và thói quen uống nước đúng nhịp.</p>
          </div>

          <div className="landing-arc-card featured">
            <div className="arc-step-num">02</div>
            <h3>Peak & Stabilize</h3>
            <span className="arc-day-tag">Ngày 5 – 7</span>
            <p>Duy trì phong độ ổn định, tăng cường bài tập sàn chậu Kegel trực quan và giải phóng áp lực hông/cột sống.</p>
          </div>

          <div className="landing-arc-card">
            <div className="arc-step-num">03</div>
            <h3>Taper & Ready</h3>
            <span className="arc-day-tag">Ngày 8 – 10</span>
            <p>Giảm tải khối lượng tập nặng, loại bỏ hoàn toàn căng thẳng mệt mỏi để bước vào ngày quan trọng với 100% thể lực.</p>
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="landing-security-banner">
        <div className="security-banner-content">
          <div className="security-icon-large">🔒</div>
          <div>
            <h3>Bảo mật riêng tư tuyệt đối cho 2 đứa mình</h3>
            <p>Toàn bộ dữ liệu của bạn lưu trữ 100% trên thiết bị của bạn. Hỗ trợ khóa mã PIN cá nhân và Face ID, chỉ có 2 người xem được.</p>
          </div>
        </div>
        <button className="primary landing-cta-bottom" onClick={handleStart}>
          Vào bảng điều khiển ngay →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Dũng & Em Yêu · 10-Day Readiness & Love Tracker · Nha Trang 27/08/2026 🌴</p>
      </footer>
    </div>
  )
}
