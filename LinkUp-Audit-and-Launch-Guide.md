# LinkUp — Full Code Audit & Pre-Launch Guide

---

## Part 1 — Function-by-Function Audit

### Auth System ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| `checkAuth()` | ✅ | Correctly hits `/api/auth/me` and routes between dashboard/auth/legal pages |
| Sign-in form submit | ✅ | Calls `/api/auth/signin`, handles errors, triggers transition |
| Sign-up form submit | ✅ | Triggers email verification flow correctly |
| `validatePasswordRequirements()` | ✅ | Regex checks all 4 rules; DOM updates live on input |
| Email verification flow | ✅ | Sends 6-digit code, 10-min expiry (server-side), resend works |
| Account recovery (username/password) | ✅ | Routes to `recovery-form`, two buttons properly separated |
| Password reset token flow | ✅ | Reads `?resetToken=` from URL on load, shows reset form |
| `showVerificationForm()` | ✅ | Correctly stores `pendingVerificationEmail`, clears old messages |
| Sign-out | ✅ | Stops active tracking before calling `/api/auth/signout` |
| `publicUser()` server function | ✅ | Properly strips sensitive fields before sending to client |
| `bcryptjs` password hashing | ✅ | Used on signup and compared on signin |
| Session config | ✅ | `httpOnly`, `sameSite: lax`, `secure` in production, 7-day expiry |

**Bug found:** The `#signup-form > button[type="submit"]` uses a secondary surface style while `#signin-form > button[type="submit"]` gets the accent gradient. This creates a confusing hierarchy — new users hit the muted button. **Fix:** Give both the same primary gradient styling or flip so Sign Up gets the more prominent style.

---

### Dashboard & Navigation ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| `showDashboard(user)` | ✅ | Correctly gates on `serviceApproved`, `requiresPolicyConsent`, `requiresRequiredSettings` |
| `restoreAppRoute()` | ✅ | All routes wired: cart, payment, profile tabs, browse, legal, tracking |
| `showDashboardHome()` | ✅ | Waitlist check is correct; redirects properly |
| `returnToBrowseRides()` | ✅ | Correctly restores `browseRole` after sub-page navigation |
| Hash routing (`#home`, `#cart`, etc.) | ✅ | `getAppRoute()` / `setAppRoute()` / `clearAppRoute()` consistent |
| Sticky dashboard header | ✅ | CSS `position: sticky; top: 0; z-index: 100` is correct |
| Logo click (home nav) | ✅ | Keyboard accessible (`Enter`/`Space`) and role="button" set |
| `ensureServiceAccess()` | ✅ | Three-layer guard: approval, policy consent, required settings |
| `hideDashboardPages()` | ✅ | Covers all pages — no visibility leaks found |
| Legal page back navigation | ✅ | `legalReturnRoute` correctly captures pre-legal route |

---

### Ride Browsing & Filtering ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| Driver/Rider role toggle | ✅ | `browseRole` state managed, maps/filters switch correctly |
| `refreshActiveBrowse()` | ✅ | Debounce on filter inputs prevents excessive API calls |
| Radius circle drawing | ✅ | `drawRadiusCircle()` handles both pickup/dropoff, null-safe |
| `clearBrowseResultMarkers()` | ✅ | Correctly removes all polylines, origin markers, and labels |
| Ride card rendering | ✅ | XSS-safe via `esc()` helper throughout |
| Sort/filter controls | ✅ | Date, seats, price, school/gender filters wire to API params |
| Map pin → card scroll | ✅ | `map-pin-flash` animation works via `scrollIntoView` |
| Leaderboard loading | ✅ | Loads school + mileage data separately, renders bar charts |
| `distanceBetweenCoordinates()` | ✅ | Haversine formula correct, matches server-side implementation |

**Issue:** Same Haversine formula is duplicated in both `app.js` and `server.js`. Not a bug, but a maintenance risk — if you fix it in one place you must remember to fix both. Consider making this an API endpoint result only.

---

