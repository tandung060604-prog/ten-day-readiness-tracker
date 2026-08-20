import React, { Component, type ReactNode } from 'react'
import { ChiikawaSVG } from './ChiikawaSVG'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleResetStorage = () => {
    if (window.confirm('Bạn có muốn đặt lại dữ liệu cục bộ và làm mới trang không?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card">
            <ChiikawaSVG character="chiikawa" size={64} />
            <h2>Đã có sự cố nhỏ xảy ra nà~ 🌸</h2>
            <p className="error-msg-detail">
              {this.state.error?.message || 'Một lỗi không mong muốn đã được chặn lại an toàn.'}
            </p>
            <p className="error-subnote">
              Đừng lo lắng, dữ liệu của bạn vẫn an toàn trong bộ nhớ máy.
            </p>

            <div className="error-actions-row">
              <button className="reload-app-btn" onClick={this.handleReload}>
                🔄 Tải Lại Trang
              </button>
              <button className="reset-cache-btn" onClick={this.handleResetStorage}>
                🧹 Đặt Lại Dữ Liệu
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
