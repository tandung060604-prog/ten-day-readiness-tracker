# Little Days — Transition Guide

## Transition Types & Timing

| Type | Used In | Visual Effect | SFX Soundscape |
|---|---|---|---|
| `cloud` | Quests, Gym, Market, Map Return | Double cloud curtains sliding inward then opening | Soft wind whoosh |
| `water` | Water Fountain, Nha Trang Beach | Expanding oceanic ripple ring with blue gradient | Water drop & ripple tone |
| `book` | Journal Library | Turning dual book pages covering viewport | Paper page turn swoosh |
| `camera` | Photo Album | Camera shutter iris + 80ms white flash | Mechanical shutter click |
| `moon` | Sleep Center | Crescent moon wipe + night stars | Celestial wind chime |
| `plane` | Airport | Airplane flying across foreground with smoke trail | Aircraft flyby sound |
| `heart` | Home, Date Restaurant | Expanding romantic heart portal | Warm romantic arpeggio |
| `gear` | Town Hall (Settings) | Rotating gear iris aperture | Clockwork click & snap |

---

## API Usage Example

```tsx
import { TransitionSystem } from './game/systems/TransitionSystem'

<TransitionSystem type="water" isActive={isTransitioning} />
```
