# LinkUp — Internal Release Notes

> **INTERNAL ONLY — DO NOT PUBLISH.**
> This is the complete engineering record: infrastructure, data-layer changes,
> security implementation, and unreleased/flag-gated products.
>
> The **customer-facing subset** lives in `public/release-notes.md`, which is
> served over HTTP at `linkuprides.com`. This file lives under `docs/`, which is
> **not** served (`express.static` only mounts `public/`).

## Rules for what goes where

| Goes in **public/release-notes.md** | Stays **here (internal)** |
| --- | --- |
| Features students can see and use | Infrastructure, hosting, database, deploy |
| UI/UX changes, fixes they'd notice | Internal tooling & admin panels |
| Policy/privacy changes affecting them | Security *implementation* detail (CSRF, headers, routes) |
| Plain-language trust & safety guarantees | Anything about **LinkUp Bites** or **LinkUp Social** |
| | Demo fixtures, test data, doc/manifest updates |

**Never** name an unreleased product or describe hosting/architecture in the public file.

---

## Unreleased / flag-gated products — status

Both remain **OFF in production** and must not appear in any public-facing copy,
release notes, marketing, or metadata until launch.

- **LinkUp Bites** — `LINKUP_BITES_ENABLED=false` in production `.env`.
  Server-gated: `requireBitesPreviewAccess` returns 404 for everything under
  `/api/bites`, so the namespace is dark by default as it's built.
- **LinkUp Social** — `LINKUP_SOCIAL_ENABLED=false` in production `.env`.
  Server-gated via `requireSocialPreviewAccess` on `/api/social`, `/api/groups`,
  `/api/interests`, plus per-route on `POST|DELETE /api/users/:id/follow` and
  `GET /api/users/suggestions` (these three sit outside the gated prefixes and
  previously leaked — fixed 2026-07-18).
- Both gates run **before** `requireAuth`, so a disabled feature returns 404 to
  everyone and reveals nothing about its existence.
- Social feature work lives on `wip/scale-session-2026-07-18`; it is **not**
  merged to `main`. Its data entities are not yet migrated to per-row tables.

---

## v2026.07.19 — Storage migration + horizontal scaling *(shipped to production)*

**Public-facing summary:** "Built to stay fast as more students join." Nothing else.

### Data layer
- Migrated all 8 entity groups out of the single `linkup_state` JSON blob into
  per-row indexed Postgres tables: `linkup_users`, `linkup_rides`,
  `linkup_ride_requests`, `linkup_messages`, `linkup_payments`,
  `linkup_wallet_transactions`, `linkup_checkout_sessions`,
  `linkup_tracking_trips`. The blob now holds only small, low-write collections
  (carts, follows, campus groups, waitlist leads, admin audit log, reset tokens).
- Mechanism: `MIGRATED_BLOB_KEYS` — `loadDb()` repopulates `db.<entity>` from each
  store's in-memory cache (so ~200 read sites were untouched); `saveDb()` strips
  those keys from the blob write. High-write entities reroute writes to per-row
  `persist`/`append`; rides, users and money records use signature-based
  change-detection (`persistDirtyRides`, `persistDirtyUsers`, `store.persistDirty()`)
  so no in-place mutation site can be missed.
- Existing deployments backfill automatically on first boot (idempotent via a
  `!cache.has(id)` guard).

### Scaling
- Redis (optional, `REDIS_URL`): shared fixed-window rate limiter with in-memory
  fallback, Socket.IO Redis adapter, and a cross-instance cache-invalidation bus
  (channel `linkup:invalidate`; publish after commit; peers reload the single row).
- `APP_INSTANCE_COUNT` guard relaxed: >1 permitted **only** when `REDIS_URL` is set.
  Second guard rejects `APP_INSTANCE_COUNT × DATABASE_POOL_MAX > 90`.
- Production currently runs **one** instance (`APP_INSTANCE_COUNT` unset) by choice.

### Money safety
- `linkup_wallet_transactions` has a partial `UNIQUE` index on `dedupe_key`;
  driver credits and wallet debits insert via `insertUnique`, so a duplicate
  credit is rejected by the database even if two instances race the same checkout.

### Bugs fixed (pre-existing, production-affecting)
- **`statement_descriptor` on card PaymentIntents** — Stripe rejects it; this broke
  *every* card checkout. Changed to `statement_descriptor_suffix`.
- **Backfill ordering data-loss bug** — each store's backfill called `saveDb`, which
  strips *all* migrated keys, so on a real deploy the first store to load would wipe
  every not-yet-backfilled entity. Now stripped once, after all stores load.
