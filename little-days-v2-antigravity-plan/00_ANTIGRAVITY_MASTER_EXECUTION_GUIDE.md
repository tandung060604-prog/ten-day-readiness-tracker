# LITTLE DAYS V2 — ANTIGRAVITY MASTER EXECUTION GUIDE

## 1. Mission

Upgrade the existing repository:

`https://github.com/tandung060604-prog/ten-day-readiness-tracker`

into:

# LITTLE DAYS V2 — OUR COZY COUPLE ADVENTURE

This is no longer only a 10-day tracker with a game skin. It should become a **cozy couple-life browser game** where real couple activities, memories, trips, routines and optional wellness data are represented through a living town, interactive buildings, character interactions, progression and a 30-level puzzle/merge campaign.

Core product loop:

`Launch → World Map → Explore → Enter Building → Activity / Gameplay → Character Reaction → Reward → Town Changes → Story / Couple Memory → Continue`

The game layer must make the real couple website more enjoyable. It must not become a disconnected minigame portal.

---

## 2. Execution Order

Execute phases strictly in this order:

1. `01_PHASE_00_AUDIT_AND_STABILIZE.md`
2. `02_PHASE_01_DATA_AND_COUPLE_PROFILE.md`
3. `03_PHASE_02_GAME_STATE_ARCHITECTURE.md`
4. `04_PHASE_03_WORLD_MAP_V2.md`
5. `05_PHASE_04_BUILDING_INTERIORS.md`
6. `06_PHASE_05_CHARACTER_SYSTEM.md`
7. `07_PHASE_06_AUDIO_VOICE_V2.md`
8. `08_PHASE_07_PUZZLE_PROTOTYPE.md`
9. `09_PHASE_08_CAMPAIGN_30_LEVELS.md`
10. `10_PHASE_09_BUILDING_UPGRADES_AND_ECONOMY.md`
11. `11_PHASE_10_COUPLE_FEATURES.md`
12. `12_PHASE_11_PRIVACY_BACKUP_AND_MIGRATION.md`
13. `13_PHASE_12_POLISH_PERFORMANCE_ACCESSIBILITY.md`
14. `14_PHASE_13_RELEASE_GITHUB_PAGES.md`

Do not skip a phase because a later feature looks more interesting.

---

## 3. Rules for Antigravity

At the start of every phase:

1. Read this file.
2. Read the phase file.
3. Inspect the current repository state.
4. Read any architecture/spec files created in previous phases.
5. Check current tests/build before making changes.
6. Write a short implementation plan for the phase.
7. Implement only the current phase scope.
8. Run validation.
9. Produce the required phase report.
10. Stop if acceptance criteria are not met.

Do not assume the repository still matches an older plan. Always inspect current code.

---

## 4. Non-negotiable Product Principles

### 4.1 Game UX, not SaaS dashboard UX

Avoid turning every interior into cards and progress bars.

Preferred model:

`Scene → focal interaction → optional details`

Example:

Bad:

`Hydration card: 1600/2000 ml`

Better:

A magical fountain visibly fills as water is logged. History can be opened from a small journal object in the scene.

### 4.2 Gameplay must affect the town

Puzzle rewards must have a real use.

Example:

`Level completion → stars/materials → building upgrade → exterior changes → new interaction/feature/story`

### 4.3 Chiikawa and Usagi are gameplay characters

They must not only be decorative sprites.

They need:

- state
- movement
- reactions
- dialogue
- abilities
- progression
- duo interactions

### 4.4 Personalization without hard-coding

Do not hard-code the real couple's:

- names
- birthdays
- relationship dates
- location
- journals
- photos
- cycle information
- personal routines

Use profile/setup data.

### 4.5 Local-first privacy

Repository may be public.

Only demo/sample data may exist in source control.

Sensitive real data is local-only by default.

### 4.6 Do not clone copyrighted game content

Do not reproduce Candy Crush, Merge Valley, Merge Age, Animal Crossing or Chiikawa assets, screens, maps or levels 1:1.

Use original layouts and mechanics inspired by broad genres.

This is a fan-made personal project and must not be represented as an official Chiikawa product.

### 4.7 Do not clone official character voices

Use original short vocalizations, licensed/custom sounds, browser TTS fallback or user-recorded voices with consent.

---

## 5. Technical Guardrails

Keep:

- React
- TypeScript
- Vite
- GitHub Pages compatibility

Do not rewrite the entire application into a game engine.

If Phaser/Pixi is introduced, use it only where it creates clear value, especially the puzzle module.

Prefer:

- TypeScript strict
- data-driven configuration
- feature modules
- lazy loading
- IndexedDB for structured persistent data
- validated imports
- schema versioning
- tests for progression and persistence

Avoid:

- `any`
- giant components
- huge monolithic CSS files
- fake stats
- fake inventory
- duplicated views
- hard-coded dialogue inside map components
- 30 level definitions embedded directly in React components
- multiple AudioContext instances
- silent network uploads
- unnecessary backend

---

## 6. Target Product Layers

### Layer A — Couple Life

Real useful features:

- relationship days
- timeline
- anniversaries
- birthdays
- memories
- journal
- love letters
- date planning
- wishlist
- trips
- goals
- optional wellness

### Layer B — Cozy World

A living storybook town with:

- day/night
- weather hooks
- animation
- interactive buildings
- moving characters
- seasonal events
- building upgrades

### Layer C — Game Progression

- Couple Level
- Bond
- XP
- Stars
- Hearts
- Coins/Friendship Points
- inventory
- building levels
- achievements
- daily/weekly quests
- 30-stage campaign

### Layer D — Personal Data Engine

The practical tracker/data layer underneath the game presentation.

---

## 7. Definition of Done for Every Phase

A phase is not complete until:

- build passes;
- relevant tests pass;
- no known regression blocks normal app use;
- current data remains readable unless a documented migration handles it;
- TypeScript has no new unresolved errors;
- phase acceptance criteria are satisfied;
- docs are updated;
- a `PHASE_REPORT.md` or equivalent phase report is produced.

---

## 8. Required Phase Report Format

At the end of each phase, create/update:

`docs/v2/reports/PHASE_XX_REPORT.md`

Include:

### Completed
What was implemented.

### Changed Files
Important files changed or added.

### Architecture Decisions
Important choices and reasons.

### Tests
Commands run and results.

### Data Migration
If applicable.

### Known Issues
Anything intentionally deferred.

### Acceptance Criteria
Checklist with pass/fail.

### Next Phase Readiness
What the next phase may rely on.

---

## 9. Stop Conditions

Stop and report instead of guessing when:

- existing user data could be destroyed;
- a required asset/license is unclear;
- a dependency would substantially change the architecture;
- a requested external API requires credentials;
- a requested feature would silently transmit sensitive data;
- repository deployment would be broken;
- a product-owner decision is genuinely required.

Do not stop for questions that can be answered by inspecting the repository.

---

## 10. Final V2 Experience

The intended feeling is:

> Open the site and enter a tiny world belonging to two people. Chiikawa and Usagi live there. The town changes as the couple logs memories, completes goals, prepares trips and plays through story stages. The practical tracker remains useful, but the interface feels like visiting a cozy game rather than filling out a dashboard.
