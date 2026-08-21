import { useState } from 'react'
import { APP_RELEASE } from '../../app/release'
import { getNotificationPermission, requestNotificationPermission } from '../../utils/notifications'

interface ReleaseNoticeProps {
  onDismiss: () => void
}

export function ReleaseNotice({ onDismiss }: ReleaseNoticeProps) {
  const [permission, setPermission] = useState<NotificationPermission>(() => getNotificationPermission())

  const enableNotifications = async () => {
    const nextPermission = await requestNotificationPermission()
    setPermission(nextPermission)
    onDismiss()
  }

  return (
    <aside className="release-notice" role="status" aria-label="Bản cập nhật mới">
      <div>
        <small>{APP_RELEASE.kind === 'major' ? 'BẢN CẬP NHẬT LỚN' : 'BẢN SỬA LỖI'} · v{APP_RELEASE.version}</small>
        <strong>{APP_RELEASE.title}</strong>
        <p>{APP_RELEASE.body}</p>
      </div>
      <div className="release-notice__actions">
        {permission !== 'granted' && (
          <button type="button" onClick={() => void enableNotifications()}>
            {permission === 'denied' ? 'Mở quyền thông báo' : 'Bật noti cập nhật'}
          </button>
        )}
        <button type="button" className="release-notice__dismiss" onClick={onDismiss}>Để sau</button>
      </div>
    </aside>
  )
}
