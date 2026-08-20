# Authoritative World Location Registry

This document records the canonical registry of all 13 interactive locations in Little Days Town.

---

## Location Registry Table

| ID | Name | Category | Map Coords (X, Y) | Anchor (X, Y) | Visual Sprite | Transition | Unlock Lv |
|---|---|---|---|---|---|---|---|
| `home` | **Tổ Ấm Chiikawa & Usagi** | `core` | (48%, 48%) | (48%, 55%) | `./assets/buildings/home.png` | `heart` | Lv. 1 |
| `quests` | **Quảng Trường Kế Hoạch 10 Ngày** | `core` | (68%, 38%) | (68%, 45%) | `./assets/buildings/quests.png` | `cloud` | Lv. 1 |
| `gym` | **Võ Đường Gym & Đẩy Tạ** | `fitness` | (28%, 38%) | (28%, 45%) | `./assets/buildings/gym.png` | `cloud` | Lv. 1 |
| `water` | **Đài Phun Nước Bù Nước** | `wellness` | (48%, 72%) | (48%, 78%) | `./assets/buildings/water.png` | `water` | Lv. 1 |
| `sleep` | **Vườn Ngủ Say 90 Phút** | `wellness` | (78%, 65%) | (78%, 72%) | `./assets/buildings/sleep.png` | `moon` | Lv. 1 |
| `journal` | **Thư Viện Nhật Ký Yêu Thương** | `romance` | (18%, 65%) | (18%, 72%) | `./assets/buildings/journal.png` | `book` | Lv. 1 |
| `album` | **Tiệm Ảnh Polaroid Kỷ Niệm** | `romance` | (32%, 78%) | (32%, 84%) | `./assets/buildings/album.png` | `camera` | Lv. 1 |
| `market` | **Chợ Phiên Dinh Dưỡng** | `dining` | (82%, 42%) | (82%, 48%) | `./assets/buildings/market.png` | `cloud` | Lv. 1 |
| `restaurant` | **Nhà Hàng Bữa Tối Lãng Mạn** | `dining` | (62%, 78%) | (62%, 84%) | `./assets/buildings/restaurant.png` | `heart` | Lv. 1 |
| `airport` | **Sân Bay Chuyến Bay 27/08** | `adventure` | (88%, 18%) | (88%, 25%) | `./assets/buildings/airport.png` | `plane` | Lv. 1 |
| `beach` | **Bãi Biển Tour 3 Đảo Nha Trang** | `adventure` | (12%, 18%) | (12%, 25%) | `./assets/buildings/beach.png` | `water` | Lv. 1 |
| `hospital` | **Bệnh Viện Tình Yêu Flo Cycle** | `wellness` | (35%, 22%) | (35%, 28%) | `./assets/buildings/hospital.png` | `heart` | Lv. 1 |
| `settings` | **Tòa Thị Chính Quản Trị** | `core` | (65%, 22%) | (65%, 28%) | `./assets/buildings/settings.png` | `gear` | Lv. 1 |

---

## Schema Reference

```typescript
export interface WorldLocation {
  id: LocationId
  name: string
  subtitle: string
  category: 'core' | 'fitness' | 'wellness' | 'dining' | 'romance' | 'adventure'
  position: { x: number; y: number }
  characterAnchor: { x: number; y: number }
  img: string
  icon: string
  color: string
  glow: string
  tag: string
  size: number
  transition: 'cloud' | 'water' | 'book' | 'camera' | 'moon' | 'plane' | 'heart' | 'gear'
  ambienceId: string
  unlockLevel: number
  defaultLevel: 1 | 2 | 3
}
```
