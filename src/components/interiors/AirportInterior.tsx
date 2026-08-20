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
  category: 'docs' | 'clothes' | 'care' | 'gadgets'
  done: boolean
}

const DEFAULT_PACKING_LIST: PackingItem[] = [
  { id: 'p1', label: 'Căn Cước Công Dân (CCCD) của Dũng & Mai Trang 🪪', category: 'docs', done: true },
  { id: 'p2', label: 'Vé máy bay khứ hồi Nha Trang 27/08 ✈️', category: 'docs', done: true },
  { id: 'p3', label: 'Xác nhận đặt phòng khách sạn & Tour 3 Đảo 🏨', category: 'docs', done: true },
  { id: 'p4', label: 'Đồ bơi đôi, váy maxi trắng đi biển & kính râm 🩱🕶️', category: 'clothes', done: false },
  { id: 'p5', label: 'Mũ cói rộng vành & dép sandal dạo cát 👒🩴', category: 'clothes', done: false },
  { id: 'p6', label: 'Kem chống nắng SPF50+ PA++++ & Xịt khoáng 🧴', category: 'care', done: false },
  { id: 'p7', label: 'Thuốc say sóng tàu xe, băng dán cá nhân, men tiêu hóa 💊', category: 'care', done: false },
  { id: 'p8', label: 'Túi chống nước điện thoại để quay lặn ngắm san hô 📱🌊', category: 'gadgets', done: false },
  { id: 'p9', label: 'Sạc nhanh, pin sạc dự phòng 20.000mAh & gậy chụp ảnh 🔋📸', category: 'gadgets', done: false }
]

