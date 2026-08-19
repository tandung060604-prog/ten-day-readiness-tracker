# GAME REDESIGN SPEC — COZY COUPLE WORLD

## 0. Mục tiêu

Biến website tracker hiện tại thành một **cozy couple-life browser game** chạy trên web, ưu tiên màn hình ngang, có cảm giác giống một game thật ngay từ khi mở app.

Các nguyên tắc chính:

- Mở app không vào dashboard trực tiếp.
- Có **splash / loading / transition scene** trước khi vào game.
- Homepage chính là **world map dạng game**.
- Có **Chiikawa + Usagi** làm hai nhân vật trung tâm của couple profile.
- Mỗi tòa nhà / địa điểm là một module thật của tracker.
- Khi click vào một địa điểm phải có:
  - hiệu ứng click,
  - camera focus / zoom nhẹ,
  - character reaction,
  - loading/transition,
  - rồi mới vào màn tương ứng.
- Khi load xong một scene/module cũng phải có hiệu ứng vào màn.
- Thiết kế lâu dài, không phải MVP làm cho có.
- Giữ data engine hiện tại: meals, workout, sleep, journal, photos, hydration, IndexedDB, export/import.
- Game layer và tracker layer phải tách logic rõ ràng.

---

# 1. Định hướng sản phẩm

Tên làm việc:

## Little Days
hoặc
## Our Little Journey

Subtitle gợi ý:

> A tiny world for our everyday life.

Kế hoạch 10 ngày hiện tại chỉ là:

> Adventure #1 — 10-Day Readiness

Sau này mở rộng:

- Adventure #2 — Nha Trang Trip
- Adventure #3 — Fitness Month
- Adventure #4 — Anniversary
- Adventure #5 — Couple Goals
- Adventure #6 — Seasonal Event

---

# 2. Trải nghiệm mở app

Không đi thẳng vào world map.

Flow chính:

```text
App Launch
   ↓
Splash Screen
   ↓
Preload Assets
   ↓
Login/Profile Check
   ↓
Intro Transition
   ↓
World Map
```

Nếu profile chưa tồn tại:

```text
App Launch
   ↓
Splash Screen
   ↓
Character Creation
   ↓
Couple Setup
   ↓
Welcome Home Animation
   ↓
World Map
```

---

# 3. Splash Screen

## 3.1. Mục tiêu

Ngay khi mở app, người dùng phải cảm giác như đang mở một game.

Không dùng blank white page hoặc loading spinner mặc định.

## 3.2. Layout

Màn hình ngang 16:9.

Background:

- pastel sky,
- mây trôi nhẹ,
- gradient mềm,
- một vài cánh hoa,
- ánh sáng dịu,
- silhouette thị trấn ở xa.

Ở giữa:

```text
Little Days

A tiny world for our everyday life
```

Phía dưới:

```text
Loading memories...
```

hoặc:

```text
Preparing our little world...
```

## 3.3. Animation

Timeline đề xuất:

```text
0ms      background fade-in
300ms    clouds begin drifting
500ms    logo scale 0.92 → 1.00
800ms    tiny sparkle
1000ms   loading progress starts
```

Loading progress:

```text
[████████░░░░░]
```

Không cần hiển thị % quá kỹ thuật.

Có thể đổi text theo asset:

```text
Loading town...
Loading characters...
Preparing memories...
Almost ready...
```

## 3.4. Audio

Không autoplay có âm thanh trước user interaction.

Sau khi load xong:

```text
Tap to Enter
```

Người dùng tap:

- mở audio context,
- bật BGM ở mức 20–25%,
- phát `enter-world.ogg`,
- chuyển scene.

---

# 4. Splash background animation

Background chạy nền cần có nhiều layer.

## Layer 1 — Sky

- gradient pastel,
- chuyển sắc rất nhẹ,
- không animate quá mạnh.

## Layer 2 — Clouds

Clouds chạy ngang:

```text
speed: 4–12 px/sec
opacity: 0.4–0.8
```

Tối thiểu 3 tốc độ khác nhau để tạo parallax.

## Layer 3 — Floating particles

Ví dụ:

- cherry blossom petals,
- tiny stars,
- soft dust particles.

Motion:
- trôi chậm,
- random nhẹ,
- không gây rối.

## Layer 4 — Town silhouette

