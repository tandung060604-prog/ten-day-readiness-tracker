/**
 * Web Haptic Feedback Utility (iOS & Android Web / PWA)
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12)
        break
      case 'medium':
        navigator.vibrate(25)
        break
      case 'success':
        navigator.vibrate([15, 40, 25])
        break
      case 'warning':
        navigator.vibrate([20, 50, 20])
        break
      case 'error':
        navigator.vibrate([40, 40, 40, 40])
        break
      default:
        navigator.vibrate(15)
    }
  } catch {
    // Ignore if not supported on the browser
  }
}
