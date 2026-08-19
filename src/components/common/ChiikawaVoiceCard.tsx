import { useState } from 'react'
import {
  CHIIKAWA_CHARACTERS,
  type ChiikawaCharacter,
  playChiikawaVoice
} from '../../utils/chiikawaAudio'

type Props = {
  character: ChiikawaCharacter
  customQuote?: string
}

export function ChiikawaVoiceCard({ character, customQuote }: Props) {
  const char = CHIIKAWA_CHARACTERS[character]
  const [activePhrase, setActivePhrase] = useState<string | null>(null)
  const [isBouncing, setIsBouncing] = useState(false)

  const handleVoiceTrigger = () => {
    const spoken = playChiikawaVoice(character)
    setActivePhrase(spoken)
    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 600)
    setTimeout(() => setActivePhrase(null), 2500)
  }

  return (
    <div
      className={`chiikawa-interactive-tag char-${character} ${isBouncing ? 'bouncing' : ''}`}
      onClick={handleVoiceTrigger}
      style={{
        borderColor: char.borderColor,
        background: char.badgeBg
      }}
      title={`Bấm vào ${char.name} (${char.jpName}) để nghe tiếng kêu cute!`}
    >
      <span className="chiikawa-emoji">{char.avatarEmoji}</span>
      <div className="chiikawa-tag-info">
        <strong style={{ color: char.color }}>
          {char.name} <small>({char.jpName})</small>
        </strong>
        <span>{customQuote || char.quotes[0]}</span>
      </div>

      {/* Cute speech bubble on click */}
      {activePhrase && (
        <div className="chiikawa-pop-speech animate-pop">
          <span>✨ {activePhrase}</span>
        </div>
      )}
    </div>
  )
}
