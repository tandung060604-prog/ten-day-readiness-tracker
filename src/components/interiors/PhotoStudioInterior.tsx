import { useState, useEffect } from 'react'
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
  emoji?: string
  imageUrl?: string
  caption: string
  isFavorite: boolean
}

const STORAGE_KEY = 'little_days_polaroids_v2'

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
  const [polaroids, setPolaroids] = useState<PolaroidPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return INITIAL_POLAROIDS
  })
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(polaroids[0] || null)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(polaroids))
    } catch (e) {
      console.warn('Failed to save polaroids to storage', e)
    }
  }, [polaroids])

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    audioSystem.playClick('soft')
    setPolaroids(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    triggerConfetti()
  }

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    audioSystem.playClick('wood')
    const updated = polaroids.filter(p => p.id !== id)
    setPolaroids(updated)
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(updated[0] || null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setNewImageBase64(result)
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, '').slice(0, 30) || 'Kỷ Niệm Đẹp')
      }
      setIsUploading(false)
    }
    reader.onerror = () => {
      setIsUploading(false)
      alert('Không thể tải ảnh. Vui lòng thử ảnh khác!')
    }
    reader.readAsDataURL(file)
  }

  const handleSaveUploadedPhoto = () => {
    if (!newImageBase64) {
      alert('Vui lòng chọn ảnh từ máy!')
      return
    }

    const todayStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const newPhoto: PolaroidPhoto = {
      id: `photo_${Date.now()}`,
      title: newTitle.trim() || 'Kỷ Niệm Ngọt Ngào',
      date: todayStr,
      category: 'trip',
      imageUrl: newImageBase64,
      caption: newCaption.trim() || 'Khoảnh khắc đáng nhớ của chúng mình 💖',
      isFavorite: true
    }

    const updated = [newPhoto, ...polaroids]
    setPolaroids(updated)
    setSelectedPhoto(newPhoto)
    setShowUploadModal(false)
    setNewImageBase64(null)
    setNewTitle('')
    setNewCaption('')
    audioSystem.playClick('pop')
    triggerConfetti()
  }

  return (
    <SceneShell
      sceneId="photo-studio"
      title="Xưởng Ảnh Polaroid & Kỷ Niệm"
      subtitle="Bảng ghim lưu giữ những khung hình rạng rỡ và biểu đồ hành trình"
      icon="📸"
      companionRole="usagi"
      companionMessage="Tách tách! Hãy chọn một bức ảnh đẹp từ máy và ghim lên bảng nhé! 📷✨"
    >
      <div className="photo-studio-container">
        {/* Top Control Bar with Upload Button & Tabs */}
        <div className="studio-top-controls">
          <div className="studio-tabs-row">
            <button
              className={`studio-tab-btn ${activeTab === 'corkboard' ? 'active' : ''}`}
              onClick={() => { audioSystem.playClick('soft'); setActiveTab('corkboard'); }}
            >
              📌 Bảng Ghim Ảnh Polaroid ({polaroids.length})
            </button>
            <button
              className={`studio-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => { audioSystem.playClick('soft'); setActiveTab('insights'); }}
            >
              📊 Biểu Đồ & Thống Kê Hành Trình
            </button>
          </div>

          {activeTab === 'corkboard' && (
            <button
              className="studio-upload-trigger-btn"
              onClick={() => { audioSystem.playClick('pop'); setShowUploadModal(true); }}
            >
              📤 Tải Ảnh Từ Máy Lên Bảng Ghim
            </button>
          )}
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
                      {photo.imageUrl ? (
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="polaroid-real-img"
                        />
                      ) : (
                        <span className="photo-emoji-large">{photo.emoji || '📸'}</span>
                      )}
                    </div>
                    <div className="polaroid-caption-area">
                      <strong className="polaroid-title-text">{photo.title}</strong>
                      <small className="polaroid-date-text">{photo.date}</small>
                      <div className="polaroid-actions-row">
                        <button
                          className={`fav-star-btn ${photo.isFavorite ? 'fav' : ''}`}
                          onClick={(e) => handleToggleFavorite(photo.id, e)}
                          title="Yêu thích"
                        >
                          {photo.isFavorite ? '❤️' : '🤍'}
                        </button>
                        {photo.imageUrl && (
                          <button
                            className="polaroid-delete-btn"
                            onClick={(e) => handleDeletePhoto(photo.id, e)}
                            title="Gỡ ảnh này"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
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

        {/* Upload Photo Modal */}
        {showUploadModal && (
          <div className="upload-photo-modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="upload-photo-modal-content animate-pop" onClick={e => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3>📤 Tải Ảnh Từ Thiết Bị (Máy Tính / Điện Thoại)</h3>
                <button className="modal-close-icon" onClick={() => setShowUploadModal(false)}>✕</button>
              </div>

              <div className="upload-form-body">
                <label className="device-file-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {newImageBase64 ? (
                    <div className="preview-selected-wrap">
                      <img src={newImageBase64} alt="Xem trước" className="preview-selected-img" />
                      <span className="change-img-text">🔄 Bấm để chọn ảnh khác</span>
                    </div>
                  ) : (
                    <div className="dropzone-placeholder">
                      <span className="dropzone-icon">🖼️</span>
                      <strong>{isUploading ? 'Đang đọc ảnh...' : 'Bấm vào đây để chọn ảnh từ bộ sưu tập'}</strong>
                      <small>Hỗ trợ JPG, PNG, WEBP trên máy tính và điện thoại</small>
                    </div>
                  )}
                </label>

                <div className="form-field-item">
                  <label>Tiêu đề bức ảnh:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="VD: Buổi trà chiều, Hoàng hôn Nha Trang..."
                    className="modal-text-input"
                  />
                </div>

                <div className="form-field-item">
                  <label>Lời nhắn / Cảm xúc:</label>
                  <textarea
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    placeholder="Viết vài dòng cảm xúc ngọt ngào gửi gắm vào bức ảnh..."
                    rows={3}
                    className="modal-textarea-input"
                  />
                </div>

                <div className="modal-actions-footer">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn-save-photo"
                    onClick={handleSaveUploadedPhoto}
                    disabled={!newImageBase64 || isUploading}
                  >
                    📌 Ghim Lên Bảng Kỷ Niệm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SceneShell>
  )
}
