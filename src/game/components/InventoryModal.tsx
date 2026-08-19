import { Modal } from '../../components/common/Modal'
import { GameIcon } from '../../components/common/GameIcons'
import type { InventoryItem } from '../types'
import { audioSystem } from '../systems/GameAudioSystem'

type Props = {
  isOpen: boolean
  onClose: () => void
  items: InventoryItem[]
}

const ITEM_ICON_MAP: Record<string, 'strawberry' | 'pudding' | 'star' | 'ribbon' | 'gem'> = {
  strawberries: 'strawberry',
  pudding: 'pudding',
  gold_star: 'star',
  love_ribbon: 'ribbon'
}

export function InventoryModal({ isOpen, onClose, items }: Props) {
  if (!isOpen) return null

  return (
    <Modal title="Túi Đồ Kỷ Niệm (Inventory)" subtitle="Vật phẩm & Quà tặng tích lũy từ các nhiệm vụ hàng ngày" onClose={onClose}>
      <div className="inventory-grid">
        {items.map((item) => {
          const iconName = ITEM_ICON_MAP[item.id] || 'star'

          return (
            <div
              key={item.id}
              className="inventory-item-card"
              onClick={() => audioSystem.playClick('pop')}
            >
              <div className="item-icon-box">
                <GameIcon name={iconName} size={32} />
                <span className="item-count-badge">x{item.count}</span>
              </div>
              <strong className="item-name">{item.name}</strong>
              <p className="item-desc">{item.description}</p>
            </div>
          )
        })}
      </div>

      <div className="inventory-hint-note">
        <span>💡 Mẹo:</span> Hoàn thành các nhiệm vụ tập luyện, uống nước và đi ngủ đúng giờ để mở khóa thêm nhiều món quà dễ thương cho ngôi nhà của 2 bạn!
      </div>
    </Modal>
  )
}
