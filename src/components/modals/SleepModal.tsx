import { useState } from 'react'
import { Modal } from '../common/Modal'
import { triggerHaptic } from '../../utils/haptics'
import type { SleepEntry } from '../../types'

type Props = {
  initialSleep?: SleepEntry
  onClose: () => void
  onSave: (sleep: SleepEntry) => void
}

export function SleepModal({ initialSleep, onClose, onSave }: Props) {
  const [bedtime, setBedtime] = useState(initialSleep?.bedtime || '23:00')
  const [wakeTime, setWakeTime] = useState(initialSleep?.wakeTime || '06:30')
  const [nightHours, setNightHours] = useState(initialSleep?.nightHours ?? 7.5)
  const [napMinutes, setNapMinutes] = useState(initialSleep?.napMinutes ?? 0)
  const [quality, setQuality] = useState(initialSleep?.quality ?? 4)

  const cycles = (Number(nightHours) / 1.5).toFixed(1)
  const isOptimal = Number(nightHours) >= 7.5 && Number(nightHours) <= 8.5

  // Auto calculate night hours if bedtime and waketime change
  const handleAutoCalc = (bed: string, wake: string) => {
    try {
      const [bH, bM] = bed.split(':').map(Number)
      const [wH, wM] = wake.split(':').map(Number)
      let bMinutes = bH * 60 + bM
      let wMinutes = wH * 60 + wM
      if (wMinutes < bMinutes) {
        wMinutes += 24 * 60
      }
      const totalHours = Math.round(((wMinutes - bMinutes) / 60) * 10) / 10
      if (totalHours > 0 && totalHours <= 16) {
        setNightHours(totalHours)
      }
    } catch {
      // ignore
    }
  }

  const handleBedChange = (val: string) => {
    setBedtime(val)
    handleAutoCalc(val, wakeTime)
  }

  const handleWakeChange = (val: string) => {
    setWakeTime(val)
    handleAutoCalc(bedtime, val)
  }

  const handleSave = () => {
    triggerHaptic('success')
    onSave({
      bedtime,
      wakeTime,
      nightHours: Math.max(0, Number(nightHours)),
      napMinutes: Math.max(0, Number(napMinutes)),
      quality
    })
    onClose()
  }

  return (
    <Modal title="Ghi nhận Giấc ngủ (Sleep Lab)" subtitle="Phân tích chu kỳ 90 phút & Đánh giá hồi phục" onClose={onClose}>
      <div className="form-grid">
        <label>
          Giờ đi ngủ tối qua
          <input type="time" value={bedtime} onChange={(e) => handleBedChange(e.target.value)} />
        </label>
        <label>
          Giờ thức dậy sáng nay
          <input type="time" value={wakeTime} onChange={(e) => handleWakeChange(e.target.value)} />
        </label>

        <label>
          Tổng số giờ ngủ ban đêm
          <input
            type="number"
            step="0.1"
            min="0"
            max="16"
            value={nightHours}
            onChange={(e) => setNightHours(Number(e.target.value))}
          />
        </label>

        <label>
          Ngủ trưa phục hồi (Phút)
          <input
            type="number"
            step="5"
            min="0"
            max="120"
            value={napMinutes}
            onChange={(e) => setNapMinutes(Number(e.target.value))}
          />
        </label>

        {/* 90-min Cycle Live Preview */}
        <div className="full sleep-cycle-preview-banner">
          <div className="cycle-preview-left">
            <span>⚡ Tương đương <strong>{cycles} chu kỳ 90 phút</strong></span>
            <small>
              {isOptimal
                ? '🌟 Đạt chuẩn vàng 5 chu kỳ hồi phục não bộ & thể lực!'
                : '💡 Khuyến nghị duy trì từ 7.5h (5 chu kỳ) đến 9h (6 chu kỳ).'}
            </small>
          </div>
        </div>

        <div className="full form-rating-group">
          <span>Chất lượng giấc ngủ ({quality}/5 sao)</span>
          <div className="star-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${quality >= star ? 'selected' : ''}`}
                onClick={() => {
                  triggerHaptic('light')
                  setQuality(star)
                }}
              >
                ★
              </button>
            ))}
          </div>
          <small className="form-hint">
            {quality <= 2 ? 'Ngủ chập chờn, mệt mỏi khi thức dậy' : quality <= 3 ? 'Bình thường' : quality === 4 ? 'Ngủ ngon, cơ thể nhẹ nhõm' : 'Tuyệt vời, tỉnh táo và tràn đầy năng lượng'}
          </small>
        </div>

        <button className="primary full mt-2" onClick={handleSave}>
          Lưu dữ liệu giấc ngủ
        </button>
      </div>
    </Modal>
  )
}
