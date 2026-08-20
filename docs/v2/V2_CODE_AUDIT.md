# LITTLE DAYS V2 — CODE AUDIT REPORT

**Date:** 2026-08-20  
**Repository:** `ten-day-readiness-tracker`  
**Phase:** Phase 00 — Audit & Stabilize Current Code  
**Auditor:** Antigravity AI Engine

---

## 1. Executive Summary

This audit evaluates the codebase of **Little Days** to transition it from a 10-day tracker prototype into **Little Days V2: Our Cozy Couple Adventure**. 

The current codebase is functional and builds successfully with Vite and TypeScript. However, significant architectural debt, view duplication, scattered audio subsystems, hard-coded personal data, and a complete absence of automated testing/linting exist.

Stabilizing these foundations in Phase 00 provides the necessary runway for Phase 01 through Phase 13 without risking regressions or user data loss.

---

## 2. Findings Matrix

| ID | Issue | Evidence | Impact | Severity | Proposed Fix | Classification | Files Involved |
|---|---|---|---|---|---|---|---|
| **AUD-01** | **God Components & Oversized Files** | `WorldMap.tsx` (942 lines), `App.tsx` (566 lines), `LoveHospitalView.tsx` (650+ lines), `styles.css` (5,000+ lines / 186KB). | High cognitive load, high risk of regression when editing, unmaintainable styling. | **High** | Decompose `App.tsx` into clean router/provider shell; extract map story data from `WorldMap.tsx` into data registry; modularize CSS in upcoming phases. | **Refactor before feature work** | `src/App.tsx`<br>`src/game/components/WorldMap.tsx`<br>`src/views/LoveHospitalView.tsx`<br>`src/styles.css` |
| **AUD-02** | **Duplicate Building Views** | In `App.tsx`, locations `home`, `water`, `sleep`, `restaurant`, `airport`, and `beach` all render `<TodayView />`. | User sees the exact same view for 6 completely different thematic buildings. | **High** | In Phase 04 (`BUILDING_INTERIORS`), provide bespoke scene-based interactive interiors for each building. | **Refactor before feature work** | `src/App.tsx`<br>`src/views/TodayView.tsx` |
| **AUD-03** | **Hard-Coded Personal Data & Names** | Hardcoded names ("Dũng", "Em Yêu", "Haru", "Mai Trang"), dates ("11/06/2026", "27/08/2026"), photos (`dung.jpg`, `nguoiyeu.jpg`), and budget ("8 triệu"). | Code cannot be reused or personalized via UI; sensitive couple data committed to public repository. | **Critical** | In Phase 01, create a Couple Profile store & Setup wizard to source all personal data dynamically from storage. | **Refactor before feature work** | `src/App.tsx`<br>`src/data/plan.ts`<br>`src/components/couple/CoupleHeroCard.tsx`<br>`src/components/couple/NhaTrangTripCard.tsx`<br>`src/game/components/WorldMap.tsx`<br>`src/utils/menstrualEngine.ts` |
| **AUD-04** | **Fragmented Audio Subsystems & Context Leaks** | Audio logic split between `GameAudioSystem.ts`, `chiikawaAudio.ts`, `soundscapes.ts`, `vietnameseAudio.ts`, `BackgroundMusicPlayer.tsx`, and `YouTubeBGMPlayer.tsx`. Multiple unshared `AudioContext` instances instantiated on the fly. | Audio overlapping, memory leaks on mobile Safari, failure to respect global mute/volume settings, external YouTube iframe network dependency. | **High** | Unify under a single shared `AudioManager` singleton in Phase 06 with Web Audio pool and procedural fallback. | **Refactor before feature work** | `src/game/systems/GameAudioSystem.ts`<br>`src/utils/chiikawaAudio.ts`<br>`src/utils/soundscapes.ts`<br>`src/utils/vietnameseAudio.ts`<br>`src/components/common/YouTubeBGMPlayer.tsx` |
| **AUD-05** | **Dependencies Using `"latest"` Version String** | `package.json` specifies `"latest"` for `react`, `react-dom`, `vite`, `typescript`, `@types/react`, etc. | Non-deterministic builds across machines and CI; future breaking changes in upstream packages will silently break the project. | **High** | Pin exact versions in `package.json` and move development tools to `devDependencies`. | **Fix Now** | `package.json`<br>`package-lock.json` |
| **AUD-06** | **Absence of Testing & Linting Baseline** | No `npm run test` or `npm run lint` scripts exist. Zero test files in the codebase. | Changes cannot be verified automatically; regressions can go unnoticed. | **High** | Add Vitest, React Testing Library, JSDOM, and flat ESLint config; write smoke tests. | **Fix Now** | `package.json`<br>`vitest.config.ts`<br>`eslint.config.js`<br>`src/__tests__/*` |
| **AUD-07** | **Missing Error Boundary** | No top-level React Error Boundary wraps the app tree. | Any unhandled runtime exception in any sub-component causes a complete white screen crash for the user. | **Medium** | Create `<ErrorBoundary>` with cozy fallback UI and wrap `<App />` in `main.tsx`. | **Fix Now** | `src/main.tsx`<br>`src/components/common/ErrorBoundary.tsx` |
| **AUD-08** | **Unsafe JSON Import & Missing Schema Migrations** | `importData` in `App.tsx` performs shallow parse without deep schema validation or migration logic across schema versions. | Corrupted backup files can corrupt app state in `localStorage`. | **Medium** | Implement schema versioning (`version: 2`) and Zod/validator checks in Phase 11. | **Refactor before feature work** | `src/App.tsx`<br>`src/data/plan.ts` |
| **AUD-09** | **Map Metadata Mixed with Presentation Logic** | `MAP_BUILDINGS` in `WorldMap.tsx` defines narrative stories, Japanese tags, dialogue quotes, canvas visual coordinates, and reward values all inside the UI component file. | Map component is 942 lines; difficult to balance progression or translate strings. | **Medium** | Extract building definitions and story scripts into a structured data module (`src/game/data/buildings.ts`) in Phase 03. | **Refactor before feature work** | `src/game/components/WorldMap.tsx` |
| **AUD-10** | **Duplicate & Orphan Asset Files** | `public/assets/buildings/airport - Copy.png` duplicate artifact. `BreathingTimer.tsx` and `PhotoStrip.tsx` in `src/components/` are redundant 2-line re-exports. | Unnecessary repository clutter and confusing import paths. | **Low** | Remove duplicate image; clean up redundant component re-exports. | **Fix Now** | `public/assets/buildings/airport - Copy.png`<br>`src/components/BreathingTimer.tsx`<br>`src/components/PhotoStrip.tsx` |
| **AUD-11** | **Documentation vs Implementation Discrepancy** | `PROJECT_SPEC.md` lists Tailwind CSS, Lucide Icons, Recharts, Dexie.js which are not installed or used. `GAME_ARCHITECTURE.md` lists 12 locations whereas code has 13 (`hospital`). | Confusing developer documentation for future phases. | **Low** | Update architectural documentation to reflect true stack (Vanilla CSS, custom SVG icons, native IndexedDB). | **Safe to defer** | `docs/v2/CURRENT_ARCHITECTURE.md`<br>`PROJECT_SPEC.md` |
| **AUD-12** | **Static/Fake Inventory & Stats** | `INITIAL_INVENTORY` is a static constant. Stars/gems/hearts formulas in `App.tsx` use artificial offsets (`12520 + loveDays * 10`). | Progression is not real; user actions do not earn true inventory items or persistent currency. | **Medium** | Build real game state management with persistent inventory and quest reward dispatchers in Phase 02. | **Refactor before feature work** | `src/App.tsx`<br>`src/game/types.ts` |

---

## 3. Classification Summary

### Actionable Fixes in Phase 00 (Fix Now):
1. **AUD-05**: Pin core and dev dependency versions in `package.json`.
2. **AUD-06**: Configure Vitest, JSDOM, React Testing Library, and ESLint baseline. Create smoke tests.
3. **AUD-07**: Add `ErrorBoundary` component around `<App />` in `src/main.tsx`.
4. **AUD-10**: Remove duplicate asset `airport - Copy.png`.

### Priority Items for Phase 01 & Phase 02 (Refactor Before Feature Work):
1. **AUD-03**: Decouple hard-coded couple names, dates, and trip references into dynamic `CoupleProfileStore`.
2. **AUD-12**: Implement unified reactive Game State & Inventory architecture (`GameStateStore`).
3. **AUD-01 & AUD-09**: Decompose `WorldMap.tsx` and `App.tsx`.

### Phase 03 - Phase 06 Foundation Items:
1. **AUD-02**: Build distinct, game-like interior scenes for all 13 buildings.
2. **AUD-04**: Unify procedural Web Audio, BGM, and soundscapes under a singleton `AudioManager`.
