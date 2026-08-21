# Little Days implementation state

Updated: 2026-08-21

## Current task

Implement the next product directions: wellness-linked daily challenges, a deterministic couple endless mode, offline PWA support, and an optional encrypted local sync flow.

## Verified progress

- Daily challenges derive hydration, workout, and journal progress from the existing wellness log.
- Daily challenge claims are stored in `GameState.dailyChallengeClaims` and awarded through the existing reward service.
- Endless mode uses a stable date + couple seed, an 8x8 board, and a two-slot local best-score ledger.
- `public/sw.js` caches the app shell and falls back to `index.html` for offline navigation.
- AES-GCM backup encryption already existed; `encryptedSync` now wraps it in a device envelope and merges claims, puzzle progress, and wellness logs before restore.

## Validation evidence

- `npm test -- --run`: 21 files, 142 tests passed on the final sweep.
- `npm run build`: passed after the service worker and sync changes.
- `npm run lint`: exit 0, 0 errors and 37 pre-existing warnings remain.
- `node --check public/sw.js`: passed; production preview returned HTTP 200 for `/`, `/manifest.json`, and `/sw.js`.

## Known follow-up

- Service-worker behavior still needs an installed-browser smoke check.
- The current local sync intentionally has no transport/backend; the encrypted JSON envelope is the transport boundary.
