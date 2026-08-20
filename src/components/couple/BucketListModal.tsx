import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { coupleStorage } from '../../domain/couple/coupleStorage'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { BucketListItem } from '../../domain/couple/coupleFeatures'

interface BucketListModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BucketListModal({ isOpen, onClose }: BucketListModalProps) {
  const [items, setItems] = useState<BucketListItem[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<BucketListItem['category']>('experiences')

  useEffect(() => {
    if (isOpen) {
      setItems(coupleStorage.loadBucketList())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleToggleItem = (id: string) => {
    audioSystem.playClick('pop')
    const updated = items.map(item => {
      if (item.id === id) {
        const nextCompleted = !item.isCompleted
        if (nextCompleted) triggerConfetti()
        return {
          ...item,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        }
      }
      return item
    })
    setItems(updated)
    coupleStorage.saveBucketList(updated)
  }

  const handleAddItem = () => {
    if (!newTitle.trim()) return
    audioSystem.playClick('soft')

    const newItem: BucketListItem = {
      id: `bucket_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      isCompleted: false
    }

    const updated = [newItem, ...items]
    setItems(updated)
    coupleStorage.saveBucketList(updated)
    setNewTitle('')
  }

  return (
    <Modal title="Danh Sách Ước Nguyện Đôi (Couple Bucket List)" onClose={onClose}>
      <div className="bucket-list-container">
        {/* Add Item Form */}
        <div className="add-bucket-item-row">
          <input
            type="text"
            placeholder="Thêm một điều ước mới của hai bạn..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddItem()}
          />
          <select value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
            <option value="experiences">✨ Trải nghiệm</option>
            <option value="trips">🏖️ Chuyến đi</option>
            <option value="food">🍲 Món ăn</option>
            <option value="places">📸 Địa điểm</option>
          </select>
          <button className="add-btn" onClick={handleAddItem} disabled={!newTitle.trim()}>
            ➕ Thêm
          </button>
        </div>

        {/* Bucket Items List */}
        <div className="bucket-items-list">
          {items.map(item => (
            <div
              key={item.id}
              className={`bucket-item-card ${item.isCompleted ? 'completed' : 'pending'}`}
              onClick={() => handleToggleItem(item.id)}
            >
              <span className="checkbox-icon">{item.isCompleted ? '✅' : '⚪'}</span>
              <div className="bucket-text-col">
                <h4 className={item.isCompleted ? 'strikethrough' : ''}>{item.title}</h4>
                <span className="bucket-category-tag">
                  {item.category === 'trips' && '🏖️ Chuyến đi'}
                  {item.category === 'food' && '🍲 Món ăn'}
                  {item.category === 'experiences' && '✨ Trải nghiệm'}
                  {item.category === 'places' && '📸 Địa điểm'}
                  {item.isCompleted && item.completedAt && ` • Hoàn thành: ${new Date(item.completedAt).toLocaleDateString('vi-VN')}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