export function AirportInterior({ profile: _profile }: AirportProps) {
  const [packingList, setPackingList] = useState<PackingItem[]>(DEFAULT_PACKING_LIST)
  const [activeCategory, setActiveCategory] = useState<'all' | 'docs' | 'clothes' | 'care' | 'gadgets'>('all')
  const [newItemText, setNewItemText] = useState('')
  const [showDownloadAlert, setShowDownloadAlert] = useState(false)

  const doneCount = packingList.filter((p) => p.done).length
  const totalCount = packingList.length
  const packingPercentage = Math.round((doneCount / totalCount) * 100)

  const filteredItems = activeCategory === 'all'
    ? packingList
    : packingList.filter((p) => p.category === activeCategory)

  const handleToggleItem = (id: string) => {
    audioSystem.playClick('soft')
    const updated = packingList.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    setPackingList(updated)

    if (updated.filter((p) => p.done).length === totalCount) {
      setTimeout(() => {
        triggerConfetti()
        audioSystem.playAchievement('quest')
      }, 200)
    }
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemText.trim()) return
    audioSystem.playClick('pop')
    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      label: newItemText.trim(),
      category: activeCategory === 'all' ? 'care' : activeCategory,
      done: false
    }
    setPackingList((prev) => [...prev, newItem])
    setNewItemText('')
  }

  const handleDownloadBoardingPass = () => {
    audioSystem.playClick('enter')
    triggerConfetti()
    setShowDownloadAlert(true)
    setTimeout(() => setShowDownloadAlert(false), 3500)
  }

  return (
    <SceneShell
      sceneId="airport"
      title="Sân Bay Quốc Tế & Đường Băng Mơ Ước"
      subtitle="Đồng hồ đếm ngược từng ngày hướng về chuyến bay Nha Trang ngày 27/08/2026"
      icon="✈️"
      companionRole="usagi"
      companionMessage="Yaaa-ha! Usagi đã chuẩn bị sẵn vé bay và vali đồ bơi rồi, sẵn sàng cất cánh cùng hai bạn nào! 🧳✈️"
    >
      <div className="airport-interior-grid">
        {/* 1. Anime Pastel Virtual Boarding Pass Card */}
        <div className="boarding-pass-card animate-slide-up">
          <div className="boarding-pass-notch top-notch" />
          <div className="boarding-pass-notch bottom-notch" />

          <div className="boarding-pass-header">
            <div className="airline-brand">
              <span className="plane-icon">✈️</span>
              <div>
                <h3>LITTLE DAYS AIRWAYS</h3>
                <small>CHUYẾN BAY TÌNH YÊU • SPECIAL COUPLE FLIGHT</small>
              </div>
            </div>
            <span className="first-class-badge">👑 FIRST CLASS</span>
          </div>

          <div className="boarding-pass-body">
            <div className="passenger-info-row">
              <div className="info-block">
                <span className="lbl">HÀNH KHÁCH / PASSENGERS</span>
                <strong className="passenger-names">Đặng Tấn Dũng & Mai Trang ❤️</strong>
              </div>
              <div className="info-block">
                <span className="lbl">CHUYẾN BAY / FLIGHT</span>
                <strong className="flight-num">LD 2708</strong>
              </div>
            </div>

            <div className="route-flight-row">
              <div className="city-block">
                <span className="city-code">HAN / SGN</span>
                <span className="city-name">Tổ Ấm Của Chúng Mình</span>
              </div>
              <div className="flight-duration-visual">
                <span className="flight-time-text">Bay ngày 27/08/2026</span>
                <div className="flight-line-plane">
                  <span className="dot" />
                  <span className="line" />
                  <span className="plane-glyph">✈️</span>
                  <span className="dot" />
                </div>
                <span className="flight-status-tag">ĐÃ XÁC NHẬN VÉ</span>
              </div>
              <div className="city-block text-right">
                <span className="city-code">CXR</span>
                <span className="city-name">Nha Trang Biển Xanh 🌴</span>
              </div>
            </div>

            <div className="boarding-pass-details-grid">
              <div className="detail-item">
                <span className="lbl">CỔNG / GATE</span>
                <strong>LOVE-01</strong>
              </div>
              <div className="detail-item">
                <span className="lbl">GHẾ NGỒI / SEATS</span>
                <strong>01A & 01B (Cửa Sổ)</strong>
              </div>
              <div className="detail-item">
                <span className="lbl">GIỜ BAY / DEPARTURE</span>
                <strong>08:30 AM</strong>
              </div>
              <div className="detail-item">
                <span className="lbl">HÀNH LÝ / BAGGAGE</span>
                <strong>20kg + 7kg Xách Tay</strong>
              </div>
            </div>
          </div>

          <div className="boarding-pass-footer">
            <div className="barcode-visual">
              <span className="barcode-lines">||||| | |||| || |||||| | ||||| |||| ||||||</span>
              <small>TICKET NO: LD-20260827-DUNG-TRANG</small>
            </div>
            <button className="btn-download-pass" onClick={handleDownloadBoardingPass}>
              🎟️ Tải Vé Máy Bay Kỷ Niệm
            </button>
          </div>

          {showDownloadAlert && (
            <div className="download-success-toast animate-bounce-gentle">
              ✨ Đã lưu vé máy bay chuyến Nha Trang 27/08 của Dũng & Mai Trang! Chúc hai bạn chuyến đi tràn ngập hạnh phúc! 💖
            </div>
          )}
        </div>

        {/* 2. Interactive Luggage Packing Checklist */}
        <div className="luggage-checklist-card">
          <div className="checklist-header">
            <div className="checklist-title-group">
              <h3>🧳 Checklist Hành Trang Du Lịch ({doneCount}/{totalCount})</h3>
              <p>Chuẩn bị chu đáo đồ dùng để chuyến đi biển Nha Trang thật trọn vẹn</p>
            </div>
            <div className="packing-stat-circle">
              <span className="pct-num">{packingPercentage}%</span>
              <small>Sẵn sàng</small>
            </div>
          </div>

          <div className="packing-progress-bar-wrap">
            <div className="packing-fill-glow" style={{ width: `${packingPercentage}%` }} />
          </div>

          {/* Category Filter Tabs */}
          <div className="packing-category-tabs">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'docs', label: '📄 Giấy Tờ & Vé' },
              { id: 'clothes', label: '👙 Đồ Bơi & Maxi' },
              { id: 'care', label: '🧴 Mỹ Phẩm & Y Tế' },
              { id: 'gadgets', label: '📱 Đồ Điện Tử' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`category-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => {
                  audioSystem.playClick('soft')
                  setActiveCategory(tab.id as typeof activeCategory)
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="packing-items-list">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`packing-item-row ${item.done ? 'packed' : ''}`}
                onClick={() => handleToggleItem(item.id)}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {}}
                  className="packing-checkbox"
                />
                <span className="packing-label">{item.label}</span>
                <span className="item-status-icon">{item.done ? '✅' : '⏳'}</span>
              </div>
            ))}
          </div>

          {/* Add custom item form */}
          <form className="add-packing-form" onSubmit={handleAddItem}>
            <input
              type="text"
              placeholder="+ Thêm đồ dùng cần mang theo..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="add-item-input"
            />
            <button type="submit" className="add-item-btn">
              + Thêm
            </button>
          </form>
        </div>
      </div>
    </SceneShell>
  )
}
