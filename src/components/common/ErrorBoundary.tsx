import React, { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in Little Days component tree:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff0f3 0%, #ffe3e8 100%)',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#4a2828'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(255, 141, 161, 0.25)',
            textAlign: 'center',
            border: '2px solid rgba(255, 141, 161, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌸🐹</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#e63956', marginBottom: '8px' }}>
              Ối, có một chút sự cố nhỏ!
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#7a5252', marginBottom: '20px' }}>
              Bé Chiikawa đang quét dọn và sắp xếp lại thị trấn. Bạn hãy thử tải lại trang nhé!
            </p>

            {this.state.error && (
              <details style={{
                textAlign: 'left',
                background: '#fff5f6',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '12px',
                color: '#993344',
                marginBottom: '20px',
                wordBreak: 'break-word',
                border: '1px solid #ffd6dc'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Chi tiết kỹ thuật</summary>
                <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #ff8da1 0%, #ff5e7e 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 94, 126, 0.3)'
                }}
              >
                🔄 Tải lại trang
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: '#f8f4f4',
                  color: '#7a5252',
                  border: '1px solid #e0d0d0',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