Một vùng map ở xa:
- blur nhẹ,
- scale nhỏ,
- tạo cảm giác sắp “đi vào thế giới”.

## Layer 5 — Character silhouettes

Optional:

Chiikawa + Usagi chạy từ trái sang phải hoặc đứng dưới logo.

Không cần chi tiết nhiều ở splash.

---

# 5. Transition từ splash → game

Không fade thẳng.

## Option A — Cloud Wipe

Hai cụm mây kéo vào từ hai bên:

```text
cloud-left  → center
cloud-right → center
```

Màn hình trắng/mây trong 300–500ms.

Sau đó:

```text
world map reveal
```

Clouds kéo ra.

Tổng thời gian:

```text
700–1000ms
```

## Option B — Camera Dive

Logo scale down.

Background map ở xa zoom dần:

```text
scale 0.7 → 1.0
blur 8px → 0px
```

Sau đó HUD xuất hiện.

## Option C — Heart Portal

Một heart-shaped portal mở rộng:

```text
clip-path: heart
scale 0.1 → 2.5
```

Sau đó reveal map.

Khuyên dùng:

**Cloud Wipe + Camera Dive kết hợp.**

---

# 6. World Map

Homepage chính là một **landscape game hub map**.

Aspect ratio ưu tiên:

```text
16:9
```

Desktop chuẩn:

- 1366×768
- 1440×810
- 1600×900
- 1920×1080

Mobile:
- zoom/pan map,
- hoặc viewport crop có camera control,
- không ép toàn map xuống quá nhỏ.

---

# 7. World Map visual style

Style:

- cute,
- cozy,
- pastel,
- feminine,
- child-friendly,
- premium casual game,
- soft shading,
- clean outlines,
- toy-like buildings.

Không dùng:

- dark gamer UI,
- cyberpunk,
- enterprise dashboard,
- material-design generic cards.

---

# 8. Map locations

## 8.1. Nhà Của Chúng Mình
Module:
- home,
- couple status,
- progress,
- quick daily overview.

## 8.2. Quảng Trường Quest
Module:
- daily checklist,
- quest completion,
- rewards.

## 8.3. Nhà Tập
Module:
- workout,
- exercise instructions,
- logs.

## 8.4. Đài Uống Nước
Module:
- hydration,
- water progress.

## 8.5. Trung Tâm Giấc Ngủ
Module:
- bedtime,
- sleep,
- nap,
- sleep quality.

## 8.6. Thư Viện Nhật Ký
Module:
- journal,
- mood,
- stress,
- reflection.

## 8.7. Album Kỷ Niệm
Module:
- meal photos,
- couple photos,
- daily album.

## 8.8. Chợ Nhỏ
Module:
- grocery,
- food inventory,
- meal planning.

## 8.9. Nhà Hàng Hẹn Hò
Module:
- date plans,
- restaurant notes,
- dinner memories.

## 8.10. Sân Bay
Module:
- adventures,
- trips,
- travel planning.

## 8.11. Bãi Biển Nha Trang
Module:
- current destination chapter,
- memories,
- itinerary.

## 8.12. Tòa Thị Chính / Cài Đặt
Module:
- settings,
- privacy,
- audio,
- export/import,
- theme.

---

# 9. Map interaction

Mỗi building có state:

```ts
type BuildingState =
  | "idle"
  | "hovered"
  | "selected"
  | "loading"
  | "locked"
  | "completed"
```

## Idle

- animation rất nhẹ,
- chimney smoke,
- flag,
- flower sway,
- light sparkle.

## Hover

```text
scale: 1 → 1.03
brightness: +5%
shadow: stronger
label: rise 4px
```

Mouse cursor:

```text
pointer
```

Có SFX:

```text
hover-soft.ogg
```

Không phát hover sound liên tục quá khó chịu.

## Selected

Khi click:

1. click sound.
2. building bounce nhẹ.
3. nhân vật quay về phía building.
4. camera focus.
5. background vignette nhẹ.
6. transition scene bắt đầu.

---

# 10. Hiệu ứng click building

Timeline:

```text
0ms      click
0ms      button SFX
50ms     building scale 1 → 0.97
130ms    building scale 0.97 → 1.05
250ms    building settle 1.00
180ms    character turn toward target
250ms    camera begins pan/zoom
550ms    transition overlay begins
```

Không để click → panel hiện ngay lập tức.

Cần cảm giác có chiều sâu.

