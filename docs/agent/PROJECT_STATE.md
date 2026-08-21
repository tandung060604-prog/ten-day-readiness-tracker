# Little Days implementation state

Updated: 2026-08-21

## Current task

Deploy closed-app release notifications with Cloudflare Worker, KV, and VAPID.

## Verified progress

- Daily challenges derive hydration, workout, and journal progress from the existing wellness log.
- Daily challenge claims are stored in `GameState.dailyChallengeClaims` and awarded through the existing reward service.
- Endless mode uses a stable date + couple seed, an 8x8 board, and a two-slot local best-score ledger.
- `public/sw.js` caches the app shell and falls back to `index.html` for offline navigation.
- AES-GCM backup encryption already existed; `encryptedSync` now wraps it in a device envelope and merges claims, puzzle progress, and wellness logs before restore.
- Cloudflare Worker `little-days-push` and its `PUSH_SUBSCRIPTIONS` KV namespace are deployed; VAPID and dispatch credentials are stored only as Cloudflare/GitHub secrets.

## Validation evidence

- `npm test -- --run`: 23 files, 148 tests passed after the Web Push client addition.
- `npm run build`: passed after the Web Push client addition.
- `npm run lint`: exit 0, 0 errors and 37 pre-existing warnings remain.
- `node --check public/sw.js`: passed; the Worker also passed `wrangler deploy --dry-run`.

## Known follow-up

- Service-worker behavior still needs an installed-browser smoke check.
- The current local sync intentionally has no transport/backend; the encrypted JSON envelope is the transport boundary.
- An installed iPhone PWA still needs to press **Bật thông báo** once before it can receive a closed-app release notification.
