import { useState } from 'react'
import { PhotoStrip } from '../components/PhotoStrip'
import { MealModal } from '../components/modals/MealModal'
import type { DailyLog, MealEntry, MealType } from '../types'

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Bữa sáng',
  snack: 'Snack phụ',
  lunch: 'Bữa trưa',
  'pre-workout': 'Pre-workout',
  dinner: 'Bữa tối',
  other: 'Khác'
}

type Props = {
  logs: DailyLog[]
  currentDay: number
  setLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>
  onAddMeal: () => void
}

export function MealsView({ logs, currentDay, setLogs }: Props) {
  const log = logs.find((l) => l.dayNumber === currentDay) || logs[currentDay - 1]
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const updateMealPhotos = (mealId: string, photoIds: string[]) => {
    setLogs((all) =>
      all.map((l) =>
        l.dayNumber === currentDay
          ? {
              ...l,
              meals: l.meals.map((m) => (m.id === mealId ? { ...m, photoIds } : m))
            }
          : l
      )
    )
  }

  const handleSaveMeal = (meal: MealEntry) => {
    setLogs((all) =>
      all.map((l) => {
        if (l.dayNumber !== currentDay) return l
        const exists = l.meals.some((m) => m.id === meal.id)
        const updatedMeals = exists
          ? l.meals.map((m) => (m.id === meal.id ? meal : m))
          : [...l.meals, meal]
        return { ...l, meals: updatedMeals }
      })
    )
  }

  const handleDeleteMeal = (mealId: string) => {
    setLogs((all) =>
      all.map((l) =>
        l.dayNumber === currentDay
          ? { ...l, meals: l.meals.filter((m) => m.id !== mealId) }
          : l
      )
    )
  }

  return (
    <div className="view-container animate-fade-in">
      <section className="card">
        <div className="section-head">
          <div>
            <small>DINH DƯỠNG NGÀY {currentDay}</small>
            <h3>Nhật ký bữa ăn & Ảnh chụp</h3>
          </div>
          <button className="primary" onClick={() => setShowAddModal(true)}>
            ＋ Thêm bữa ăn
          </button>
        </div>

        {!log.meals.length ? (
          <div className="empty-state">
            <div className="empty-icon">🥗</div>
            <h3>Chưa có bữa ăn nào được ghi lại</h3>
            <p>Hãy bấm vào nút "Thêm bữa ăn" để ghi lại dinh dưỡng và chụp ảnh bữa ăn của bạn.</p>
            <button className="primary mt-2" onClick={() => setShowAddModal(true)}>
              ＋ Thêm bữa ăn đầu tiên
            </button>
          </div>
        ) : (
          <div className="meal-list">
            {log.meals.map((m) => (
              <article className="meal-card" key={m.id}>
                <div className="meal-head">
                  <div className="meal-title-group">
                    <span className="meal-type-pill">{MEAL_LABELS[m.mealType]}</span>
                    <time className="meal-time">{m.time}</time>
                  </div>
                  <div className="meal-actions-group">
                    <span className="meal-food-count">{m.foods.length} món</span>
                    <button
                      className="edit-meal-btn"
                      onClick={() => setEditingMeal(m)}
                      title="Chỉnh sửa bữa ăn"
                    >
                      ✎ Sửa
                    </button>
                  </div>
                </div>

                <div className="food-tags">
                  {m.foods.map((f) => (
                    <span key={f.id} className={`food-tag ${f.category || 'other'}`}>
                      {f.name}
                      {f.amount ? ` · ${f.amount}${f.unit || ''}` : ''}
                    </span>
                  ))}
                </div>

                {m.notes && <p className="meal-note">📝 {m.notes}</p>}

                <div className="meal-photos-section">
                  <PhotoStrip
                    photoIds={m.photoIds || []}
                    onChange={(ids) => updateMealPhotos(m.id, ids)}
                  />
                </div>

                <div className="privacy-note">
                  🔒 Ảnh được lưu an toàn trên máy (IndexedDB) · Không gửi lên cloud.
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <small>HƯỚNG DẪN DINH DƯỠNG</small>
            <h3>Cấu trúc 1 đĩa ăn cân bằng (Balanced Plate)</h3>
          </div>
        </div>
        <div className="macro-grid">
          <div className="macro-card protein-card">
            <b>🥩 Protein (Đạm sạch)</b>
            <span>Ức gà · cá hồi · trứng · thịt bò nạc · đậu phụ (chiếm 25–30% đĩa)</span>
          </div>
          <div className="macro-card carb-card">
            <b>🍚 Carb (Tinh bột chậm)</b>
            <span>Cơm gạo lứt · khoai lang · yến mạch · bánh mì đen · chuối</span>
          </div>
          <div className="macro-card veg-card">
            <b>🥦 Rau củ & Chất xơ</b>
            <span>150–250g rau xanh mỗi bữa chính (bông cải, cải chíp, xà lách)</span>
          </div>
          <div className="macro-card fruit-card">
            <b>🍎 Trái cây & Vi chất</b>
            <span>1–2 khẩu phần táo, cam, việt quất hoặc sữa chua lên men</span>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showAddModal && (
        <MealModal
          day={currentDay}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveMeal}
        />
      )}

      {editingMeal && (
        <MealModal
          day={currentDay}
          editingMeal={editingMeal}
          onClose={() => setEditingMeal(null)}
          onSave={handleSaveMeal}
          onDelete={handleDeleteMeal}
        />
      )}
    </div>
  )
}
