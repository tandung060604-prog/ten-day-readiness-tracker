import type { TransitionType } from '../types'

type Props = {
  type: TransitionType
  isActive: boolean
  onComplete?: () => void
}

export function TransitionSystem({ type, isActive }: Props) {
  if (!isActive) return null

  return (
    <div className={`game-transition-overlay transition-${type} animate-transition-in`}>
      {/* Type 1: Cloud Wipe */}
      {type === 'cloud' && (
        <div className="cloud-wipe-wrapper">
          <div className="cloud-wipe-left" />
          <div className="cloud-wipe-right" />
          <div className="transition-icon-center">☁️</div>
        </div>
      )}

      {/* Type 2: Water Ripple */}
      {type === 'water' && (
        <div className="water-ripple-wrapper">
          <div className="water-circle-expand" />
          <div className="transition-icon-center">💧</div>
        </div>
      )}

      {/* Type 3: Book Page Turn */}
      {type === 'book' && (
        <div className="book-turn-wrapper">
          <div className="book-page-left" />
          <div className="book-page-right" />
          <div className="transition-icon-center">📖</div>
        </div>
      )}

      {/* Type 4: Camera Shutter */}
      {type === 'camera' && (
        <div className="camera-shutter-wrapper">
          <div className="camera-flash" />
          <div className="camera-aperture" />
          <div className="transition-icon-center">📸</div>
        </div>
      )}

      {/* Type 5: Moon & Stars Night Wipe */}
      {type === 'moon' && (
        <div className="moon-wipe-wrapper">
          <div className="moon-sky-mask" />
          <div className="transition-icon-center">🌙</div>
        </div>
      )}

      {/* Type 6: Airplane Trail */}
      {type === 'plane' && (
        <div className="plane-wipe-wrapper">
          <div className="plane-sky-curtain" />
          <div className="plane-flight-anim">
            <span>✈️</span>
          </div>
        </div>
      )}

      {/* Type 7: Romantic Heart Portal */}
      {type === 'heart' && (
        <div className="heart-portal-wrapper">
          <div className="heart-expanding-circle" />
          <div className="transition-icon-center">💖</div>
        </div>
      )}

      {/* Type 8: Gear Iris */}
      {type === 'gear' && (
        <div className="gear-iris-wrapper">
          <div className="gear-rotating-mask" />
          <div className="transition-icon-center">⚙️</div>
        </div>
      )}
    </div>
  )
}