### Seat Selection ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| `createSeatLayout()` | ✅ | Correctly renders driver vs. rider modes with right seat IDs |
| `getVehicleSeatIds()` | ✅ | Layout map (2/4/5/6/7 seats) matches server `VEHICLE_SEAT_LAYOUTS` |
| `getSeatLayoutCountForRide()` | ✅ | Infers seat count from `seatMap` when `vehicleSeatCount` missing |
| Reserved seat blocking | ✅ | `state.reserved` → disabled; `!state.available` → disabled |
| Driver seat toggle | ✅ | `driverAvailableSeatIds` set managed correctly; re-renders on click |
| `selectedSeatByRide` map | ✅ | Persists seat choice across card re-renders |

---

### Cart & Checkout ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| Add to cart (`POST /api/cart/:rideId`) | ✅ | Requires `termsAccepted: true` enforced server-side |
| Overlap detection | ✅ | `intervalsOverlap()` used both client and server-side for cart conflicts |
| Cart count badge | ✅ | `loadCart()` updates `cartRideIds` Set and renders count |
| Remove from cart | ✅ | `DELETE /api/cart/:rideId` wired correctly |
| `checkoutCartButton` | ✅ | Guards on empty cart before proceeding |
| Stripe session flow | ✅ | Creates session UUID server-side, redirects to completion URL |
| `completeStripeCheckout()` | ✅ | Handles already-paid sessions gracefully (`'Payment already completed.'`) |
| Checkout cancel | ✅ | `?checkout=cancel` shows cart with error message, clears URL |

**Architecture note:** The checkout is currently a simulated flow (no real Stripe SDK calls — it creates a local UUID and redirects to your own URL). This is fine for development/testing but needs real Stripe integration before launch. See Part 3.

---

### Live Tracking ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| `startTripTracking()` | ✅ | Uses `navigator.geolocation.watchPosition`, stores `trackingWatchId` |
| `stopTripTracking()` | ✅ | Clears `watchId`, calls `DELETE /api/track/:tripId` |
| `copyTrackingLink()` | ✅ | Uses `navigator.clipboard.writeText` with fallback |
| `loadSharedTrackingPage()` | ✅ | Polling loop with `sharedTrackingPollId` for viewer side |
| Tracking map init | ✅ | Custom dark `UBER_MAP_STYLES` consistent with app theme |
| Car icon marker | ✅ | SVG-based, anchored correctly at center `(18,18)` |
| Sign-out tracking stop | ✅ | `stopTripTracking()` awaited before signout API call |

---

### Messaging / Chat ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| `loadChatPage()` | ✅ | Filters rides where user is driver or passenger |
| `loadChatConversation()` | ✅ | Fetches messages for selected ride, scrolls to bottom |
| Chat disabled state | ✅ | `isRideChatDisabled()` — 24h post-trip end, enforced server-side |
| XSS protection | ✅ | All message content rendered via `esc()` not `.innerHTML` |
| `canUserAccessRideChat()` | ✅ | Server confirms driver or passenger before returning messages |

---

### Profile & Settings ✅ Working Correctly

| Function | Status | Notes |
|---|---|---|
| `fillProfileForm(user)` | ✅ | Birthday and gender correctly locked after first save |
| `fillDriverPayoutForm()` | ✅ | Masked values displayed; commission rate shown (`15%`) |
| `fillDefaultPaymentForm()` | ✅ | Payment method summary with masked card number |
| Policy consent flow | ✅ | Requires scroll-to-bottom before agree button enables |
| `fillPolicyConsentForm()` | ✅ | Correctly gates on `requiredTermsVersion`/`requiredPrivacyVersion` match |
| Release notes tab | ✅ | Newest-first feed with version tags |
| `getRequiredSettingsTab()` | ✅ | Routes to correct profile tab based on missing fields |

---

### Server-Side ✅ Working Correctly

