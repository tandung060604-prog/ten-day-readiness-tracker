# RESPONSIVE LAYOUT & VIEWPORT MATRIX — LITTLE DAYS V2

## 1. Breakpoints & Viewport Testing

```text
┌─────────────────────────┬───────────────────┬──────────────────────────────────────────┐
│ Device Category         │ Resolution        │ Behavior & Adaptive Layout               │
├─────────────────────────┼───────────────────┼──────────────────────────────────────────┤
│ Desktop Cinema          │ 1920x1080 (16:9)  │ Full panoramic town canvas, docked HUDs  │
│ Laptop / Ultrabook      │ 1366x768 (16:9)   │ Auto-fit scalable SVG town view          │
│ Tablet Landscape        │ 1024x768 / 1194x834│ Optimized touch navigation, side drawers │
│ Mobile Landscape        │ 844x390           │ Immersive fullscreen match-3 board       │
│ Mobile Portrait         │ 390x844 / 412x915 │ Compact touch controls + safe area insets│
└─────────────────────────┴───────────────────┴──────────────────────────────────────────┘
```

---

## 2. Safe Area Insets & Notch Handling
- CSS `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` protect top HUD headers and bottom action drawers on iPhone notch / Dynamic Island displays and Android gesture bars.

---

## 3. PWA Web App Manifest
- `public/manifest.json` provides:
  - Name: `Little Days V2 — Hành Trình Tình Yêu & Thị Trấn Đôi`
  - Display: `standalone`
  - Orientation: `any`
  - Theme Color: `#1e1724`
  - Background Color: `#151019`
