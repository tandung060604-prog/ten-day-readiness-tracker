# Little Days Web Push

This Worker stores only browser PushSubscriptions in the `PUSH_SUBSCRIPTIONS` KV namespace. It never receives PINs, couple profiles, photos, or wellness data.

## One-time production setup

1. Sign in locally with `npx wrangler login`.
2. Generate one VAPID pair with `npx web-push generate-vapid-keys`.
3. Set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (a `mailto:` address), and a random `PUSH_DISPATCH_TOKEN` using `wrangler secret put <NAME> --config workers/push/wrangler.jsonc`.
4. Deploy with `npx wrangler deploy --config workers/push/wrangler.jsonc` and retain the resulting `workers.dev` URL.
5. Set the GitHub repository variable `LITTLE_DAYS_PUSH_WORKER_URL` to that URL and the repository secret `PUSH_DISPATCH_TOKEN` to the same dispatch token.

After the next `main` deployment, the installed app fetches the public VAPID key, subscribes when the user presses **Bật thông báo**, and GitHub Actions posts a release payload to the Worker.
