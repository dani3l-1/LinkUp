# LinkUp — Environment Setup

## Quick start

```bash
# Local testing (local JSON DB, no production Supabase)
npm run start:test

# Production (Supabase, Stripe live keys)
npm run start
```

## Package scripts

```json
"scripts": {
  "start": "node server.js",
  "start:test": "LINKUP_ENV_FILE=.env.local node server.js"
}
```

## Environment files

| File | When used | Database |
|------|-----------|----------|
| `.env.local` | `npm run start:test` | Local JSON under `data/local-test/` |
| `.env` | `npm start` / deployed process | Supabase/PostgreSQL when `DATABASE_URL` is set |

## Database separation

- **Local testing** — No `DATABASE_URL` in `.env.local`. Server uses the local JSON database automatically.
- **Production (Supabase)** — Set `DATABASE_URL` in `.env` or your host environment to your Supabase connection string.
  Get it from: Supabase dashboard → Project Settings → Database → Connection string (URI / Session mode).

## Stripe separation

- Use **test keys** (`sk_test_...` / `pk_test_...`) in `.env.local`
- Use **live keys** (`sk_live_...` / `pk_live_...`) in `.env` or your production host environment
- For local Stripe webhooks, run: `stripe listen --forward-to localhost:4000/api/stripe/webhook`

## Safety guards

The server will **refuse to start** if:
- `SESSION_SECRET` is missing
- Running in production without `DATABASE_URL`, Stripe keys, or SMTP config
- Running from a local Mac with `.env` pointed at `DATABASE_URL`, unless `ALLOW_PRODUCTION_DATABASE_LOCALLY=true`
