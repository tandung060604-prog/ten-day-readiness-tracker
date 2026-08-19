import { useEffect, useState } from 'react'
import { deletePhoto, getPhoto, savePhoto } from '../db/photos'

type Props = {
  photoIds: string[]
  onChange: (ids: string[]) => void
}

export function PhotoStrip({ photoIds, onChange }: Props) {
  const [urls, setUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true
    const load = async () => {
      const next: Record<string, string> = {}
      for (const id of photoIds) {
        const blob = await getPhoto(id)
        if (blob) next[id] = URL.createObjectURL(blob)
      }
      if (active) setUrls(next)
    }
    load()
    return () => {
      active = false
      Object.values(urls).forEach(URL.revokeObjectURL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoIds.join('|')])

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    const ids = [...photoIds]
    for (const file of Array.from(files)) {
      const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`
      await savePhoto(id, file)
      ids.push(id)
    }
    onChange(ids)
  }

  const remove = async (id: string) => {
    await deletePhoto(id)
    onChange(photoIds.filter((x) => x !== id))
  }

  return (
    <div className="photo-strip">
      {photoIds.map((id) => (
        <div className="photo-thumb" key={id}>
          {urls[id] ? <img src={urls[id]} alt="Meal evidence" /> : <div className="photo-loading">...</div>}
          <button aria-label="Xóa ảnh" onClick={() => remove(id)}>×</button>
        </div>
      ))}
      <label className="photo-add">
        <input type="file" accept="image/*" capture="environment" multiple onChange={(e) => add(e.target.files)} />
        <span>＋</span>
        <small>Ảnh bữa ăn</small>
      </label>
    </div>
  )
}
