# PHASE 09 — BUILDING UPGRADES, INVENTORY AND ECONOMY

## Goal

Make campaign rewards materially transform the town.

The town must visibly evolve because the user plays and completes real couple activities.

---

## Economy

Use only virtual game currencies.

Suggested:

### Hearts
Earned from couple-life activities.

### Stars
Earned from puzzle stages.

### Coins / Friendship Points
Earned from recurring quests.

No real-money store.

No microtransactions.

No pay-to-win.

---

## Inventory

Authoritative categories:

- building materials;
- ingredients;
- decorations;
- memory collectibles;
- puzzle boosters;
- souvenirs;
- event items.

Items must be genuinely earned and consumed.

Do not display fake stock/counts.

---

## Building Upgrade Model

Each building should support three stages.

Example Home:

### Lv1
Small cottage.

### Lv2
Garden + balcony + expanded interactions.

### Lv3
Large cozy home + unique landmark.

Upgrade must affect:

- world-map exterior;
- interior decorations;
- feature unlocks;
- dialogue;
- sometimes reward efficiency/cosmetics.

Avoid upgrades that only increase arbitrary numbers.

---

## Upgrade Flow

`Earn materials`
→ `open building upgrade interaction`
→ `preview visual change`
→ `confirm`
→ `spend materials`
→ `upgrade animation`
→ `new exterior/interior`
→ `character reaction`
→ `new feature/story`

Persist transaction atomically where possible.

Do not allow negative inventory.

---

## Decoration System

Support limited cosmetic customization.

Examples:

- flower bed;
- lantern;
- wall photo;
- rug;
- plant;
- sign;
- souvenir shelf.

Keep the system constrained.

Do not build a full Sims-like editor.

---

## Reward Sources

Rewards may come from:

- puzzle levels;
- daily quests;
- weekly quests;
- achievements;
- couple milestones;
- trip milestones.

Use central reward definitions.

---

## Achievement Integration

Implement useful achievements such as:

- Early Bird
- Hydration Hero
- Memory Keeper
- Adventure Together
- Our First Journey
- relationship-day milestones

Achievements based on real data only.

Do not fabricate completion.

---

## Tests

Test:

- currency add/spend;
- inventory transaction;
- insufficient resource handling;
- building upgrade once;
- visual variant resolution;
- feature unlock;
- achievement trigger;
- no double reward.

---

## Acceptance Criteria

- [ ] At least several buildings visibly change between levels.
- [ ] Upgrade costs use real inventory.
- [ ] Puzzle rewards feed upgrades.
- [ ] Couple activity rewards can also contribute.
- [ ] Inventory cannot go negative.
- [ ] No fake UI counters remain.
- [ ] Upgrade state persists.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/BUILDING_UPGRADE_SYSTEM.md`
- `docs/v2/ECONOMY_AND_REWARDS.md`
- `docs/v2/reports/PHASE_09_REPORT.md`

Then stop.
