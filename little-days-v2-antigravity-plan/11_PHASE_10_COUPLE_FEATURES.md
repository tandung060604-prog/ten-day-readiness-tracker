# PHASE 10 — COUPLE LIFE FEATURES AND ENDLESS MODE

## Goal

Make the project valuable even after the 30-level campaign is finished.

The practical couple features should feel integrated into the game world.

---

## Prioritization Rule

Do not implement every brainstormed feature.

Prioritize features that:

1. are useful to this couple;
2. fit an existing building naturally;
3. create memories or reduce planning effort;
4. can affect game progression;
5. do not require unsafe sharing.

---

# Priority A — Core Couple Features

## Daily Couple Question

Located at:

Home / sofa or tea table.

Supports:

- one prompt per day;
- optional answers;
- skip;
- favorite;
- archive.

Can reward a small Heart.

---

## Love Letter Mailbox

Located at:

Home mailbox.

Supports:

- write letter;
- save draft;
- open;
- favorite.

Optional scheduled Memory Capsule integration.

---

## Memory Capsule

Located at:

Memory Library.

Open conditions:

- specific date;
- after N days;
- birthday;
- anniversary.

Must function without a backend.

---

## Date Roulette

Located at:

Restaurant.

Inputs:

- budget;
- mood;
- time;
- indoor/outdoor;
- food preference.

Use profile preferences when available.

Do not silently use location.

---

## Wishlist / Bucket List

Located at:

Home / Library / Adventure area.

Categories:

- places;
- food;
- experiences;
- gifts;
- trips.

Allow marking completed and creating memory from completed item.

---

## Shared Goals

Located at:

Quest Square.

Examples:

- fitness goal;
- trip saving;
- photo challenge;
- new restaurant challenge.

Goals may generate quests.

---

## Anniversary Timeline

Located at:

Home calendar / Memory Library.

Show:

- relationship start;
- important dates;
- saved memories;
- trips;
- milestone decorations.

---

## Birthday Event

When birthday exists:

- balloons;
- special dialogue;
- cake decoration;
- optional hidden quest.

No birthday is required to play.

---

# Priority B — Strong Additions

- Trip journal
- Couple photo challenge
- What should we eat? roulette
- What should we do tonight? generator
- Relationship trivia using user-entered facts
- Couple quiz
- Monthly recap
- Yearly recap
- Souvenir display
- Collectible photo cards

Implement only after Priority A is coherent.

---

# Endless Couple Life

After campaign completion unlock:

- daily quests;
- weekly quests;
- seasonal events;
- future adventures;
- new trip chapters;
- anniversary chapters;
- birthday events;
- rotating prompts.

This should be configuration-driven.

---

# Seasonal Events

Prepare client-side event rules for:

- birthday;
- anniversary;
- Valentine;
- Tet;
- Christmas.

Use optional visual themes.

Do not require a backend.

---

# Personalization

Features may use:

- nicknames;
- relationship dates;
- birthdays;
- city/timezone;
- favorite foods;
- favorite activities;
- favorite places;
- couple goals.

Never require all of these.

---

# Tests

Test:

- date calculations;
- capsule unlock;
- roulette with/without preferences;
- goal completion;
- anniversary detection;
- birthday optional behavior;
- campaign-to-endless transition.

---

# Acceptance Criteria

- [ ] Core couple features feel native to building scenes.
- [ ] Endless mode exists after campaign.
- [ ] Features work with minimal profile.
- [ ] Optional personal data improves experience but is not required.
- [ ] Sensitive data is not exposed on the map unintentionally.
- [ ] No feature dump/dashboard regression.
- [ ] Phase report exists.

---

# Required Output

Create:

- `docs/v2/COUPLE_FEATURES_SPEC.md`
- `docs/v2/ENDLESS_MODE_SPEC.md`
- `docs/v2/reports/PHASE_10_REPORT.md`

Then stop.
