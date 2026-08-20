import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { NhaTrangTripCard } from '../couple/NhaTrangTripCard'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { DailyLog } from '../../types'
import type { CoupleProfile } from '../../domain/couple/types'

interface BeachAdventureProps {
  log: DailyLog
  day: number
  profile?: CoupleProfile
  toggleChecklist: (id: string) => void
}

interface BeachActivity {
  id: string
  title: string
  icon: string
  badge: string
  unlocked: boolean
}

const DEFAULT_BEACH_ACTIVITIES: BeachActivity[] = [
  { id: 'b1', title: 'Lặn Ngắm San Hô Đảo Hòn Mun', icon: '🤿', badge: 'Trải Nghiệm Đỉnh Cao', unlocked: true },
  { id: 'b2', title: 'Thưởng Thức Hải Sản Tươi Sống Bên Bờ Biển', icon: '🦞', badge: 'Ẩm Thực', unlocked: true },
  { id: 'b3', title: 'Tắm Khoáng Bùn Nóng Thư Giãn', icon: '♨️', badge: 'Chăm Sóc Sức Khỏe', unlocked: true },
  { id: 'b4', title: 'Ngắm Hoàng Hôn Vịnh Nha Trang Trên Du Thuyền', icon: '⛵', badge: 'Lãng Mạn 100%', unlocked: false },
  { id: 'b5', title: 'Chụp Bộ Ảnh Kỷ Niệm Cát Trắng Nắng Vàng', icon: '📸', badge: 'Kỷ Niệm', unlocked: true }
]

export function BeachAdventureInterior({
  log,
  day,
  profile: _profile,
  toggleChecklist
}: BeachAdventureProps) {
  const [activities, setActivities] = useState<BeachActivity[]>(DEFAULT_BEACH_ACTIVITIES)

  const handleToggleActivity = (id: string) => {
    audioSystem.playSplash()
    const updated = activities.map(act =>
      act.id === id ? { ...act, unlocked: !act.unlocked } : act
    )
    setActivities(updated)
    triggerConfetti()
  }

  return (
    <SceneShell
      sceneId="beach-adventure"
      title="Bãi Biển & Khu Thám Hiểm"
      subtitle="Thiên đường biển xanh cát trắng sẵn sàng chào đón hai bạn"
      icon="🏖️"
      companionRole="chiikawa"
      companionMessage="Biển Nha Trang trong vắt đẹp mê ly! Đôi mình đã sẵn sàng cho chuyến đi chưa nào? 🌊👒"
    >
      <div className="beach-interior-grid">
        {/* Nha Trang Trip Readiness Card */}
        <div className="beach-readiness-banner">
          <NhaTrangTripCard />
        </div>

        {/* Activity & Adventure Wishlist */}
        <div className="beach-activities-card">
          <div className="activities-header">
            <span className="tropical-icon">🌴</span>
            <h3>Hoạt Động Biển Không Thể Bỏ Lỡ</h3>
          </div>

          <div className="activities-grid">
            {activities.map(act => (
              <div 
                key={act.id}
                className={`beach-activity-item ${act.unlocked ? 'checked' : ''}`}
                onClick={() => handleToggleActivity(act.id)}
              >
                <div className="act-icon-box">{act.icon}</div>
                <div className="act-info">
                  <h4>{act.title}</h4>
                  <span className="act-badge">{act.badge}</span>
                </div>
                <div className="act-status-check">
                  {act.unlocked ? '✅' : '⭕'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
