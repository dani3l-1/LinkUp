# LinkUp Feature Guide

This document is the app-team reference for what LinkUp should support across web and future mobile clients. Keep product behavior, labels, emails, checkout, and safety flows aligned with this file.

---

## Product Principles

- LinkUp is for verified university students sharing rides within a trusted campus network.
- Ride services should stay unavailable until the user has completed required profile, policy, payment, or verification steps.
- Exact private information should be revealed only when the user has a legitimate reason to see it.
- Payment, payout, login, reservation, and trip-completion flows are launch-critical and must be covered by smoke checks before release.
- Use `ridewlinkup@gmail.com` as the support contact in user-facing support copy.

---

## Launch Readiness And Release Process

The app must pass launch-readiness checks before production deployment.

- Run `npm test` before pushing or deploying.
- GitHub Actions runs `npm test` on pushes to `main` and pull requests.
- `scripts/check-launch-readiness.js` checks:
  - JavaScript syntax for `server.js`, `public/app.js`, and `public/boot.js`
  - Static assets referenced by `public/index.html`
  - Cache-busted `app.js` and `boot.js` URLs
  - A real local auth smoke test: sign in, session cookie, `/api/auth/me`
- Production deployment steps live in `docs/production-deploy-runbook.md`.
- Do not use `npm run start:test` in production. It is only for local JSON-database testing.

---

## Auth And Account Access

**Primary screen:** `auth-section`

- Sign in with university email and password.
- Create account with first name, optional middle name, last name, birthday, gender, university email, and password.
- Password must include 8+ characters, uppercase, lowercase, number, and special character.
- Signup requires Terms and Conditions plus Privacy Notice acceptance.
- Email verification uses a 6-digit code with resend support.
- Forgot password sends reset instructions by email.
- Two-factor login challenge appears after password sign-in when 2FA is enabled.
- Admin email exceptions can bypass `.edu` requirements when listed in `ADMIN_EMAILS`.
- Login must never depend on stale cached JavaScript. Bump script `?v=` values when changing auth-critical frontend code.

---

## Dashboard Home

**Primary screen:** dashboard home inside `dashboard-mode`

- Quick actions: Browse Rides, Request a Ride, List a Ride, Your Rides, Leaderboard.
- Admin users see an admin entry point.
- Shows user greeting and core ride stats.
- Shows recent rides and active upcoming ride cards.
- Shows the interactive ride checklist for upcoming rider reservations.
- Trip tracking controls:
  - Start/stop live location sharing
  - Trusted contact email input
  - Copy/send tracking link
  - Live route/map preview

### Ride Checklist

The checklist is embedded on the dashboard, not a separate page.

Steps:

1. Find your ride — Browse open rides and reserve a seat.
2. Verify the driver — Confirm name, license plate, and car match.
3. Share live tracking — Optional. Send your live trip to a trusted contact.
4. Give the arrival code — Read the 6-digit code so your driver can complete the ride.
5. Rate the driver — Help the community by rating your driver.

Checklist progress should persist per ride.

---

## Browse Rides

**Primary screen:** `browse-page`

### Rider Mode

- Browse available driver listings.
- Filter by destination, pickup area/radius, drop-off area/radius, date, minimum seats, maximum price.
- Same-school-only and same-gender-driver filters.
- Sort by soonest departure, lowest price, highest price, and most seats.
- Sticky map panel showing matching ride areas and pins.
- Add ride to cart from listing card.
- Tap driver name to view public profile.
- Driver exact last name and sensitive details stay private until reservation.

### Driver Mode

- Browse open rider requests.
- Request cards show route, date/time, offered price, rider count, request type, and privacy-safe destination.
- Make an offer on a request.
- Post shared ride directly from a request card.
- Moving requests show cargo context and uploaded item photo.

---

## Request A Ride

**Primary screen:** `request-ride-page`

### Standard Ride Request

- Pickup and drop-off autocomplete.
- Drop-off privacy toggle on by default.
- Route preview map.
- Pickup and drop-off flex radius inputs.
- Date and time.
- Rider count from 1 to 7.
- Price willing to pay.
- Share ride with other riders toggle.
- Same-gender driver only option.
- Same-school driver only option.
- Multi-line notes.

### Moving Request

