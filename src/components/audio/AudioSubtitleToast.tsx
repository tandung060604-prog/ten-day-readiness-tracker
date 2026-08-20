import { useEffect, useState } from 'react'
import { audioManager } from '../../domain/audio/audioManager'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import type { SubtitlePayload } from '../../domain/audio/types'

export function AudioSubtitleToast() {
  const [subtitle, setSubtitle] = useState<SubtitlePayload | null>(null)

  useEffect(() => {
    const unsubscribe = audioManager.subscribeSubtitles((payload) => {
      setSubtitle(payload)
    })
    return () => unsubscribe()
  }, [])

  if (!subtitle) return null

  return (
    <div className="audio-subtitle-toast-container animate-slide-up" role="status" aria-live="polite">
      <div className="subtitle-card">
        {subtitle.avatarCharacter && subtitle.avatarCharacter !== 'narrator' && (
          <div className="subtitle-avatar">
            <ChiikawaSVG character={subtitle.avatarCharacter} size={36} />
          </div>
        )}
        <div className="subtitle-content">
          <strong className="subtitle-speaker">{subtitle.speakerName}:</strong>
          <span className="subtitle-text">"{subtitle.text}"</span>
        </div>
      </div>
    </div>
  )
}