---

# 11. Camera focus system

Nếu dùng Phaser:

```ts
camera.pan(targetX, targetY, 400, "Sine.easeInOut")
camera.zoomTo(1.08, 400)
```

Sau focus:

- world darken nhẹ,
- building highlight,
- transition overlay.

Khi quay lại map:

```ts
camera.zoomTo(1.0, 400)
camera.pan(homeX, homeY, 400)
```

---

# 12. Transition giữa map và building/module

Mỗi loại địa điểm có transition riêng.

## Nhà Tập

Transition:

```text
dumbbell icon drops
screen shakes very lightly
wipe from bottom
```

SFX:
`gym-enter.ogg`

## Đài Uống Nước

Transition:

```text
water ripple expands
blue circular mask fills screen
```

SFX:
`water-swish.ogg`

## Thư Viện Nhật Ký

Transition:

```text
book opens
page flip covers screen
```

SFX:
`page-turn.ogg`

## Album Kỷ Niệm

Transition:

```text
camera shutter
white flash 80ms
photo frame slides in
```

SFX:
`camera-shutter-soft.ogg`

## Trung Tâm Giấc Ngủ

Transition:

```text
screen dims
stars appear
crescent moon wipe
```

SFX:
`night-chime.ogg`

## Sân Bay

Transition:

```text
airplane crosses foreground
cloud wipe
```

SFX:
`plane-pass-soft.ogg`

## Bãi Biển

Transition:

```text
wave sweeps upward
```

SFX:
`wave.ogg`

## Nhà Hàng Hẹn Hò

Transition:

```text
heart particles
warm pink fade
```

SFX:
`romantic-chime.ogg`

## Tòa Thị Chính

Transition:

```text
gear rotates
iris-in
```

---

# 13. Module loading screen

Nếu data/module chưa load xong ngay, không hiển thị spinner generic.

Ví dụ:

## Gym

Chiikawa / Usagi kéo tạ nhỏ.

Text:

```text
Preparing today's training...
```

## Journal

Animation:
- book pages turning.

Text:

```text
Opening today's memories...
```

## Album

Animation:
- polaroid printing.

Text:

```text
Developing memories...
```

## Sleep

Animation:
- moon bounce.

Text:

```text
Turning down the lights...
```

---

# 14. Load complete animation

Khi module load xong:

## Basic sequence

```text
overlay opacity 1 → 0
module background fade in
character / hero art pop-in
title slide down
content cards stagger in
```

Timing:

```text
background: 250ms
hero: 350ms
title: 300ms
cards stagger: 50–80ms
```

Không load toàn bộ card cùng lúc.

---

# 15. Module exit transition

Back button không được hard-cut.

Flow:

```text
Back clicked
↓
current module shrink/fade
↓
transition overlay
↓
map camera restored
↓
map HUD fades in
↓
character idle resumes
```

---

# 16. Character system

V1:

- Chiikawa
- Usagi

Người dùng chọn ai là player, ai là partner.

States:

```text
idle
walk
look
happy
sleepy
eat
train
celebrate
sad
wave
```

---

# 17. Character event reactions

## Meal logged

```text
idle → eat → happy → idle
```

## Workout complete

```text
idle → train → celebrate → idle
```

## Water goal complete

```text
idle → happy → sparkle
```

## Sleep target complete

```text
sleepy → happy
```

## Daily quest complete

Cả hai:

```text
look at each other
↓
heart burst
↓
celebrate
```

---

# 18. Character asset structure

```text
assets/
  characters/
    chiikawa/
      manifest.json
      idle/
      walk/
      happy/
      sleepy/
      eat/
      train/
      celebrate/

    usagi/
      manifest.json
      idle/
      walk/
      happy/
      sleepy/
      eat/
      train/
      celebrate/
```

Tất cả cùng:

- canvas size,
- scale,
- baseline,
- line style,
- lighting,
- anchor system.

---

# 19. Character anchors

```ts
anchors: {
  head: [x, y],
  body: [x, y],
  leftHand: [x, y],
  rightHand: [x, y],
  feet: [x, y]
}
```

Accessories dùng chung anchor system.

---

# 20. Copyright / asset strategy

Chiikawa / Usagi là IP có bản quyền.

Không commit random ripped assets vào repo public.

Structure:

```text
assets/
  demo/
  licensed/
```

`licensed/` có thể gitignore.

