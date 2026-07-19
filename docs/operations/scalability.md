# Scalability — assessment & roadmap

Honest read on how far LinkUp scales today and the staged path to grow. Measure
with a load test against a seeded database. (The `agent:perf` / `agent:ceiling`
load-test harnesses referenced below live with the agents framework on a separate
branch, not in this PR.)

> **Status (this branch, 2026-07-19):** the storage migration + Redis horizontal
> scaling described below is **implemented on production's codebase** in PR #5.
> All 8 entity groups are in per-row tables (`linkup_users`, `linkup_rides`,
> `linkup_ride_requests`, `linkup_messages`, `linkup_payments`,
> `linkup_wallet_transactions`, `linkup_checkout_sessions`,
> `linkup_tracking_trips`); Redis provides the shared rate limiter, Socket.IO
> adapter, and cross-instance cache invalidation. Verified on a throwaway
> Postgres + Stripe **test** mode + Upstash Redis: full checkout **12/12**
> ($16.12 driver credit; duplicate credit → 0 rows), backfill-no-loss **5/5**,
> two-instance coherence **9/9**, `npm test` green. Not yet deployed; production
> stays single-instance until `APP_INSTANCE_COUNT>1` is set with `REDIS_URL`.

## Verdict

**Ready for a single-campus pilot, and now horizontally scalable (2026-07-18).**
The two original ceilings are cleared: state no longer lives in one process
(rate limits, socket fan-out, and per-entity caches are shared through Redis, and
`APP_INSTANCE_COUNT > 1` is allowed with `REDIS_URL` set), and the dataset no
longer lives in one database row (every high-write entity is its own indexed
table). What remains is capacity work (read replica, object storage for photos,
off the pausing DB tier) — Stage 4 below — not rearchitecture. Run a single
instance for the pilot; scale out when load calls for it.

## Measured ceiling (near-empty dataset, isolated instance)

| Path | Throughput | p50 | p95 | p99 |
| --- | --- | --- | --- | --- |
| `GET /api/auth/me` (session read) | ~3,300 req/s | 10ms | 25ms | 31ms |
| `GET /api/rides` (marketplace read) | ~1,000 req/s | 32ms | 84ms | 103ms |
| `PUT /api/profile/preferences` (write) | ~900 req/s | 40ms | 69ms | 94ms |

0 errors under concurrency 40. **These are best-case numbers on an empty DB.**
Two app-layer costs grow linearly with total data, so they degrade as LinkUp
fills up — that is the whole point of the roadmap.

### Measured ceiling at volume (`npm run agent:ceiling`)

The same single write (`PUT /api/profile/preferences`) run against a seeded
database proves the write cost scales with total data — because every write
re-serializes the whole blob:

| Seeded users | Blob size | Write p50 | Write p95 |
| --- | --- | --- | --- |
| 0 | ~0 MB | 4 ms | 19 ms |
| 5,000 | ~2.4 MB | 56 ms (14×) | 581 ms |
| 20,000 | ~9.6 MB | 245 ms (60×) | 1,108 ms |

**Read this plainly:** at 20k users, a trivial preference toggle takes a quarter
second at the median and over a second at p95 — and it gets worse linearly from
there. This is the ceiling, quantified. It is the objective trigger for each
storage-migration slice: when p50 for the hot writes approaches ~100ms at your
real volume, migrate the next entity. Removing the highest-frequency writes from
the blob (tracking, done) buys the most headroom per slice.

## The three ceilings

1. **Single instance only. — RESOLVED (Stage 3, 2026-07-18).** Rate limiters,
   the socket.io adapter, and the per-entity caches were all process-local. They
   are now shared through Redis (shared rate limiter, Socket.IO Redis adapter,
   and cross-instance cache invalidation), so `APP_INSTANCE_COUNT > 1` is allowed
   when `REDIS_URL` is set. Without Redis the guard still refuses a cluster.

2. **Whole-database-in-one-row storage.** The entire dataset is a single JSON
   blob in `linkup_state`. Every write deep-clones the whole object
   (`JSON.parse(JSON.stringify(db))`), serializes it, and writes the whole row —
   and all writes are serialized through one promise chain, so they cannot run
   in parallel. Every read re-normalizes the whole blob (`normalizeDbShape` runs
   `uniqueById` over all rides/requests/users and rebuilds every user object).
   Cost per write ≈ O(total data); cost per read ≈ O(users + rides). At a few
   thousand active users — especially with live-trip GPS writes — this is the
   wall.

3. **Free-tier database.** `DATABASE_POOL_MAX=5`; Supabase free can pause (a
   keepalive workflow exists solely to prevent that). Fine for a pilot, unfit
   for real traffic.

What already protects you: graceful degradation is in place — `/ready` returns
503 on DB failure so a proxy stops routing, and the branded maintenance page
serves during outages. Sessions are already in Postgres (they scale). Assets are
cache-busted and maps load on demand.

