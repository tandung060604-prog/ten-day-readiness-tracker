import { audioSystem } from '../systems/GameAudioSystem'
import { GameIcon } from '../../components/common/GameIcons'
import type { GameIconName } from '../../components/common/GameIcons'
import type { LocationId } from '../types'

type Props = {
  currentLocation: LocationId | 'map'
  onNavigate: (loc: LocationId | 'map') => void
  onOpenInventory: () => void
}

const DOCK_ITEMS: { loc: LocationId | 'map'; icon: GameIconName; label: string }[] = [
  { loc: 'map',      icon: 'map',     label: 'Bản Đồ'       },
  { loc: 'quests',    icon: 'bag',     label: 'Kho Báu'       },
  { loc: 'market',    icon: 'shop',    label: 'Cửa Hàng'      },
  { loc: 'album',     icon: 'event',   label: 'Sự Kiện'       },
  { loc: 'journal',   icon: 'friends', label: 'Bạn Bè'        },
  { loc: 'settings',  icon: 'trophy',  label: 'Bảng Xếp Hạng' },
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
          <span className="hud-dock__icon">
            <GameIcon name={d.icon} size={20} />
          </span>
          <span className="hud-dock__label">{d.label}</span>
        </button>
      ))}
      <button
        className="hud-dock hud-dock--inventory"
        onClick={() => { audioSystem.playClick('pop'); onOpenInventory() }}
      >
        <span className="hud-dock__icon">
          <GameIcon name="bag" size={20} color="#ff922b" />
        </span>
        <span className="hud-dock__label">Túi Đồ</span>
      </button>
    </nav>
  )
}
