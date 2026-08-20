import { useState, useEffect } from 'react'
import { useGameState } from '../../context/GameStateContext'
import { gameEvents } from '../../domain/game/events'
import type { LocationId } from '../../game/types'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function GameDevToolsModal({ isOpen, onClose }: Props) {
  const { state, grantReward, spendCurrency, resetState } = useGameState()
  const [selectedBuilding, setSelectedBuilding] = useState<LocationId>('home')
  const [toast, setToast] = useState<string | null>(null)

  // Listen to keyboard shortcut Ctrl+Shift+D anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        if (isOpen) onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const showFeedback = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAddCurrencies = () => {
    grantReward({
      hearts: 500,
      stars: 100,
      coins: 300,
      source: 'Dev Tools: Thêm Tiền Tệ'
    })
    showFeedback('Đã thêm +500 ❤️, +100 ⭐, +300 🪙')
  }

  const handleAddXp = () => {
    grantReward({
      xp: 250,
      bondXp: 150,
      source: 'Dev Tools: Thêm XP'
    })
    showFeedback('Đã thêm +250 XP & +150 Bond XP')
  }

  const handleAddItems = () => {
    grantReward({
      items: [
        { itemId: 'strawberry_cake', quantity: 2 },
        { itemId: 'lavender_oil', quantity: 3 },
        { itemId: 'golden_nails', quantity: 15 },
        { itemId: 'love_bento', quantity: 1 }
      ],
      source: 'Dev Tools: Thêm Vật Phẩm'
    })
    showFeedback('Đã thêm 4 vật phẩm cao cấp vào kho!')
  }

  const handleUpgradeBuilding = () => {
    grantReward({
      buildingXp: [{ buildingId: selectedBuilding, amount: 200 }],
      source: `Dev Tools: Nâng Cấp ${selectedBuilding}`
    })
    showFeedback(`Đã thêm +200 XP cho công trình ${selectedBuilding}`)
  }

  const handleTriggerTestEvent = () => {
    gameEvents.emit('ACTIVITY_COMPLETED', {
      activityId: 'dev_test',
      name: 'Rèn luyện chạy bộ 5km',
      category: 'workout'
    })
    showFeedback('Đã phát sự kiện ACTIVITY_COMPLETED')
  }

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn reset toàn bộ Game State về mặc định không?')) {
      resetState()
      showFeedback('Đã reset Game State về ban đầu')
    }
  }

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '520px',
          background: '#1e1e24',
          color: '#f3f4f6',
          borderRadius: '24px',
          padding: '24px',
          border: '2px solid #ff8da1',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', background: '#e63956', color: 'white', padding: '4px 8px', borderRadius: '8px', fontWeight: 800 }}>
              DEV TOOLS
            </span>
            <h3 style={{ margin: '8px 0 0', fontSize: '18px', color: '#fff' }}>Game State Debugger</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#333',
              border: 'none',
              color: '#aaa',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ✕
          </button>
        </div>

        {toast && (
          <div style={{ background: '#10b981', color: 'white', padding: '8px 12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {toast}
          </div>
        )}

        {/* Status Preview */}
        <div style={{ background: '#2a2a32', padding: '12px', borderRadius: '14px', marginBottom: '16px', fontSize: '13px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div>Level: <strong style={{ color: '#ffd166' }}>{state.progression.level}</strong> ({state.progression.xp}/{state.progression.xpToNextLevel} XP)</div>
          <div>Bond: <strong style={{ color: '#ff8da1' }}>{state.progression.bondLevel}</strong></div>
          <div>Kho đồ: <strong>{state.inventory.length} ô</strong></div>
          <div>❤️ {state.currencies.hearts}</div>
          <div>⭐ {state.currencies.stars}</div>
          <div>🪙 {state.currencies.coins}</div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={handleAddCurrencies}
            style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            💰 +Tiền Tệ (❤️/⭐/🪙)
          </button>
          <button
            onClick={handleAddXp}
            style={{ padding: '10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            ⚡ +XP &amp; Bond Level
          </button>
          <button
            onClick={handleAddItems}
            style={{ padding: '10px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            🎁 +Vật Phẩm Quý
          </button>
          <button
            onClick={handleTriggerTestEvent}
            style={{ padding: '10px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            📡 Bắn Sự Kiện Test
          </button>
        </div>

        {/* Building Level Up */}
        <div style={{ background: '#2a2a32', padding: '12px', borderRadius: '14px', marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>
            Nâng cấp công trình:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value as LocationId)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#1e1e24', color: 'white', border: '1px solid #444' }}
            >
              {(Object.keys(state.buildings) as LocationId[]).map((b) => (
                <option key={b} value={b}>
                  {b} (Lv.{state.buildings[b]?.level || 1})
                </option>
              ))}
            </select>
            <button
              onClick={handleUpgradeBuilding}
              style={{ padding: '8px 14px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              +200 XP
            </button>
          </div>
        </div>

        {/* Spend Currency Test */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => spendCurrency('coins', 50)}
            style={{ flex: 1, padding: '8px', background: '#444', color: '#ffb703', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
          >
            Tiêu -50 🪙
          </button>
          <button
            onClick={() => spendCurrency('hearts', 20)}
            style={{ flex: 1, padding: '8px', background: '#444', color: '#ff8da1', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
          >
            Tiêu -20 ❤️
          </button>
        </div>

        {/* Reset */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <small style={{ color: '#888' }}>Nhấn Ctrl+Shift+D để bật/tắt</small>
          <button
            onClick={handleReset}
            style={{ padding: '6px 12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
          >
            Reset Game State
          </button>
        </div>
      </div>
    </div>
  )
}
