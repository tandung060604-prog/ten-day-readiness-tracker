import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../components/common/ErrorBoundary'

const ThrowingComponent = () => {
  throw new Error('Test component crash')
}

const SafeComponent = () => {
  return <div>Thị trấn Little Days bình yên</div>
}

describe('ErrorBoundary & Core Boot Smoke Tests', () => {
  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Thị trấn Little Days bình yên')).toBeInTheDocument()
  })

  it('catches runtime component errors and displays friendly fallback UI', () => {
    // Suppress console.error during expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Ối, có một chút sự cố nhỏ!/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tải lại trang/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
