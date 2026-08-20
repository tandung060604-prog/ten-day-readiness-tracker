import { useEffect, useRef, useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

const YOUTUBE_VIDEO_ID = 'FqpR7HOCgP0' // SECRET - ANH TRAI 'SAY HI'
const BGM_VOL_KEY = 'little_days_bgm_volume_pref'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function YouTubeBGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem(BGM_VOL_KEY)
      return saved ? parseInt(saved, 10) : 25
    } catch {
      return 25
    }
  })
  const playerRef = useRef<any>(null)
  const containerId = 'yt-bgm-iframe-container'

  useEffect(() => {
    // 1. Load YouTube IFrame Player API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(containerId, {
          height: '1',
          width: '1',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume)
              event.target.playVideo()
              setIsPlaying(true)
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false)
              }
            }
          }
        })
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    // Force autoplay on any user interaction (tap, click, key) for mobile browsers
    const handleFirstInteraction = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.setVolume(volume)
        playerRef.current.playVideo()
        setIsPlaying(true)
      }
    }

    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true })
    window.addEventListener('keydown', handleFirstInteraction, { passive: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
      }
    }
  }, [volume])

  const togglePlay = () => {
    triggerHaptic('light')
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    } else {
      playerRef.current.setVolume(volume)
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    try {
      localStorage.setItem(BGM_VOL_KEY, newVol.toString())
    } catch { /* ignore */ }
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(newVol)
    }
  }

  return (
    <div className="bgm-player-widget">
      {/* Hidden YouTube IFrame Container */}
      <div
        id={containerId}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0.01,
          pointerEvents: 'none',
          top: '-9999px',
          left: '-9999px'
        }}
      />

      <button
        type="button"
        className={`bgm-toggle-btn ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        title={
          isPlaying
            ? "Tạm dừng bài hát SECRET - ANH TRAI 'SAY HI'"
            : "Phát bài hát SECRET - ANH TRAI 'SAY HI'"
        }
      >
        <span className="bgm-icon">{isPlaying ? '💿' : '🎵'}</span>
        <div className="bgm-info">
          <span className="bgm-title">SECRET · Say Hi</span>
          <span className="bgm-status">
            {isPlaying ? `Đang phát (${volume}%)` : 'Tạm dừng'}
          </span>
        </div>

        {/* Animated Equalizer Bars */}
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
            max="100"
            step="5"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            title="Âm lượng nhạc nền"
          />
        </div>
      )}
    </div>
  )
}
