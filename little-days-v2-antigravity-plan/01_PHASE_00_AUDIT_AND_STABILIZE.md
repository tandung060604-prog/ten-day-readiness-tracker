# PHASE 00 — AUDIT AND STABILIZE CURRENT CODE

## Goal

Understand the real current repository, document technical debt and stabilize the foundation **without redesigning the product yet**.

This phase must not introduce the V2 world, puzzle campaign or new feature set.

---

## Read First

- `00_ANTIGRAVITY_MASTER_EXECUTION_GUIDE.md`
- repository `README.md`
- `GAME_ARCHITECTURE.md`
- `GAME_REDESIGN_COMPLETE_PLAN.md`
- `AUDIO_GUIDE.md`
- `TRANSITION_GUIDE.md`
- `ASSET_LICENSES.md`
- all current source folders

---

## Audit Scope

Inspect at minimum:

- `src/`
- `src/game/`
- `src/views/`
- `src/components/`
- `src/utils/`
- `src/data/`
- `src/db/`
- `public/`
- `package.json`
- Vite/GitHub Pages configuration

Check specifically:

- oversized components;
- duplicated views;
- duplicated business logic;
- hard-coded personal names/dates/stats;
- map metadata mixed with UI logic;
- audio logic spread across utilities;
- repeated AudioContext creation;
- unsafe localStorage/JSON import;
- missing schema migration;
- missing tests;
- missing error boundaries;
- oversized CSS;
- asset loading;
- stale/dead files;
- docs differing from implementation;
- incorrect building count;
- dependency versions using `latest`;
- accessibility basics;
- mobile layout;
- service-worker/PWA leftovers if any.

Do not assume any previously suspected issue is true. Verify it.

---

## Deliverable 1 — Code Audit

Create:

`docs/v2/V2_CODE_AUDIT.md`

For every meaningful finding use:

| Issue | Evidence | Impact | Severity | Proposed Fix | Files |
|---|---|---|---|---|---|

Severity:

- Critical
- High
- Medium
- Low

Also classify each issue as:

- fix now;
- refactor before feature work;
- safe to defer.

---

## Deliverable 2 — Current Architecture Map

Create:

`docs/v2/CURRENT_ARCHITECTURE.md`

Document:

- boot flow;
- top-level state;
- navigation flow;
- current buildings;
- storage;
- audio;
- map;
- transitions;
- character rendering;
- tracker modules;
- deployment.

Include Mermaid diagrams when useful.

---

## Stabilization Work

After the audit, fix only foundation issues that block later phases.

Expected candidates:

### Dependency hygiene

- pin core dependency versions;
- remove unused dependencies;
- verify lockfile;
- do not add large frameworks yet.

### TypeScript

- enable/strengthen strict checks where feasible;
- remove obvious unsafe casts;
- establish shared type locations.

### Lint / Format

Add or repair:

- ESLint
- Prettier

Keep configuration simple.

### Testing baseline

Add:

- Vitest
- React Testing Library

Create smoke tests for:

- application boot;
- important data helper functions;
- existing route/view switching if practical.

Do not attempt complete test coverage.

### Error handling

Add a top-level error boundary if absent.

### App decomposition

If `App.tsx` is acting as a god component, extract only obvious concerns such as:

- app shell;
- routing/navigation state;
- provider composition;
- storage bootstrapping.

Do not redesign UI.

### CSS

Do not rewrite all styling.

Only establish a direction for modular styles/tokens.

---

## Do Not Do

- no new map artwork;
- no puzzle engine;
- no new couple features;
- no new building interiors;
- no new progression;
- no user-profile redesign;
- no migration to a completely different framework.

---

## Tests

Run at minimum:

```bash
npm install
npm run build
npm run lint
npm run test
```

If scripts differ, document the actual commands.

---

## Acceptance Criteria

- [ ] Repository builds.
- [ ] Audit exists and contains evidence.
- [ ] Current architecture is documented.
- [ ] Core dependencies are versioned predictably.
- [ ] Lint/format baseline exists.
- [ ] Automated test baseline exists.
- [ ] No meaningful visual redesign occurred.
- [ ] Existing saved data remains readable.
- [ ] Known blockers for Phase 01 are identified.
- [ ] Phase report is written.

---

## Required Output

Create:

- `docs/v2/V2_CODE_AUDIT.md`
- `docs/v2/CURRENT_ARCHITECTURE.md`
- `docs/v2/reports/PHASE_00_REPORT.md`

Then stop.
