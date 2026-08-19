import React, { useState } from 'react'
import { SetPinModal } from '../components/security/SetPinModal'
import type { AppSettings } from '../types'

type Props = {
  settings: AppSettings
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>
  exportData: () => void
  importData: (f: File | undefined) => void
  resetData: () => void
}

export function SettingsView({
  settings,
  setSettings,
  exportData,
  importData,
  resetData
}: Props) {
  const [showPinModal, setShowPinModal] = useState(false)

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
    </div>
  )
}