| Area | Status | Notes |
|---|---|---|
| Rate limiting | ✅ | Custom sliding-window per-IP+route limiter, cleans up expired entries |
| Security headers | ✅ | CSP, X-Frame-Options, HSTS (prod), Permissions-Policy all set |
| `saveDb()` with temp file | ✅ | Atomic write via temp → rename prevents corruption |
| Email outbox fallback | ✅ | Saves to JSON file if SMTP not configured — good for dev |
| `normalizeUserAccess()` | ✅ | Upgrades waitlisted users to approved when domain added to allowlist |
| `expireUnclaimedRideRequests()` | ✅ | Auto-expires stale open requests on every profile load |
| `requireAuth` + `requireServiceAccess` | ✅ | Middleware chain correct on all protected routes |
| `CORS_ORIGIN` env support | ✅ | Configurable via comma-separated env var |
| `GOOGLE_MAPS_API_KEY` injection | ✅ | Served to client via `/api/maps-key` endpoint, not hardcoded in HTML |
| JSON body limit | ✅ | `100kb` cap on `express.json()` |
| `x-powered-by` disabled | ✅ | `app.disable('x-powered-by')` present |

---

### Issues Found

#### 🔴 Critical (Must fix before launch)

1. **No real Stripe integration.** The checkout flow creates a local UUID session and redirects to `/?checkout=success&session_id=<uuid>`. No actual money moves. You must integrate `stripe.checkout.sessions.create()` and verify webhook events before taking real payments.

2. **db.json is a flat file.** Your database is a single JSON file written synchronously. This will corrupt under concurrent writes at any meaningful load. Before launch, migrate to SQLite (easy) or PostgreSQL/MySQL (production-grade).

3. **Session secret must be set in prod.** The server already crashes if `SESSION_SECRET` is missing — good. But make sure it's a cryptographically random 64+ character string in production, not a short memorable phrase.

4. **SMTP not configured = silent email failure.** Verification codes, password resets, and tracking links fall back to the local outbox file. If this file is on an ephemeral container filesystem, emails are lost. Configure SMTP before launch.

#### 🟡 Important (Fix before public users)

5. **No minimum password length.** `validatePassword()` on both client and server checks for character classes but not length. A password like `A1!a` passes. Add `password.length >= 8` (recommend 12).

6. **Geolocation error handling.** `startTripTracking()` starts `watchPosition` but the error callback only logs to console. If a user denies location permissions, the UI shows no feedback. Add a visible error state.

7. **`component restricted to 'us'` in autocomplete.** Both `originAutocomplete` and `requestOriginAutocomplete` set `componentRestrictions: { country: 'us' }` but `server.js` has Canadian universities (e.g., Waterloo `uwaterloo.ca`). Canadian users will have a broken experience trying to enter Canadian addresses.

8. **No CSRF protection.** Session cookies + same-site lax provides some protection, but for financial operations (checkout, payout info), add CSRF tokens or double-submit cookie pattern.

9. **`db.json` path hardcoded.** If you deploy to a read-only filesystem (common on PaaS), writes will fail silently. Use an environment variable for the DB path.

#### 🟢 Minor (Polish before launch)

10. **Sign-up button styling.** The "Create Account" button uses the secondary surface style while "Let's Ride" (sign-in) gets the accent gradient. New users see the less prominent button. Swap so the primary action on each form gets the accent treatment.

11. **Duplicate Haversine formula.** Both `app.js` (client) and `server.js` independently implement the distance calculation. The server version is authoritative — the client one is only for display. Add a comment to clarify, and if they ever diverge you'll have distance inconsistencies.

12. **`setTimeout` with 100ms in `showListRidePage`.** The map init is delayed with a hardcoded `setTimeout(100)`. This is a race condition — on slow devices the function may run before the DOM is ready. Use a proper `MutationObserver` or check `originMapDiv.offsetParent !== null`.

13. **No `aria-live` on ride list updates.** When ride search results update, screen readers get no announcement. Add `aria-live="polite"` to `#rides-list`.