## Staged roadmap

### Stage 1 — Pilot hardening (now → first campus)
No rearchitecture. Low-risk wins:
- Move the database off the pausing free tier to a small always-on Postgres;
  raise `DATABASE_POOL_MAX` to the provider's safe limit.
- Put a CDN / cache in front of static assets (`public/`), long-TTL with the
  existing cache-busting query strings.
- Add uptime + error monitoring (no code rearchitecture; biggest risk reduction
  per hour).
- **Safe app-layer win (needs a focused change + test):** stop re-normalizing on
  every read. `dbCache` is already normalized after load and after each save, so
  `loadDb()` re-running `normalizeDbShape` on every request is redundant O(data)
  work. Returning the cached object (with copy-on-write discipline in handlers)
  removes the largest read-path cost. Treat as its own reviewed change, not a
  blind edit — several hundred handlers read this path.

### Stage 2 — Storage migration (before multi-campus)
The unavoidable one. Move from the single JSON blob to real relational tables
(`users`, `rides`, `ride_requests`, `payments`, `messages`, `tracking_trips`,
`wallet_transactions`) with indexes on the hot lookups (user id, ride id,
university, status). Reads and writes then touch only the rows they need instead
of the whole dataset, and writes parallelize. Do it behind the existing storage
seam incrementally — one entity at a time, dual-read during cutover — so it never
becomes a big-bang rewrite. This is the single highest-leverage scaling project.

**Progress — tracking trips + chat messages migrated (2026-07-17/18).** The two
highest-write entities are out of the blob:

- **Tracking trips** → `linkup_tracking_trips` (one row per trip). A location
  ping — the most frequent write — now persists a single row.
- **Chat messages** (ride, social, club) → `linkup_messages` (one row per
  message, append-only). Each send inserts one row instead of rewriting the DB.
- **Ride requests** → `linkup_ride_requests` (upsert by id). Posting, offering,
  expiring, and moderating a request touches one row, not the whole blob.
- **Payments, wallet transactions, checkout sessions** → `linkup_payments`,
  `linkup_wallet_transactions`, `linkup_checkout_sessions` (via a generic
  `makeCollectionStore` factory; one indexed row per record). The checkout flow,
  wallet-balance/idempotency reads, and the `reconcile`/`metrics` scripts all read
  from the new tables. **Verified end-to-end on real Postgres with a full
  Stripe-test checkout:** created a paid ride, confirmed a test PaymentIntent,
  completed checkout — the payment, the driver's $16.12 wallet credit (correct net
  of Stripe fee + 15% commission), and the paid checkout session all landed in
  their own tables; the main blob held zero of them; and `npm run reconcile`
  confirmed the ledger agrees with Stripe. (Also fixed a pre-existing
  production-breaking bug: Stripe no longer accepts `statement_descriptor` on card
  PaymentIntents — switched to `statement_descriptor_suffix`.)

Both use an in-memory working set with per-row Postgres persistence (a dedicated
JSON file in dev), reads no longer re-normalize them on every request, and
existing deployments migrate out of the blob automatically on first boot
(one-time backfill). **Verified against real Postgres** — booted an isolated
instance on a throwaway Supabase database and confirmed: schema creates, backfill
moves legacy records into the new tables, a live ride-chat send and a live
tracking session land in their own tables, and the main blob carries zero of
either. File-mode QA agent (19 checks) green throughout.

- **Rides** → `linkup_rides` (upsert by id). Create, join/reserve, rating,
  completion, admin removal, and checkout seat-reservation each persist one ride
  row. **Verified on real Postgres** (create + join persist a passenger row;
  blob clean) and via a full Stripe-test checkout that reserves a seat.
- **Users** → `linkup_users` (id PK, indexed email). Because users are mutated
  in ~100 places that all relied on `saveDb`, `saveDb` now persists any user whose
  change-signature differs since its last write — exactly replicating "user edits
  persist on save" so no call site can be missed. The signature excludes the
  inline profile photo (compared by length+prefix) to keep the per-save scan
  cheap. **Verified on real Postgres:** signup, email-verification, profile, and
  account-deletion tombstone all persist to individual rows; blob clean; 33 users
  backfilled. Member/admin numbers stay stable (store loads ordered by createdAt).

## Stage 2 — COMPLETE (2026-07-18)

Every high-write / unbounded-growth entity now lives in its own indexed table:
`linkup_users`, `linkup_rides`, `linkup_ride_requests`, `linkup_messages`,
`linkup_payments`, `linkup_wallet_transactions`, `linkup_checkout_sessions`,
`linkup_tracking_trips`. The main `linkup_state` blob now holds only small,
low-frequency collections (carts, follows, connections, campus groups, waitlist
leads, admin audit log, reset tokens). A production write now touches the one row
it changed instead of re-serializing the whole database, and existing deployments
migrate automatically on first boot. All slices were verified on a real throwaway
Supabase Postgres (a full Stripe-test checkout confirmed money correctness and
`npm run reconcile` agreement).

