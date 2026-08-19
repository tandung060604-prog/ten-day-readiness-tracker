import React, { useEffect } from 'react'

type Props = {
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ title, subtitle, onClose, children, maxWidth = '560px' }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose()
      }}
    >
      <div className="modal animate-scale-up" style={{ maxWidth }}>
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <small className="modal-subtitle">{subtitle}</small>}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