14. **CSP missing `stripe.com`.** If you add real Stripe, you'll need to add `https://js.stripe.com` to `script-src` and `https://api.stripe.com` to `connect-src`.

---

## Part 2 — UI/UX Improvements Applied

The following changes have been made to your files:

### `styles.css` Changes
- **Loading spinner** — Added `.btn-loading` class that shows a spinning indicator on any button without disrupting layout
- **Skeleton screens** — Added `.skeleton-card` and `.skeleton-line` classes for use while API data loads
- **Toast notification system** — Full toast component (`#toast-container`, `.toast`, `.toast-success/.error/.info`) with auto-dismiss and click-to-dismiss. Positioned bottom-right, accessible via `aria-live`
- **Input validation states** — Valid inputs get a subtle green border tint; invalid (unfocused) get red
- **Improved focus rings** — All focusable elements now use `--focus-ring` token for consistent keyboard navigation visibility
- **Skip to content link** — `.skip-link` added for keyboard/screen reader users
- **Mobile touch targets** — All buttons and inputs minimum 44px tall on screens ≤540px
- **iOS zoom prevention** — `font-size: 16px` on inputs prevents unwanted zoom on focus in Safari
- **Responsive top-row** — Stacks vertically on mobile instead of overflowing

### `app.js` Changes
- **`showToast(message, type, duration)`** — Global toast function wired to `#toast-container`
- **`setButtonLoading(button, loading)`** — Adds/removes loading spinner from any button and disables it during async operations

### `index.html` Changes
- **`id="main-content"` on `<main>`** — Target for skip link
- **Skip link added** — `<a href="#main-content" class="skip-link">Skip to content</a>`
- **Toast container added** — `<div id="toast-container" role="status" aria-live="polite">` with correct ARIA

---

## Part 3 — Pre-Launch Checklist

### 🔴 Week Before Launch

```
[ ] Integrate real Stripe
    - npm install stripe
    - stripe.checkout.sessions.create() in /api/cart/create-checkout-session
    - Add Stripe webhook endpoint to verify payment_intent.succeeded
    - Update CSP to allow stripe.com scripts and API calls
    - Test with Stripe test cards (4242 4242 4242 4242)

[ ] Replace db.json with a real database
    Option A (easiest): better-sqlite3
      npm install better-sqlite3
      Migrate users, rides, carts to SQLite tables
      Wrap writes in transactions for atomicity
    Option B (production): PostgreSQL via Supabase or Railway
      npm install pg
      Use connection pooling (pg-pool)

[ ] Configure SMTP
    - Recommended: Resend (resend.com) or Postmark
    - Set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT in .env
    - Test email delivery end-to-end
    - Set EMAIL_FROM to a real verified address

[ ] Add minimum password length (8+ chars) to validatePassword() in server.js
    and validatePasswordRequirements() in app.js

[ ] Set strong SESSION_SECRET in production
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 🟡 1-2 Weeks Before Launch

```
[ ] Domain & hosting
    - Register linkup.app or your target domain
    - Recommended host: Railway, Render, or Fly.io (Node.js-native)
    - Point DNS to your host, enable SSL (auto on most PaaS)
    - Set NODE_ENV=production, APP_BASE_URL=https://yourdomain.com

