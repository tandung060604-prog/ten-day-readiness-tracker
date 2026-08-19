import { useState } from 'react'
import { Modal } from '../common/Modal'
import { parseFoodInput } from '../../utils/autoCategory'
import type { FoodItem, MealEntry, MealType } from '../../types'

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Bữa sáng',
  snack: 'Snack phụ',
  lunch: 'Bữa trưa',
  'pre-workout': 'Pre-workout',
  dinner: 'Bữa tối',
  other: 'Khác'
}

const CATEGORY_LABELS: Record<NonNullable<FoodItem['category']>, { label: string; color: string }> = {
  protein: { label: 'Protein (Đạm)', color: '#7dbbff' },
  carb: { label: 'Carb (Tinh bột)', color: '#f6c96a' },
  vegetable: { label: 'Rau xanh / Xơ', color: '#4ee1aa' },
  fruit: { label: 'Trái cây', color: '#cc8fff' },
  dairy: { label: 'Sữa / Dairy', color: '#67b7ff' },
  fat: { label: 'Chất béo tốt', color: '#ffa07a' },
  drink: { label: 'Đồ uống', color: '#00f2fe' },
  other: { label: 'Khác', color: '#8fa1b2' }
}

type Props = {
  day: number
  editingMeal?: MealEntry | null
  onClose: () => void
  onSave: (meal: MealEntry) => void
  onDelete?: (mealId: string) => void
}

export function MealModal({ day, editingMeal, onClose, onSave, onDelete }: Props) {
  const [type, setType] = useState<MealType>(editingMeal?.mealType || 'lunch')
  const [time, setTime] = useState(editingMeal?.time || new Date().toTimeString().slice(0, 5))
  const [foodText, setFoodText] = useState(
    editingMeal ? editingMeal.foods.map(f => f.name).join(', ') : ''
  )
  const [foodItems, setFoodItems] = useState<FoodItem[]>(editingMeal?.foods || [])
  const [notes, setNotes] = useState(editingMeal?.notes || '')

  // When text changes, update parsed items
  const handleFoodTextChange = (text: string) => {
    setFoodText(text)
    const parsed = parseFoodInput(text)
    setFoodItems(parsed)
  }

  const handleCategoryChange = (index: number, newCategory: FoodItem['category']) => {
    setFoodItems(prev => prev.map((item, i) => i === index ? { ...item, category: newCategory } : item))
  }

  const handleSave = () => {
    if (!foodItems.length && !foodText.trim()) return
    const finalItems = foodItems.length ? foodItems : parseFoodInput(foodText)
    
    const meal: MealEntry = {
      id: editingMeal?.id || `meal-${Date.now()}`,
      day,
      mealType: type,
      time,
      foods: finalItems,
      notes: notes.trim() || undefined,
      photoIds: editingMeal?.photoIds || []
    }
    onSave(meal)
    onClose()
  }

  return (
    <Modal
      title={editingMeal ? 'Chỉnh sửa Bữa ăn' : 'Thêm Bữa ăn Mới'}
      subtitle={`Ghi nhận dinh dưỡng cho Ngày ${day}`}
      onClose={onClose}
    >
      <div className="form-grid">
        <label>
          Loại bữa ăn
          <select value={type} onChange={(e) => setType(e.target.value as MealType)}>
            {Object.entries(MEAL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Thời gian ăn
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>

        <label className="full">
          <span>Các món ăn <small>(ngăn cách bằng dấu phẩy hoặc xuống dòng)</small></span>
          <textarea
            value={foodText}
            onChange={(e) => handleFoodTextChange(e.target.value)}
            placeholder="Ví dụ: 200g ức gà áp chảo, 1 bát cơm gạo lứt, đĩa bông cải xanh luộc, 1 quả chuối"
            rows={3}
          />
        </label>

        {foodItems.length > 0 && (
          <div className="full food-category-manager">
            <span className="category-manager-title">
              ✦ Phân loại nhóm chất (tự động nhận diện):
            </span>
            <div className="category-tags-list">
              {foodItems.map((item, idx) => (
                <div key={item.id || idx} className="category-tag-editor">
                  <span className="food-name">{item.name}</span>
                  <select
                    value={item.category || 'other'}
                    onChange={(e) => handleCategoryChange(idx, e.target.value as any)}
                    className="tag-select"
                    style={{
                      borderColor: CATEGORY_LABELS[item.category || 'other']?.color
                    }}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, catInfo]) => (
                      <option key={catKey} value={catKey}>
                        {catInfo.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="full">
          Ghi chú thêm (cảm giác no, phản ứng cơ thể, tiêu hóa...)
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ăn no vừa phải, tiêu hóa êm..."
          />
        </label>

        <div className="full modal-actions-row">
          {editingMeal && onDelete && (
            <button
              type="button"
              className="danger compact"
              onClick={() => {
                if (confirm('Bạn có chắc muốn xóa bữa ăn này?')) {
                  onDelete(editingMeal.id)
                  onClose()
                }
              }}
            >
              Xóa bữa ăn
            </button>
          )}
          <button type="button" className="secondary compact" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="primary" onClick={handleSave}>
            {editingMeal ? 'Cập nhật bữa ăn' : 'Lưu bữa ăn'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
