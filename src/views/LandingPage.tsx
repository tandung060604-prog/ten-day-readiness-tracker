import { useState } from 'react'
import { AppLogo } from '../components/common/AppLogo'
import { YouTubeBGMPlayer } from '../components/common/YouTubeBGMPlayer'
import { ChibiMascot, type MascotRole } from '../components/common/ChibiMascot'
import { ChiikawaVoiceCard } from '../components/common/ChiikawaVoiceCard'
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
          <YouTubeBGMPlayer />
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

      {/* Meet the Chiikawa & Friends Showcase Section */}
      <section className="landing-mascots-showcase">
        <div className="landing-section-header">
          <small>CHIIKAWA & FRIENDS UNIVERSE · ちいかわ</small>
          <h2>Biệt Đội Chiikawa Đồng Hành Cùng Hai Bạn</h2>
          <p className="section-subtext">Mỗi bé nhân vật mang một màu sắc và giọng nói riêng giúp bạn duy trì năng lượng và nụ cười rạng rỡ mỗi ngày.</p>
        </div>

        <div className="chiikawa-universe-grid">
          {/* 1. Chiikawa */}
          <div className="chiikawa-char-card char-chiikawa">
            <ChiikawaVoiceCard character="chiikawa" />
            <div className="char-card-body">
              <span className="char-role-badge">🐹 Phục Hồi & Giấc Ngủ</span>
              <p>Bé mầm trắng dịu dàng, giúp Dũng & Em Yêu xoa dịu mệt mỏi và ngủ thật ngon giấc.</p>
            </div>
          </div>

          {/* 2. Hachiware */}
          <div className="chiikawa-char-card char-hachiware">
            <ChiikawaVoiceCard character="hachiware" />
            <div className="char-card-body">
              <span className="char-role-badge">🐱 Bù Nước & Lạc Quan</span>
              <p>Mèo tai xanh thông minh với câu thần chú <em>"Nanto kanaare! (Mọi chuyện sẽ ổn thôi!)"</em>.</p>
            </div>
          </div>

          {/* 3. Usagi */}
          <div className="chiikawa-char-card char-usagi">
            <ChiikawaVoiceCard character="usagi" />
            <div className="char-card-body">
              <span className="char-role-badge">🐰 Thể Lực & Đẩy Tạ</span>
              <p>Thỏ vàng siêu năng lượng, luôn tràn ngập nhiệt huyết <em>"Uraaa! Ya-ha!"</em> tiếp lửa tập luyện.</p>
            </div>
          </div>

          {/* 4. Momonga */}
          <div className="chiikawa-char-card char-momonga">
            <ChiikawaVoiceCard character="momonga" />
            <div className="char-card-body">
              <span className="char-role-badge">🐿️ Dinh Dưỡng & Ăn Sạch</span>
              <p>Sóc bay lông xù sành ăn, hướng dẫn cấu trúc bữa ăn ngon miệng và giàu năng lượng sạch.</p>
            </div>
          </div>

          {/* 5. Kurimanju */}
          <div className="chiikawa-char-card char-kurimanju">
            <ChiikawaVoiceCard character="kurimanju" />
            <div className="char-card-body">
              <span className="char-role-badge">🦦 Thư Giãn & Âm Thanh</span>
              <p>Rái cá điềm tĩnh thích nhâm nhi trà, phát âm thanh sóng biển và mưa rơi ru ngủ cực êm.</p>
            </div>
          </div>

          {/* 6. Rakko Master */}
          <div className="chiikawa-char-card char-rakko">
            <ChiikawaVoiceCard character="rakko" />
            <div className="char-card-body">
              <span className="char-role-badge">⭐ Sư Phụ Kỷ Luật 10 Ngày</span>
              <p>Chiến binh rái cá dẫn đường, giúp bạn hoàn thành xuất sắc từng ngày trong lộ trình về đích.</p>
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