[ ] Google Maps API key lockdown
    - In Google Cloud Console, restrict your API key to:
      - HTTP referrers: yourdomain.com/*
      - APIs: Maps JavaScript API, Places API, Distance Matrix API, Directions API
    - Set a daily quota limit to prevent runaway billing

[ ] Environment variables (all required for production)
    SESSION_SECRET=<64-char random hex>
    NODE_ENV=production
    PORT=4000
    APP_BASE_URL=https://yourdomain.com
    GOOGLE_MAPS_API_KEY=<your key>
    SMTP_HOST=smtp.resend.com
    SMTP_PORT=587
    SMTP_USER=resend
    SMTP_PASS=<your key>
    EMAIL_FROM=LinkUp <no-reply@yourdomain.com>
    STRIPE_SECRET_KEY=sk_live_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    CORS_ORIGIN=https://yourdomain.com

[ ] Fix Canadian address autocomplete
    - Change componentRestrictions to accept ['us', 'ca']
    - Or make it configurable per university domain

[ ] Add CSRF protection to financial routes
    - npm install csurf (or implement double-submit cookie)
    - Apply to: /api/cart/create-checkout-session, /api/profile/payout, /api/profile/payment-method

[ ] Geolocation error UX
    - Show user-visible error message when navigator.geolocation is denied
    - Check geolocationPermission state on page load
```

### 🟢 Launch Week

```
[ ] Load testing
    - Test with 50+ concurrent users using Artillery or k6
    - This will expose db.json write contention issues before real users do

[ ] Error monitoring
    - npm install @sentry/node
    - Wrap server routes with Sentry error capture
    - Add Sentry browser SDK for client-side errors

[ ] Analytics
    - Add Plausible or PostHog (privacy-friendly, no GDPR consent required)
    - Track: signups, ride bookings, checkout completions, page views

[ ] Uptime monitoring
    - BetterUptime or UptimeRobot — free tier is sufficient
    - Alert on /api/auth/me endpoint health

[ ] Backup strategy
    - If using SQLite: set up daily automated backup to S3 or Backblaze
    - If using Postgres on Railway/Supabase: enable automatic backups

[ ] Review Terms & Privacy versions
    - Confirm REQUIRED_TERMS_VERSION and REQUIRED_PRIVACY_VERSION in .env
      match the actual policy documents in your HTML
    - Any policy change will force all users to re-accept

[ ] University domain approval
    - Currently only 6 domains in SUPPORTED_UNIVERSITY_DOMAINS trigger auto-approval
    - All others go to waitlist
    - Decide your launch school(s) and confirm the domain is in the list
```

### 🚀 Post-Launch (Month 1)

```
[ ] Driver verification
    - Currently no ID or license verification before a driver can list rides
    - Consider integrating Stripe Identity for ID verification on drivers

[ ] Insurance notice
    - Add a driver onboarding step that explicitly asks them to confirm
      their personal auto insurance covers ride-sharing

[ ] Push notifications
    - When a passenger books a seat, notify the driver
    - When a driver accepts a request, notify the rider
    - Use web-push or a service like OneSignal

[ ] Rate your driver
    - The rating system data model exists (driverRatingAverage, driverRatingCount)
    - The frontend rating UI needs to be verified end-to-end after a completed trip

[ ] Ride request matching
    - The "request a ride" feature creates rideRequests
    - Driver offers (driverOffers) need UI to notify riders when a driver responds
    - Verify this complete loop works with a real test
```

---

## Part 4 — Recommended Tech Stack for Launch

| Layer | Current | Recommended for Launch |
|---|---|---|
| Database | `db.json` flat file | **SQLite** (via better-sqlite3) for solo dev; **PostgreSQL** for team |
| Payments | Simulated UUID sessions | **Stripe Checkout** (real sessions + webhooks) |
| Email | SMTP/outbox fallback | **Resend** (resend.com) — simple API, generous free tier |
| Hosting | Local / undefined | **Railway** or **Render** — Node.js-native, free SSL |
| Error tracking | Console logs | **Sentry** — free tier sufficient |
| Analytics | None | **Plausible** — $9/mo, privacy-friendly |
| Maps | Google Maps | Keep as-is — already well integrated |
| Session store | In-memory (express-session default) | **connect-sqlite3** or **connect-pg-simple** — survives restarts |

---

## Summary

Your app is architecturally solid and well-organized. The auth system, navigation, seat selection, filtering, and tracking all function correctly. The code is consistently XSS-safe, uses good security headers, and has thoughtful UX details like the ride transition animation, dark map theme, and policy consent gating.

The main gaps are infrastructure-level — the flat-file database and simulated Stripe are fine for testing but not for real users and real money. Address those two items first, then the SMTP and session store, and you'll have a genuinely launchable product.
