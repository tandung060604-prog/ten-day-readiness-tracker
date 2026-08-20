# PHASE 04 — BUILDING INTERIORS AND GAME UX

## Goal

Give each building a unique interior scene, interaction model and purpose.

Critical rule:

**Do not reuse one generic tracker view as the main experience of multiple buildings.**

---

## Universal Interior Contract

Every building must define:

1. exterior identity;
2. entrance transition;
3. interior environment;
4. focal interaction;
5. secondary interactions;
6. resident/companion behavior;
7. progression;
8. unique ambience;
9. unique SFX;
10. rewards;
11. empty state;
12. loading state;
13. mobile layout;
14. level 1/2/3 visual variants.

Use:

`Scene → focal interaction → optional details`

instead of:

`Header → 12 dashboard cards`.

---

# 1. OUR HOME

## Visual

Cozy cottage living room:

- sofa;
- tea table;
- calendar;
- memory shelf;
- photo wall;
- mailbox;
- warm window;
- flowers.

## Interactions

- calendar → anniversaries;
- photo frame → memories;
- sofa → daily check-in;
- mailbox → love letters;
- bookshelf → timeline.

## Data shown naturally

- relationship days;
- upcoming date;
- recent memory;
- couple streak;
- today-together summary.

## Upgrade

Lv1: tiny room.

Lv2: balcony + more photo space.

Lv3: expanded home + glowing heart tree outside.

---

# 2. QUEST SQUARE

## Visual

Town plaza with:

- wooden quest board;
- fountain;
- banners;
- reward chest.

## Interactions

- daily quests;
- weekly quests;
- story quests;
- couple quests;
- achievements;
- adventure campaign entrance.

This is the primary bridge between real activities and game progression.

---

# 3. GYM & DOJO

Usagi is the energetic coach.

## Interior

- wooden training hall;
- dumbbells;
- mat;
- punching bag;
- timer;
- towel;
- water.

## Interactions

- workout plan;
- sets/reps;
- rest timer;
- completion ritual;
- streak;
- personal records.

Completion should trigger:

`check animation → Usagi reaction → SFX → reward → persistence`

Do not make medical claims.

---

# 4. WATER FOUNTAIN

## Focal Interaction

The fountain itself represents hydration.

Logging water visually changes the fountain.

Suggested stages:

- 0–24%: low water;
- 25%: fountain wakes;
- 50%: fish appear;
- 75%: flowers bloom;
- 100%: sparkle/rainbow celebration.

Quick actions:

- +200 ml
- +300 ml
- +500 ml

History lives behind a small journal/object, not on the main scene.

---

# 5. SLEEP HAVEN

## Visual

- moon window;
- star lights;
- cloud bed;
- lavender;
- night lamp.

## Features

- bedtime;
- wake time;
- duration;
- nap;
- breathing mode;
- sleep routine;
- calm ambience.

No diagnosis or medical certainty.

---

# 6. MEMORY LIBRARY

Each day/memory should feel like a book.

## Interactions

- browse year;
- browse month;
- open memory book;
- journal;
- gratitude;
- private note;
- shared reflection;
- love letter.

Add:

## Memory Capsule

Allow a message to unlock:

- after N days;
- on anniversary;
- on birthday.

---

# 7. PHOTO STUDIO

## Visual

- polaroids;
- camera;
- film;
- corkboard;
- scrapbook table.

## Features

- couple photos;
- food photos;
- trips;
- captions;
- date;
- tags;
- optional location;
- favorites;
- Memory of the Month.

Avoid committing personal images into the repository.

---

# 8. LITTLE MARKET

## Visual

- produce stalls;
- baskets;
- bakery;
- food displays.

## Main interaction

Choose food as if shopping and place it into a basket.

Features:

- groceries;
- fridge inventory;
- shopping list;
- meal ideas;
- meal history;
- favorite meals.

Prepare hook for mini-merge:

`ingredients → meal`

Do not build the full merge engine here.

---

# 9. DATE NIGHT RESTAURANT

## Visual

- cozy rooftop;
- two-person table;
- candles;
- flowers;
- sea/city view;
- warm lamps.

## Features

- date planner;
- wishlist;
- budget;
- menu notes;
- outfit note;
- post-date memory;
- photos;
- date rating;
- random date generator.

The generator must use profile preferences when available.

---

# 10. AIRPORT

## Interior

- terminal;
- departure board;
- suitcase;
- boarding-pass style UI;
- plane window.

## Features

- trip countdown;
- itinerary;
- luggage checklist;
- trip budget;
- transport;
- booking notes;
- travel-document checklist.

Usagi can later run around pulling luggage.

---

# 11. BEACH / ADVENTURE AREA

## Purpose

Destination scene for trips.

Support:

- itinerary;
- activity goals;
- food wishlist;
- photo goals;
- expense log;
- destination badges.

State:

`Planning Mode → Active Trip → Memory Mode`

Nha Trang can be the first adventure theme, but the architecture must support future destinations.

---

# 12. TOWN HALL

Settings must remain immersive.

## Interior

- map table;
- archive;
- clock;
- vault.

## Sections

- couple profile;
- privacy;
- audio;
- graphics;
- accessibility;
- backup;
- import/export;
- reset;
- theme;
- language.

---

# 13. LOVE CLINIC / WELLNESS COTTAGE

Sensitive optional feature.

Support only if enabled by the user.

May include:

- period dates;
- symptoms;
- mood;
- notes;
- reminders;
- estimated cycle windows.

Required notice:

`Predictions are estimates and are not medical advice.`

Default behavior:

- local-only;
- hideable building;
- privacy mode.

Allow changing the exterior/name to:

`Wellness Cottage`

for users who do not want cycle tracking.

---

## Implementation Approach

Prefer scene-specific components under feature folders.

Example:

```text
features/buildings/
  home/
  quests/
  gym/
  water/
  sleep/
  memories/
  photos/
  market/
  restaurant/
  airport/
  adventure/
  townHall/
  wellness/
```

Shared scene primitives may include:

- `SceneShell`
- `InteractiveObject`
- `SceneDialogueAnchor`
- `SceneJournal`
- `RewardToast`

Do not force every building into an identical component template.

---

## Tests

At minimum:

- each building renders;
- primary interaction is reachable;
- navigation back to map works;
- persistence works for edited data;
- sensitive building respects visibility setting;
- no old duplicated TodayView remains as the main view for unrelated buildings.

---

## Acceptance Criteria

- [ ] Every target building has a distinct interior.
- [ ] Each interior has one clear focal interaction.
- [ ] No unrelated buildings rely on the same generic main tracker view.
- [ ] Each scene has an audio/character hook.
- [ ] Mobile fallback exists.
- [ ] Sensitive building can be hidden.
- [ ] Scene data persists.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/V2_BUILDING_DESIGN.md`
- `docs/v2/BUILDING_INTERACTION_MATRIX.md`
- `docs/v2/reports/PHASE_04_REPORT.md`

Then stop.