Thêm:

```text
ASSET_LICENSES.md
```

Track:
- source,
- license,
- usage permission,
- modified/not modified.

Không rip:
- anime voices,
- game sprites,
- soundtrack,
- commercial art packs không license.

---

# 21. Top HUD

Game screen:

```text
[ Couple Profile ]

Day 3 / 10

♥ Hearts
⭐ Stars
💎 Memory Gems
⚡ Energy

✉️  🎁  📅  ⚙️
```

HUD phải:
- nhẹ,
- không che map,
- responsive.

---

# 22. Bottom HUD

Gợi ý:

```text
🗺 Bản Đồ
🎒 Túi Đồ
🎁 Kho Báu
🏪 Cửa Hàng
🎈 Sự Kiện
📖 Kỷ Niệm
```

Không cần friend/leaderboard ở V1.

---

# 23. Reward system

Items:

- strawberry,
- carrot,
- pudding,
- onigiri,
- ribbon,
- flower,
- star,
- heart,
- toy,
- lamp,
- plant.

Reward chỉ cosmetic / emotional.

Không ảnh hưởng dữ liệu tracker.

---

# 24. Home decoration

Long-term:

Quest reward có thể dùng để trang trí:

- bed,
- couch,
- plant,
- wall art,
- lamp,
- rug,
- flower pot.

Nhà của hai người thay đổi theo tiến độ.

---

# 25. Map day/night

Map có thể đổi theo giờ thật.

## Morning

- blue sky,
- warm sun,
- birds.

## Afternoon

- clear pastel.

## Evening

- pink/orange sky.

## Night

- deep blue,
- windows light up,
- stars,
- moon,
- street lamps.

Không cần weather API ở V1.

Dựa giờ local.

---

# 26. Ambient animation

Map loops:

- clouds,
- waterfall,
- fountain,
- flowers,
- leaves,
- chimney smoke,
- wave,
- flags,
- airplane occasionally,
- tiny birds,
- lamp glow.

Performance requirement:
- animation subtle,
- pause/reduce effects nếu tab hidden.

---

# 27. Audio architecture

Dùng:

## Howler.js

```text
audio/
  bgm/
  ui/
  transitions/
  reward/
  ambience/
```

## BGM

- home-day
- home-night
- journal
- sleep
- travel

## Ambient

- birds
- fountain
- waves
- wind

## UI

- click
- hover
- open
- close

## Transition

- water
- page
- cloud
- plane
- shutter

---

# 28. Audio rules

- default BGM volume 20–25%.
- SFX 40–50%.
- ambient 15–25%.
- no autoplay before user gesture.
- remember audio preference.
- global mute.

---

# 29. Tech stack

## Main app

- React
- TypeScript
- Vite

## UI

- Tailwind CSS
- Framer Motion

## Game world

- Phaser 3

## Audio

- Howler.js

## Data

- IndexedDB
- Dexie.js hoặc idb

## Charts

- Recharts

## Dates

- date-fns

---

# 30. Game-development tools

## Tiled Map Editor

Dùng cho:
- map layout,
- layers,
- roads,
- water,
- buildings,
- hotspots,
- trigger zones.

Suggested layers:

```text
Ground
Water
Road
Vegetation
Buildings
Props
NPC
Player
Interaction
Foreground
```

## Aseprite

Dùng:
- sprites,
- item animations,
- small FX.

## Figma

Dùng:
- HUD,
- dialogs,
- buttons,
- panels,
- labels.

## Optional later

- Rive
- Spine

Không cần ở Phase 1.

---

# 31. React + Phaser integration

Structure:

```text
src/
  app/
  game/
    scenes/
      BootScene.ts
      PreloadScene.ts
      WorldMapScene.ts
      TransitionScene.ts

    entities/
      Character.ts
      Building.ts

    systems/
      AudioSystem.ts
      CameraSystem.ts
      TransitionSystem.ts
      RewardSystem.ts

  modules/
    home/
    quests/
    gym/
    water/
    sleep/
    journal/
    album/
    market/
    restaurant/
    travel/
    settings/
```

---

# 32. Phaser scenes

## BootScene

- config,
- basic fonts,
- first logo.

## PreloadScene

- assets,
- sound metadata,
- progress animation.

## WorldMapScene

- world map,
- buildings,
- characters,
- hotspots,
- camera.

## TransitionScene

