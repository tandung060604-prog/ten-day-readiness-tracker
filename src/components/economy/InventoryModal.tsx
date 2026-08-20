import { useState } from 'react'
import { Modal } from '../common/Modal'
import { getItem } from '../../domain/economy/itemRegistry'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import type { InventorySlot, ItemCategory } from '../../domain/economy/types'

interface InventoryModalProps {
  isOpen: boolean
  inventory: InventorySlot[]
  coins: number
  hearts: number
  stars: number
  onClose: () => void
}

type TabKey = 'all' | ItemCategory

export function InventoryModal({
  isOpen,
  inventory,
  coins,
  hearts,
  stars,
  onClose
}: InventoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  if (!isOpen) return null

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'all', label: 'Tất Cả', icon: '🎒' },
    { key: 'building_materials', label: 'Vật Liệu', icon: '🪵' },
    { key: 'ingredients', label: 'Nguyên Liệu', icon: '🌾' },
    { key: 'decorations', label: 'Trang Trí', icon: '🪴' },
    { key: 'memory_collectibles', label: 'Kỷ Vật', icon: '📸' },
    { key: 'puzzle_boosters', label: 'Bổ Trợ', icon: '🚀' },
    { key: 'souvenirs', label: 'Lưu Niệm', icon: '🐚' }
  ]

  const filteredSlots = inventory.filter(slot => {
    if (activeTab === 'all') return true
    const item = getItem(slot.itemId)
    return item?.category === activeTab
  })

  return (
    <Modal title="Túi Đồ Cặp Đôi (Couple Backpack)" onClose={onClose}>
      <div className="inventory-modal-container">
        {/* Currencies Bar */}
        <div className="inventory-currencies-bar">
          <div className="curr-item">
            <span>🪙 Xu:</span>
            <strong>{coins}</strong>
          </div>
          <div className="curr-item">
            <span>💖 Tim:</span>
            <strong>{hearts}</strong>
          </div>
          <div className="curr-item">
            <span>⭐ Sao:</span>
            <strong>{stars}</strong>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="inventory-category-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`inv-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => {
                audioSystem.playClick('soft')
                setActiveTab(tab.key)
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Inventory Item Grid */}
        <div className="inventory-items-grid">
          {filteredSlots.length === 0 ? (
            <div className="empty-inventory-state">
              <span className="empty-icon">🎒</span>
              <p>Chưa có vật phẩm trong danh mục này. Hãy hoàn thành nhiệm vụ và vượt ải giải đố để thu thập nhé!</p>
            </div>
          ) : (
            filteredSlots.map(slot => {
              const item = getItem(slot.itemId)
              if (!item) return null

              return (
                <div key={slot.itemId} className={`inventory-item-card rarity-${item.rarity}`}>
                  <div className="item-icon-box">
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-qty-badge">x{slot.quantity}</span>
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}
