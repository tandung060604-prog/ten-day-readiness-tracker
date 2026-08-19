import { useEffect, useState } from 'react'
import { deletePhoto, getPhoto, savePhoto } from '../../db/photos'
import { Modal } from '../common/Modal'

type Props = {
  photoIds: string[]
  onChange: (ids: string[]) => void
}

export function PhotoStrip({ photoIds, onChange }: Props) {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    let active = true
    const currentUrls: Record<string, string> = {}

    const load = async () => {
      for (const id of photoIds) {
        const blob = await getPhoto(id)
        if (blob && active) {
          currentUrls[id] = URL.createObjectURL(blob)
        }
      }
      if (active) {
        setUrls(currentUrls)
      }
    }

    load()

    return () => {
      active = false
      Object.values(currentUrls).forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch {
          // ignore
        }
      })
    }
  }, [photoIds.join('|')])

  const handleAdd = async (files: FileList | null) => {
    if (!files?.length) return
    setIsUploading(true)
    try {
      const nextIds = [...photoIds]
      for (const file of Array.from(files)) {
        const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        await savePhoto(id, file)
        nextIds.push(id)
      }
      onChange(nextIds)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Xóa bức ảnh này khỏi bộ nhớ máy?')) return
    await deletePhoto(id)
    onChange(photoIds.filter((x) => x !== id))
  }

  return (
    <div className="photo-strip-container">
      <div className="photo-strip">
        {photoIds.map((id) => (
          <div
            className="photo-thumb animate-scale-up"
            key={id}
            onClick={() => urls[id] && setPreviewUrl(urls[id])}
            title="Bấm để xem ảnh phóng to"
          >
            {urls[id] ? (
              <img src={urls[id]} alt="Ảnh bằng chứng bữa ăn" />
            ) : (
              <div className="photo-loading">Đang tải...</div>
            )}
            <button
              className="photo-delete-btn"
              aria-label="Xóa ảnh"
              onClick={(e) => handleRemove(e, id)}
              title="Xóa ảnh"
            >
              ✕
            </button>
          </div>
        ))}

        <label className={`photo-add ${isUploading ? 'loading' : ''}`}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => handleAdd(e.target.files)}
            disabled={isUploading}
          />
          <span className="photo-add-icon">{isUploading ? '⌛' : '＋'}</span>
          <small>{isUploading ? 'Đang lưu...' : 'Thêm ảnh món'}</small>
        </label>
      </div>

      {previewUrl && (
        <Modal title="Chi tiết ảnh bữa ăn" onClose={() => setPreviewUrl(null)} maxWidth="700px">
          <div className="photo-preview-modal">
            <img src={previewUrl} alt="Phóng to ảnh bữa ăn" className="preview-img-full" />
            <div className="preview-footer">
              <small className="privacy-badge">🔒 Lưu trữ cục bộ trên thiết bị của bạn (IndexedDB)</small>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
