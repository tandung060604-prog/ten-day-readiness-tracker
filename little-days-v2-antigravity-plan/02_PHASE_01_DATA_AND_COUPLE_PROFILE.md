# PHASE 01 — DATA MODEL AND COUPLE PROFILE

## Goal

Remove personal hard-coding and build the data foundation for a reusable couple game.

The application must be playable using demo data, while real data is entered locally after launch.

---

## Product Model

Create the concept of:

```ts
interface CoupleProfile {
  id: string
  player1: PersonProfile
  player2: PersonProfile
  relationshipStartDate?: string
  importantDates: ImportantDate[]
  homeCity?: string
  timezone?: string
  favoritePlaces?: PlaceReference[]
  favoriteFoods?: string[]
  favoriteSongs?: string[]
  coupleGoals?: CoupleGoal[]
  privacy: PrivacyPreferences
  createdAt: string
  updatedAt: string
}
```

Person profile should support:

- display name;
- nickname;
- optional birthday;
- avatar character;
- favorite color;
- favorite foods;
- optional preferences.

Minimum onboarding data:

- nickname/player label for two people;
- who uses Chiikawa;
- who uses Usagi.

Everything else should be optional.

---

## Required Setup Flow

Create a lightweight first-run setup.

Step 1:
`Welcome to Little Days`

Step 2:
`Who lives here?`

Step 3:
Choose:

- Chiikawa
- Usagi

Step 4:
Optional couple information.

Step 5:
Privacy explanation.

Step 6:
Enter town.

The setup must be skippable using a demo profile.

---

## Optional Information

Support but do not require:

### Relationship

- relationship start date;
- first meeting;
- anniversaries;
- planned trip dates.

### Birthday

For:

- birthday event;
- countdown;
- decorations;
- dialogue;
- hidden birthday quest.

### Location

Default scope:

- city;
- timezone.

Do not require precise GPS.

### Preferences

- favorite foods;
- date activities;
- songs;
- colors;
- destinations;
- goals.

---

## Data Classification

Define:

### Public/demo-safe
Can live in source code.

### Personal local
Nickname, preferences, dates.

### Sensitive local
Journal, cycle/health information, private photos, precise location.

Use explicit types/metadata where useful.

---

## Storage Direction

Do not complete full encrypted vault yet.

But establish interfaces so storage can later move to IndexedDB cleanly.

Suggested boundaries:

```text
src/
  domain/
    couple/
  storage/
    repositories/
    schemas/
  features/
    onboarding/
```

Do not let UI directly call `localStorage` everywhere.

---

## Replace Hard-coded Data

Search the repository for:

- names;
- relationship dates;
- Nha Trang dates;
- static couple counters;
- assumed locations;
- hard-coded personal stats.

Replace them with:

- profile data;
- adventure configuration;
- demo fixtures.

Do not delete useful content. Convert it to seed/demo data where appropriate.

---

## Derived Selectors

Create tested helpers/selectors for:

- relationship day count;
- next important date;
- age only if actually needed;
- timezone/day-period;
- milestone detection.

Do not calculate sensitive or health-derived claims here.

---

## Tests

Add tests for:

- empty profile;
- demo profile;
- relationship day calculation;
- timezone fallback;
- optional birthday;
- malformed profile fallback.

---

## Acceptance Criteria

- [ ] No real personal details are required in source code.
- [ ] A new user can complete setup.
- [ ] Setup can be skipped with demo data.
- [ ] Existing V1 data is not destroyed.
- [ ] UI can read profile data through a clean API.
- [ ] Relationship day calculation is tested.
- [ ] City/timezone are optional.
- [ ] Precise GPS is not collected.
- [ ] Phase report is written.

---

## Required Output

Create/update:

- `docs/v2/V2_PERSONALIZATION_PRIVACY.md`
- `docs/v2/COUPLE_PROFILE_SCHEMA.md`
- `docs/v2/reports/PHASE_01_REPORT.md`

Then stop.
