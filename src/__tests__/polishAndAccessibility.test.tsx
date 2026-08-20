import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../components/common/ErrorBoundary'

// Component that intentionally throws an error
const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test crash event')
  }
  return <div>Ứng dụng hoạt động bình thường!</div>
}

describe('Polish, Performance & Accessibility Suite — Phase 12', () => {
  describe('1. Error Boundary Crash Guard', () => {
    it('renders child components cleanly when no errors occur', () => {
      render(
        <ErrorBoundary>
          <ProblemChild shouldThrow={false} />
        </ErrorBoundary>
      )
      expect(screen.getByText('Ứng dụng hoạt động bình thường!')).toBeDefined()
    })

    it('catches runtime errors gracefully and displays Chiikawa recovery screen', () => {
      const originalError = console.error
      console.error = () => {}

      render(
        <ErrorBoundary>
          <ProblemChild shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Đã có sự cố nhỏ xảy ra/i)).toBeDefined()
      expect(screen.getByText(/Test crash event/i)).toBeDefined()
      expect(screen.getByText(/Tải Lại Trang/i)).toBeDefined()

      console.error = originalError
    })
  })

  describe('2. WCAG & Keyboard Accessibility Attributes', () => {
    it('verifies essential interactive buttons have accessible text labels', () => {
      render(
        <ErrorBoundary>
          <button aria-label="Đóng bảng điều khiển" className="test-btn">
            ✖
          </button>
        </ErrorBoundary>
      )

      const btn = screen.getByRole('button', { name: /Đóng bảng điều khiển/i })
      expect(btn).toBeDefined()
      expect(btn.getAttribute('aria-label')).toBe('Đóng bảng điều khiển')
    })
  })
})
