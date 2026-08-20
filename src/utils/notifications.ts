/**
 * Web Notifications & Reminder Scheduler
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied'
  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch {
    return 'denied'
  }
}

export function sendLocalNotification(title: string, body: string, _icon = '✦') {
  if (!isNotificationSupported()) return false

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://tandung060604-prog.github.io/ten-day-readiness-tracker/favicon.ico',
        badge: 'https://tandung060604-prog.github.io/ten-day-readiness-tracker/favicon.ico',
        silent: false
      })
      return true
    } catch {
      // Fallback for browsers that don't support constructor in certain modes
      return false
    }
  }
  return false
}

export function testNotification(): boolean {
  return sendLocalNotification(
    '⚡ 10-Day Readiness Tracker',
    '🎉 Thông báo điện thoại đã kết nối thành công! Bạn sẽ nhận được nhắc nhở uống nước và giấc ngủ đúng giờ.'
  )
}
