# 10-Day Readiness Tracker

A local-first wellness, recovery and training tracker built as a React + TypeScript + Vite MVP.

## Highlights

- 10-day training / taper plan
- Daily readiness dashboard
- Meal logging
- Meal photo evidence stored locally in IndexedDB
- Hydration tracker
- Sleep and nap tracking
- Upper/lower/cardio/recovery plan with exercise instructions
- Kegel / pelvic-floor light-dose tracking
- 4:6 breathing timer
- Mood, stress, energy and soreness journal
- Desk-break checklist for a coding workday
- Insights charts
- JSON backup / restore
- Privacy mode
- Dark / light theme
- GitHub Pages workflow

> Readiness is a personal adherence score, not a medical assessment.

## Run locally

```bash
npm install
npm run dev
```

Vite will print the localhost URL (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

The project ships with `.github/workflows/deploy-pages.yml` and Vite is configured with `base: './'` for static hosting.

1. Push this repository to GitHub.
2. In GitHub repository settings, open **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main`.
5. The included workflow builds and deploys `dist/`.

## Data model / privacy

- Logs and settings: `localStorage`
- Meal photos: browser `IndexedDB`
- No backend
- No analytics SDK
- No cloud photo upload

Clearing site storage will remove local data, so use **Settings → Export backup** regularly.

## Seed data

The MVP includes the already-known Day 1–3 entries so development starts with a realistic dashboard.

## Scope note

This is intentionally an MVP. Future improvements could include PWA installability, notification reminders, richer food categorization, photo export ZIP, and optional encrypted sync.

## Create the GitHub repository from this local repo

The included local folder is already a Git repository with commits.
For privacy, create the remote as **private** first because the seeded MVP contains personal routine/meal data.

If GitHub CLI is installed and authenticated:

```bash
./scripts/publish-github.sh
```

Or choose another name:

```bash
./scripts/publish-github.sh my-readiness-tracker
```

To intentionally create a public repository:

```bash
./scripts/publish-github.sh ten-day-readiness-tracker --public
```
