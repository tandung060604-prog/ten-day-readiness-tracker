import type { ReactNode } from 'react'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { audioSystem } from '../../game/systems/GameAudioSystem'

export interface SceneShellProps {
  sceneId: string
  title: string
  subtitle?: string
  icon: string
  companionRole?: 'chiikawa' | 'usagi'
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
  companionMessage,
  onCompanionClick,
  children
}: SceneShellProps) {
  const handleCompanionInteract = () => {
    audioSystem.playClick('soft')
    if (onCompanionClick) {
      onCompanionClick()
    }
  }

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

        {/* Interactive Companion Mascot Widget */}
        <div 
          className="scene-shell-companion"
          onClick={handleCompanionInteract}
          title="Bấm để trò chuyện với bé"
          role="button"
          tabIndex={0}
        >
          {companionMessage && (
            <div className="scene-companion-bubble animate-bounce-gentle">
              <span>{companionMessage}</span>
            </div>
          )}
          <div className="scene-companion-avatar">
            <ChiikawaSVG character={companionRole} size={48} />
          </div>
        </div>
      </div>

      {/* Main Scene Body */}
      <div className="scene-shell-content">
        {children}
      </div>
    </div>
  )
}
