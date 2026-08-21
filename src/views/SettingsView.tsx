import React, { useEffect, useState } from 'react'
import { SetPinModal } from '../components/security/SetPinModal'
import { ChiikawaSVG } from '../components/common/ChiikawaSVG'
import { getNotificationPermission, requestNotificationPermission, testNotification } from '../utils/notifications'
import { isBackgroundPushConfigured, subscribeToReleasePush } from '../app/push'
import { downloadCalendarICS } from '../utils/calendarSync'
import { triggerHaptic } from '../utils/haptics'
import type { AppSettings } from '../types'
import type { CoupleProfile } from '../domain/couple/types'
import { DataBackupModal } from '../components/privacy/DataBackupModal'

type Props = {
  settings: AppSettings
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>
  profile?: CoupleProfile
  onUpdateProfile?: (profile: CoupleProfile) => void
  exportData: () => void
  importData: (f: File | undefined) => void
  resetData: () => void
}

export function SettingsView({
  settings,
  setSettings,
  profile,
  onUpdateProfile,
  exportData,
  importData,
  resetData
}: Props) {
  const [showPinModal, setShowPinModal] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default')
  const [showBackupModal, setShowBackupModal] = useState(false)

  useEffect(() => {
    setNotifPermission(getNotificationPermission())
  }, [])

  const handleRequestNotification = async () => {
    triggerHaptic('medium')
    const result = await subscribeToReleasePush()
    const perm = result === 'not-configured' ? await requestNotificationPermission() : getNotificationPermission()
    setNotifPermission(perm)
    if (perm === 'granted') {
      testNotification()
      if (result === 'failed') alert('Đã cấp quyền nhưng chưa kết nối được thông báo nền. Hãy thử lại sau.')
    }
  }

  const handleTestNotification = () => {
    triggerHaptic('light')
    const ok = testNotification()
    if (!ok && notifPermission !== 'granted') {
      alert('Vui lòng cấp quyền thông báo trước để nhận nhắc nhở.')
    }
  }

  const handleDownloadCalendar = () => {
    triggerHaptic('success')
    downloadCalendarICS(settings)
  }

  const field = (label: string, key: keyof AppSettings, type = 'text', hint?: string) => (
    <label className="settings-field">
      <span>
        {label}
        {hint && <small className="field-hint">{hint}</small>}
      </span>
      <input
        type={type}
        value={String(settings[key])}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            [key]: typeof s[key] === 'number' ? Number(e.target.value) : e.target.value
          }))
        }
      />
    </label>
  )

  const handleSavePinHash = (newPinHash: string | undefined) => {
    setSettings((s) => ({
      ...s,
      pinHash: newPinHash,
      isLockEnabled: !!newPinHash
    }))
  }

  return (
    <div className="view-container animate-fade-in">
      {/* Security & Private App Lock Section */}
      <section className="card security-settings-card">
        <div className="section-head">
          <div>
            <small>BẢO MẬT & QUYỀN RIÊNG TƯ (APP LOCK)</small>
            <h3>Khóa ứng dụng riêng tư</h3>
          </div>
          <span className={`status-pill ${settings.isLockEnabled && settings.pinHash ? 'completed' : 'planned'}`}>
            {settings.isLockEnabled && settings.pinHash ? '🔒 Đang bảo vệ' : '🔓 Chưa bật'}
          </span>
        </div>

        <p className="settings-desc">
          Bảo vệ dữ liệu cá nhân chỉ một mình bạn có thể xem. Khi bật, ứng dụng sẽ yêu cầu mã PIN hoặc Face ID / Touch ID mỗi khi mở lại.
        </p>

        <div className="security-controls-grid">
          <div className="security-box">
            <div className="security-info">
              <strong>Mã PIN bí mật (4–6 số)</strong>
              <small>
                {settings.pinHash
                  ? 'Đã cài đặt mã PIN bảo vệ.'
                  : 'Chưa thiết lập mã PIN.'}
              </small>
            </div>
            <button
              className={settings.pinHash ? 'secondary compact' : 'primary compact'}
              onClick={() => setShowPinModal(true)}
            >
              {settings.pinHash ? 'Đổi mã PIN' : 'Thiết lập mã PIN'}
            </button>
          </div>

          {settings.pinHash && (
            <>
              <label className="toggle-line">
                <div className="toggle-info">
                  <strong>Xác thực Face ID / Sinh trắc học</strong>
                  <small>Tự động mở khóa bằng khuôn mặt hoặc vân tay khi mở app</small>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableBiometrics ?? true}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, enableBiometrics: e.target.checked }))
                  }
                />
              </label>

              <label className="settings-field full">
                <span>Thời gian tự động khóa màn hình (Auto-lock)</span>
                <select
                  value={settings.autoLockMinutes ?? 1}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, autoLockMinutes: Number(e.target.value) }))
                  }
                >
                  <option value={0}>Khóa ngay lập tức khi rời app / ẩn tab</option>
                  <option value={1}>Sau 1 phút không hoạt động</option>
                  <option value={5}>Sau 5 phút không hoạt động</option>
                  <option value={15}>Sau 15 phút không hoạt động</option>
                </select>
              </label>
            </>
          )}
        </div>
      </section>

      {/* Web Push Notifications & Alarm Section */}
      <section className="card notif-settings-card">
        <div className="section-head">
          <div>
            <small>THÔNG BÁO ĐIỆN THOẠI & NHẮC NHỞ</small>
            <h3>Kết nối thông báo hệ thống</h3>
          </div>
          <span className={`status-pill ${notifPermission === 'granted' ? 'completed' : 'planned'}`}>
            {notifPermission === 'granted' ? '🔔 Đã bật' : '🔕 Chưa cấp quyền'}
          </span>
        </div>

        <p className="settings-desc">
          Nhận thông báo đẩy trên điện thoại nhắc nhở: Uống nước đúng giờ, Đứng dậy vận động sau mỗi 60 phút làm việc, và Chuẩn bị đi ngủ đúng giờ.
        </p>

        <div className="security-controls-grid">
          <div className="security-box">
            <div className="security-info">
              <strong>Trạng thái quyền thông báo: {notifPermission.toUpperCase()}</strong>
              <small>
                {notifPermission === 'granted'
                  ? (isBackgroundPushConfigured() ? 'Đã kết nối thông báo nền cho bản cập nhật mới.' : 'Đã bật thông báo khi app đang mở.')
                  : 'Bấm nút bên cạnh để nhận thông báo cập nhật trên điện thoại.'}
              </small>
            </div>
            <div className="btn-group-row">
              {notifPermission !== 'granted' ? (
                <button className="primary compact" onClick={handleRequestNotification}>
                  Bật thông báo
                </button>
              ) : (
                <button className="secondary compact" onClick={handleTestNotification}>
                  ⚡ Thử gửi thông báo
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Sync & Export Section */}
      <section className="card calendar-sync-card">
        <div className="section-head">
          <div>
            <small>ĐỒNG BỘ LỊCH TRÌNH (CALENDAR SYNC)</small>
            <h3>Xuất lịch trình vào Apple / Google Calendar</h3>
          </div>
          <span className="soft-badge">.ICS Smart Sync</span>
        </div>

        <p className="settings-desc">
          Tự động đồng bộ toàn bộ 10 ngày lộ trình vào ứng dụng Lịch (Apple Calendar trên iPhone, Google Calendar, Outlook) bao gồm giờ tập, mốc uống nước và ngày về đích Ready Day.
        </p>

        <button className="primary wide-calendar-sync-btn" onClick={handleDownloadCalendar}>
          📅 Đồng bộ lịch trình 10 ngày vào Lịch iPhone / Google (.ICS)
        </button>
      </section>

      <section className="card sync-settings-card">
        <div className="section-head"><div><small>LOCAL-FIRST · AES-GCM</small><h3>Sao lưu &amp; đồng bộ riêng tư</h3></div><span className="soft-badge">Không cần backend</span></div>
        <p className="settings-desc">Mã hóa toàn bộ wellness log, hồ sơ đôi, currency và tiến trình trước khi chuyển sang thiết bị còn lại.</p>
        <button className="primary wide-calendar-sync-btn" onClick={() => setShowBackupModal(true)}>🔐 Mở Data Vault &amp; Sync</button>
      </section>

      {/* Couple Profile & Personalization */}
      {profile && onUpdateProfile && (
        <section className="card couple-settings-card">
          <div className="section-head">
            <div>
              <small>HỒ SƠ CẶP ĐÔI &amp; LINH VẬT (COUPLE PROFILE)</small>
              <h3>Tổ ấm của chúng mình</h3>
            </div>
            <span className="soft-badge">🌸 Living Town</span>
          </div>

          <p className="settings-desc">
            Tùy chỉnh tên gọi, linh vật đồng hành và ngày kỷ niệm của hai bạn. Mọi thông tin được bảo mật cục bộ 100% trên thiết bị.
          </p>

          <div className="form-grid">
            <label className="settings-field">
              <span>Tên / Biệt danh Bạn (Player 1)</span>
              <input
                type="text"
                value={profile.player1.nickname || profile.player1.displayName}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    player1: {
                      ...profile.player1,
                      displayName: e.target.value,
                      nickname: e.target.value
                    }
                  })
                }
              />
            </label>

            <label className="settings-field">
              <span>Linh vật của Bạn</span>
              <select
                value={profile.player1.avatarCharacter}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    player1: {
                      ...profile.player1,
                      avatarCharacter: e.target.value as 'chiikawa' | 'usagi'
                    },
                    player2: {
                      ...profile.player2,
                      avatarCharacter: e.target.value === 'chiikawa' ? 'usagi' : 'chiikawa'
                    }
                  })
                }
                style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
              >
                <option value="chiikawa">Bé Chiikawa 🐹 (Ấm áp, chu đáo)</option>
                <option value="usagi">Thỏ Usagi 🐰 (Năng lượng siêu cấp)</option>
              </select>
            </label>

            <label className="settings-field">
              <span>Tên / Biệt danh Người Ấy (Player 2)</span>
              <input
                type="text"
                value={profile.player2.nickname || profile.player2.displayName}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    player2: {
                      ...profile.player2,
                      displayName: e.target.value,
                      nickname: e.target.value
                    }
                  })
                }
              />
            </label>

            <label className="settings-field">
              <span>Ngày bắt đầu yêu nhau</span>
              <input
                type="date"
                value={profile.relationshipStartDate || '2026-06-11'}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    relationshipStartDate: e.target.value,
                    importantDates: profile.importantDates.map((d) =>
                      d.category === 'anniversary' ? { ...d, date: e.target.value } : d
                    )
                  })
                }
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ChiikawaSVG character={profile.player1.avatarCharacter} size={36} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                {profile.player1.nickname || profile.player1.displayName}
              </span>
            </div>
            <span style={{ color: '#e63956', fontWeight: 800 }}>❤️</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ChiikawaSVG character={profile.player2.avatarCharacter} size={36} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                {profile.player2.nickname || profile.player2.displayName}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Routine & Schedule Preferences */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>CÀI ĐẶT LỊCH TRÌNH & THÓI QUEN</small>
            <h3>Tùy chỉnh mục tiêu hàng ngày</h3>
          </div>
          <span className="soft-badge">Personalization</span>
        </div>

        <div className="form-grid">
          {field('Tên tiêu đề ứng dụng', 'title')}
          {field('Giờ thức dậy mục tiêu', 'wakeTime', 'time')}
          {field('Giờ đi ngủ mục tiêu', 'bedtimeTarget', 'time')}
          {field('Giờ bắt đầu làm việc', 'workStart', 'time')}
          {field('Giờ kết thúc làm việc', 'workEnd', 'time')}
          {field('Giờ tập luyện thể thao', 'workoutStart', 'time')}
          {field('Mục tiêu nước mỗi ngày (ml)', 'waterTargetMl', 'number', 'Khuyến nghị: 2500 - 3500ml')}

          <label className="toggle-line full">
            <div className="toggle-info">
              <strong>Chế độ ngụy trang (Privacy Mode)</strong>
              <small>Tự động đổi tên app thành "Daily Wellness Tracker" trên thanh tiêu đề</small>
            </div>
            <input
              type="checkbox"
              checked={settings.privacyMode}
              onChange={(e) =>
                setSettings((s) => ({ ...s, privacyMode: e.target.checked }))
              }
            />
          </label>
        </div>
      </section>

      {/* Data Backup & Restore */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>QUẢN LÝ DỮ LIỆU CỤC BỘ (LOCAL-FIRST)</small>
            <h3>Sao lưu & Khôi phục dữ liệu</h3>
          </div>
          <span className="soft-badge">Backup / Restore</span>
        </div>

        <p className="settings-desc">
          Toàn bộ nhật ký, lịch trình và hình ảnh bữa ăn của bạn được lưu trữ an toàn trong trình duyệt (LocalStorage & IndexedDB). Không có bất kỳ dữ liệu nào được tải lên máy chủ ngoài.
        </p>

        <div className="data-actions-row">
          <button className="primary" onClick={exportData}>
            📥 Xuất bản sao lưu (Export JSON)
          </button>

          <label className="button-file">
            📤 Nhập dữ liệu sao lưu (Import JSON)
            <input
              type="file"
              accept="application/json"
              onChange={(e) => importData(e.target.files?.[0])}
            />
          </label>

          <button className="danger" onClick={resetData}>
            🗑 Xóa toàn bộ dữ liệu & Reset
          </button>
        </div>
      </section>

      {/* Set PIN Modal */}
      {showPinModal && (
        <SetPinModal
          currentPinHash={settings.pinHash}
          onClose={() => setShowPinModal(false)}
          onSuccess={handleSavePinHash}
        />
      )}
      <DataBackupModal isOpen={showBackupModal} onClose={() => setShowBackupModal(false)} />
    </div>
  )
}
