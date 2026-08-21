import type { ReactNode } from 'react'
import type { DailyScreen } from '../../app/appRoute'

interface DailyModeShellProps {
  screen: DailyScreen
  onScreenChange: (screen: DailyScreen) => void
  onChangeMode: () => void
  onAdventure: () => void
  children: ReactNode
}

const labels: Record<DailyScreen, string> = { today: 'Hôm nay', plan: 'Kế hoạch', journal: 'Nhật ký', settings: 'Cài đặt' }

export function DailyModeShell({ screen, onScreenChange, onChangeMode, onAdventure, children }: DailyModeShellProps) {
  return (
    <div className="daily-mode-shell">
      <header className="daily-mode-header"><span className="home-hub-kicker">{labels[screen]}</span><button onClick={onChangeMode}>Đổi chế độ</button></header>
      {children}
      <nav className="daily-bottom-nav" aria-label="Điều hướng Hôm nay">
        <button className={screen === 'today' ? 'active' : ''} onClick={() => onScreenChange('today')}>♥<span>Hôm nay</span></button>
        <button className={screen === 'plan' ? 'active' : ''} onClick={() => onScreenChange('plan')}>✓<span>Kế hoạch</span></button>
        <button className={screen === 'journal' ? 'active' : ''} onClick={() => onScreenChange('journal')}>▤<span>Nhật ký</span></button>
        <button onClick={onAdventure}>✦<span>Phiêu lưu</span></button>
        <button className={screen === 'settings' ? 'active' : ''} onClick={() => onScreenChange('settings')}>⚙<span>Cài đặt</span></button>
      </nav>
    </div>
  )
}
