# PHASE 13 — RELEASE AND GITHUB PAGES

## Goal

Prepare and validate the production release of Little Days V2 without losing user data or breaking GitHub Pages routing/assets.

Do not push/publish unless the repository owner explicitly authorizes it.

---

# Pre-release Audit

Verify:

- Phase 00–12 acceptance criteria;
- build;
- tests;
- migrations;
- asset paths;
- base path;
- GitHub Pages routing;
- lazy chunks;
- audio files;
- service worker if present;
- public/private data separation;
- no secret/API keys;
- no real private user data.

---

# Production Build

Run the real production build.

Inspect:

- warnings;
- bundle sizes;
- chunk failures;
- source-map decisions;
- asset URLs.

Test using the same base path expected on GitHub Pages.

---

# Migration Dry Run

Simulate:

1. V1 user opens V2;
2. data is detected;
3. backup is created;
4. migration succeeds;
5. user can enter town;
6. old core data is still represented;
7. reload retains V2 data.

Also simulate malformed V1 data.

---

# Critical E2E Flows

At minimum:

### New User

`Launch → Setup → World Map → Building → Activity → Save → Reload`

### Returning V1 User

`Launch → Migration → Map → Verify data`

### Campaign

`Quest Square → Level → Win → Reward → Building Upgrade`

### Couple Feature

`Home/Library → Create memory → Reload`

### Privacy

`Hide sensitive building → reload → still hidden`

### Backup

`Export → reset test environment → import → restore`

---

# GitHub Pages

Verify:

- Vite `base`;
- static asset path;
- SPA routing approach;
- refresh on subpath;
- service-worker scope;
- cache invalidation.

Do not change deployment mechanism without a clear reason.

---

# Release Notes

Create:

`docs/v2/V2_RELEASE_NOTES.md`

Include:

- what changed;
- major new features;
- migration behavior;
- privacy changes;
- known limitations;
- fan-project disclaimer;
- backup recommendation.

---

# Rollback Plan

Document:

- previous stable release/commit;
- how to disable broken service worker;
- how to restore V1/V2 backup;
- which migrations are irreversible.

Avoid destructive schema migration without fallback.

---

# Final Product Documentation

Update repository README to explain:

- Little Days V2 concept;
- local-first storage;
- optional personal data;
- fan-made status;
- build/run commands;
- architecture docs;
- asset/license notes.

Do not expose private couple details in README.

---

# Release Gate

Release only when:

- build passes;
- tests pass;
- migration dry run passes;
- no private data exists in git;
- critical e2e flows pass;
- GitHub Pages preview works;
- rollback plan exists.

---

# Acceptance Criteria

- [ ] Production build validated.
- [ ] GitHub Pages paths validated.
- [ ] V1→V2 migration dry run passes.
- [ ] New-user flow passes.
- [ ] Campaign reward/upgrading flow passes.
- [ ] Backup restore passes.
- [ ] No private user data is tracked.
- [ ] Release notes exist.
- [ ] Rollback plan exists.
- [ ] Final phase report exists.

---

# Required Output

Create:

- `docs/v2/V2_RELEASE_NOTES.md`
- `docs/v2/RELEASE_CHECKLIST.md`
- `docs/v2/ROLLBACK_PLAN.md`
- `docs/v2/reports/PHASE_13_REPORT.md`

Then stop and report readiness.

Do not push, deploy or create a release unless explicitly authorized.
