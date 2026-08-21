import { useEffect, useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'

export function OrientationPrompt({ enabled = true }: { enabled?: boolean }) {
  const [isPortrait, setIsPortrait] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [dismissed, setDismissed] = useState(false)

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      // If width < 860 and height > width -> User is holding phone vertically
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 1024
      setIsPortrait(portrait)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  // 5-second countdown timer
  useEffect(() => {
    if (!isPortrait || dismissed) return

    setCountdown(5)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPortrait, dismissed])

  if (!enabled || !isPortrait || dismissed) return null

  const handleDismiss = () => {
    audioSystem.playClick('pop')
    setDismissed(true)
  }

  return (
    <div className="orientation-prompt-overlay animate-fade-in">
      <div className="orientation-prompt-card animate-pop">
        {/* Animated Rotating Phone Graphic */}
        <div className="phone-rotate-anim-wrap">
          <div className="phone-rotate-icon">📱</div>
          <span className="rotate-arrow-badge">⟲</span>
        </div>

        {/* Mascots Cheer */}
        <div className="orientation-mascots-row">
          <ChiikawaSVG character="chiikawa" size={56} className="animate-bounce-gentle" />
          <span className="heart-separator">💖</span>
          <ChiikawaSVG character="usagi" size={56} className="animate-bounce-gentle" />
        </div>

        <h2 className="orientation-title">Vui Lòng Xoay Ngang Màn Hình</h2>
        <p className="orientation-desc">
          <strong>Little Days</strong> được thiết kế theo khung hình <strong>ngang 16:9</strong> chuẩn Anime RPG để mang lại trải nghiệm bản đồ và tương tác tốt nhất cho <strong>Haru &amp; Mai Trang</strong>!
        </p>

        {/* Countdown / Dismiss Button */}
        <div className="orientation-action-box">
          {countdown > 0 ? (
            <div className="orientation-countdown-pill">
              <span className="pulse-dot">⏳</span>
              <span>Đang chờ xoay ngang... ({countdown}s)</span>
            </div>
          ) : (
            <button className="orientation-continue-btn animate-pop" onClick={handleDismiss}>
              Tiếp tục với màn hình hiện tại →
            </button>
          )}

          <button className="orientation-skip-text" onClick={handleDismiss}>
            Bỏ qua lời nhắc
          </button>
        </div>
      </div>
    </div>
  )
}
