import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { vaultManager } from '../../domain/privacy/vaultManager'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { PrivacySettings } from '../../domain/privacy/types'

interface PrivacySettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacySettingsModal({ isOpen, onClose }: PrivacySettingsModalProps) {
  const [settings, setSettings] = useState<PrivacySettings>(() => vaultManager.loadPrivacySettings())
  const [vaultConfig, setVaultConfig] = useState(() => vaultManager.loadVaultConfig())
  const [newPin, setNewPin] = useState('')
  const [pinMessage, setPinMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setSettings(vaultManager.loadPrivacySettings())
      setVaultConfig(vaultManager.loadVaultConfig())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleToggleSetting = (key: keyof PrivacySettings) => {
    audioSystem.playClick('soft')
    const updated = { ...settings, [key]: !settings[key] }
    setSettings(updated)
    vaultManager.savePrivacySettings(updated)
  }

  const handleSetPin = () => {
    audioSystem.playClick('pop')
    const res = vaultManager.setPin(newPin)
    if (res.success) {
      setVaultConfig(vaultManager.loadVaultConfig())
      setPinMessage('✅ Đã thiết lập mã PIN 4 số thành công!')
      setNewPin('')
      triggerConfetti()
    } else {
      setPinMessage(`❌ ${res.error}`)
    }
  }

  const handleRemovePin = () => {
    audioSystem.playClick('soft')
    vaultManager.clearPin()
    setVaultConfig(vaultManager.loadVaultConfig())
    setPinMessage('ℹ️ Đã hủy mã PIN bảo vệ.')
  }

  return (
    <Modal title="Cài Đặt Bảo Mật & Quyền Riêng Tư" onClose={onClose}>
      <div className="privacy-settings-container">
        {/* Medical Estimate Disclaimer */}
        <div className="privacy-disclaimer-card">
          <span className="disclaimer-icon">🩺ℹ️</span>
          <div>
            <h4>Tuyên Bố Miễn Trừ Y Tế</h4>
            <p>
              Tất cả các dự đoán sinh học và chu kỳ chăm sóc sức khỏe là ước tính cá nhân mang tính tham khảo.
              <strong> Không phải là lời khuyên hay chẩn đoán y khoa chuyên nghiệp.</strong>
            </p>
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="privacy-options-group">
          <h5>🗺️ Hiển Thị Trên Bản Đồ:</h5>

          <label className="toggle-row">
            <span>Ẩn Phòng Khám Sức Khỏe trên Bản Đồ Thị Trấn</span>
            <input
              type="checkbox"
              checked={settings.hideWellnessClinicOnMap}
              onChange={() => handleToggleSetting('hideWellnessClinicOnMap')}
            />
          </label>

          <label className="toggle-row">
            <span>Bật lớp phủ làm mờ riêng tư khi rời tab</span>
            <input
              type="checkbox"
              checked={settings.enablePrivacyBlur}
              onChange={() => handleToggleSetting('enablePrivacyBlur')}
            />
          </label>
        </div>

        {/* PIN Protection */}
        <div className="privacy-options-group">
          <h5>🔒 Khóa Mã PIN Bảo Vệ (Privacy Vault):</h5>

          {vaultConfig.hasPin ? (
            <div className="pin-active-box">
              <span>🔒 <strong>Trạng thái:</strong> Mã PIN đang hoạt động</span>
              <button className="remove-pin-btn" onClick={handleRemovePin}>
                Hủy Mã PIN
              </button>
            </div>
          ) : (
            <div className="pin-setup-box">
              <input
                type="password"
                maxLength={4}
                placeholder="Nhập 4 chữ số PIN..."
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
              />
              <button
                className="save-pin-btn"
                onClick={handleSetPin}
                disabled={newPin.length !== 4}
              >
                Thiết Lập PIN
              </button>
            </div>
          )}

          {pinMessage && <p className="pin-feedback-text">{pinMessage}</p>}
        </div>

        {/* Offline Guarantee */}
        <div className="offline-guarantee-badge">
          <span>🛡️ 100% Dữ Liệu Lưu Trữ Cục Bộ Trên Thiết Bị (Zero-Tracking)</span>
        </div>
      </div>
    </Modal>
  )
}