**Known cost to optimize next:** the user change-detection scans all users per
`saveDb` (a cheap photo-excluded stringify, no DB write unless changed). Fine to
low-thousands of users; beyond that, move profile photos to S3 (already planned)
and/or switch to explicit dirty-tracking. In dev/file mode the per-entity stores
rewrite their whole JSON file on change — harmless for dev, irrelevant to the
Postgres per-row production path.

## Stage 3 — COMPLETE (2026-07-18): horizontally scalable

All three shared-state pieces are done and **verified against real Postgres +
Redis (Upstash) with two live instances**. The `APP_INSTANCE_COUNT=1` guard is
lifted: with `REDIS_URL` set, the app runs safely on N instances.

- **Shared rate limiting.** When `REDIS_URL` is set, `makeRateLimiter` uses a
  Redis fixed-window counter; a Redis hiccup falls back to per-instance in-memory
  limiting (Redis being down never takes the app down). *Verified:* two instances
  behind one Redis enforced one combined limit — the 429 fired at request #21
  across both (per-instance limiting would never trigger in 30).
- **Socket.IO Redis adapter.** With `REDIS_URL`, chat/live-trip events fan out
  across instances via a Redis pub/sub pair (dedicated clients; the rate-limiter
  client stays fail-fast). Both instances boot with the adapter connected.
- **Cross-instance cache invalidation — DONE + verified (2026-07-18).** Each
  instance still caches entities in memory (fast reads), but every committed
  write now publishes a small `{from, kind, key}` message on the Redis channel
  `linkup:invalidate`; a dedicated subscriber on the *other* instances runs the
  registered reload handler, which re-reads that one row (or the small blob) from
  Postgres. Messages carry the origin instance id so a publisher ignores its own.
  Publishes are chained **after** the DB commit so a peer can never reload a
  pre-commit value. Covers every store — `linkup_users`, `linkup_rides`,
  `linkup_ride_requests`, `linkup_messages`, `linkup_tracking_trips`,
  `linkup_payments`, `linkup_wallet_transactions`, `linkup_checkout_sessions`,
  and the `linkup_state` blob. Redis-less / file-mode installs no-op it (single
  instance). *Verified with two live instances (ports 4195/4196) against the test
  Postgres + Upstash Redis:* a user, a ride, and a chat message created on
  instance A all became visible on instance B within ~1–2 polls (≈300–600ms),
  and a profile edit on B propagated back to A — the exact flows that previously
  returned `404 User not found` on B.
- **DB-enforced money idempotency — DONE + verified (2026-07-18).** Wallet
  debit/credit rows carry a `dedupeKey` and `linkup_wallet_transactions` has a
  partial `UNIQUE` index on it, so the database itself rejects a duplicate
  (`INSERT ... ON CONFLICT (dedupe_key) WHERE dedupe_key <> '' DO NOTHING`).
  Verified on real Postgres: a duplicate credit with the same key inserts 0 rows
  and the count stays 1. A double-credit is impossible even if two instances race
  the same checkout — money correctness does **not** depend on cache freshness.
- Sessions are already in Postgres (shared).

**The `APP_INSTANCE_COUNT` guard now permits N instances when `REDIS_URL` is set**
(without Redis it still refuses a cluster, since process-local caches would
desync). A second guard refuses a cluster whose total Postgres connection budget
(`APP_INSTANCE_COUNT × DATABASE_POOL_MAX`) exceeds a safe ceiling (90) — size the
pool down before scaling instances up. To run a cluster: set `REDIS_URL`, set
`APP_INSTANCE_COUNT` to the instance count (and `DATABASE_POOL_MAX` so the product
fits your database), then run PM2 cluster mode or multiple machines behind a load
balancer.

**Still recommended before heavy scale (optimizations, not blockers):** move
inline profile photos to S3 (biggest user-row payload), switch the user
change-detection to explicit dirty-tracking, and add a Postgres read replica for
the read-heavy marketplace.

### Stage 4 — Regional scale (next, after horizontal scale)
Horizontal scale (Stage 3) is done; the remaining scale work is capacity, not
architecture:
- Add a Postgres **read replica** for the read-heavy marketplace and point read
  paths at it.
- Move inline profile photos to **S3/object storage** (biggest user-row payload)
  and serve via CDN.
- Load-balance across instances (no sticky sessions needed — sessions and socket
  fan-out are both shared), and autoscale on CPU/latency.

## Rule of thumb

Externalize state **before** scaling out; migrate storage **before**
multi-campus; move off the pausing DB tier **before** any real marketing push.
Re-run `npm run agent:perf` (ideally with seeded data) at each stage and record
the numbers here and in the living audit.
