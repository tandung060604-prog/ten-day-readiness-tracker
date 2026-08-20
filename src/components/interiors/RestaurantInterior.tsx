import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { CoupleProfile } from '../../domain/couple/types'

interface RestaurantProps {
  profile?: CoupleProfile
}

interface DateIdea {
  id: string
  title: string
  category: 'romantic' | 'adventure' | 'chill' | 'foodie'
  icon: string
  estimatedCost: string
  description: string
}

const DEFAULT_DATE_IDEAS: DateIdea[] = [
  {
    id: 'd1',
    title: 'Bữa Tối Dưới Ánh Nến Lung Linh',
    category: 'romantic',
    icon: '🕯️',
    estimatedCost: '300.000đ - 500.000đ',
    description: 'Cùng nhau tự tay nấu món mì Ý sốt kem và thưởng thức trong ánh nến thơm ấm áp.'
  },
  {
    id: 'd2',
    title: 'Đi Dạo Bãi Biển Ngắm Hoàng Hôn',
    category: 'chill',
    icon: '🌅',
    estimatedCost: 'Miễn phí ✨',
    description: 'Cùng nắm tay dạo bước bên bờ biển Nha Trang, nghe tiếng sóng vỗ rì rào.'
  },
  {
    id: 'd3',
    title: 'Rạp Chiếu Phim Tại Gia Cùng Bỏng Ngô',
    category: 'chill',
    icon: '🍿',
    estimatedCost: '50.000đ - 100.000đ',
    description: 'Bật bộ phim hoạt hình Ghibli yêu thích, đắp chung chăn mây và ăn bim bim.'
  },
  {
    id: 'd4',
    title: 'Food Tour Ẩm Thực Đường Phố',
    category: 'foodie',
    icon: '🍢',
    estimatedCost: '150.000đ - 250.000đ',
    description: 'Cùng nhau thử hết các món ăn vặt: bánh căn, nem nướng, chè bưởi thơm lừng.'
  },
  {
    id: 'd5',
    title: 'Buổi Hẹn Cà Phê Mèo Dễ Thương',
    category: 'romantic',
    icon: '🐱',
    estimatedCost: '100.000đ - 180.000đ',
    description: 'Vuốt ve những chú mèo bông mềm mại và nhâm nhi ly trà đào cam sả thơm phức.'
  }
]

export function RestaurantInterior({ profile: _profile }: RestaurantProps) {
  const [selectedIdea, setSelectedIdea] = useState<DateIdea | null>(DEFAULT_DATE_IDEAS[0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [dateWishlist, setDateWishlist] = useState<string[]>([
    'Ăn kem dừa bên bờ vịnh Nha Trang 🥥',
    'Chụp một bộ ảnh hoàng hôn lãng mạn 📸'
  ])
  const [newWishInput, setNewWishInput] = useState('')

  const handleSpinIdea = () => {
    setIsSpinning(true)
    audioSystem.playClick('wood')
    let counter = 0
    const interval = setInterval(() => {
      const random = DEFAULT_DATE_IDEAS[Math.floor(Math.random() * DEFAULT_DATE_IDEAS.length)]
      setSelectedIdea(random)
      counter++
      if (counter > 8) {
        clearInterval(interval)
        setIsSpinning(false)
        triggerConfetti()
        audioSystem.playAchievement('quest')
      }
    }, 120)
  }

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWishInput.trim()) return
    audioSystem.playClick('soft')
    setDateWishlist([...dateWishlist, newWishInput.trim()])
    setNewWishInput('')
  }

  return (
    <SceneShell
      sceneId="date-restaurant"
      title="Nhà Hàng Hẹn Hò Ánh Nến"
      subtitle="Bàn tiệc dành riêng cho hai người với view biển thơ mộng"
      icon="🍷"
      companionRole="usagi"
      companionMessage="Yaaa-ha! Bàn tiệc nến lãng mạn đã sẵn sàng, chúc hai bạn một buổi hẹn thật ngọt ngào!"
    >
      <div className="restaurant-interior-grid">
        {/* Focal Interaction: Romantic Date Idea Generator */}
        <div className="date-generator-card">
          <div className="restaurant-header-banner">
            <span className="rooftop-icon">✨</span>
            <h3>Bộ Quay Ý Tưởng Hẹn Hò Ngọt Ngào</h3>
          </div>

          <div className={`date-idea-spotlight ${isSpinning ? 'spinning' : ''}`}>
            {selectedIdea && (
              <div className="idea-content">
                <span className="idea-icon">{selectedIdea.icon}</span>
                <h4>{selectedIdea.title}</h4>
                <p className="idea-desc">{selectedIdea.description}</p>
                <div className="idea-meta">
                  <span className="idea-cost">💰 Chi phí: {selectedIdea.estimatedCost}</span>
                  <span className="idea-tag">💖 Thể loại: {selectedIdea.category}</span>
                </div>
              </div>
            )}
          </div>

          <button
            className="spin-idea-btn"
            onClick={handleSpinIdea}
            disabled={isSpinning}
          >
            {isSpinning ? '🎲 Đang Tìm Ý Tưởng Lãng Mạn...' : '🎲 Chọn Ngẫu Nhiên Ý Tưởng Mới!'}
          </button>
        </div>

        {/* Wishlist & Date Planning Card */}
        <div className="date-wishlist-card">
          <h3>💌 Danh Sách Ước Mơ Hẹn Hò</h3>
          <p>Những địa điểm và hoạt động hai bạn muốn cùng nhau trải nghiệm:</p>

          <form onSubmit={handleAddWish} className="add-wish-form">
            <input
              type="text"
              value={newWishInput}
              onChange={(e) => setNewWishInput(e.target.value)}
              placeholder="Thêm điều muốn làm cùng nhau..."
            />
            <button type="submit" className="add-wish-btn">➕ Thêm</button>
          </form>

          <ul className="wishlist-items">
            {dateWishlist.map((item, idx) => (
              <li key={idx} className="wish-item">
                <span>💖 {item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SceneShell>
  )
}
