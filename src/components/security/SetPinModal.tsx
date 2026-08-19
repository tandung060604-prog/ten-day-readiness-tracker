import { useState } from 'react'
import { Modal } from '../common/Modal'
import { hashPin, verifyPin } from '../../utils/security'

type Props = {
  currentPinHash?: string
  onClose: () => void
  onSuccess: (newPinHash: string | undefined) => void
}

export function SetPinModal({ currentPinHash, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'verifyOld' | 'enterNew' | 'confirmNew'>(
    currentPinHash ? 'verifyOld' : 'enterNew'
  )
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')

  const handleVerifyOld = async () => {
    if (!currentPinHash) {
      setStep('enterNew')
      return
    }
    const isValid = await verifyPin(oldPin, currentPinHash)
    if (isValid) {
      setError('')
      setStep('enterNew')
    } else {
      setError('Mã PIN cũ không chính xác!')
    }
  }

  const handleEnterNew = () => {
    if (newPin.length < 4) {
      setError('Mã PIN phải có ít nhất 4 chữ số!')
      return
    }
    setError('')
    setStep('confirmNew')
  }

  const handleConfirmNew = async () => {
    if (confirmPin !== newPin) {
      setError('Mã PIN xác nhận không khớp!')
      return
    }
    const hashed = await hashPin(newPin)
    onSuccess(hashed)
    onClose()
  }

  const handleDisablePin = () => {
    if (confirm('Bạn có chắc muốn tắt mã PIN bảo mật?')) {
      onSuccess(undefined)
      onClose()
    }
  }

  return (
    <Modal
      title={currentPinHash ? 'Đổi Mã PIN Bảo Mật' : 'Thiết Lập Mã PIN Mới'}
      subtitle="Bảo vệ sự riêng tư, chỉ mình bạn mở được ứng dụng"
      onClose={onClose}
      maxWidth="480px"
    >
      <div className="form-grid">
        {step === 'verifyOld' && (
          <>
            <label className="full">
              Nhập mã PIN hiện tại của bạn:
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                autoFocus
              />
            </label>
            {error && <div className="full form-error-msg">{error}</div>}
            <div className="full modal-actions-row">
              <button type="button" className="danger compact" onClick={handleDisablePin}>
                Tắt bảo mật PIN
              </button>
              <button type="button" className="secondary compact" onClick={onClose}>
                Hủy
              </button>
              <button type="button" className="primary" onClick={handleVerifyOld}>
                Tiếp tục
              </button>
            </div>
          </>
        )}

        {step === 'enterNew' && (
          <>
            <label className="full">
              Nhập mã PIN mới (4 - 6 số):
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                autoFocus
              />
            </label>
            {error && <div className="full form-error-msg">{error}</div>}
            <div className="full modal-actions-row">
              <button type="button" className="secondary compact" onClick={onClose}>
                Hủy
              </button>
              <button type="button" className="primary" onClick={handleEnterNew}>
                Xác nhận
              </button>
            </div>
          </>
        )}

        {step === 'confirmNew' && (
          <>
            <label className="full">
              Nhập lại mã PIN mới để xác nhận:
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                autoFocus
              />
            </label>
            {error && <div className="full form-error-msg">{error}</div>}
            <div className="full modal-actions-row">
              <button type="button" className="secondary compact" onClick={() => setStep('enterNew')}>
                Quay lại
              </button>
              <button type="button" className="primary" onClick={handleConfirmNew}>
                Lưu mã PIN
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
