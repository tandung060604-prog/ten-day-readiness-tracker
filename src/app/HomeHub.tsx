import type { CoupleProfile } from '../domain/couple/types'

interface HomeHubProps {
  profile: CoupleProfile
  onSelectDaily: () => void
  onSelectAdventure: () => void
}

export function HomeHub({ profile, onSelectDaily, onSelectAdventure }: HomeHubProps) {
  return (
    <main className="home-hub" aria-labelledby="home-hub-title">
      <div className="home-hub-intro">
        <span className="home-hub-kicker">Little Days · không gian của hai mình</span>
        <h1 id="home-hub-title">Chào {profile.player1.nickname} &amp; {profile.player2.nickname}</h1>
        <p>Chọn nhịp điệu cho hôm nay.</p>
      </div>
      <div className="home-hub-choices">
        <button className="home-hub-card home-hub-daily" onClick={onSelectDaily}>
          <span className="home-hub-card-icon">♥</span>
          <span><strong>Hôm nay</strong><small>Wellness, kế hoạch và nhật ký</small></span>
          <span className="home-hub-arrow">→</span>
        </button>
        <button className="home-hub-card home-hub-adventure" onClick={onSelectAdventure}>
          <span className="home-hub-card-icon">✦</span>
          <span><strong>Phiêu lưu</strong><small>Bản đồ, nhiệm vụ và ghép hình</small></span>
          <span className="home-hub-arrow">→</span>
        </button>
      </div>
    </main>
  )
}
