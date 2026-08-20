# PHASE 12 — POLISH, PERFORMANCE, RESPONSIVE AND ACCESSIBILITY

## Goal

Raise V2 from feature-complete to release-quality.

Do not add major new product features here.

---

# Performance Targets

Aim for:

- smooth map on mid-range hardware;
- responsive puzzle input;
- reasonable first load;
- lazy-loaded heavy scenes;
- no obvious memory leaks.

Do not promise a perfect 60fps on every device.

Measure before optimizing.

---

# Asset Optimization

Use appropriate:

- WebP;
- AVIF when useful;
- compressed audio;
- sprite sheets where useful;
- lazy loading;
- asset manifest.

Avoid:

- giant base64 source files;
- loading all building interiors at boot;
- loading all campaign audio at boot.

---

# Rendering

Inspect unnecessary re-renders.

WorldMap should not fully rerender because:

- a timer updates;
- text input changes;
- an unrelated building form changes.

Use selectors and component boundaries.

---

# Animation Hierarchy

Use:

- anticipation;
- squash/stretch;
- easing;
- particle burst;
- reward stagger;
- very light screen shake;
- character reaction;
- optional haptic.

Do not animate every element.

Important interactions get stronger feedback than secondary ones.

---

# Responsive

## Desktop

Primary target:
16:9 game-like composition.

## Tablet

Landscape optimized.

## Mobile portrait

May show a friendly landscape suggestion.

Do not completely lock the app.

Core functions must remain usable.

---

# Accessibility

Implement/review:

- keyboard navigation;
- visible focus;
- semantic controls;
- contrast;
- scalable text;
- reduced motion;
- subtitles;
- mute;
- voice-off mode;
- meaningful labels;
- screen-reader-friendly form controls.

Decorative game art should not overwhelm assistive technology.

---

# Reduced Motion

When enabled:

- skip long character walks;
- reduce parallax;
- reduce particles;
- disable camera shake;
- retain clear state changes.

---

# Audio Accessibility

Support:

- full mute;
- BGM mute;
- ambience mute;
- SFX mute;
- voice mute;
- subtitles always available.

---

# Error and Offline UX

Add graceful states for:

- corrupt local data;
- missing asset;
- failed lazy chunk;
- offline mode;
- unsupported speech voice.

Do not crash into a blank screen.

---

# PWA Review

Evaluate whether installable/offline PWA behavior is stable on GitHub Pages.

Possible features:

- app manifest;
- icons;
- service worker;
- offline shell;
- cached critical assets.

Do not ship PWA if cache invalidation causes unreliable releases.

---

# Testing

Run:

- unit tests;
- integration tests;
- Playwright critical flows;
- keyboard test;
- reduced-motion test;
- mobile viewport test;
- offline test;
- import/export test;
- campaign completion flow.

Perform bundle inspection.

---

# Acceptance Criteria

- [ ] No obvious performance regressions.
- [ ] Large features lazy load.
- [ ] Main interactions work with keyboard.
- [ ] Reduced motion is respected.
- [ ] Subtitles and mute controls work.
- [ ] Mobile portrait remains usable.
- [ ] Critical offline/error states are graceful.
- [ ] Major e2e flows pass.
- [ ] Phase report exists.

---

# Required Output

Create:

- `docs/v2/PERFORMANCE_REPORT.md`
- `docs/v2/ACCESSIBILITY_CHECKLIST.md`
- `docs/v2/RESPONSIVE_MATRIX.md`
- `docs/v2/reports/PHASE_12_REPORT.md`

Then stop.
