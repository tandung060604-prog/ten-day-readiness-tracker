# PHASE 02 — GAME STATE ARCHITECTURE

## Goal

Create the reusable state architecture required for progression, inventory, building levels, adventures, quests and character state.

Do not build the 30 levels yet.

---

## Architecture Decision

Evaluate:

- Zustand;
- reducer + context;
- XState where state machines add clear value.

Choose the smallest solution that handles:

- current scene;
- selected building;
- player/couple profile;
- inventory;
- currencies;
- building progress;
- quest progress;
- adventure progress;
- character state;
- settings.

Document the decision.

Avoid placing all global data in one huge store.

---

## Core Domains

Create data-driven models for:

### Player/Couple progression

```ts
interface CoupleProgress {
  level: number
  xp: number
  bondLevel: number
  bondXp: number
}
```

### Currency

- Hearts
- Stars
- Coins/Friendship Points

No real-money currency.

### Inventory

Categories:

- ingredients;
- food;
- decorations;
- memories;
- boosters;
- collectibles;
- souvenirs;
- materials.

No fake item counts.

### Buildings

```ts
interface BuildingProgress {
  buildingId: BuildingId
  level: 1 | 2 | 3
  xp: number
  unlockedFeatures: string[]
  decorations: string[]
}
```

### Adventure

```ts
interface Adventure {
  id: string
  title: string
  startDate?: string
  endDate?: string
  chapters: ChapterDefinition[]
  rewards: RewardDefinition[]
}
```

Do not hard-code the entire product around "10 days".

### Quest

Support:

- daily;
- weekly;
- story;
- couple;
- event.

---

## Reward Pipeline

Create one authoritative reward service.

Example:

`ActivityCompleted`
→ reward calculation
→ inventory/currency update
→ progression update
→ building effect
→ persistence
→ UI event

Do not duplicate reward logic inside UI components.

---

## Event Model

Introduce an internal event model for reactions such as:

- workout completed;
- hydration goal completed;
- memory created;
- puzzle won;
- building upgraded;
- anniversary reached.

This event model will later drive:

- dialogue;
- character animation;
- sound;
- achievements.

Avoid a premature complex event bus. Keep it typed and testable.

---

## Persistence Boundary

Game store must not know browser storage implementation details.

Use repositories/services.

Example:

```text
game state
   ↓
repository interface
   ↓
IndexedDB/local adapter
```

---

## Development Tools

During development only, create a simple debug panel or dev utilities for:

- add currency;
- reset progress;
- set building level;
- unlock adventure;
- fire event.

Ensure it is excluded or hidden in production.

---

## Tests

Test:

- earn/spend currency;
- inventory add/remove;
- reward application;
- building level bounds;
- XP progression;
- event emission;
- reset;
- serialization.

---

## Acceptance Criteria

- [ ] Global state architecture is documented.
- [ ] App does not depend on one giant top-level state component.
- [ ] Progression is real, not placeholder counters.
- [ ] Inventory has authoritative data.
- [ ] Rewards use one service.
- [ ] Adventure model supports future campaigns.
- [ ] State can serialize/restore.
- [ ] Relevant tests pass.
- [ ] No puzzle implementation yet.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/V2_TECHNICAL_ARCHITECTURE.md`
- `docs/v2/GAME_STATE_MODEL.md`
- `docs/v2/reports/PHASE_02_REPORT.md`

Then stop.
