# LinkUp Deployment Setup

## Current Deployable Stack

This version is ready for a single Node.js web service backed by PostgreSQL:

- Railway, Render, Fly.io, or a VPS for Node.js
- Managed PostgreSQL database
- Stripe for payments and Connect onboarding
- Google Maps Platform
- SMTP email provider

When `DATABASE_URL` is set, LinkUp stores app data in PostgreSQL and stores login sessions in PostgreSQL. Local development can still run from `data/db.json` when `DATABASE_URL` is blank.

## Required Environment Variables

Set these on the host. Do not commit real values.

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=replace_with_a_64_byte_random_hex_string
ADMIN_EMAILS=founder@university.edu,ops@university.edu

DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_SSL=true

APP_BASE_URL=https://linkuprides.com
CORS_ORIGIN=https://linkuprides.com

GOOGLE_MAPS_API_KEY=your_google_maps_key

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-linkup-email@gmail.com
SMTP_PASS=your_email_app_password
EMAIL_FROM="LinkUp <your-linkup-email@gmail.com>"

REQUIRED_TERMS_VERSION=v2026.05.8
REQUIRED_PRIVACY_VERSION=v2026.05.8
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Database Setup

Use one of these:

- Render PostgreSQL if the app is hosted on Render
- Railway PostgreSQL if the app is hosted on Railway
- Neon PostgreSQL if you want a separate managed database

Copy the database connection string into `DATABASE_URL`.

The server creates these tables automatically when it starts:

- `linkup_state`
- `linkup_sessions`

If you already have local data in `data/db.json`, the first PostgreSQL startup seeds the database from that file only when `linkup_state` is empty.

## Render Setup

1. Create a PostgreSQL database in Render.
2. Create a Web Service from the GitHub repo.
3. Set:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add the database internal connection string as `DATABASE_URL`.
5. Set `DATABASE_SSL=true`.
6. Add the rest of the environment variables above.
7. Add the custom domain `linkuprides.com`.

## Railway Setup

1. Create a Railway project from the GitHub repo.
2. Add a PostgreSQL service.
3. Add the LinkUp app as a Node service.
4. Set the app service `DATABASE_URL` from the PostgreSQL service connection URL.
5. Set `DATABASE_SSL=true` unless Railway gives an internal URL that does not require SSL.
6. Add the rest of the environment variables above.
7. Add the custom domain `linkuprides.com`.

## Custom Domain

When `linkuprides.com` points to the host, set:

```env
APP_BASE_URL=https://linkuprides.com
CORS_ORIGIN=https://linkuprides.com
```

For local development keep:

```env
APP_BASE_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:4000
```

## Payment Provider Setup

LinkUp keeps payment and payout provider choice behind environment variables so Stripe can be replaced later without changing the rest of the ride workflow:

```env
PAYMENT_PROVIDER=stripe
PAYOUT_PROVIDER=stripe
```

Stripe is the only implemented provider today. New providers should keep the same app-level records: checkout sessions use `provider`, `providerPaymentId`, and `providerSessionId`; completed payments use the same provider fields plus any provider-specific legacy ids needed for migration. Payout onboarding should use the app route `/api/profile/payout/onboarding`, and payout status refresh should use `/api/profile/payout/status`.

## Stripe Setup

In Stripe Dashboard:

1. Use live keys only when you are ready for real payments.
2. Add a webhook endpoint:

```txt
https://linkuprides.com/api/stripe/webhook
```

The provider-neutral alias is also supported:

```txt
https://linkuprides.com/api/payments/webhook/stripe
```

3. Select these events:
   - `payment_intent.succeeded`
   - `account.updated`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

The webhook finalizes paid reservations if the browser return flow fails, and it updates Stripe Connect payout status when accounts change.

## Google Maps Setup

Enable:

- Maps JavaScript API
- Places API
- Directions API
- Distance Matrix API
- Geocoding API

Restrict the browser key to:

```txt
https://linkuprides.com/*
```

Also add localhost during development:

```txt
http://localhost:4000/*
```

## Production Checklist

- [ ] PostgreSQL database is created.
- [ ] `DATABASE_URL` is set.
- [ ] `DATABASE_SSL=true` is set for hosted PostgreSQL.
- [ ] `NODE_ENV=production`.
- [ ] `SESSION_SECRET` is long and random.
- [ ] `APP_BASE_URL` and `CORS_ORIGIN` use the public HTTPS domain.
- [ ] Stripe live keys are set.
- [ ] Stripe webhook endpoint is registered.
- [ ] Google Maps key is restricted.
- [ ] SMTP settings work.
- [ ] PostgreSQL backup plan exists.

## Not Yet Included

These are the next upgrades before a larger public launch:

- Fully relational PostgreSQL tables for users, rides, carts, messages, and payments
- Object storage for profile pictures instead of data URLs
- Admin tools for reports, refunds, and payout operations