- `check-launch-readiness.js` delete-account smoke test read the anonymized user
  from the `db.json` blob; now reads the user store.

### Verification (throwaway Postgres + Stripe **test** + Upstash Redis)
- Full Stripe-test checkout **12/12** — payment, driver credit ($16.12 net of fee +
  15% commission) and paid session each land in their own table; blob zero; seat
  reserved on the ride row; duplicate credit inserts 0 rows.
- Backfill-no-loss **5/5** across all 8 entity groups; blob left clean.
- Two-instance cross-instance coherence **9/9**.
- Local-Postgres dry-run against a restored **production** dump: **10/10**, zero loss
  (production held only 3 users, 0 rides/payments at the time).

### Deploy notes (learned the hard way)
- Production is `/home/ubuntu/linkup` on Ubuntu, PM2 fork mode, single process.
- The server's `/home/ubuntu/linkup/.env` is a **separate, gitignored file** — `git pull`
  never updates it. `REDIS_URL` had to be added there directly.
- `dotenv` is loaded **without** `override`, so PM2's cached env wins:
  use `pm2 restart linkup --update-env`, not a plain restart.
- `npm ci` deletes `node_modules` first; PM2 auto-restarts during that window log
  `MODULE_NOT_FOUND`. Harmless, but `pm2 stop` → `npm ci` → `pm2 start` avoids it.
- Supabase Free tier has **no automated backups and no PITR** — take
  `npm run backup:production` (verified `pg_dump` custom-format + SHA-256 manifest)
  and copy it off-machine before any migration.
- Rollback requires restoring the DB backup **and** reverting code together — the
  migration empties the blob, so reverting code alone makes data look missing.

---

## v2026.07.17 — Reliability *(removed from public notes)*

- **Production readiness monitoring.** `/ready` confirms startup is complete and
  Supabase is reachable; `/health` remains a lightweight process check.
- **Safer releases and shutdowns.** Drains HTTP traffic, flushes queued database
  writes, and closes the PostgreSQL pool before exiting.
- **Scaling guardrails (superseded 2026-07-19).** Enforced one PM2 process and a
  free-tier-friendly connection pool.
- **Disabled products stay disabled.** Bites and Social off in production.
  *(This line was previously published — it named both unreleased products on the
  public page. Removed 2026-07-19.)*

---

## v2026.07.16 *(removed from public notes)*
- **Four-ride production demo.** Demo fixtures gained a fourth fictional ride to
  exercise fixed-map + independently scrollable results with realistic overflow.
- **Documentation.** Shared web/iOS feature manifest and app-team guide updated.

## v2026.07.04 *(removed from public notes)*
- **Inline script blocked by CSP.** Stripe Connect bootstrap moved into the external
  boot script permitted by the Content-Security-Policy.

## v2026.06.02 *(removed from public notes)*
- **Admin safety recordings panel.** Recordings tab listing all safety recordings with
  rider, route, duration, recorded/expiry dates, and report status; admins can play
  any recording in-browser. Every access is written to the admin audit log.
  *(User-relevant privacy consequences remain public via the audit-trail and Privacy
  Notice entries.)*

## v2026.05.27 *(removed from public notes)*
- **iOS feature manifest and API guide.** Shared `features.json` manifest + API guide
  so the iOS app stays aligned with website features.

## v2026.05.17–20 — Security implementation *(rephrased or removed in public)*
- **API writes restricted to trusted origins.** Cross-origin POST/PUT/PATCH/DELETE from
  unrecognized domains rejected server-side (CSRF class). *Removed from public.*
- **Sensitive API responses are not cached.** No-store headers on responses containing
  personal data, payment info, or session state. *Public version rewritten in plain
  language as "Your details aren't left behind on shared computers."*
- **Payout onboarding from a protected server action.** Stripe Connect onboarding starts
  from a server-side protected route in a separate tab (CSRF / link-manipulation).
  *Public version rewritten as "Driver payout setup is protected."*

---

## Known follow-ups
- Rotate the production database password (was exposed in a chat transcript).
- Return **404** instead of 200 for dotfile/probe paths (`/.env`, `/.git/config`,
  `/wp-admin/…`). Not a leak — the SPA catch-all serves `index.html` and `.env` is
  outside `public/` — but 200s invite continued scanning and pollute logs.
- Disconnect the leftover Cloudflare "linkup" Worker build (unused experiment, fails
  on every push).
- Merge Social + Bites onto `main` behind their flags, then migrate their entities.
