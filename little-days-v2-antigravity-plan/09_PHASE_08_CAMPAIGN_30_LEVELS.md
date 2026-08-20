# PHASE 08 — FULL 30-LEVEL LITTLE DAYS ADVENTURE

## Goal

Expand the validated puzzle prototype into a complete 30-level story campaign.

The campaign must be original and tied to the couple town.

---

# Campaign Structure

## Chapter 1 — OUR LITTLE HOME
Levels 1–10.

Theme:

- meeting;
- learning;
- fixing the first part of town;
- unlocking foundational buildings.

Mechanics introduced gradually:

1. Basic Match
2. Match-4
3. Match-5
4. Soft obstacle
5. Collection objective
6. Combo
7. Special tile
8. Chiikawa ability
9. Usagi ability
10. Duo ability finale

---

## Chapter 2 — BUILD OUR TOWN
Levels 11–20.

Theme:

collect materials and restore town buildings.

Possible materials:

- wood;
- flowers;
- fabric;
- lanterns;
- photo pieces;
- food basket;
- stars.

Mechanics:

- locked tiles;
- grass;
- boxes;
- clouds;
- river lanes;
- delivery objectives;
- merge chain;
- limited moves;
- multi-stage boards.

Every 2–3 levels should result in a visible town upgrade or unlock.

---

## Chapter 3 — NHA TRANG ADVENTURE
Levels 21–30.

Theme:

- packing;
- airport;
- flight;
- arrival;
- food;
- beach;
- photos;
- date night;
- sunset finale.

Use a combination of:

- match;
- merge;
- collection;
- delivery.

Level 30:

# NHA TRANG SUNSET FINALE

This is a celebration, not a combat boss.

Unlock:

- sunset destination scene;
- special couple frame;
- cosmetic reward;
- ending scene;
- fireworks;
- duo celebration.

---

# Merge Mechanics

Use merge only when it supports the story.

Examples:

`Seed → Flower → Bouquet → Heart Bouquet`

`Film → Camera → Album → Memory Book`

`Ingredient → Dish → Dinner → Date Night`

Do not randomly switch genres without narrative reason.

---

# Level Data Requirements

All 30 levels must be data-driven.

Each level definition must include:

- id;
- number;
- name;
- chapter;
- story beat;
- board dimensions;
- tile set;
- objective;
- objective count;
- move count;
- blockers;
- mechanics;
- active character;
- available ability;
- tutorial text;
- rewards;
- town/building impact;
- difficulty metadata.

No level configuration inside React render code.

---

# Mandatory Documentation

Create:

`docs/v2/V2_GAMEPLAY_30_LEVELS.md`

Document **all 30 levels individually**.

Do not write:

`Levels 12–16 are similar.`

For every level include:

### Level N — Name

- Chapter
- Story
- Mechanic
- Board objective
- Move count
- Blockers
- Character
- Ability
- Difficulty
- Reward
- Building/world impact

---

# Difficulty Curve

Target:

1–3:
tutorial.

4–8:
easy.

9–12:
easy-medium.

13–18:
medium.

19–24:
medium-hard.

25–29:
hard but fair.

30:
spectacle/celebration challenge.

Do not use intentionally frustrating difficulty spikes.

---

# Failure UX

Failure should feel gentle.

Use:

- encouraging reaction;
- clear objective recap;
- retry;
- optional earned booster.

Do not monetize failure.

---

# Testing

Test:

- all 30 configs validate;
- each board can initialize;
- objectives are reachable in simulated/basic validation where possible;
- reward IDs exist;
- building impact references valid buildings;
- no duplicate level IDs;
- progression unlock order;
- level 30 ending.

Use automated config validation.

---

# Acceptance Criteria

- [ ] 30 unique level definitions exist.
- [ ] All 30 are documented individually.
- [ ] Level configs validate.
- [ ] Campaign unlock order works.
- [ ] Rewards are real.
- [ ] Story beats affect town progression.
- [ ] Chapter 3 uses travel theme without hard-coding the whole app to Nha Trang.
- [ ] Completing level 30 unlocks Endless Couple Life hooks.
- [ ] Phase report exists.

---

# Required Output

Create:

- `docs/v2/V2_GAMEPLAY_30_LEVELS.md`
- `docs/v2/CAMPAIGN_BALANCE_NOTES.md`
- `docs/v2/reports/PHASE_08_REPORT.md`

Then stop.