Optional reusable overlay handling:
- cloud,
- water,
- book,
- camera,
- moon.

---

# 33. Transition API

Thiết kế generic:

```ts
transitionTo({
  type: "book",
  destination: "journal",
  targetBuilding: "library"
})
```

Types:

```ts
type TransitionType =
  | "cloud"
  | "water"
  | "book"
  | "camera"
  | "moon"
  | "plane"
  | "heart"
  | "gear"
```

---

# 34. Navigation state

Không route đơn thuần.

Có:

```ts
GameNavigationState = {
  currentWorld: "main",
  currentLocation: "map" | "gym" | "journal" | ...,
  transitionState: "idle" | "leaving" | "loading" | "entering"
}
```

React Router vẫn có thể tồn tại bên dưới cho URL/history.

---

# 35. Tracker engine giữ lại

Giữ nguyên:

- meals,
- workout logs,
- water,
- sleep,
- journal,
- photos,
- settings,
- backup,
- import,
- IndexedDB.

Không rewrite phần dữ liệu chỉ vì đổi UI.

---

# 36. GameState tách riêng

```ts
type GameState = {
  characterSelection
  stars
  hearts
  gems
  inventory
  decorations
  unlockedLocations
  adventureProgress
}
```

Không dùng reward để sửa dữ liệu health.

---

# 37. Screen transitions in React modules

Dùng Framer Motion:

```tsx
initial={{ opacity: 0, y: 12, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -8, scale: 0.99 }}
```

Page duration:

```text
250–400ms
```

Cards stagger:

```text
50–80ms
```

---

# 38. Visual transition polish

Transitions phải có:

- easing,
- slight delay,
- sound,
- matching color.

Không:
- transition > 1.5s quá thường xuyên,
- excessive blur,
- flashing.

---

# 39. Reduced motion

Accessibility:

Nếu:

```css
prefers-reduced-motion: reduce
```

Thì:
- disable parallax,
- giảm zoom,
- fade only,
- no camera shake,
- particles off.

---

# 40. Preloading strategy

Không preload toàn bộ app.

## Initial preload

Chỉ:

- splash,
- map,
- two characters,
- HUD,
- common SFX.

Sau World Map:

lazy preload:
- gym assets,
- journal assets,
- album assets.

Ưu tiên:

```text
fast first meaningful scene
```

---

# 41. Loading fallback

Nếu asset lỗi:

- hiện placeholder,
- không crash app.

Ví dụ:

```text
Unable to load this decoration.
Retry
```

Core tracker phải vẫn usable.

---

# 42. Mobile behavior

Desktop là primary.

Mobile:

- map viewport zoomed,
- drag/pan,
- bottom HUD compact,
- top HUD condensed,
- tap building,
- transition vẫn giữ.

Không bắt landscape rotation bắt buộc ở V1.

Có thể gợi ý:

> Best experienced in landscape mode.

---

# 43. Current tracker → game mapping

| Tracker hiện tại | Game module |
|---|---|
| Today | Nhà Của Chúng Mình |
| Checklist | Quảng Trường Quest |
| Training | Nhà Tập |
| Hydration | Đài Uống Nước |
| Sleep | Trung Tâm Giấc Ngủ |
| Journal | Thư Viện Nhật Ký |
| Photos | Album Kỷ Niệm |
| Grocery | Chợ Nhỏ |
| Date notes | Nhà Hàng Hẹn Hò |
| Trips | Sân Bay |
| Nha Trang | Bãi Biển Nha Trang |
| Settings | Tòa Thị Chính |

---

# 44. Roadmap triển khai

## Phase 0 — Design Foundation

- art direction.
- palette.
- typography.
- map plan.
- asset rules.
- character contract.
- sound direction.
- transition guidelines.

Không code gameplay vội.

---

## Phase 1 — Splash + Boot Flow

Làm:

- splash screen.
- loading background.
- parallax clouds.
- progress.
- tap to enter.
- audio unlock.
- cloud/camera transition.

Definition of Done:

- mở app cảm giác như game.
- không blank screen.
- transition vào map mượt.

---

## Phase 2 — Vertical Slice

Chỉ:

- World Map.
- Chiikawa.
- Usagi.
- 1 building: Nhà Tập.
- click building.
- transition.
- workout module.
- return transition.
- 1 reward animation.

