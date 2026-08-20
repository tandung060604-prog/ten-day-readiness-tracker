# PHASE 03 — LIVING WORLD MAP V2

## Goal

Transform the current world map from a mostly static hotspot screen into a living cozy town while preserving usability and performance.

Do not build every interior yet.

---

## World Design

The map should feel like a small storybook town.

Target atmosphere:

- watercolor/pastel;
- warm sunlight;
- clay/wood cottages;
- flowers;
- river;
- tiny paths;
- soft animated details;
- readable interactive locations.

Avoid:

- generic dashboard overlays;
- neon game UI;
- visually noisy particle spam.

---

## Living World Systems

Implement architecture for:

### Time of day

- morning;
- afternoon;
- sunset;
- night.

Use profile timezone when available, otherwise browser timezone.

### Ambient animation

Examples:

- clouds;
- tree sway;
- flower movement;
- river movement;
- butterflies;
- falling petals;
- chimney smoke;
- window glow.

### Weather hook

Create the interface/state only if external weather is not yet available.

The map must function fully without network weather.

### Seasonal theme hooks

Prepare for:

- birthday;
- anniversary;
- Tet;
- Valentine;
- Christmas;
- trip events.

Do not create every seasonal asset now.

---

## Location Architecture

Move building/location metadata out of monolithic UI components.

Create a data-driven registry.

Each location should define:

- id;
- name;
- map position;
- exterior variant;
- unlock state;
- building level;
- destination scene;
- ambience id;
- character behavior hooks.

---

## Building Count

Determine the actual current implemented location/building count from code.

Document differences between code and old docs.

V2 target should support at least these concepts:

1. Home
2. Quest Square
3. Gym & Dojo
4. Water Fountain
5. Sleep Haven
6. Memory Library
7. Photo Studio
8. Little Market
9. Date Night Restaurant
10. Airport
11. Beach / Adventure Area
12. Town Hall
13. Love Clinic / Wellness Cottage

Names may be refined, but IDs must remain stable once migration begins.

---

## Navigation

Target flow:

`World Map → click building → character walks → entrance transition → scene loads`

Do not teleport instantly unless reduced-motion or performance mode is enabled.

Add:

- hover/focus feedback;
- keyboard access;
- mobile tap behavior;
- locked-location feedback.

---

## Character Presence

At this phase implement only map locomotion hooks/anchors.

Full behavior belongs to Phase 05.

Characters should be able to:

- have a current map location;
- move toward selected building;
- idle near landmarks;
- spawn predictably.

---

## Performance

World map must not re-render completely due to:

- clock tick;
- dialogue text;
- hydration count;
- unrelated form input.

Use memoization/selectors appropriately.

Prefer CSS/SVG/canvas approaches based on current implementation; do not introduce a rendering engine solely for the map without evidence it is needed.

---

## Reduced Motion

If reduced motion is enabled:

- remove long walking transitions;
- reduce particles;
- disable camera motion;
- keep functional cues.

---

## Tests

Test at least:

- all registered buildings have valid destinations;
- no duplicate IDs;
- level variants resolve correctly;
- locked/unlocked logic;
- day-period selector;
- navigation fallback.

---

## Acceptance Criteria

- [ ] Map metadata is data-driven.
- [ ] Day/night state works.
- [ ] At least several ambient elements are live.
- [ ] Existing buildings remain reachable.
- [ ] Characters can be positioned/moved toward buildings.
- [ ] Reduced-motion mode works.
- [ ] Map remains usable on desktop/tablet/mobile.
- [ ] Building interiors are not yet redesigned wholesale.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/WORLD_MAP_V2_SPEC.md`
- `docs/v2/WORLD_LOCATION_REGISTRY.md`
- `docs/v2/reports/PHASE_03_REPORT.md`

Then stop.
