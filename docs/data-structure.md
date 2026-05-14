# LinkUp data structure

LinkUp currently uses `data/db.json` for local development only. The app normalizes this file into a versioned shape at load/save time so old local records do not break new code.

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

- `users`: account, university, policy consent, profile, Stripe customer, and payout summary fields.
- `rides`: driver-created ride listings, passengers, seat availability, route, price, and restrictions.
- `rideRequests`: rider-created requests and driver offers.
- `carts`: keyed by user id, each value is an array of `{ rideId, seatId, termsAcceptedAt }`.
- `checkoutSessions`: temporary checkout reservation records keyed by Stripe PaymentIntent or legacy Checkout Session id.
- `payments`: completed payment records after Stripe verification and seat reservation.
- `trackingTrips`: live trip sharing sessions with location snapshots.
- `rideMessages`: keyed by ride id, each value is an array of chat messages.
- `userReports`: user-submitted reports tied to a ride.
- `userBlocks`: block relationships between users.
- `passwordResetTokens`: hashed reset tokens with expiration.

For production, move these collections to a managed database such as PostgreSQL before real users.