Nếu chưa đẹp:
- polish tiếp,
- không mở rộng.

---

## Phase 3 — Full World Map

- all buildings.
- hover.
- hotspots.
- labels.
- ambient loops.
- top HUD.
- bottom HUD.
- map camera.
- day/night.

---

## Phase 4 — Module Migration

Kết nối:

- Home.
- Quest.
- Gym.
- Water.
- Sleep.
- Journal.
- Album.
- Market.
- Restaurant.
- Airport.
- Nha Trang.
- Settings.

---

## Phase 5 — Transition Pack

Hoàn thiện:

- cloud.
- water.
- book.
- camera flash.
- moon.
- plane.
- heart.
- gear.

Tất cả dùng chung API.

---

## Phase 6 — Character System

- state machine.
- reactions.
- inventory props.
- accessories.
- couple setup.

---

## Phase 7 — Sound

- BGM.
- ambient.
- SFX.
- volume settings.
- mute.
- persistence.

---

## Phase 8 — Rewards / Inventory

- star.
- heart.
- items.
- backpack.
- decorations.

---

## Phase 9 — Adventures

- Nha Trang sub-map.
- airport travel.
- itinerary.
- memories.

---

## Phase 10 — Long-term

- reusable Adventures.
- events.
- anniversary.
- seasonal themes.
- new characters.
- home decoration.

---

# 45. MVP v1 Definition of Done

- [ ] Splash screen đẹp.
- [ ] Animated loading background.
- [ ] Tap to enter.
- [ ] Audio unlock.
- [ ] Transition splash → map.
- [ ] Landscape map.
- [ ] Chiikawa + Usagi.
- [ ] Buildings clickable.
- [ ] Camera focus.
- [ ] Transition building → module.
- [ ] Load-complete animation.
- [ ] Back transition.
- [ ] Home.
- [ ] Quest.
- [ ] Gym.
- [ ] Water.
- [ ] Sleep.
- [ ] Journal.
- [ ] Album.
- [ ] Meals/photos vẫn hoạt động.
- [ ] IndexedDB không mất data.
- [ ] Audio settings.
- [ ] Responsive.
- [ ] GitHub Pages build.
- [ ] prefers-reduced-motion.
- [ ] asset failures không crash app.

---

# 46. Final implementation principle

Không làm:

> “dashboard cũ + cute background”.

Phải làm:

> **game world trước về mặt cảm nhận, tracker engine ở dưới về mặt kỹ thuật.**

App khi mở phải tạo cảm giác:

1. đang bước vào một thế giới nhỏ,
2. hai nhân vật đang sống trong đó,
3. mỗi hoạt động đời thật biến thành một nơi trong thế giới,
4. mỗi lần click đều có feedback và transition,
5. người dùng muốn quay lại vì cảm giác cozy, cute và có ký ức tích lũy.

---

# 47. Codex instruction

Khi giao cho Codex:

1. Không implement tất cả trong một commit.
2. Làm Phase 1 trước.
3. Review animation + UX.
4. Sau đó Vertical Slice.
5. Chỉ mở rộng nếu map + transition + character loop đã đẹp.
6. Ưu tiên polish hơn số lượng feature.
7. Không dùng random copyrighted assets.
8. Giữ tracker data architecture hiện tại.
9. Mọi transition phải reusable.
10. Mọi building phải dùng một interaction contract chung.
11. Mọi character phải dùng cùng asset/anchor system.
12. Repo phải build được bằng:

```bash
npm install
npm run dev
npm run build
```

13. GitHub Pages phải hoạt động.
14. Viết README.
15. Viết `ASSET_LICENSES.md`.
16. Viết `GAME_ARCHITECTURE.md`.
17. Viết `TRANSITION_GUIDE.md`.

---

# 48. Deliverables mong muốn từ Codex

## Required

- World map playable.
- Splash/loading.
- Transition engine.
- Character system.
- Building interaction system.
- Audio system.
- Existing tracker integration.
- Responsive layout.
- GitHub Pages deploy.

## Documentation

```text
README.md
GAME_ARCHITECTURE.md
ASSET_GUIDE.md
ASSET_LICENSES.md
TRANSITION_GUIDE.md
AUDIO_GUIDE.md
```

## Optional later

```text
TILED_MAP_GUIDE.md
CHARACTER_ANIMATION_GUIDE.md
ADVENTURE_SYSTEM.md
```
