import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { CoupleProfile } from '../../domain/couple/types'

interface AirportProps {
  profile?: CoupleProfile
}

interface PackingItem {
  id: string
  label: string
  category: 'clothes' | 'docs' | 'personal' | 'gadgets'
  done: boolean
}

const DEFAULT_PACKING_LIST: PackingItem[] = [
  { id: 'p1', label: 'Căn cước công dân / Hộ chiếu 🪪', category: 'docs', done: true },
  { id: 'p2', label: 'Vé máy bay / Mã đặt chỗ điện tử ✈️', category: 'docs', done: true },
  { id: 'p3', label: 'Đồ bơi & Kính râm đi biển 🩱🕶️', category: 'clothes', done: false },
  { id: 'p4', label: 'Kem chống nắng SPF50+ & Xịt khoáng 🧴', category: 'personal', done: false },
  { id: 'p5', label: 'Sạc điện thoại & Sạc dự phòng 10.000mAh 🔋', category: 'gadgets', done: false },
  { id: 'p6', label: 'Thuốc say tàu xe & Băng cá nhân 💊', category: 'personal', done: false },
  { id: 'p7', label: 'Mũ rộng vành & Dép tông đi dạo cát 👒🩴', category: 'clothes', done: false }
]

export function AirportInterior({ profile: _profile }: AirportProps) {
  const [packingList, setPackingList] = useState<PackingItem[]>(DEFAULT_PACKING_LIST)
  const doneCount = packingList.filter(p => p.done).length
  const totalCount = packingList.length
  const packingPercentage = Math.round((doneCount / totalCount) * 100)

  const handleToggleItem = (id: string) => {
    audioSystem.playClick('soft')
    const updated = packingList.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    setPackingList(updated)

    if (updated.filter(p => p.done).length === totalCount) {
      setTimeout(() => {
        triggerConfetti()
        audioSystem.playAchievement('quest')
      }, 200)
    }
  }

  return (
    <SceneShell
      sceneId="airport"
      title="Sân Bay Little Sky"
      subtitle="Cửa ngõ cất cánh cho những chuyến phiêu lưu tình yêu tuyệt vời"
      icon="✈️"
      companionRole="usagi"
      companionMessage="Yaaa-ha! Usagi đã kéo vali xong xuôi rồi, chuẩn bị bay thôi nàooo! 🧳✈️"
    >
      <div className="airport-interior-grid">
        {/* Departure Board Widget */}
        <div className="airport-departure-board">
          <div className="board-header">
            <span className="board-blinking-dot" />
            <h3>BẢNG KHỞI HÀNH • DEPARTURE BOARD</h3>
          </div>

          <div className="flight-ticket-row">
            <div className="flight-code">VN-LOVE</div>
            <div className="flight-route">
              <span>HÀ NỘI (HAN)</span>
              <span className="flight-arrow">✈️ ➔</span>
              <span>NHA TRANG (CXR)</span>
            </div>
            <div className="flight-status status-boarding">ĐANG CHUẨN BỊ SẴN SÀNG</div>
          </div>

          <div className="flight-meta-grid">
            <div className="meta-box">
              <span className="meta-label">CHUYẾN ĐI</span>
              <strong>Nha Trang Biển Xanh</strong>
            </div>
            <div className="meta-box">
              <span className="meta-label">THỜI GIAN</span>
              <strong>10 Ngày Rực Rỡ</strong>
            </div>
            <div className="meta-box">
              <span className="meta-label">TIẾN ĐỘ HÀNH LÝ</span>
              <strong className="text-highlight">{packingPercentage}% Hoàn Tất</strong>
            </div>
          </div>
        </div>

        {/* Luggage Packing Checklist */}
        <div className="luggage-checklist-card">
          <div className="checklist-header">
            <h3>🧳 Danh Sách Hành Lý Cần Chuẩn Bị ({doneCount}/{totalCount})</h3>
            <div className="packing-progress-bar">
              <div className="packing-fill" style={{ width: `${packingPercentage}%` }} />
            </div>
          </div>

          <div className="packing-items-list">
            {packingList.map(item => (
              <label 
                key={item.id} 
                className={`packing-item-row ${item.done ? 'packed' : ''}`}
                onClick={() => handleToggleItem(item.id)}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {}}
                />
                <span className="packing-label">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
