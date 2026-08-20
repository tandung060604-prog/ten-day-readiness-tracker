import { useState } from 'react'
import type { ReactNode } from 'react'
import { LiveCompanionWidget } from '../character/LiveCompanionWidget'
import { DuoInteractionModal } from '../character/DuoInteractionModal'
import type { MascotCharacter } from '../../domain/couple/types'

export interface SceneShellProps {
  sceneId: string
  title: string
  subtitle?: string
  icon: string
  companionRole?: MascotCharacter
  companionMessage?: string
  onCompanionClick?: () => void
  children: ReactNode
}

export function SceneShell({
  sceneId,
  title,
  subtitle,
  icon,
  companionRole = 'chiikawa',
  companionMessage: _companionMessage,
  onCompanionClick: _onCompanionClick,
  children
}: SceneShellProps) {
  const [showDuoModal, setShowDuoModal] = useState(false)

  return (
    <div className={`scene-shell scene-shell-${sceneId} animate-fade-in`}>
      {/* Scene Header */}
      <div className="scene-shell-header">
        <div className="scene-shell-title-group">
          <span className="scene-shell-icon" role="img" aria-label={title}>{icon}</span>
          <div>
            <h1 className="scene-shell-title">{title}</h1>
            {subtitle && <p className="scene-shell-subtitle">{subtitle}</p>}
          </div>
        </div>

        {/* Live Interactive Companion Mascot Widget */}
        <LiveCompanionWidget
          character={companionRole}
          onOpenDuoModal={() => setShowDuoModal(true)}
        />
      </div>

      {/* Main Scene Body */}
      <div className="scene-shell-content">
        {children}
      </div>

      {/* Duo Interaction & Miracle Modal */}
      {showDuoModal && (
        <DuoInteractionModal
          isOpen={showDuoModal}
          onClose={() => setShowDuoModal(false)}
        />
      )}
    </div>
  )
}
