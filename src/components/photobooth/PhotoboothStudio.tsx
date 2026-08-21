import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { PHOTOBOOTH_TEMPLATES } from '../../domain/photobooth/photoboothTemplates'
import { renderPhotoboothStrip } from '../../domain/photobooth/photoboothEngine'
import type { PhotoboothTemplate, PhotoboothFilter } from '../../domain/photobooth/types'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'

interface PhotoboothStudioProps {
  onPinToCorkboard?: (stripDataUrl: string, title: string) => void
}

type CaptureCount = 4 | 6
type StudioStep = 'capture' | 'frame'

export const getPhotoboothCharacterAsset = (template: PhotoboothTemplate) => {
  const character = template.stickers.character === 'all' ? 'chiikawa' : template.stickers.character ?? 'chiikawa'
  return `./assets/${character}.png`
}

const createSlots = (count: CaptureCount) => Array<string | null>(count).fill(null)

export function PhotoboothStudio({ onPinToCorkboard }: PhotoboothStudioProps) {
  const [step, setStep] = useState<StudioStep>('capture')
  const [captureCount, setCaptureCount] = useState<CaptureCount>(4)
  const [selectedTemplate, setSelectedTemplate] = useState<PhotoboothTemplate>(PHOTOBOOTH_TEMPLATES[0])
  const [photos, setPhotos] = useState<(string | null)[]>(createSlots(4))
  const [filter, setFilter] = useState<PhotoboothFilter>('pastel')
  const [coupleTitle, setCoupleTitle] = useState('Tấn Dũng & Mai Trang')
  const [customMessage, setCustomMessage] = useState('Little Days - cùng nhau lớn lên')
  const [dateText, setDateText] = useState(() => new Date().toLocaleDateString('vi-VN'))
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const singleFileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setIsCameraActive(false)
  }, [])

  useEffect(() => stopCamera, [stopCamera])

  useEffect(() => {
    let isMounted = true
    const render = async () => {
      setIsRendering(true)
      try {
        const url = await renderPhotoboothStrip({ template: selectedTemplate, photos, filter, coupleTitle, dateText, customMessage })
        if (isMounted) setPreviewDataUrl(url)
      } catch {
        if (isMounted) setPreviewDataUrl(null)
      } finally {
        if (isMounted) setIsRendering(false)
      }
    }
    const timer = window.setTimeout(render, 120)
    return () => { isMounted = false; window.clearTimeout(timer) }
  }, [selectedTemplate, photos, filter, coupleTitle, dateText, customMessage])

  const setSequenceSize = (count: CaptureCount) => {
    audioSystem.playClick('soft')
    setCaptureCount(count)
    setPhotos(createSlots(count))
    setSelectedTemplate(PHOTOBOOTH_TEMPLATES.find(template => template.photoCount === count) ?? PHOTOBOOTH_TEMPLATES[0])
    setStep('capture')
    stopCamera()
  }

  const startCamera = async () => {
    setCameraError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Thiết bị này chưa hỗ trợ camera trong trình duyệt. Hãy dùng nút tải ảnh.')
      return
    }
    try {
      // ponytail: native getUserMedia covers the supported mobile browsers; add a camera package only for device-specific fallbacks.
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsCameraActive(true)
      audioSystem.playClick('pop')
    } catch {
      setCameraError('Không mở được camera. Hãy cho phép quyền camera hoặc tải ảnh từ máy.')
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const slotIndex = photos.findIndex(photo => photo === null)
    if (!video || slotIndex < 0 || !video.videoWidth || !video.videoHeight) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const image = canvas.toDataURL('image/jpeg', 0.92)
    const next = [...photos]
    next[slotIndex] = image
    setPhotos(next)
    audioSystem.playClick('pop')
    triggerConfetti()
    if (next.every(Boolean)) {
      stopCamera()
      setStep('frame')
    }
  }

  const retakeLast = () => {
    const lastPhoto = photos.map(Boolean).lastIndexOf(true)
    if (lastPhoto < 0) return
    const next = [...photos]
    next[lastPhoto] = null
    setPhotos(next)
    setStep('capture')
    audioSystem.playClick('soft')
  }

  const handleSelectTemplate = (template: PhotoboothTemplate) => {
    audioSystem.playClick('soft')
    setSelectedTemplate(template)
    setCoupleTitle(template.defaultTitle)
    setCustomMessage(template.defaultSubtitle)
  }

  const handleSlotClick = (index: number) => {
    setActiveSlotIndex(index)
    singleFileInputRef.current?.click()
  }

  const readIntoSlots = (files: readonly File[], startIndex = 0) => {
    const next = [...photos]
    const slots = Array.from({ length: next.length - startIndex }, (_, index) => startIndex + index)
    const selection = files.slice(0, slots.length)
    if (!selection.length) return
    let completed = 0
    selection.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = event => {
        next[slots[index]] = event.target?.result as string
        completed += 1
        if (completed === selection.length) {
          setPhotos(next)
          if (next.every(Boolean)) setStep('frame')
          triggerConfetti()
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSingleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && activeSlotIndex !== null) readIntoSlots([file], activeSlotIndex)
    event.target.value = ''
  }

  const handleBulkFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) readIntoSlots(Array.from(event.target.files))
    event.target.value = ''
  }

  const handleDownloadStrip = () => {
    if (!previewDataUrl) return
    const link = document.createElement('a')
    link.download = `LittleDays_Photobooth_${Date.now()}.png`
    link.href = previewDataUrl
    link.click()
    audioSystem.playClick('pop')
  }

  const handlePinStrip = () => {
    if (!previewDataUrl) return
    onPinToCorkboard?.(previewDataUrl, coupleTitle || 'Dải ảnh Little Days')
    audioSystem.playClick('wood')
    triggerConfetti()
  }

  const captured = photos.filter(Boolean).length
  const templates = PHOTOBOOTH_TEMPLATES.filter(template => template.photoCount === captureCount)

  return (
    <div className="photobooth-studio-container photobooth-flow">
      <input ref={singleFileInputRef} type="file" accept="image/*" onChange={handleSingleFileChange} hidden />
      <input ref={bulkFileInputRef} type="file" accept="image/*" multiple onChange={handleBulkFileChange} hidden />

      {step === 'capture' ? (
        <section className="photobooth-capture-stage" aria-label="Chụp ảnh photobooth">
          <div className="photobooth-capture-copy">
            <span>PHOTObooth Little Days</span>
            <h3>Chụp khoảnh khắc trước, chọn khung sau</h3>
            <p>Chụp một dải ảnh selfie, rồi thử những khung Chiikawa Family phù hợp nhất.</p>
          </div>

          <div className="photobooth-capture-count" role="group" aria-label="Số ảnh cần chụp">
            {([4, 6] as CaptureCount[]).map(count => <button key={count} type="button" className={captureCount === count ? 'active' : ''} onClick={() => setSequenceSize(count)}>{count} ảnh</button>)}
          </div>

          <div className="photobooth-camera-card">
            <video ref={videoRef} className="photobooth-camera-preview" autoPlay muted playsInline hidden={!isCameraActive} />
            {!isCameraActive && <div className="photobooth-camera-idle"><img src="./assets/chiikawa.png" alt="Chiikawa" /><img src="./assets/hachiware.png" alt="Hachiware" /><img src="./assets/usagi.png" alt="Usagi" /><strong>Sẵn sàng tạo dáng</strong><span>Camera chỉ mở khi bạn bấm nút bên dưới.</span></div>}
            <div className="photobooth-camera-controls">
              {!isCameraActive ? <button type="button" className="photobooth-primary-action" onClick={() => void startCamera()}>Mở camera trước</button> : <><button type="button" className="photobooth-shutter" onClick={capturePhoto} aria-label="Chụp ảnh">Chụp {captured + 1}/{captureCount}</button><button type="button" className="photobooth-secondary-action" onClick={stopCamera}>Tắt camera</button></>}
              <button type="button" className="photobooth-link-action" onClick={() => bulkFileInputRef.current?.click()}>Tải ảnh từ máy</button>
            </div>
            {cameraError && <p className="photobooth-camera-error" role="alert">{cameraError}</p>}
          </div>

          <div className="photobooth-capture-slots" aria-label={`Đã chụp ${captured} trên ${captureCount} ảnh`}>
            {photos.map((photo, index) => <button key={index} type="button" className={`photobooth-capture-slot ${photo ? 'filled' : ''}`} onClick={() => photo && handleSlotClick(index)}>{photo ? <img src={photo} alt={`Ảnh đã chụp ${index + 1}`} /> : <span>{index + 1}</span>}</button>)}
          </div>

          {captured > 0 && <button type="button" className="photobooth-retake" onClick={retakeLast}>Chụp lại ảnh gần nhất</button>}
        </section>
      ) : (
        <section className="photobooth-frame-stage" aria-label="Chọn khung photobooth">
          <div className="photobooth-frame-heading"><div><span>ẢNH ĐÃ SẴN SÀNG</span><h3>Chọn khung Chiikawa Family</h3></div><button type="button" className="photobooth-secondary-action" onClick={() => setStep('capture')}>Chụp lại</button></div>

          <div className="photobooth-template-selector" role="list" aria-label="Khung photobooth">
            <div className="templates-scroll-row">{templates.map(template => <button key={template.id} type="button" role="listitem" className={`template-chip-card ${selectedTemplate.id === template.id ? 'active' : ''}`} style={{ '--template-accent': template.accentColor } as CSSProperties} onClick={() => handleSelectTemplate(template)}><img src={getPhotoboothCharacterAsset(template)} alt="" /><div><strong>{template.name.replace(/^[^ ]+ /, '')}</strong><small>{template.photoCount} ảnh · {template.stickers.stampText}</small></div></button>)}</div>
          </div>

          <div className="photobooth-workspace-grid">
            <div className="photobooth-controls-col">
              <section className="photobooth-options-card"><h4>Ảnh trong dải</h4><div className={`slots-grid slots-${selectedTemplate.layout}`}>{photos.map((photo, index) => <button key={index} type="button" className={`photobooth-slot-box ${photo ? 'has-photo' : 'empty'}`} onClick={() => handleSlotClick(index)}>{photo ? <img src={photo} alt={`Ảnh ${index + 1}`} className="slot-thumb" /> : <span>Thêm ảnh</span>}</button>)}</div></section>
              <section className="photobooth-options-card"><h4>Màu ảnh</h4><div className="filters-list-row">{(['pastel', 'warm', 'rosy', 'bw', 'none'] as PhotoboothFilter[]).map(value => <button key={value} type="button" className={`filter-btn ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{({ pastel: 'Pastel', warm: 'Ấm áp', rosy: 'Hồng', bw: 'Đen trắng', none: 'Ảnh gốc' } as Record<PhotoboothFilter, string>)[value]}</button>)}</div></section>
              <section className="photobooth-options-card"><h4>Dòng chữ kỷ niệm</h4><label>Tên hai bạn<input className="booth-input" value={coupleTitle} onChange={event => setCoupleTitle(event.target.value)} /></label><label>Lời nhắn<input className="booth-input" value={customMessage} onChange={event => setCustomMessage(event.target.value)} /></label><label>Ngày chụp<input className="booth-input" value={dateText} onChange={event => setDateText(event.target.value)} /></label></section>
            </div>

            <aside className="photobooth-preview-col"><div className="preview-sticky-wrapper"><div className="preview-header"><h4>Dải ảnh của hai bạn</h4>{isRendering && <span>Đang tạo</span>}</div><div className="preview-canvas-card">{previewDataUrl ? <img src={previewDataUrl} alt="Dải ảnh photobooth đã chọn khung" className="preview-strip-img" /> : <div className="preview-loading-box">Đang tạo ảnh</div>}</div><div className="preview-actions-row"><button type="button" className="btn-download-strip" onClick={handleDownloadStrip}>Lưu ảnh PNG</button>{onPinToCorkboard && <button type="button" className="btn-pin-corkboard" onClick={handlePinStrip}>Ghim lên bảng ảnh</button>}</div></div></aside>
          </div>
        </section>
      )}
    </div>
  )
}
