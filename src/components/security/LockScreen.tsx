import { useEffect, useState } from 'react'
import { verifyPin, authenticateWithBiometrics, isBiometricsSupported } from '../../utils/security'
import { triggerHaptic } from '../../utils/haptics'

type Props = {
  storedPinHash: string
  enableBiometrics?: boolean
  appTitle?: string
  onUnlock: () => void
}

export function LockScreen({ storedPinHash, enableBiometrics = true, appTitle = 'Readiness Tracker', onUnlock }: Props) {
  const [pin, setPin] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [biometricsAvailable, setBiometricsAvailable] = useState(false)

  useEffect(() => {
    setBiometricsAvailable(isBiometricsSupported() && enableBiometrics)
    // Try auto biometrics once on mount if enabled
    if (enableBiometrics && isBiometricsSupported()) {
      authenticateWithBiometrics().then((success) => {
        if (success) {
          triggerHaptic('success')
          onUnlock()
        }
      })
    }
  }, [enableBiometrics, onUnlock])

  const handleDigitClick = (digit: string) => {
    if (pin.length >= 6) return
    triggerHaptic('light')
    const nextPin = pin + digit
    setPin(nextPin)
    setErrorMessage('')

    // Check when reaches 4 digits (or 6 digits depending on PIN setup)
    if (nextPin.length >= 4) {
      checkPinMatch(nextPin)
    }
  }

  const handleDelete = () => {
    triggerHaptic('light')
    setPin((prev) => prev.slice(0, -1))
    setErrorMessage('')
  }

  const checkPinMatch = async (candidatePin: string) => {
    const isMatch = await verifyPin(candidatePin, storedPinHash)
    if (isMatch) {
      triggerHaptic('success')
      onUnlock()
    } else {
      // Shake animation & error haptic
      triggerHaptic('error')
      setIsShaking(true)
      setErrorMessage('Mã PIN không chính xác')
      setTimeout(() => {
        setIsShaking(false)
        setPin('')
      }, 500)
    }
  }

  const handleBiometricsClick = async () => {
    triggerHaptic('medium')
    const success = await authenticateWithBiometrics()
    if (success) {
      triggerHaptic('success')
      onUnlock()
    }
  }

  return (
    <div className="lock-screen-backdrop">
      <div className="lock-screen-container">
        {/* Lock header */}
        <div className="lock-header">
          <div className="lock-icon-orb">🔒</div>
          <h2>{appTitle}</h2>
          <p>Nhập mã PIN riêng tư để mở khóa</p>
        </div>

        {/* PIN indicator dots */}
        <div className={`pin-dots-row ${isShaking ? 'shake-animation' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`pin-dot ${pin.length > index ? 'filled' : ''}`}
            />
          ))}
        </div>

        {errorMessage && <div className="pin-error-text">{errorMessage}</div>}

        {/* iOS-Style Numeric Keypad */}
        <div className="ios-keypad">
          {[
            ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
            ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
            ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']
          ].map(([num, letters]) => (
            <button
              key={num}
              type="button"
              className="keypad-btn"
              onClick={() => handleDigitClick(num)}
            >
              <span className="keypad-num">{num}</span>
              {letters && <span className="keypad-sub">{letters}</span>}
            </button>
          ))}

          {/* Bottom row: Biometrics, 0, Delete */}
          {biometricsAvailable ? (
            <button
              type="button"
              className="keypad-btn action-key"
              onClick={handleBiometricsClick}
              title="Mở khóa bằng Face ID / Touch ID"
            >
              <span className="keypad-icon">👤</span>
              <span className="keypad-sub">Face ID</span>
            </button>
          ) : (
            <div className="keypad-btn empty-key" />
          )}

          <button
            type="button"
            className="keypad-btn"
            onClick={() => handleDigitClick('0')}
          >
            <span className="keypad-num">0</span>
          </button>

          <button
            type="button"
            className="keypad-btn action-key"
            onClick={handleDelete}
            title="Xóa ký tự"
          >
            <span className="keypad-icon">⌫</span>
            <span className="keypad-sub">Xóa</span>
          </button>
        </div>

        <div className="lock-footer-note">
          <span>🔒 Dữ liệu được bảo vệ an toàn 100% trên thiết bị này</span>
        </div>
      </div>
    </div>
  )
}
