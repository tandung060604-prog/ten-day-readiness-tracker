import type { ReactNode } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { GameIcon } from '../../components/common/GameIcons'
import { audioSystem } from '../systems/GameAudioSystem'
import { MAP_BUILDINGS } from './WorldMap'
import type { LocationId } from '../types'

type Props = {
  locationId: LocationId
  onBackToMap: () => void
  day: number
  maxDays: number
  onOpenDayPlan: () => void
  onOpenQuests: () => void
  onOpenSettings: () => void
  children: ReactNode
}

export function BuildingModuleModal({ locationId, onBackToMap, day, maxDays, onOpenDayPlan, onOpenQuests, onOpenSettings, children }: Props) {
  const building = MAP_BUILDINGS.find((b) => b.id === locationId) || MAP_BUILDINGS[0]

  const handleBack = () => {
    audioSystem.playClick('soft')
    onBackToMap()
  }

  return (
    <div className="game-module-scene animate-slide-up">
      {/* Module Scene Header Bar */}
      <header className="module-scene-topbar">
        <button className="module-back-btn" onClick={handleBack} title="Quay lại Bản Đồ Thế Giới">
          <span className="back-arrow">←</span>
          <span>Bản Đồ</span>
        </button>

        <div className="module-scene-title-group">
          <span className="module-building-icon">{building.icon}</span>
          <div>
            <h2>{building.name.replace('\n', ' ')}</h2>
          </div>
        </div>

        <div className="module-top-actions" aria-label="Tiện ích hành trình">
          <button className="module-day-btn" onClick={onOpenDayPlan} title="Xem kế hoạch theo ngày">Ngày {day}/{maxDays}</button>
          <button className="module-icon-btn" onClick={onOpenQuests} title="Nhiệm vụ"><GameIcon name="target" size={18} /></button>
          <button className="module-icon-btn" onClick={onOpenSettings} title="Cài đặt"><GameIcon name="gear" size={18} /></button>
          <div className="module-char-badge" title="Bé Chiikawa đang đồng hành cùng bạn">
            <ChiikawaSVG character="chiikawa" size={38} className="animate-bounce-gentle" />
          </div>
        </div>
      </header>

      {/* Module Content Container */}
      <main className="module-scene-body">
        {children}
      </main>
    </div>
  )
}
