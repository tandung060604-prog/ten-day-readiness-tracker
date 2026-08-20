import { Modal } from './Modal'
import { ChiikawaSVG } from './ChiikawaSVG'
import { audioSystem } from '../../game/systems/GameAudioSystem'

interface CurrencyAndQuickStartModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToBuilding?: (buildingId: string) => void
}

export function CurrencyAndQuickStartModal({
  isOpen,
  onClose,
  onNavigateToBuilding
}: CurrencyAndQuickStartModalProps) {
  if (!isOpen) return null

  return (
    <Modal title="Hướng Dẫn Bắt Đầu & Sử Dụng Tiền Tệ (Starter Guide)" onClose={onClose}>
      <div className="starter-guide-container">
        {/* Mascot Welcome Header */}
        <div className="starter-welcome-banner">
          <ChiikawaSVG character="chiikawa" size={48} />
          <div>
            <h3>Chào mừng bạn đến với Thị Trấn Little Days! 🌸</h3>
            <p>Dưới đây là cẩm nang nhanh giúp hai bạn nắm rõ cách chơi và sử dụng tiền tệ trong game nhé!</p>
          </div>
        </div>

        {/* 1. Currencies Explained */}
        <div className="currencies-detail-section">
          <h4>💎 3 Loại Tiền Tệ & Cách Sử Dụng:</h4>

          <div className="currency-card-item heart-theme">
            <div className="currency-header-line">
              <span className="cur-icon">💖</span>
              <strong>Trái Tim Tình Yêu (Hearts)</strong>
            </div>
            <p>
              • <strong>Cách nhận:</strong> Trả lời Câu hỏi đôi mỗi ngày (+15 Tim), check-in sofa, viết thư tình, thắng màn giải đố.
            </p>
            <p>
              • <strong>Dùng để làm gì:</strong> Nâng cấp Ngôi Nhà Nhỏ, mở khóa Kỹ Năng Đôi của Chiikawa & Usagi, mở khóa Viên Nang Kỷ Niệm.
            </p>
          </div>

          <div className="currency-card-item coin-theme">
            <div className="currency-header-line">
              <span className="cur-icon">🪙</span>
              <strong>Tiền Xu Thị Trấn (Coins / Gems)</strong>
            </div>
            <p>
              • <strong>Cách nhận:</strong> Thắng các màn giải đố Match-3, hoàn thành mục tiêu uống nước & giấc ngủ hàng ngày.
            </p>
            <p>
              • <strong>Dùng để làm gì:</strong> Mua vật liệu xây dựng (Gỗ anh đào, Đá phép thuật) để nâng cấp toàn bộ 13 công trình thị trấn.
            </p>
          </div>

          <div className="currency-card-item star-theme">
            <div className="currency-header-line">
              <span className="cur-icon">⭐</span>
              <strong>Ngôi Sao Thành Tích (Stars)</strong>
            </div>
            <p>
              • <strong>Cách nhận:</strong> Đạt điểm cao (1-3 Sao) trong Chiến dịch 30 màn chơi giải đố.
            </p>
            <p>
              • <strong>Dùng để làm gì:</strong> Mở khóa các Chương truyện mới và chứng nhận nâng cấp công trình lên <strong>Bậc Hoàng Kim (Tier 3)</strong>.
            </p>
          </div>
        </div>

        {/* 2. Step-by-Step Starter Roadmap */}
        <div className="starter-roadmap-section">
          <h4>🚀 Lộ Trình 4 Bước Dành Cho Người Mới Bắt Đầu:</h4>

          <div className="roadmap-steps-list">
            <div
              className="roadmap-step-card"
              onClick={() => {
                onNavigateToBuilding?.('home')
                onClose()
              }}
            >
              <div className="step-num">1</div>
              <div className="step-content">
                <strong>🏡 Vào Ngôi Nhà Nhỏ (Cottage)</strong>
                <p>Nhấn vào sofa để tâm sự và trả lời câu hỏi tình yêu hôm nay ➔ Nhận ngay <strong>+15 Tim 💖</strong></p>
              </div>
              <span className="go-btn">Đến ngay ➔</span>
            </div>

            <div
              className="roadmap-step-card"
              onClick={() => {
                onNavigateToBuilding?.('water')
                onClose()
              }}
            >
              <div className="step-num">2</div>
              <div className="step-content">
                <strong>⛲ Vào Đài Phun Nước (Fountain)</strong>
                <p>Ghi nhận ly nước mát bạn đã uống hôm nay để chăm sóc sức khỏe ➔ Nhận <strong>+20 Xu 🪙</strong></p>
              </div>
              <span className="go-btn">Đến ngay ➔</span>
            </div>

            <div
              className="roadmap-step-card"
              onClick={() => {
                onNavigateToBuilding?.('quests')
                onClose()
              }}
            >
              <div className="step-num">3</div>
              <div className="step-content">
                <strong>🧩 Vào Quảng Trường Nhiệm Vụ (Quests)</strong>
                <p>Chơi thử Màn 1 để làm quen ghép hình 3 bé Chiikawa ➔ Nhận <strong>+50 Xu 🪙, +25 Tim 💖, +1 Sao ⭐</strong></p>
              </div>
              <span className="go-btn">Đến ngay ➔</span>
            </div>

            <div
              className="roadmap-step-card"
              onClick={() => {
                onNavigateToBuilding?.('home')
                onClose()
              }}
            >
              <div className="step-num">4</div>
              <div className="step-content">
                <strong>🏰 Nâng Cấp Công Trình Thị Trấn</strong>
                <p>Dùng Xu & Tim vừa kiếm được để nâng cấp Nhà Nhỏ lên Bậc 2 đón ban công ngắm sao lãng mạn!</p>
              </div>
              <span className="go-btn">Đến ngay ➔</span>
            </div>
          </div>
        </div>

        {/* Close Action */}
        <button
          className="starter-close-btn"
          onClick={() => {
            audioSystem.playClick('pop')
            onClose()
          }}
        >
          Đã Nắm Rõ, Bắt Đầu Khám Phá Thị Trấn Ngay! 🌸✨
        </button>
      </div>
    </Modal>
  )
}
