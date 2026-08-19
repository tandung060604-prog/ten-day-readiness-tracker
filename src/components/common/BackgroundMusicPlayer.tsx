import { useEffect, useRef, useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

type Props = {
  defaultVolume?: number
}

// Relaxing, high-quality chill melodic background audio stream
const DEFAULT_BGM_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'

export function BackgroundMusicPlayer({ defaultVolume = 0.18 }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(defaultVolume)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(DEFAULT_BGM_URL)
    audio.loop = true
    audio.volume = defaultVolume
    audioRef.current = audio

    // Attempt gentle auto-play on first user interaction (due to iOS Safari Autoplay policy)
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          // Browser prevented autoplay before explicit gesture
        })
      }
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction, { once: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [defaultVolume])

  const togglePlay = () => {
    triggerHaptic('light')
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.volume = isMuted ? 0 : volume
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Handle error
      })
    }
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    if (audioRef.current) {
      audioRef.current.volume = newVol
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <div className="bgm-player-widget">
      <button
        type="button"
        className={`bgm-toggle-btn ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? 'Tạm dừng nhạc nền (SECRET - Say Hi BGM)' : 'Phát nhạc nền nhẹ nhàng (SECRET - Say Hi BGM)'}
      >
        <span className="bgm-icon">🎵</span>
        <div className="bgm-info">
          <span className="bgm-title">SECRET · Say Hi</span>
          <span className="bgm-status">{isPlaying ? 'Đang phát nhẹ (18%)' : 'Tạm dừng'}</span>
        </div>

        {/* Animated Audio Equalizer Bars */}
        <div className={`bgm-visualizer ${isPlaying ? 'active' : ''}`}>
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
        </div>
      </button>

      {isPlaying && (
        <div className="bgm-mini-slider">
          <span className="vol-icon">🔉</span>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.02"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            title="Âm lượng nhạc nền"
          />
        </div>
      )}
    </div>
  )
}
