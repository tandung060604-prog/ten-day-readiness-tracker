import { triggerHaptic } from '../utils/haptics'

type Props = {
  onEnterApp: () => void
}

export function LandingPage({ onEnterApp }: Props) {
  const handleStart = () => {
    triggerHaptic('success')
    onEnterApp()
  }

  return (
    <div className="landing-page-wrapper animate-fade-in">
      {/* Top Navbar */}
      <header className="landing-navbar">
        <div className="landing-brand">
          <div className="logo">10</div>
          <div>
            <strong>10-Day Readiness</strong>
            <small>Personal Wellness Protocol</small>
          </div>
        </div>
        <button className="primary compact landing-nav-btn" onClick={handleStart}>
          Vào ứng dụng →
        </button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-badge">
          <span>✦ Giao thức 10 Ngày Chuẩn Bị Toàn Diện</span>
        </div>
        <h1 className="landing-hero-title">
          Build Energy. Track Recovery. <br />
          <span className="gradient-text">Arrive Completely Ready.</span>
        </h1>
        <p className="landing-hero-desc">
          Ứng dụng cá nhân theo dõi 6 trụ cột hồi phục và sẵn sàng cao độ: Giấc ngủ sâu, Dinh dưỡng cân bằng, Tập luyện thông minh, Hydration thông minh, Giãn cơ & Bài thở.
        </p>

        <div className="landing-hero-actions">
          <button className="primary landing-cta-large" onClick={handleStart}>
            ⚡ Bắt đầu hành trình 10 ngày
          </button>
        </div>

        <div className="landing-hero-tags">
          <span>🔒 100% Cục bộ & Bảo mật</span>
          <span>⚡ Nhận diện dinh dưỡng AI</span>
          <span>🌊 Hydration Wave Tracking</span>
          <span>👤 Khóa PIN & Face ID</span>
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

      {/* 6 Core Pillars */}
      <section className="landing-pillars-section">
        <div className="landing-section-header">
          <small>6 TRỤ CỘT ĐÁNH GIÁ</small>
          <h2>Thuật Toán Điểm Readiness Toàn Diện</h2>
        </div>

        <div className="landing-pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon">🌙</div>
            <h4>Giấc ngủ (25%)</h4>
            <p>Tối ưu chu kỳ ngủ đêm từ 7.5 – 8 giờ và giấc ngủ ngắn nap phục hồi hệ thần kinh.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">🥗</div>
            <h4>Dinh dưỡng (20%)</h4>
            <p>Tự động nhận diện nhóm chất: Protein, Carb chậm, Rau củ và Trái cây sạch.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">⚡</div>
            <h4>Tập luyện (20%)</h4>
            <p>Lịch tập chi tiết từng ngày kèm mô phỏng chuyển động động tác trực quan.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">🌊</div>
            <h4>Hydration (10%)</h4>
            <p>Theo dõi cốc nước với animation sóng nước dâng sinh động và 6 mốc giờ uống.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">🧘</div>
            <h4>Phục hồi & Thở (10%)</h4>
            <p>Huấn luyện viên Kegel và Bài tập thở sâu 4:6 kích hoạt hệ thần kinh phó giao cảm.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">✨</div>
            <h4>Tâm trạng & Cảm nhận (15%)</h4>
            <p>Ghi nhận chỉ số Năng lượng, Căng thẳng và Nhật ký phản chiếu mỗi tối.</p>
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="landing-security-banner">
        <div className="security-banner-content">
          <div className="security-icon-large">🔒</div>
          <div>
            <h3>Bảo mật riêng tư tuyệt đối</h3>
            <p>Toàn bộ dữ liệu của bạn lưu trữ 100% trên thiết bị của bạn. Hỗ trợ khóa mã PIN cá nhân và Face ID, không lo bị người khác xem trộm.</p>
          </div>
        </div>
        <button className="primary landing-cta-bottom" onClick={handleStart}>
          Vào bảng điều khiển ngay →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>10-Day Readiness Tracker · Designed for iOS Mobile & Desktop</p>
      </footer>
    </div>
  )
}
