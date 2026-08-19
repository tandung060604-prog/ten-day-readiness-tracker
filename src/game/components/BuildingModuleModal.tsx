import type { ReactNode } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import { WORLD_BUILDINGS } from './WorldMap'
import type { LocationId } from '../types'

type Props = {
  locationId: LocationId
  onBackToMap: () => void
  children: ReactNode
}

export function BuildingModuleModal({ locationId, onBackToMap, children }: Props) {
  const building = WORLD_BUILDINGS.find((b) => b.id === locationId) || WORLD_BUILDINGS[0]

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
            <h2>{building.name}</h2>
            <small>{building.subtitle}</small>
          </div>
        </div>

        <div className="module-char-badge" title={`Bé ${building.character} đang đồng hành cùng bạn`}>
          <ChiikawaSVG character={building.character} size={42} className="animate-bounce-gentle" />
        </div>
      </header>

      {/* Module Content Container */}
      <main className="module-scene-body">
        {children}
      </main>
    </div>
  )
}
