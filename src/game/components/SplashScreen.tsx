import { useEffect, useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'

type Props = {
  onEnterGame: () => void
}

const LOADING_STEPS = [
  'Đang nạp ký ức của 2 đứa mình...',
  'Đang tải thị trấn Little Days...',
  'Đang chuẩn bị chuyến bay Nha Trang...',
  'Bé Chiikawa & Usagi đã sẵn sàng!',
  'Thế giới nhỏ đã mở ra!'
]

export function SplashScreen({ onEnterGame }: Props) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval)
          setIsLoaded(true)
          return 100
        }
        const next = prev + Math.floor(Math.random() * 18 + 12)
        const clamped = Math.min(100, next)
        const sIdx = Math.min(LOADING_STEPS.length - 1, Math.floor((clamped / 100) * LOADING_STEPS.length))
        setStepIndex(sIdx)
        return clamped
      })
    }, 180)

    return () => window.clearInterval(interval)
  }, [])

  const handleEnter = () => {
    audioSystem.initAudioContext()
    audioSystem.playClick('enter')
    onEnterGame()
  }

  return (
    <div className="game-splash-screen animate-fade-in">
      {/* Parallax Clouds Background */}
      <div className="splash-sky-layer" />
      <div className="splash-cloud-layer cloud-layer-1" />
      <div className="splash-cloud-layer cloud-layer-2" />
      <div className="splash-cloud-layer cloud-layer-3" />

      {/* Floating Cherry Blossoms & Sparkles */}
      <div className="splash-particles-layer">
        <span className="particle p1">🌸</span>
        <span className="particle p2">✨</span>
        <span className="particle p3">🍃</span>
        <span className="particle p4">💖</span>
        <span className="particle p5">🌸</span>
        <span className="particle p6">✨</span>
      </div>

      {/* Town Silhouette at the Bottom Horizon */}
      <div className="splash-town-silhouette" />

      {/* Center Hero Brand Box */}
      <div className="splash-center-content animate-slide-up">
        <div className="splash-badge">
          <span>🌿 A TINY WORLD FOR OUR EVERYDAY LIFE</span>
        </div>

        <h1 className="splash-game-title">Little Days</h1>
        <p className="splash-subtitle">
          Thế giới nhỏ của <strong>Dũng & Em Yêu</strong> · Adventure #1: 10-Day Readiness & Nha Trang 27/08 🌴
        </p>

        {/* Character Duo: Chiikawa & Usagi standing together */}
        <div className="splash-characters-row">
          <div className="splash-char-box char-left">
            <ChiikawaSVG character="chiikawa" size={90} className="animate-bounce-gentle" />
            <span className="char-name-tag">Chiikawa 🐹</span>
          </div>
          <div className="splash-heart-badge">
            <span className="heart-icon">💖</span>
          </div>
          <div className="splash-char-box char-right">
            <ChiikawaSVG character="usagi" size={90} className="animate-bounce-gentle" />
            <span className="char-name-tag">Usagi 🐰</span>
          </div>
        </div>

        {/* Loading Progress or Tap to Enter Button */}
        <div className="splash-action-container">
          {!isLoaded ? (
            <div className="splash-loading-box">
              <div className="splash-progress-track">
                <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <small className="splash-loading-text">{LOADING_STEPS[stepIndex]}</small>
            </div>
          ) : (
            <button className="splash-enter-btn animate-pop" onClick={handleEnter}>
              <span className="btn-sparkle">✨</span>
              <span>BƯỚC VÀO THẾ GIỚI (TAP TO ENTER)</span>
              <span className="btn-arrow">→</span>
            </button>
          )}
        </div>
      </div>

      <footer className="splash-footer-note">
        <small>Mẹo: Trải nghiệm tốt nhất khi xoay ngang màn hình hoặc xem trên máy tính · Âm thanh tự động kích hoạt khi chạm 🎵</small>
      </footer>
    </div>
  )
}
