import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { InsightsView } from '../../views/InsightsView'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { AppSettings, DailyLog } from '../../types'

interface PhotoStudioProps {
  logs: DailyLog[]
  settings: AppSettings
}

interface PolaroidPhoto {
  id: string
  title: string
  date: string
  category: 'trip' | 'food' | 'cozy'
  emoji: string
  caption: string
  isFavorite: boolean
}

const INITIAL_POLAROIDS: PolaroidPhoto[] = [
  {
    id: 'ph1',
    title: 'Buổi Hẹn Đầu Tiên',
    date: '06/06/2024',
    category: 'cozy',
    emoji: '🌸',
    caption: 'Ánh mắt đầu tiên chạm nhau, ngượng ngùng nhưng đầy ấm áp.',
    isFavorite: true
  },
  {
    id: 'ph2',
    title: 'Kem Dừa Bên Bờ Biển',
    date: '18/08/2024',
    category: 'food',
    emoji: '🥥',
    caption: 'Vị ngọt béo của kem dừa hòa cùng gió biển mát lạnh.',
    isFavorite: true
  },
  {
    id: 'ph3',
    title: 'Hoàng Hôn Vàng Rực',
    date: '20/08/2024',
    category: 'trip',
    emoji: '🌅',
    caption: 'Bầu trời nhuộm sắc cam hồng rực rỡ bên em.',
    isFavorite: false
  }
]

export function PhotoStudioInterior({ logs, settings }: PhotoStudioProps) {
  const [activeTab, setActiveTab] = useState<'corkboard' | 'insights'>('corkboard')
  const [polaroids, setPolaroids] = useState<PolaroidPhoto[]>(INITIAL_POLAROIDS)
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(INITIAL_POLAROIDS[0])

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    audioSystem.playClick('soft')
    setPolaroids(polaroids.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    triggerConfetti()
  }

  return (
    <SceneShell
      sceneId="photo-studio"
      title="Xưởng Ảnh Polaroid & Kỷ Niệm"
      subtitle="Bảng ghim lưu giữ những khung hình rạng rỡ và biểu đồ hành trình"
      icon="📸"
      companionRole="usagi"
      companionMessage="Tách tách! Usagi vừa chụp được một bức ảnh siêu lung linh nè! 📷✨"
    >
      <div className="photo-studio-container">
        {/* Navigation Tabs */}
        <div className="studio-tabs-row">
          <button
            className={`studio-tab-btn ${activeTab === 'corkboard' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('corkboard'); }}
          >
            📌 Bảng Ghim Ảnh Polaroid
          </button>
          <button
            className={`studio-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('insights'); }}
          >
            📊 Biểu Đồ & Thống Kê Hành Trình
          </button>
        </div>

        {activeTab === 'corkboard' ? (
          <div className="corkboard-scene animate-fade-in">
            <div className="corkboard-board">
              <div className="corkboard-grid">
                {polaroids.map(photo => (
                  <div
                    key={photo.id}
                    className={`polaroid-card ${selectedPhoto?.id === photo.id ? 'active-spotlight' : ''}`}
                    onClick={() => { audioSystem.playClick('wood'); setSelectedPhoto(photo); }}
                  >
                    <div className="polaroid-pin">📌</div>
                    <div className="polaroid-image-frame">
                      <span className="photo-emoji-large">{photo.emoji}</span>
                    </div>
                    <div className="polaroid-caption-area">
                      <strong>{photo.title}</strong>
                      <small>{photo.date}</small>
                      <button
                        className={`fav-star-btn ${photo.isFavorite ? 'fav' : ''}`}
                        onClick={(e) => handleToggleFavorite(photo.id, e)}
                        title="Yêu thích"
                      >
                        {photo.isFavorite ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spotlight Inspection Card */}
            {selectedPhoto && (
              <div className="photo-spotlight-drawer animate-slide-up">
                <div className="spotlight-header">
                  <span className="spotlight-badge">📸 Khoảnh Khắc Nổi Bật</span>
                  <h4>{selectedPhoto.title} ({selectedPhoto.date})</h4>
                </div>
                <p className="spotlight-quote">"{selectedPhoto.caption}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="studio-insights-scene animate-fade-in">
            <InsightsView logs={logs} settings={settings} />
          </div>
        )}
      </div>
    </SceneShell>
  )
}
