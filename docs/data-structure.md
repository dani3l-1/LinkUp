# LinkUp data structure

LinkUp uses the same normalized application state shape in local JSON development and PostgreSQL deployment.

- Local development without `DATABASE_URL`: data is stored in `data/db.json`.
- Production with `DATABASE_URL`: data is stored in PostgreSQL table `linkup_state`, row `state_key = 'main'`, column `data` as `jsonb`.
- PostgreSQL sessions are stored separately in `linkup_sessions`.

This keeps the current app stable while moving persistence to PostgreSQL. A future larger migration can split these collections into fully relational tables.

## Root shape

```json
{
  "schemaVersion": 2,
  "meta": {
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  },
  "users": [],
  "rides": [],
  "rideRequests": [],
  "carts": {},
  "checkoutSessions": [],
  "payments": [],
  "trackingTrips": [],
  "rideMessages": {},
  "userReports": [],
  "userBlocks": [],
  "passwordResetTokens": []
}
```

## Collection notes

- `users`: account, university, policy consent, profile, provider customer ids, provider payout account summaries, and legacy Stripe migration fields.
- `rides`: driver-created ride listings, passengers, seat availability, route, price, and restrictions.
- `rideRequests`: rider-created requests and driver offers.
- `carts`: keyed by user id, each value is an array of `{ rideId, seatId, actualPickup, actualDropoff, termsAcceptedAt }`.
- `checkoutSessions`: temporary checkout reservation records keyed by provider payment id, with Stripe ids kept only as provider-specific migration fields.
- `payments`: completed payment records after provider verification and seat reservation. Records include `provider`, `providerPaymentId`, and optional provider-specific legacy ids.
- `rides.passengers`: reserved riders. Flexible-radius Personal Car rides may include `actualPickup` and `actualDropoff` so drivers can navigate to the rider's requested spots.
- `trackingTrips`: live trip sharing sessions with location snapshots.
- `rideMessages`: keyed by ride id, each value is an array of chat messages.
- `userReports`: user-submitted reports tied to a ride.
- `userBlocks`: block relationships between users.
- `passwordResetTokens`: hashed reset tokens with expiration.

## PostgreSQL tables

```sql
CREATE TABLE linkup_state (
  state_key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE linkup_sessions (
  sid TEXT PRIMARY KEY,
  sess JSONB NOT NULL,
  expires TIMESTAMPTZ NOT NULL
);
```

The server creates these tables automatically on startup when `DATABASE_URL` is set.
