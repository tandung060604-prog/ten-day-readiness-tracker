import { useState, useEffect, useRef } from 'react'
import { PHOTOBOOTH_TEMPLATES } from '../../domain/photobooth/photoboothTemplates'
import { renderPhotoboothStrip } from '../../domain/photobooth/photoboothEngine'
import type { PhotoboothTemplate, PhotoboothFilter } from '../../domain/photobooth/types'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'

interface PhotoboothStudioProps {
  onPinToCorkboard?: (stripDataUrl: string, title: string) => void
}

const SAMPLE_DEMO_PHOTOS = [
  './assets/dung.jpg',
  './assets/nguoiyeu.jpg',
  './assets/interiors/home_bg.jpg',
  './assets/interiors/beach_bg.jpg',
  './assets/interiors/restaurant_bg.jpg',
  './assets/interiors/sleep_bg.jpg'
]

export function PhotoboothStudio({ onPinToCorkboard }: PhotoboothStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PhotoboothTemplate>(PHOTOBOOTH_TEMPLATES[0])
  const [photos, setPhotos] = useState<(string | null)[]>(Array(PHOTOBOOTH_TEMPLATES[0].photoCount).fill(null))
  const [filter, setFilter] = useState<PhotoboothFilter>('pastel')
  const [coupleTitle, setCoupleTitle] = useState('Dũng & Chiikawa')
  const [customMessage, setCustomMessage] = useState('Little Days · Life4Cuts')
  const [dateText, setDateText] = useState(() => new Date().toLocaleDateString('vi-VN'))
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)

  const singleFileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)

  // Reset photos array when switching between 4-photo and 6-photo templates
  const handleSelectTemplate = (tmpl: PhotoboothTemplate) => {
    audioSystem.playClick('soft')
    setSelectedTemplate(tmpl)
    setCoupleTitle(tmpl.defaultTitle)
    setCustomMessage(tmpl.defaultSubtitle)
    if (photos.length !== tmpl.photoCount) {
      const newPhotos = Array(tmpl.photoCount).fill(null)
      for (let i = 0; i < Math.min(photos.length, tmpl.photoCount); i++) {
        newPhotos[i] = photos[i]
      }
      setPhotos(newPhotos)
    }
  }

  // Trigger live render when inputs change
  useEffect(() => {
    let isMounted = true
    const generatePreview = async () => {
      setIsRendering(true)
      try {
        const url = await renderPhotoboothStrip({
          template: selectedTemplate,
          photos,
          filter,
          coupleTitle,
          dateText,
          customMessage
        })
        if (isMounted) setPreviewDataUrl(url)
      } catch (err) {
        console.warn('Failed to render photobooth preview', err)
      } finally {
        if (isMounted) setIsRendering(false)
      }
    }

    const timer = setTimeout(generatePreview, 150)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [selectedTemplate, photos, filter, coupleTitle, dateText, customMessage])

  // Single Slot Photo Click
  const handleSlotClick = (index: number) => {
    audioSystem.playClick('pop')
    setActiveSlotIndex(index)
    singleFileInputRef.current?.click()
  }

  // Handle single file upload
  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || activeSlotIndex === null) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const updated = [...photos]
      updated[activeSlotIndex] = dataUrl
      setPhotos(updated)
      triggerConfetti()
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Bulk Upload Multiple Photos
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const count = Math.min(files.length, selectedTemplate.photoCount)
    const newPhotos = [...photos]
    let loadedCount = 0

    for (let i = 0; i < count; i++) {
      const reader = new FileReader()
      const slotIndex = i
      reader.onload = (event) => {
        newPhotos[slotIndex] = event.target?.result as string
        loadedCount++
        if (loadedCount === count) {
          setPhotos([...newPhotos])
          triggerConfetti()
        }
      }
      reader.readAsDataURL(files[i])
    }
    e.target.value = ''
  }

  // Fill Sample Demo Photos
  const handleFillDemoPhotos = () => {
    audioSystem.playClick('pop')
    const filled = Array(selectedTemplate.photoCount).fill(null).map((_, i) => SAMPLE_DEMO_PHOTOS[i % SAMPLE_DEMO_PHOTOS.length])
    setPhotos(filled)
    triggerConfetti()
  }

  // Download High-Res Strip
  const handleDownloadStrip = () => {
    if (!previewDataUrl) return
    audioSystem.playClick('pop')
    const link = document.createElement('a')
    link.download = `Photobooth_${selectedTemplate.id}_${Date.now()}.png`
    link.href = previewDataUrl
    link.click()
    triggerConfetti()
  }

  // Pin to Corkboard
  const handlePinStrip = () => {
    if (!previewDataUrl) return
    audioSystem.playClick('wood')
    onPinToCorkboard?.(previewDataUrl, coupleTitle || 'Dải Ảnh Photobooth')
    triggerConfetti()
    alert('Đã ghim dải ảnh Photobooth lên Bảng Ghim Polaroid thành công! 📌💖')
  }

  return (
    <div className="photobooth-studio-container">
      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        ref={singleFileInputRef}
        onChange={handleSingleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept="image/*"
        multiple
        ref={bulkFileInputRef}
        onChange={handleBulkFileChange}
        style={{ display: 'none' }}
      />

      {/* Top Banner / Template Mode Switcher */}
      <div className="photobooth-header-banner">
        <div>
          <h3>📸 Tiệm Chụp Ảnh Photobooth Hàn Quốc & Chiikawa</h3>
          <p>Tự tạo dải ảnh Life4Cuts 4 ô & 6 ô chuẩn phong cách sticker đôi lứa cực đáng yêu</p>
        </div>
        <div className="photobooth-quick-actions">
          <button className="btn-bulk-upload" onClick={() => bulkFileInputRef.current?.click()}>
            ⚡ Tải {selectedTemplate.photoCount} Ảnh Cùng Lúc
          </button>
          <button className="btn-fill-demo" onClick={handleFillDemoPhotos}>
            🌸 Dùng Ảnh Mẫu
          </button>
        </div>
      </div>

      {/* Template Selector Carousel */}
      <div className="photobooth-template-selector">
        <span className="template-selector-title">
          🎨 Chọn Mẫu Khung Photobooth ({PHOTOBOOTH_TEMPLATES.length} Mẫu: 6 Mẫu 4-Ảnh • 2 Mẫu 6-Ảnh):
        </span>
        <div className="templates-scroll-row">
          {PHOTOBOOTH_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              className={`template-chip-card ${selectedTemplate.id === tmpl.id ? 'active' : ''}`}
              style={{
                borderColor: selectedTemplate.id === tmpl.id ? tmpl.accentColor : 'rgba(0,0,0,0.1)',
                background: selectedTemplate.id === tmpl.id ? tmpl.backgroundColor : '#ffffff'
              }}
              onClick={() => handleSelectTemplate(tmpl)}
            >
              <span className="tmpl-badge-emoji">{tmpl.badgeEmoji}</span>
              <div className="tmpl-info">
                <strong>{tmpl.name}</strong>
                <small>{tmpl.photoCount} Ô Ảnh • {tmpl.layout.replace('_', ' ').toUpperCase()}</small>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace (Left: Controls & Slots / Right: Live Strip Preview) */}
      <div className="photobooth-workspace-grid">
        {/* Left Column: Photo Slots & Customization Options */}
        <div className="photobooth-controls-col">
          {/* Photo Slot Selection Grid */}
          <div className="slots-grid-card">
            <h4>🖼️ Tải Ảnh Cho Từng Ô ({selectedTemplate.photoCount} Ô):</h4>
            <div className={`slots-grid slots-${selectedTemplate.layout}`}>
              {photos.map((photoSrc, idx) => (
                <div
                  key={idx}
                  className={`photobooth-slot-box ${photoSrc ? 'has-photo' : 'empty'}`}
                  onClick={() => handleSlotClick(idx)}
                >
                  {photoSrc ? (
                    <div className="slot-img-wrap">
                      <img src={photoSrc} alt={`Ô ${idx + 1}`} className="slot-thumb" />
                      <span className="slot-replace-pill">🔄 Đổi</span>
                    </div>
                  ) : (
                    <div className="slot-empty-content">
                      <span className="slot-plus-icon">＋</span>
                      <span>Ô {idx + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Color Filter Selector */}
          <div className="photobooth-options-card">
            <h4>✨ Chọn Bộ Lọc Màu Photobooth:</h4>
            <div className="filters-list-row">
              {(['pastel', 'warm', 'rosy', 'bw', 'none'] as PhotoboothFilter[]).map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => { audioSystem.playClick('soft'); setFilter(f) }}
                >
                  {f === 'pastel' && '🌸 Pastel Hàn Quốc'}
                  {f === 'warm' && '☕ Vintage Nhật'}
                  {f === 'rosy' && '💖 Hồng Mộng Mơ'}
                  {f === 'bw' && '🎞️ Đen Trắng Retro'}
                  {f === 'none' && '🌿 Ảnh Gốc'}
                </button>
              ))}
            </div>
          </div>

          {/* Text & Date Inputs */}
          <div className="photobooth-options-card">
            <h4>✍️ Tùy Chỉnh Chữ & Ngày Kỷ Niệm:</h4>
            <div className="inputs-vertical-stack">
              <div className="input-group">
                <label>Tên Cặp Đôi / Tiêu Đề:</label>
                <input
                  type="text"
                  value={coupleTitle}
                  onChange={e => setCoupleTitle(e.target.value)}
                  placeholder="VD: Dũng & Bé Yêu"
                  className="booth-input"
                />
              </div>
              <div className="input-group">
                <label>Lời Nhắn / Phụ Đề:</label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  placeholder="VD: Little Days · 10-Day Life4Cuts"
                  className="booth-input"
                />
              </div>
              <div className="input-group">
                <label>Ngày Chụp:</label>
                <input
                  type="text"
                  value={dateText}
                  onChange={e => setDateText(e.target.value)}
                  placeholder="VD: 20/08/2026"
                  className="booth-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Strip Preview & Export Actions */}
        <div className="photobooth-preview-col">
          <div className="preview-sticky-wrapper">
            <div className="preview-header">
              <h4>👀 Xem Trước Dải Ảnh Photobooth</h4>
              {isRendering && <span className="rendering-badge">Đang xuất ảnh...</span>}
            </div>

            <div className="preview-canvas-card">
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Xem trước Photobooth"
                  className="preview-strip-img animate-pop"
                />
              ) : (
                <div className="preview-loading-box">Đang tạo dải ảnh...</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="preview-actions-row">
              <button className="btn-download-strip" onClick={handleDownloadStrip}>
                💾 Tải Dải Ảnh Về Máy (PNG)
              </button>
              {onPinToCorkboard && (
                <button className="btn-pin-corkboard" onClick={handlePinStrip}>
                  📌 Ghim Lên Bảng Polaroid
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
