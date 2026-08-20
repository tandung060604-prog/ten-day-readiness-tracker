# PHASE 01 REPORT — DATA MODEL AND COUPLE PROFILE

**Date:** 2026-08-20  
**Phase:** Phase 01  
**Status:** Completed  
**Author:** Antigravity AI Engine  

---

### Completed

1. **CoupleProfile Domain Model & Types:**
   - Designed and created [`src/domain/couple/types.ts`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/src/domain/couple/types.ts) with full support for `PersonProfile`, `ImportantDate`, `PlaceReference`, `CoupleGoal`, `PrivacyPreferences`, and aggregate `CoupleProfile`.
   - Created safe, public-friendly demo fixture [`src/domain/couple/demoProfile.ts`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/src/domain/couple/demoProfile.ts) (Haru 🐹 & Mai Trang 🐰).

2. **Pure Functional Selectors:**
   - Implemented [`src/domain/couple/selectors.ts`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/src/domain/couple/selectors.ts) for:
     - Relationship day counting (`getRelationshipDays`)
     - Upcoming date countdown detection (`getNextImportantDate`)
     - Couple title formatting (`getCoupleDisplayName`)
     - Character role resolution (`getPlayerByCharacter`)
     - Relationship milestone celebrations (`getMilestoneCelebration` for 50, 100, 200, 365, 500, 730, 1000 days).

3. **Storage Abstraction & Repository:**
   - Created [`src/storage/coupleProfileRepository.ts`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/src/storage/coupleProfileRepository.ts) supporting persistence to `localStorage['little_days_couple_profile_v1']`, automatic corrupt JSON recovery, and helper mutators.

4. **First-Run Onboarding Setup Wizard:**
   - Created [`src/components/onboarding/CoupleSetupModal.tsx`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/src/components/onboarding/CoupleSetupModal.tsx) with a 5-step wizard and 1-click Demo Mode bypass.

5. **Decoupled Hard-Coded Occurrences Across App:**
   - `App.tsx`: Sourced `profile` via repository, calculated dynamic `loveDays`, wired `CoupleSetupModal`, passed dynamic props.
   - `CoupleHeroCard.tsx`: Dynamically displays player nicknames, avatars, anniversary count, and milestone banner.
   - `TopHUD.tsx`: Displays active player nickname and assigned character icon.
   - `SplashScreen.tsx`: Dynamically builds character role cards based on `CoupleProfile`.
   - `SettingsView.tsx`: Added interactive Couple Profile editor with real-time mascot preview.
   - `LoveHospitalView.tsx`: Dynamically renders partner names in hero banner, care guide, and packing checklist.

6. **Comprehensive Test Suite & Documentation:**
   - Added 11 unit tests in `src/__tests__/coupleProfile.test.ts`. Total test suite passes at 20/20 (100%).
   - Published [`docs/v2/V2_PERSONALIZATION_PRIVACY.md`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/docs/v2/V2_PERSONALIZATION_PRIVACY.md) and [`docs/v2/COUPLE_PROFILE_SCHEMA.md`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/ten-day-readiness-tracker/docs/v2/COUPLE_PROFILE_SCHEMA.md).

---

### Changed Files

- `src/domain/couple/types.ts` (New): Domain interfaces and types.
- `src/domain/couple/demoProfile.ts` (New): Default demo couple fixture.
- `src/domain/couple/selectors.ts` (New): Pure selector calculation functions.
- `src/storage/coupleProfileRepository.ts` (New): Local persistence and recovery manager.
- `src/components/onboarding/CoupleSetupModal.tsx` (New): 5-step first-run setup wizard.
- `src/components/couple/CoupleHeroCard.tsx` (Modified): Dynamic couple greeting and love counter.
- `src/game/components/TopHUD.tsx` (Modified): Dynamic player badge.
- `src/game/components/SplashScreen.tsx` (Modified): Dynamic character cards.
- `src/views/SettingsView.tsx` (Modified): Added Profile management section.
- `src/views/TodayView.tsx` (Modified): Passed profile to children.
- `src/views/LoveHospitalView.tsx` (Modified): Dynamic partner names and care guide.
- `src/App.tsx` (Modified): Integrated profile store, onboarding modal, and dynamic state.
- `src/__tests__/coupleProfile.test.ts` (New): 11 unit tests for selectors & repository.
- `docs/v2/V2_PERSONALIZATION_PRIVACY.md` (New): Privacy and data classification doc.
- `docs/v2/COUPLE_PROFILE_SCHEMA.md` (New): JSON schema specification.
- `docs/v2/reports/PHASE_01_REPORT.md` (New): Phase 01 completion report.

---

### Architecture Decisions

1. **Local-First Sovereign Architecture:**
   No external user database is introduced. All profile records live on-device in `localStorage` under `little_days_couple_profile_v1`.
2. **Pure Selectors for Derived Metrics:**
   Relationship day counts, countdowns, and milestone detections are computed through pure functional selectors with fallback protections against corrupt timestamps.
3. **Seamless Demo Mode Fallback:**
   Users can test or play the entire game immediately with demo data without entering real personal details.

---

### Tests

- `npm run test`: 4 test files, 20 tests passed (100%).
- `npm run lint`: 0 errors.
- `npm run build`: Production build passes in ~380ms with 0 errors.

---

### Data Migration

- Existing V1 logs (`ten-day-readiness-v1`) and settings (`ten-day-readiness-settings-v1`) remain completely intact. When upgrading from V1 to V2, the app loads `DEMO_COUPLE_PROFILE` gracefully if no profile is found, preserving all existing daily logs.

---

### Known Issues

- None in Phase 01.

---

### Acceptance Criteria

- [x] No real personal details are required in source code.
- [x] A new user can complete setup (`CoupleSetupModal`).
- [x] Setup can be skipped with demo data ("Dùng dữ liệu mẫu").
- [x] Existing V1 data is not destroyed.
- [x] UI reads profile data through a clean API (`coupleProfileRepository`, `selectors`).
- [x] Relationship day calculation is tested.
- [x] City/timezone are optional.
- [x] Precise GPS is not collected.
- [x] Phase report is written (`docs/v2/reports/PHASE_01_REPORT.md`).

---

### Next Phase Readiness

- **Phase 02 (`03_PHASE_02_GAME_STATE_ARCHITECTURE.md`)** is ready to commence.
- Prerequisite items established: Couple identity, active role resolution, and modular storage foundations.
