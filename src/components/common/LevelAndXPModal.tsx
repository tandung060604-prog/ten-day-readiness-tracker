import { Modal } from './Modal'
import { ChiikawaSVG } from './ChiikawaSVG'
import { calculateXpToNextLevel, calculateBondXpToNextLevel } from '../../domain/game/rewardService'
import { useGameState } from '../../context/GameStateContext'
import { audioSystem } from '../../game/systems/GameAudioSystem'

interface LevelAndXPModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LevelAndXPModal({ isOpen, onClose }: LevelAndXPModalProps) {
  const { state } = useGameState()

  if (!isOpen) return null

  const level = state.progression.level
  const currentXp = state.progression.xp
  const requiredXp = calculateXpToNextLevel(level)
  const xpPct = Math.min(100, Math.floor((currentXp / Math.max(1, requiredXp)) * 100))

  // Level Title Mapping
  const getLevelTitle = (lvl: number) => {
    if (lvl <= 2) return 'Cặp Đôi Mầm Trắng 🌱'
    if (lvl <= 5) return 'Tri Kỷ Đồng Hành 🌸'
    if (lvl <= 10) return 'Tình Yêu Thắm Thiết 💖'
    if (lvl <= 20) return 'Gia Đình Nhỏ Hạnh Phúc 🏡'
    return 'Tình Yêu Vĩnh Cửu Hoàng Kim 👑'
  }

  return (
    <Modal title="Cơ Chế Cấp Độ & Kinh Nghiệm (Level & XP Guide)" onClose={onClose}>
      <div className="level-xp-modal-container">
        {/* Current Level Banner Card */}
        <div className="current-level-card">
          <div className="level-mascot-badge">
            <ChiikawaSVG character="chiikawa" size={56} />
            <span className="level-number-tag">Cấp {level}</span>
          </div>

          <div className="level-title-col">
            <h3>{getLevelTitle(level)}</h3>
            <p className="level-summary-sub">
              Tiến độ cấp hiện tại: <strong>{currentXp} / {requiredXp} XP</strong> ({xpPct}%)
            </p>

            {/* Animated XP Progress Bar */}
            <div className="xp-progress-track">
              <div className="xp-progress-fill" style={{ width: `${xpPct}%` }}>
                <span className="xp-sparkle">✨</span>
              </div>
            </div>
            <span className="xp-needed-text">Còn <strong>{Math.max(0, requiredXp - currentXp)} XP</strong> nữa để lên Cấp {level + 1}!</span>
          </div>
        </div>

        {/* 1. What is XP & Leveling */}
        <div className="xp-explanation-card">
          <h4>💡 Cấp Độ (Level) và Điểm Kinh Nghiệm (XP) là gì?</h4>
          <p>
            <strong>Kinh Nghiệm (XP)</strong> là thước đo mức độ gắn kết và đồng hành của hai bạn trong thị trấn Little Days.
            Mỗi khi cùng nhau hoàn thành nhiệm vụ, giải đố, chăm sóc sức khỏe hay trang trí nhà cửa, hai bạn sẽ nhận được điểm XP.
            Khi thanh XP đầy, hai bạn sẽ <strong>tự động Lên Cấp</strong> và mở khóa vô vàn đặc quyền!
          </p>
        </div>

        {/* 2. How to Earn XP Table */}
        <div className="how-to-earn-section">
          <h4>🎯 5 Cách Tích Lũy Kinh Nghiệm (XP) Nhanh Nhất:</h4>
          <div className="earn-ways-grid">
            <div className="earn-way-item">
              <span className="way-icon">🧩</span>
              <div className="way-text">
                <strong>Chiến Dịch Giải Đố (Match-3)</strong>
                <p>Thắng mỗi màn nhận từ <strong>+50 đến +500 XP</strong></p>
              </div>
            </div>

            <div className="earn-way-item">
              <span className="way-icon">🛋️</span>
              <div className="way-text">
                <strong>Sofa Check-In & Trả Lời Câu Hỏi</strong>
                <p>Mỗi ngày tâm sự nhận ngay <strong>+50 XP</strong></p>
              </div>
            </div>

            <div className="earn-way-item">
              <span className="way-icon">💧</span>
              <div className="way-text">
                <strong>Nhiệm Vụ Quảng Trường (Uống Nước, Ngủ)</strong>
                <p>Hoàn thành nhận từ <strong>+60 đến +90 XP</strong></p>
              </div>
            </div>

            <div className="earn-way-item">
              <span className="way-icon">🏡</span>
              <div className="way-text">
                <strong>Nâng Cấp Công Trình Thị Trấn</strong>
                <p>Nâng cấp lên Bậc 2 & Bậc 3 nhận <strong>+150 XP</strong></p>
              </div>
            </div>

            <div className="earn-way-item">
              <span className="way-icon">💌</span>
              <div className="way-text">
                <strong>Gửi Thư Tình & Viên Nang Kỷ Niệm</strong>
                <p>Lưu giữ lời hẹn ước nhận ngay <strong>+40 XP</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Level Up Rewards & Perks */}
        <div className="level-perks-section">
          <h4>🎁 Đặc Quyền Khi Lên Cấp:</h4>
          <ul className="perks-list">
            <li>🪙 <strong>Thưởng Khủng:</strong> Tặng ngay <strong>+100 Xu, +50 Tim, +1 Sao</strong> mỗi khi lên cấp!</li>
            <li>⚡ <strong>Năng Lượng:</strong> Hồi phục 100% Năng Lượng để tiếp tục phiêu lưu.</li>
            <li>🌸 <strong>Tương Tác Linh Vật:</strong> Mở khóa các câu thoại ngọt ngào và điệu nhảy cổ vũ mới của Chiikawa & Usagi.</li>
            <li>🏰 <strong>Mở Khóa Xây Dựng:</strong> Đủ điều kiện nâng cấp các công trình lên Bậc Hoàng Kim (Tier 3).</li>
          </ul>
        </div>

        {/* Close Action */}
        <button
          className="level-close-btn"
          onClick={() => { audioSystem.playClick('pop'); onClose() }}
        >
          Đã Hiểu, Cùng Nhau Tích Lũy XP Nào! 🚀
        </button>
      </div>
    </Modal>
  )
}
