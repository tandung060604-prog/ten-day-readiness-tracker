# Handoff — Cloudflare Web Push

Updated: 2026-08-21

## Active task

`PUSH-001` — Deploy Cloudflare Worker/KV and VAPID-backed release notifications for the installed Little Days PWA.

## Verified

- Branch: `main`; starting HEAD: `8b1cec6`.
- `workers/push` bundles successfully with `wrangler deploy --config workers/push/wrangler.jsonc --dry-run`.
- `npm test -- --run`: 23 files, 148 tests passed.
- `npm run build`: passed.
- `npm run lint`: 0 errors; 37 pre-existing warnings.
- `node --check public/sw.js`: passed.
- `wrangler whoami`: authenticated; Cloudflare Worker and KV namespace were provisioned and deployed.
- VAPID public/private keys and the dispatch token were set as Cloudflare secrets; the matching dispatch token was set as a GitHub repository secret.
- The public Worker URL is stored in the GitHub repository variable `LITTLE_DAYS_PUSH_WORKER_URL`.

## Unfinished and blocker

Do not commit VAPID keys, dispatch tokens, or Cloudflare API tokens. Commit/push the current code, then use an installed iPhone PWA to press **Bật thông báo** and verify the next deployment arrives while the app is closed.

## First next command

`gh run watch <next-pages-run-id> --repo tandung060604-prog/ten-day-readiness-tracker --exit-status`
