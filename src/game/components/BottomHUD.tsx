import { audioSystem } from '../systems/GameAudioSystem'
import type { LocationId } from '../types'

type Props = {
  currentLocation: LocationId | 'map'
  onNavigate: (loc: LocationId | 'map') => void
  onOpenInventory: () => void
}

const DOCK_ITEMS: { loc: LocationId | 'map'; icon: string; label: string }[] = [
  { loc: 'map',      icon: '🗺️', label: 'Bản Đồ'       },
  { loc: 'quests',    icon: '🎒', label: 'Kho Báu'       },
  { loc: 'market',    icon: '🏪', label: 'Cửa Hàng'      },
  { loc: 'album',     icon: '🎈', label: 'Sự Kiện'       },
  { loc: 'journal',   icon: '👫', label: 'Bạn Bè'        },
  { loc: 'settings',  icon: '🏆', label: 'Bảng Xếp Hạng' },
]

export function BottomHUD({ currentLocation, onNavigate, onOpenInventory }: Props) {
  return (
    <nav className="hud-bottom">
      {DOCK_ITEMS.map((d) => (
        <button
          key={d.loc}
          className={`hud-dock ${currentLocation === d.loc ? 'hud-dock--active' : ''}`}
          onClick={() => { audioSystem.playClick('soft'); onNavigate(d.loc) }}
        >
          <span className="hud-dock__icon">{d.icon}</span>
          <span className="hud-dock__label">{d.label}</span>
        </button>
      ))}
    </nav>
  )
}