- Separate moving request mode.
- Cargo size selector: Small, Medium, Large.
- Required item photo upload: PNG, JPG, or WebP, max 2 MB.
- Budget field instead of per-seat price.
- Moving-specific notes.
- Drivers should see enough item context to decide whether they can help.

---

## List A Ride

**Primary screen:** `list-ride-page`

### Ride Types

- Personal Car
- Rideshare Service
- Moving Service

### Shared Fields

- Pickup and drop-off autocomplete.
- Route preview map.
- Pickup and drop-off detour radius.
- Date and departure time.
- Same-gender riders only.
- Same-school riders only.
- Price per seat or moving flat rate.
- Optional parking / airport fee shown separately from the seat price.
- Multi-line notes.
- Terms agreement checkbox.

### Personal Car Fields

- Car maker, model, color, and license plate.
- License plate is hidden until reservation.
- Vehicle layout from 2 to 7 seats.
- Interactive seat picker.

### Rideshare Service Fields

- Service name, such as Uber or Lyft.
- Available spots.

### Moving Service Fields

- Vehicle type.
- Cargo capacity.
- Loading/unloading help.
- Large furniture support.
- Moving cards should label the provider as "Mover" instead of "Driver."

---

## Cart

**Primary screen:** `cart-page`

- Multi-trip basket.
- Select/deselect individual trips or all trips.
- Ride details and seat details for each cart item.
- Order summary with subtotal, optional parking / airport fees, and service fee.
- Terms agreement before checkout.
- 3-step checkout progress: Cart -> Payment -> Confirmed.
- Cart should not own payment-method selection. Payment choice belongs on the Payment page.

---

## Payment And Checkout

**Primary screen:** `payment-page`

- Right-side panel shows ride details, selected rides, subtotal, fees, wallet credit, and remaining amount due.
- Payment method selection lives on the Payment page.
- LinkUp Wallet credit is selected by default when available.
- User can manually choose to use card instead.
- Stripe Embedded Checkout supports card, Apple Pay, Google Pay, and Link.
- LinkUp never stores raw card details.
- Checkout button should clearly communicate reservation, such as "Reserve your seat."
- Wallet-covered checkout should avoid charging card when wallet fully covers the amount.

---

## Reservation Confirmation Email

Sent after a rider successfully reserves a ride.

Email requirements:

- Must be visually polished and user-friendly.
- Greeting should use the rider's first name.
- Subject should be ride-specific, such as `Your LinkUp ride to [destination] is confirmed`.
- Include ride details:
  - Route
  - Date/time
  - Seat/passenger details when available
  - Seat price, optional parking / airport fee, and total paid
  - Driver name
  - Vehicle and license plate when available
  - Support email: `ridewlinkup@gmail.com`
- Include the 6-digit arrival/completion code so the rider can still give it to the driver without Wi-Fi.
- Include the five ride checklist steps.
- Include a link back to the dashboard checklist.
- Do not use collapsed/hidden email content patterns that require users to expand with three dots.

---

## Your Rides

**Primary screen:** `your-rides-page`

### Current Rides

- Confirmed reservations as rider.
- Active rides as driver.
- Driver sees passenger list, confirmed rider details, and seat assignments.
- Rider sees 6-digit arrival/completion code after reservation/departure rules allow it.
- Driver enters completion code to unlock earnings.
- Rating prompt appears after completed trip.
- Chat access per confirmed ride.

### Requested Rides

- Open requests posted by the user.
- Incoming driver offers.
- Accept/decline offers.
- Cancel request.

### Ride History

- Completed and departed rides.
- Rating display.
- Role-aware history for driver and rider.

---

## Chat

**Primary screen:** `chat-page`

- One chat per confirmed ride.
- Ride list on the left, selected thread on the right.
- Real-time messages.
- Typing indicators.
- Push notification opt-in per ride.
- Chat access should expire or restrict based on ride participation rules.

---

## Track My Trip

- Rider can start/stop live location sharing.
- Tracking link can be copied or sent to a trusted contact.
- Trusted contact can be added or updated mid-trip.
- Tracking page shows live route context on one map.
- Sharing live tracking is recommended but optional in the ride checklist.

---

## Profile

**Primary screen:** `profile-page`

Sidebar order:

1. Personal info
2. Payment method
3. Driver payouts
4. Security
5. Appearance
6. Transfer school
7. Policy agreement
8. Release notes
9. About LinkUp

### Personal Info

- Avatar upload/remove with hover edit overlay.
- Identity tag: display name, university, major, class year, member since, member number.
- Name fields: first, middle, last.
- Academic fields: major and class year.
- Social fields: Instagram, X, LinkedIn.
- Account fields: birthday, gender, university email.
- Birthday, gender, and account email are locked after set except through supported flows.
- Invite friends form sends a LinkUp invite email using the current user's display name and the LinkUp site link.
- Profile tracks and displays how many friend invites the user has sent.

### Payment Method

- Show saved default card brand, last 4, and expiry.
- Add/update card through Stripe.
- Raw card data never touches LinkUp servers.

### Driver Payouts

- Stripe Connect onboarding.
- Payout verification status.
- Earnings summary:
  - This week's earnings
  - Pending earnings
  - Available/completed balance
  - All-time total
- Wallet balance and earnings flow explanation.
- Bank payout history through Stripe ledger.

### Security

- Authenticator-app 2FA setup.
- QR code and manual setup key.
- Enable/disable 2FA with current code.
- Email 2FA support where enabled.
- Change password with email confirmation code.

### Appearance

- Theme options: Dark, Light, Auto.
- Auto mode uses light from 6 AM to 7 PM and dark outside that window.
- Preference saves to account and persists locally.

### Transfer School

- Enter a new university email.
- Send 6-digit verification code to the new email.
- After verification, update account email, university, school network, same-school matching, and leaderboard school.
- Preserve ride history, wallet, ratings, profile, and member number.
- Store previous school/email history for audit context.

### Policy Agreement

- Scrollable policy summary.
- Full Terms and Conditions.
- Full Privacy Notice.
- Latest policy acceptance required before ride services resume.

### Release Notes

- In-app changelog, newest updates first.

### About LinkUp

- Mission summary.
- Rider, driver, school, and safety overview.
- Community rules and moderation expectations.

---

## Public Profile

**Primary screen:** `public-profile-page`

- Read-only profile shown when tapping another user's name.
- Header should say `Public profile`; the user's name appears in the profile hero.
- Avatar or initial.
- Display name, university, major, class year, member number.
- Verified university badge when applicable.
- Social media icon buttons:
  - Instagram
  - X
  - LinkedIn
- Icons open saved profile links in a new tab.
- Ride stats:
  - Rides offered
  - Completed as driver
  - Rides joined
  - Open requests
- Driver rating card:
  - Green for 4.5 to 5.0
  - Yellow for 3.5 to 4.4
  - Red below 3.5
- Block/unblock user action.
- Blocking hides listings and requests from both users.

---

## Leaderboard

**Primary screen:** `leaderboard-page`

- School-wide ride-sharing rankings.
- Show universities with user count and total miles saved.
- Show total miles saved across the network.
- Highlight current user's school.

---

## Wallet And Earnings

- Driver earnings flow into LinkUp Wallet after completion code confirmation or auto-release.
- LinkUp commission rate defaults to 15%.
- Stripe card processing fees are deducted from driver earnings.
- Wallet credit applies to future rides by default.
- Users can manually deselect wallet credit and use their own payment card.
- This behavior encourages wallet credit usage before additional payout movement.

---

## Safety, Privacy, And Moderation

- Same-school and same-gender filters must be honored.
- Exact drop-off privacy is on by default for requests.
- Passenger email and private ride details must not leak to unrelated riders.
- Completion code must not be visible to the driver before rider provides it.
- Users can report unsafe behavior.
- Users can block/unblock other users.
- Community rules cover fake listings, harassment, scams, off-app pressure, emergency guidance, reports, and moderation.

---

## Admin Expectations

- Admin users have an admin entry point from the dashboard.
- Admins can inspect and support production data only through explicit protected flows.
- Any temporary admin recovery endpoint must be treated as temporary and removed after use.
- Admin tools should never bypass launch-readiness checks.

---

## Documents To Keep Updated

- `features.md` — product/app-team feature guide.
- `public/release-notes.md` — user-facing changelog.
- `docs/app-flowchart.md` — app flow diagrams.
- `docs/production-deploy-runbook.md` — production deployment process.
- `API.md` — API behavior for client teams.
