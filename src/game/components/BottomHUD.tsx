import { audioSystem } from '../systems/GameAudioSystem'
import type { LocationId } from '../types'

type Props = {
  currentLocation: LocationId | 'map'
  onNavigate: (loc: LocationId | 'map') => void
  onOpenInventory: () => void
}

export function BottomHUD({ currentLocation, onNavigate, onOpenInventory }: Props) {
  const handleNavClick = (loc: LocationId | 'map') => {
    audioSystem.playClick('soft')
    onNavigate(loc)
  }

  return (
    <nav className="game-bottom-hud">
      <button
        className={`hud-dock-btn ${currentLocation === 'map' ? 'active' : ''}`}
        onClick={() => handleNavClick('map')}
        title="Quay lại Bản Đồ Thế Giới (World Map)"
      >
        <span className="dock-icon">🗺️</span>
        <span className="dock-label">Bản Đồ</span>
      </button>

      <button
        className="hud-dock-btn"
        onClick={() => {
          audioSystem.playClick('pop')
          onOpenInventory()
        }}
        title="Mở Túi Đồ Kỷ Niệm (Inventory)"
      >
        <span className="dock-icon">🎒</span>
        <span className="dock-label">Túi Đồ</span>
      </button>

      <button
        className={`hud-dock-btn ${currentLocation === 'quests' ? 'active' : ''}`}
        onClick={() => handleNavClick('quests')}
        title="Quảng Trường Nhiệm Vụ (Quests Plaza)"
      >
        <span className="dock-icon">🎁</span>
        <span className="dock-label">Nhiệm Vụ</span>
      </button>

      <button
        className={`hud-dock-btn ${currentLocation === 'airport' || currentLocation === 'beach' ? 'active' : ''}`}
        onClick={() => handleNavClick('beach')}
        title="Chuyến Đi Nha Trang 27/08"
      >
        <span className="dock-icon">🏖️</span>
        <span className="dock-label">Nha Trang</span>
      </button>

      <button
        className={`hud-dock-btn ${currentLocation === 'album' ? 'active' : ''}`}
        onClick={() => handleNavClick('album')}
        title="Album Kỷ Niệm 2 Đứa Mình"
      >
        <span className="dock-icon">📖</span>
        <span className="dock-label">Kỷ Niệm</span>
      </button>

      <button
        className={`hud-dock-btn ${currentLocation === 'settings' ? 'active' : ''}`}
        onClick={() => handleNavClick('settings')}
        title="Tòa Thị Chính & Cài Đặt (Town Hall)"
      >
        <span className="dock-icon">🏛️</span>
        <span className="dock-label">Thị Chính</span>
      </button>
    </nav>
  )
}
