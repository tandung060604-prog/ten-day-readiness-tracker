import { useState } from 'react'
import { subscribeToReleasePush, type PushSubscriptionResult } from '../../app/push'
import { getNotificationPermission } from '../../utils/notifications'
import { triggerHaptic } from '../../utils/haptics'

export const NOTIFICATION_ONBOARDING_KEY = 'little-days-notification-onboarding-v1'

export function shouldShowNotificationOnboarding(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  try {
    return localStorage.getItem(NOTIFICATION_ONBOARDING_KEY) !== 'true' && Notification.permission !== 'denied'
  } catch {
    return Notification.permission !== 'denied'
  }
}

function rememberNotificationChoice() {
  try {
    localStorage.setItem(NOTIFICATION_ONBOARDING_KEY, 'true')
  } catch {
    // Private browsing can block storage; the prompt can safely show again next launch.
  }
}

function getFailureCopy(result: PushSubscriptionResult) {
  if (result === 'not-supported') return 'Thiết bị này chưa hỗ trợ thông báo nền. Bạn vẫn có thể dùng Little Days bình thường.'
  if (result === 'denied') return 'Quyền thông báo đang bị tắt. Bạn có thể bật lại trong Cài đặt của iPhone.'
  return 'Chưa kết nối được thông báo nền. Hãy kiểm tra mạng rồi thử lại.'
}

type Props = { onComplete: () => void }

export function NotificationOnboardingPrompt({ onComplete }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleAllow = async () => {
    triggerHaptic('medium')
    setError('')
    setIsSubmitting(true)
    const result = await subscribeToReleasePush()
    setIsSubmitting(false)

    if (result === 'enabled' || result === 'not-configured' || result === 'denied' || result === 'not-supported') {
      rememberNotificationChoice()
      onComplete()
      return
    }

    setError(getFailureCopy(result))
  }

  const handleLater = () => {
    rememberNotificationChoice()
    onComplete()
  }

  return (
    <div className="notification-onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="notification-onboarding-title">
      <section className="notification-onboarding-card">
        <div className="notification-onboarding-icon" aria-hidden="true">🔔</div>
        <span className="notification-onboarding-eyebrow">GIỮ KẾT NỐI CÙNG NHAU</span>
        <h1 id="notification-onboarding-title">Cho Little Days báo tin nhé?</h1>
        <p>Nhận lời nhắc và biết ngay khi có bản cập nhật mới, kể cả lúc bạn đang đóng app.</p>
        <div className="notification-onboarding-points" aria-label="Lợi ích của thông báo">
          <span>✦ Báo khi có phiên bản mới</span>
          <span>♡ Nhắc những khoảnh khắc dành cho hai bạn</span>
        </div>
        {error && <p className="notification-onboarding-error" role="alert">{error}</p>}
        <button type="button" className="notification-onboarding-allow" onClick={() => void handleAllow()} disabled={isSubmitting}>
          {isSubmitting ? 'Đang kết nối…' : getNotificationPermission() === 'granted' ? 'Kết nối thông báo' : 'Cho phép thông báo'}
        </button>
        <button type="button" className="notification-onboarding-later" onClick={handleLater} disabled={isSubmitting}>Để sau</button>
        <small>Bạn có thể thay đổi lựa chọn bất cứ lúc nào trong Cài đặt.</small>
      </section>
    </div>
  )
}
