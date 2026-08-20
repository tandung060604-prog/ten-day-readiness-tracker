import { useEffect, useState } from 'react'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { getContextualDialogue } from '../../domain/character/dialogueEngine'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { EPHEMERAL_STATE_DURATIONS } from '../../domain/character/characterStateMachine'
import type { CharacterState, DialogueTrigger } from '../../domain/character/types'
import type { MascotCharacter } from '../../domain/couple/types'

interface LiveCompanionWidgetProps {
  character?: MascotCharacter
  initialState?: CharacterState
  partnerName?: string
  relationshipDays?: number
  trigger?: DialogueTrigger
  onStateChange?: (state: CharacterState) => void
  onOpenDuoModal?: () => void
}

export function LiveCompanionWidget({
  character = 'chiikawa',
  initialState = 'idle',
  partnerName = 'Mai Trang',
  relationshipDays = 100,
  trigger = 'idle_random',
  onStateChange,
  onOpenDuoModal
}: LiveCompanionWidgetProps) {
  const [state, setState] = useState<CharacterState>(initialState)
  const [dialogue, setDialogue] = useState(() =>
    getContextualDialogue({
      character,
      trigger,
      partnerName,
      relationshipDays
    })
  )
  const [showBubble, setShowBubble] = useState(true)

  // Re-evaluate dialogue on trigger change
  useEffect(() => {
    const nextLine = getContextualDialogue({
      character,
      trigger,
      partnerName,
      relationshipDays
    })
    setDialogue(nextLine)
    setShowBubble(true)

    if (nextLine.animation) {
      setState(nextLine.animation)
      if (onStateChange) onStateChange(nextLine.animation)
    }
  }, [character, trigger, partnerName, relationshipDays, onStateChange])

  // Handle ephemeral auto-reversion back to idle
  useEffect(() => {
    const duration = EPHEMERAL_STATE_DURATIONS[state]
    if (duration) {
      const timer = setTimeout(() => {
        setState('idle')
        if (onStateChange) onStateChange('idle')
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [state, onStateChange])

  const handleCompanionClick = () => {
    audioSystem.playClick('pop')
    setState('happy')
    if (onStateChange) onStateChange('happy')

    const randomLine = getContextualDialogue({
      character,
      trigger: 'idle_random',
      partnerName,
      relationshipDays
    })
    setDialogue(randomLine)
    setShowBubble(true)
  }

  // Animation class helper
  let animClass = 'anim-breathe'
  if (state === 'walking') animClass = 'anim-waddle'
  else if (state === 'running') animClass = 'anim-run'
  else if (state === 'happy' || state === 'celebrating') animClass = 'animate-bounce-gentle'
  else if (state === 'sleeping') animClass = 'anim-sleep'
  else if (state === 'training') animClass = 'anim-train'

  return (
    <div className={`live-companion-widget live-companion-${character}`}>
      {/* Dynamic Dialogue Bubble */}
      {showBubble && dialogue && (
        <div className="companion-speech-bubble animate-slide-up" onClick={() => setShowBubble(false)}>
          <span className="bubble-text">{dialogue.text}</span>
          <span className="bubble-close-hint">✕</span>
        </div>
      )}

      {/* Interactive Mascot Avatar & State Glow */}
      <div 
        className={`companion-avatar-wrap ${animClass} state-${state}`}
        onClick={handleCompanionClick}
        title="Bấm để chơi đùa cùng bé"
        role="button"
        tabIndex={0}
      >
        <ChiikawaSVG character={character} size={54} />
        {state === 'sleeping' && <span className="zzz-particle">💤</span>}
        {state === 'happy' && <span className="sparkle-particle">✨</span>}
        {state === 'celebrating' && <span className="confetti-particle">🎉</span>}
      </div>

      {/* Duo Quick Interaction Button */}
      {onOpenDuoModal && (
        <button 
          className="duo-open-btn"
          onClick={onOpenDuoModal}
          title="Mở Tương Tác Cặp Đôi (Chiikawa & Usagi)"
        >
          💖 Đôi Bạn
        </button>
      )}
    </div>
  )
}
