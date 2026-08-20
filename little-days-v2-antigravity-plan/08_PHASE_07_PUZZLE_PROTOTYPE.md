# PHASE 07 — PUZZLE PROTOTYPE: FIRST 3 LEVELS

## Goal

Prove the core gameplay loop before building all 30 levels.

Only build a high-quality 3-level vertical slice.

---

## Engine Decision

Compare:

### React/DOM

Choose if it can provide:

- smooth 7x7/8x8 board;
- cascades;
- input handling;
- animation;
- acceptable mobile performance.

### Phaser/Pixi isolated module

Choose if it materially improves:

- board animation;
- particles;
- performance;
- touch input;
- game feel.

If Phaser is used:

- React remains the application shell;
- Phaser loads lazily only for adventure gameplay;
- no rewrite of the map/buildings into Phaser.

Document the choice.

---

## Core Match Mechanics

Prototype:

- board generation;
- swap;
- legal move validation;
- match-3;
- match-4 special;
- match-5 special;
- cascades;
- blockers;
- objective tracking;
- limited moves;
- score;
- win;
- fail;
- restart.

Board:

7x7 or 8x8.

Tiles must use original project artwork, not emoji in production.

Possible concepts:

- heart;
- carrot;
- flower;
- star;
- shell;
- camera;
- water;
- strawberry.

Use only enough tile types for fair level design.

---

## Level 1 — First Spark

Purpose:
teach basic match.

Objective:
collect a small number of Heart tiles.

No blockers.

Character:
Chiikawa introduces the board.

Reward:
small amount of Stars + town material.

---

## Level 2 — Usagi's Big Idea

Purpose:
teach match-4 special tile.

Objective:
collect Carrots and use one special tile.

Character:
Usagi.

Reward:
Stars + material.

---

## Level 3 — Flower Promise

Purpose:
teach match-5 and first blocker.

Objective:
clear Flower targets around soft obstacles.

Character:
both.

Reward:
first meaningful Home upgrade material.

---

## Game Feel

Add:

- squash/stretch;
- cascade delay;
- small particle bursts;
- combo text;
- character reactions;
- short SFX;
- light haptic when available;
- very light camera shake only for large special effect.

Support reduced motion.

---

## Character Ability Hooks

Prototype only one simple ability for each character.

Example:

Chiikawa:
`Memory Spark`

Usagi:
`Carrot Rocket`

Do not implement the complete ability catalog yet.

Add Love Link meter if the architecture is stable enough.

---

## Integration

Flow must be:

`Quest Square → Adventure → Level Select → Puzzle → Reward → Return to Town`

Reward must update the real shared game state.

No fake reward screen.

---

## Persistence

Persist:

- completed levels;
- best score;
- stars earned;
- reward claimed state.

Do not allow duplicate reward claiming.

---

## Tests

Unit tests:

- match detection;
- valid swap;
- cascade;
- special generation;
- move decrement;
- objective completion;
- reward claim once.

End-to-end:

- start level;
- win;
- receive reward;
- return to town;
- reload;
- progress remains.

---

## Acceptance Criteria

- [ ] Three polished playable levels exist.
- [ ] Rewards update town/game state.
- [ ] Progress persists.
- [ ] Duplicate reward exploits are prevented.
- [ ] Mobile input works.
- [ ] Reduced motion works.
- [ ] Engine choice is documented.
- [ ] No attempt was made to build all 30 levels yet.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/PUZZLE_ENGINE_SPEC.md`
- `docs/v2/PUZZLE_LEVEL_SCHEMA.md`
- `docs/v2/reports/PHASE_07_REPORT.md`

Then stop.
