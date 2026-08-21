import { useState } from 'react'
import { Modal } from '../common/Modal'
import { backupManager } from '../../domain/privacy/backupManager'
import { encryptedSync } from '../../domain/privacy/encryptedSync'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'

interface DataBackupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DataBackupModal({ isOpen, onClose }: DataBackupModalProps) {
  const [passphrase, setPassphrase] = useState('')
  const [encryptMode, setEncryptMode] = useState(false)
  const [importSummary, setImportSummary] = useState<string | null>(null)
  const [pendingPayload, setPendingPayload] = useState<any | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [syncMode, setSyncMode] = useState(false)

  if (!isOpen) return null

  // 1. Handle Export
  const handleExport = async () => {
    audioSystem.playClick('pop')
    try {
      const payload = backupManager.generateBackupPayload()
      let dataToDownload: string
      let filename: string

      if (encryptMode) {
        if (!passphrase.trim()) {
          setStatusMessage({ text: 'Vui lòng nhập mật khẩu để mã hóa file!', isError: true })
          return
        }
        const encrypted = await backupManager.encryptBackup(payload, passphrase.trim())
        dataToDownload = JSON.stringify(encrypted, null, 2)
        filename = `little_days_encrypted_backup_${new Date().toISOString().split('T')[0]}.json`
      } else {
        dataToDownload = JSON.stringify(payload, null, 2)
        filename = `little_days_backup_${new Date().toISOString().split('T')[0]}.json`
      }

      const blob = new Blob([dataToDownload], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      setStatusMessage({ text: `Đã xuất file sao lưu thành công (${filename})! 🎉`, isError: false })
      triggerConfetti()
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Lỗi khi xuất file sao lưu!', isError: true })
    }
  }

  const handleSyncExport = async () => {
    audioSystem.playClick('pop')
    if (!passphrase.trim()) { setStatusMessage({ text: 'Vui lòng nhập mật khẩu đồng bộ!', isError: true }); return }
    try {
      const envelope = await encryptedSync.createEnvelope(passphrase.trim())
      const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `little_days_sync_${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url)
      setStatusMessage({ text: 'Đã tạo gói đồng bộ mã hóa. Chuyển file này sang thiết bị còn lại.', isError: false })
    } catch (error) { setStatusMessage({ text: error instanceof Error ? error.message : 'Không tạo được gói đồng bộ.', isError: true }) }
  }

  // 2. Handle File Selected for Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async event => {
      try {
        const raw = event.target?.result as string
        const parsed = JSON.parse(raw)
        if (parsed?.kind === 'little-days-encrypted-sync') {
          setPendingPayload(parsed); setSyncMode(true); setImportSummary('Gói đồng bộ mã hóa AES-GCM'); setStatusMessage(null); return
        }
        setSyncMode(false)
        const validation = backupManager.validateBackupPayload(parsed)

        if (!validation.isValid) {
          setStatusMessage({ text: validation.error || 'File không hợp lệ!', isError: true })
          setPendingPayload(null)
          setImportSummary(null)
          return
        }

        setPendingPayload(parsed)
        setImportSummary(validation.summary || 'File hợp lệ')
        setStatusMessage(null)
      } catch {
        setStatusMessage({ text: 'File không đúng định dạng JSON!', isError: true })
        setPendingPayload(null)
        setImportSummary(null)
      }
    }
    reader.readAsText(file)
  }

  // 3. Confirm Restore
  const handleConfirmRestore = async () => {
    if (!pendingPayload) return
    audioSystem.playClick('pop')

    try {
      let finalPayload = pendingPayload

      if (syncMode) {
        if (!passphrase.trim()) {
          setStatusMessage({ text: 'Vui lòng nhập mật khẩu đồng bộ!', isError: true })
          return
        }
        finalPayload = await encryptedSync.decryptEnvelope(pendingPayload, passphrase.trim())
      } else if (pendingPayload.isEncrypted) {
        if (!passphrase.trim()) {
          setStatusMessage({ text: 'Vui lòng nhập mật khẩu giải mã!', isError: true })
          return
        }
        finalPayload = await backupManager.decryptBackup(pendingPayload, passphrase.trim())
      }

      const res = syncMode
        ? encryptedSync.restoreMergedPayload(backupManager.generateBackupPayload(), finalPayload)
        : backupManager.restoreBackupPayload(finalPayload)
      if (res.success) {
        setStatusMessage({ text: 'Khôi phục dữ liệu thành công! Ứng dụng sẽ tải lại sau 2 giây...', isError: false })
        triggerConfetti()
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setStatusMessage({ text: res.error || 'Lỗi khôi phục dữ liệu!', isError: true })
      }
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Giải mã thất bại. Vui lòng kiểm tra mật khẩu!', isError: true })
    }
  }

  // 4. Handle Factory Reset
  const handleFactoryReset = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <Modal title="Sao Lưu & Khôi Phục Dữ Liệu (Data Vault)" onClose={onClose}>
      <div className="backup-modal-container">
        <div className="backup-section-card sync-section-card">
          <h4>🔐 Đồng Bộ Mã Hóa Giữa Hai Thiết Bị</h4>
          <p className="section-desc">Tạo một gói AES-GCM cục bộ, chuyển qua kênh riêng tư rồi nhập ở thiết bị còn lại. Không cần máy chủ.</p>
          <input type="password" placeholder="Mật khẩu đồng bộ (ít nhất 4 ký tự)" value={passphrase} onChange={e => setPassphrase(e.target.value)} />
          <button className="export-action-btn" onClick={handleSyncExport}>Tạo gói đồng bộ mã hóa</button>
        </div>
        {/* Export Section */}
        <div className="backup-section-card">
          <h4>📦 Xuất File Sao Lưu (Export Backup)</h4>
          <p className="section-desc">
            Tải toàn bộ tiến trình thị trấn, kỷ vật tình yêu và màn chơi giải đố thành file JSON an toàn.
          </p>

          <div className="encrypt-toggle-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={encryptMode}
                onChange={e => setEncryptMode(e.target.checked)}
              />
              <span>🔒 Mã Hóa File Bằng Mật Khẩu (AES-GCM 256-bit)</span>
            </label>
          </div>

          {encryptMode && (
            <div className="passphrase-input-row">
              <input
                type="password"
                placeholder="Nhập mật khẩu mã hóa (ít nhất 4 ký tự)..."
                value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
              />
            </div>
          )}

          <button className="export-action-btn animate-bounce-gentle" onClick={handleExport}>
            📥 Tải File Sao Lưu Về Máy
          </button>
        </div>

        {/* Import Section */}
        <div className="backup-section-card">
          <h4>📤 Khôi Phục Dữ Liệu (Import Backup)</h4>
          <p className="section-desc">
            Chọn file sao lưu JSON để khôi phục lại dữ liệu cặp đôi trên thiết bị này.
          </p>

          <input type="file" accept=".json" onChange={handleFileChange} className="file-input-control" />

          {importSummary && (
            <div className="import-preview-box">
              <span>✅ <strong>Xác nhận file:</strong> {importSummary}</span>
              {pendingPayload?.isEncrypted && (
                <input
                  type="password"
                  className="decrypt-input"
                  placeholder="Nhập mật khẩu giải mã..."
                  value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                />
              )}
              <button className="restore-confirm-btn" onClick={handleConfirmRestore}>
                🔄 Xác Nhận Khôi Phục Dữ Liệu
              </button>
            </div>
          )}
        </div>

        {statusMessage && (
          <div className={`status-toast ${statusMessage.isError ? 'error' : 'success'}`}>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Destructive Factory Reset */}
        <div className="danger-zone-card">
          <h4>⚠️ Vùng Nguy Hiểm</h4>
          {!showResetConfirm ? (
            <button className="danger-reset-btn" onClick={() => setShowResetConfirm(true)}>
              🗑️ Xóa Toàn Bộ Dữ Liệu & Bắt Đầu Lại
            </button>
          ) : (
            <div className="reset-confirm-box">
              <p>Hành động này sẽ xóa vĩnh viễn mọi dữ liệu trên thiết bị. Bạn có chắc chắn không?</p>
              <div className="reset-actions">
                <button className="cancel-reset-btn" onClick={() => setShowResetConfirm(false)}>Hủy</button>
                <button className="confirm-delete-btn" onClick={handleFactoryReset}>Đồng Ý Xóa</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
