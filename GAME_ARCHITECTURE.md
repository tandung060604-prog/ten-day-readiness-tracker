# Little Days — Game Architecture & Design System

## 1. Overview
**Little Days** (*A tiny world for our everyday life*) is a cozy couple-life browser game built with React, TypeScript, and Vite. It transforms the 10-day readiness and Nha Trang travel preparation into an interactive town adventure.

---

## 2. Core Game Loop & Lifecycle

```text
App Launch
   ↓
Splash Screen (16:9 Landscape with Parallax Clouds & Progress)
   ↓
Tap to Enter (Audio Context Unlock + Cloud Wipe)
   ↓
World Map (Landscape Hub Map with 12 Buildings & Mascots)
   ↓
Building Click (Camera Focus + Cinematic Transition)
   ↓
Active Tracker Module (Gym, Water, Sleep, Quests, Journal, etc.)
   ↓
Exit Transition (Back to World Map)
```

---

## 3. World Map & 12 Interactive Locations

| Location ID | In-Game Name | Mascots | Transition Type | Description |
|---|---|---|---|---|
| `home` | **Nhà Của Chúng Mình** | Chiikawa 🐹 | `heart` | Tổ ấm của Dũng & Em Yêu, đếm ngày yêu và trạng thái 10 ngày. |
| `quests` | **Quảng Trường Quest** | Hachiware 🐱 | `cloud` | Checklist nhiệm vụ hàng ngày và phần thưởng ngôi sao. |
| `gym` | **Nhà Tập (Gym & Dojo)** | Usagi 🐰 | `cloud` | Bài tập thể lực, video mô phỏng động tác và đẩy tạ. |
| `water` | **Đài Uống Nước** | Hachiware 🐱 | `water` | Theo dõi lượng nước uống, hiệu ứng ly nước sóng sánh. |
| `sleep` | **Trung Tâm Giấc Ngủ** | Kurimanju 🦦 | `moon` | Theo dõi chu kỳ ngủ 90 phút và âm thanh ru ngủ. |
| `journal` | **Thư Viện Nhật Ký** | Chiikawa 🐹 | `book` | Ghi lại cảm xúc, mức năng lượng và suy ngẫm trong ngày. |
| `album` | **Album Kỷ Niệm** | Momonga 🐿️ | `camera` | Dải phim kỷ niệm và các hình ảnh món ăn đã chụp. |
| `market` | **Chợ Nhỏ (Nutrition)** | Momonga 🐿️ | `cloud` | Quản lý bữa ăn healthy, calo và dinh dưỡng sạch. |
| `restaurant` | **Queen Ann Sky Lounge** | Chiikawa 🐹 | `heart` | Lên kế hoạch bữa tối lãng mạn ngắm vịnh Nha Trang. |
| `airport` | **Sân Bay Quốc Tế** | Rakko ⭐ | `plane` | Đếm ngược chuyến bay 27/08 và quỹ du lịch MoMo 8 triệu. |
| `beach` | **Bãi Biển Nha Trang** | Usagi 🐰 | `water` | Lịch trình 6 điểm đến: Tour 3 Đảo, Vĩnh Trường, Viện Hải Dương. |
| `settings` | **Tòa Thị Chính** | Rakko ⭐ | `gear` | Khóa mã PIN, Face ID, tùy chỉnh âm thanh và sao lưu. |

---

## 4. Systems Architecture

- **`TransitionSystem`**: Handles 8 distinct cinematic screen wipes (`cloud`, `water`, `book`, `camera`, `moon`, `plane`, `heart`, `gear`).
- **`GameAudioSystem`**: Web Audio synthesized SFX (tap, pop, enter, chord, chimes) + YouTube BGM integration with volume memory.
- **`TopHUD`**: Real-time Love Hearts, Discipline Stars, Memory Gems, and Energy bar.
- **`BottomHUD`**: Responsive dock for one-tap navigation and inventory management.
