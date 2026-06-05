# LinkUp Feature Guide

This document is the app-team reference for production-facing LinkUp features across web and future mobile clients. It explains what each feature should do, where it appears, and what it connects to.

Do not add unreleased product areas to this document until they are approved for production.

---

## Product Principles

- LinkUp is for verified university students sharing rides within a trusted campus network.
- Ride services stay unavailable until the user has completed required profile, verification, policy, and approval steps.
- Private ride details should only be revealed when the user has a legitimate ride reason to see them.
- Payment, payout, login, reservation, waitlist, and trip-completion flows are launch-critical.
- Support contact for user-facing copy: `ridewlinkup@gmail.com`.

---

## Launch Readiness And Deployment

How it works:
- Run `npm test` before pushing or deploying.
- `scripts/check-launch-readiness.js` verifies JavaScript syntax, static assets, cache-busted frontend files, and an auth smoke test.
- GitHub Actions runs the same check on pushes and pull requests.
- Production deployment steps live in `docs/production-deploy-runbook.md`.

Connected to:
- `npm test`
- `scripts/check-launch-readiness.js`
- `docs/production-deploy-runbook.md`
- `public/index.html`
- `public/app.js`
- `server.js`

---

## Auth And Account Access

Primary screen:
- `auth-section`

How it works:
- Users sign in with university email and password.
- Users create accounts with first name, optional middle name, last name, birthday, gender, university email, and password.
- Passwords must include 8+ characters, uppercase, lowercase, number, and special character.
- Signup requires Terms and Conditions plus Privacy Notice acceptance.
- Email verification uses a 6-digit code with resend support.
- Forgot password sends reset instructions by email.
- Two-factor login challenge appears after password sign-in when enabled.
- Users who realize they already have an account can return from Create Account to Sign In.
- Admin emails listed in `ADMIN_EMAILS` can bypass university-email restrictions.

Connected to:
- `POST /api/auth/signup`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/signin`
- `POST /api/auth/2fa/verify`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `POST /api/auth/signout`
- Env: `ADMIN_EMAILS`, `BYPASS_EMAIL_VERIFICATION`

Email behavior:
- Verification emails use the clean branded white email style.
- Ride confirmation emails keep their existing darker premium style.

---

## Waitlist Mode

Primary screen:
- `waitlist-page`

How it works:
- When `WAITLIST_MODE=true`, non-admin students stay on the waitlist even after account creation.
- Local test mode can bypass the waitlist with `LOCAL_TEST_BYPASS_WAITLIST=true`.
- Waitlisted users can edit basic profile info.
- Payment method and driver payout settings are hidden while waitlisted.
- The waitlist page congratulates users with their member number and explains what LinkUp is.
- The waitlist page does not show the user's school name in the hero message.
- When a user's school becomes approved and pre-launch mode is off, LinkUp sends an approval email telling them they can start riding.

Connected to:
- Env: `WAITLIST_MODE`
- Env: `LOCAL_TEST_BYPASS_WAITLIST`
- `GET /api/auth/me`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/leaderboard/waitlist-schools`
- `PUT /api/profile/waitlist-intent`
- `sendSchoolApprovalEmail(...)` in `server.js`

Waitlist poll:
- Users choose what they are more likely to do most often:
  - Ride
  - Drive
  - Not sure
- The choice saves to the user profile as `waitlistIntent`.

Waitlist leaderboard:
- Shows schools ranked by total waitlisted students.
- Shows total students per school.
- The current user's school is highlighted.
- Each school line is color-segmented by role mix without showing driver/rider numbers:
  - Teal = riders
  - Gold = drivers
  - Gray = unsure
- The poll area includes a small legend explaining the colors.
- Unknown school domains display as the email domain and are surfaced for admin review.

Connected to:
- `GET /api/leaderboard/waitlist-schools`
- User fields: `serviceApproved`, `waitlistIntent`, `universityDomain`
- Preview files:
  - `public/previews/waitlist-page-preview.html`
  - `public/previews/waitlist-leaderboard-preview.html`

---

## Dashboard Home

Primary screen:
- Dashboard home inside `dashboard-mode`

How it works:
- Shows greeting, university label, quick actions, ride stats, current rides, and recent rides.
- Quick actions:
  - Browse Rides
  - Request a Ride
  - List a Ride
  - Your Rides
  - Leaderboard
- Admin users see Admin.
- While a user is currently in an active ride checklist window, Find a Ride and List a Ride are hidden so the dashboard stays focused on the active ride.
- Upcoming rides can appear as a boarding-pass style card.

Connected to:
- `GET /api/auth/me`
- `GET /api/profile`
- `GET /api/rides`
- `GET /api/ride-requests`
- `GET /api/notifications`
- `public/previews/dashboard-with-ride-preview.html`

---

## Ride Checklist

Primary screen:
- Embedded in dashboard near the active/upcoming ride

How it works:
- The checklist appears when a ride is near departure and stays visible through the active ride window.
- Progress persists per ride.
- Share live tracking is optional.

Steps:
1. Find your ride — Browse open rides and reserve a seat.
2. Verify the driver — Confirm name, license plate, and car match.
3. Share live tracking — Optional. Send your live trip to a trusted contact.
4. Give the arrival code — Read the 6-digit code so your driver can complete the ride.
5. Rate the driver — Help the community by rating your driver.

Connected to:
- `GET /api/profile`
- Ride reservation data in `db.rides[].passengers`
- Completion code flow
- Dashboard checklist state in frontend storage
- Ride confirmation email checklist link

---

## Browse Rides

Primary screen:
- `browse-page`

Rider mode:
- Browse available driver listings.
- Filter by destination, pickup radius, drop-off radius, date, seats, max price, same school, and same gender.
- Sort by soonest departure, lowest price, highest price, and most seats.
- Map panel shows matching ride areas and pins.
- Riders can add a ride to cart from a listing card.
- Before booking, riders should be able to see booked seats and who booked those seats.
- Before booking, riders should be able to open profiles for people who will be in the car.
- Sensitive information remains limited to the right audience.

Driver mode:
- Browse open rider requests.
- Request cards show route, date/time, offered price, rider count, request type, and privacy-safe destination.
- Drivers can make an offer on a request.
- Drivers can post a shared ride from a compatible request.
- Moving requests show cargo context and uploaded item photo.

Connected to:
- `GET /api/rides`
- `GET /api/ride-requests`
- `POST /api/cart/:rideId`
- `POST /api/ride-requests/:requestId/offer`
- `POST /api/ride-requests/:requestId/post-shared-ride`
- `GET /api/users/:userId/profile`
- `GET /api/config/google-maps-key`

---

## Request A Ride

Primary screen:
- `request-ride-page`

How it works:
- Users post ride requests with pickup, drop-off, date, time, rider count, and price willing to pay.
- Drop-off privacy is on by default.
- Pickup and drop-off flex radius inputs define how far the rider can travel to meet or be dropped off.
- Same-gender driver only and same-school driver only preferences are available.
- No smoking during ride option is available.
- Notes field is multi-line.
- Bright mode must keep labels, inputs, and checkbox text readable.

Moving request mode:
- Separate moving request type.
- Cargo size selector: Small, Medium, Large.
- Required item photo upload: PNG, JPG, or WebP, max 2 MB.
- Budget field replaces per-seat price.
- Drivers should see enough item context to decide whether they can help.

Connected to:
- `POST /api/ride-requests`
- `GET /api/config/google-maps-key`
- Google Maps autocomplete and route preview
- `db.rideRequests`

---

## List A Ride

Primary screen:
- `list-ride-page`

Ride types:
- Personal Car
- Rideshare Service
- Moving Service

Shared behavior:
- Pickup and drop-off autocomplete.
- Route preview map.
- Pickup and drop-off detour radius.
- Date and departure time.
- Same-gender riders only.
- Same-school riders only.
- No smoking during ride option.
- Price per seat or moving flat rate.
- Optional parking / airport fee shown separately from the seat price.
- Multi-line notes.
- Driver disclaimer and terms agreement required before posting.

Personal car fields:
- Car maker, model, color, and license plate.
- License plate is hidden until reservation.
- Vehicle layout from 2 to 7 seats.
- Interactive seat picker.

Rideshare service fields:
- Service name, such as Uber or Lyft.
- Available spots.

Moving service fields:
- Vehicle type.
- Cargo capacity.
- Loading/unloading help.
- Large furniture support.
- Moving cards label the provider as "Mover" instead of "Driver."

Connected to:
- `POST /api/rides`
- `GET /api/rides`
- `GET /api/config/google-maps-key`
- `db.rides`
- Google Maps autocomplete and route preview

---

## Cart

Primary screen:
- `cart-page`

How it works:
- Multi-trip basket.
- Select or deselect individual trips.
- Select or deselect all trips.
- Cart item shows ride and seat details.
- Order summary includes subtotal, optional parking / airport fees, service fee, wallet credit, and amount due.
- Terms agreement is required before checkout.
- Payment-method selection belongs on the Payment page, not the Cart page.

Connected to:
- `GET /api/cart`
- `POST /api/cart/:rideId`
- `DELETE /api/cart/:rideId`
- `POST /api/cart/create-embedded-checkout`

---

## Payment And Checkout

Primary screen:
- `payment-page`

How it works:
- Right-side panel shows selected ride details and totals.
- Payment method selection lives on the Payment page.
- LinkUp Wallet credit is selected by default when available.
- Users can manually choose to use a card instead.
- Stripe Embedded Checkout supports card, Apple Pay, Google Pay, and Link where available.
- LinkUp never stores raw card data.
- Checkout button should communicate reservation, such as "Reserve your seat."
- Wallet-covered checkout should avoid charging card when wallet fully covers the amount.

Connected to:
- `GET /api/payments/config`
- `GET /api/stripe/config`
- `POST /api/cart/create-embedded-checkout`
- `POST /api/cart/checkout/complete`
- Stripe Embedded Checkout
- Wallet transactions in database

---

## Reservation Confirmation Email

Sent after:
- A rider successfully reserves a ride.

How it works:
- Uses the premium ride-confirmation email style.
- Greeting uses the rider's first name.
- Subject should be ride-specific, such as `Your LinkUp ride to [destination] is confirmed`.
- Includes route, date/time, seat/passenger details, seat price, optional parking / airport fee, total paid, driver name, support contact, and vehicle/plate when available.
- Includes the 6-digit arrival/completion code so the rider can give it to the driver without Wi-Fi.
- Includes the five checklist steps.
- Includes a link back to the dashboard checklist.
- Must not use collapsed/hidden email content patterns that require users to expand with three dots.

Connected to:
- `sendReservationConfirmationEmail(...)` in `server.js`
- `POST /api/cart/checkout/complete`
- `POST /api/rides/:rideId/reserve`
- Email sender: `sendAuthEmail(...)`
- Support email: `ridewlinkup@gmail.com`

---

## Your Rides

Primary screen:
- `your-rides-page`

Current rides:
- Confirmed reservations as rider.
- Active rides as driver.
- Driver sees passenger list, confirmed rider details, and seat assignments.
- Rider sees 6-digit arrival/completion code after reservation/departure rules allow it.
- Driver enters completion code to unlock earnings.
- Rating prompt appears after completed trip.
- Chat access per confirmed ride.

Requested rides:
- Open requests posted by the user.
- Incoming driver offers.
- Accept or decline offers.
- Cancel request.

Ride history:
- Completed and departed rides.
- Rating display.
- Role-aware history for driver and rider.

Connected to:
- `GET /api/profile`
- `GET /api/rides`
- `GET /api/ride-requests`
- `POST /api/rides/:rideId/complete`
- `POST /api/rides/:rideId/rating`
- `POST /api/ride-requests/:requestId/offer`

---

## Driver Dashboard And Route Navigation

Primary context:
- Dashboard when the user is driving an active/upcoming ride

How it works:
- Driver sees a boarding pass for the ride.
- Driver sees passenger manifest and seat assignments.
- Driver sees route card with:
  - Start
  - Current stop
  - Rider drop-off stops
  - Final destination
  - Total number of stops
- Driver can open full route in Google Maps or Apple Maps.
- Links should prefill all destinations so the driver can press Start and drive.
- Driver map should use Google Maps API when available.

Connected to:
- `GET /api/profile`
- `GET /api/config/google-maps-key`
- `db.rides[].passengers[].actualDropoff`
- Google Maps Directions API / Maps JavaScript API
- Apple Maps URL scheme
- Preview: `public/previews/driver-dashboard-preview.html`

---

## Chat

Primary screen:
- `chat-page`

How it works:
- One chat per confirmed ride.
- Ride list on the left, selected thread on the right.
- Real-time messages.
- Typing indicators where supported.
- Push notification opt-in per ride.
- Chat access expires or restricts based on ride participation rules.

Connected to:
- `GET /api/rides/:rideId/messages`
- `POST /api/rides/:rideId/messages`
- Socket.IO
- `GET /api/push/config`
- `POST /api/push/subscribe`
- `POST /api/push/unsubscribe`
- `POST /api/device-token`

---

## Tracking And Ride Safety

Primary contexts:
- Dashboard active ride
- Tracking page for trusted contact
- Rider and driver safety panels

How it works:
- Riders and drivers can use live tracking.
- Tracking link can be copied or sent to a trusted contact.
- Trusted contact can be added or updated mid-trip.
- Tracking page shows route context and current-location dot.
- Sharing live tracking is recommended but optional in the checklist.
- Safety recording can be started when needed.
- Safety recordings are stored by LinkUp for 30 days, then deleted automatically.
- Reports to LinkUp are available from ride safety tools.
- Driver and rider safety tools should be consistent.
- Door usability reminder: child locks should be off and doors should open from inside.
- No smoking preference should be visible where relevant.

Connected to:
- `POST /api/trips/track/start`
- `POST /api/trips/track/stop`
- `GET /api/trips/track/:viewerToken`
- Safety recording endpoints in `server.js`
- `SAFETY_RECORDING_RETENTION_MS`
- Google Maps API
- `db.trackingTrips`
- `db.safetyRecordings`
- `db.userReports`

---

## Profile

Primary screen:
- `profile-page`

Sidebar order:
1. Personal info
2. Payment method
3. Driver payouts
4. Security
5. Notifications
6. Appearance
7. Transfer school
8. Policy agreement
9. Release notes
10. Conduct record
11. Send feedback
12. Delete account
13. About LinkUp

Personal info:
- Avatar upload/remove with hover edit overlay.
- Identity tag: display name, university, major, class year, member since, member number.
- Name fields: first, middle, last.
- Academic fields: major and class year.
- Account fields: birthday, gender, university email.
- Birthday, gender, and account email are locked after set except through supported flows.
- Invite friends by email.
- Copy personal invite link.
- Personal invite link should not expose the user's last name.
- Profile tracks invite count and joined count.

Payment method:
- Show saved default card brand, last 4, and expiry.
- Add/update card through Stripe.
- Raw card data never touches LinkUp servers.
- Hidden while waitlisted.

Driver payouts:
- Stripe Connect onboarding.
- Payout verification status.
- Earnings summary.
- Wallet balance and earnings flow explanation.
- Hidden while waitlisted.

Security:
- Authenticator-app 2FA setup.
- QR code and manual setup key.
- Enable/disable 2FA with current code.
- Email 2FA support where enabled.
- Change password with email confirmation code.

Notifications:
- Users can opt in/out of weekly recap emails.
- Users can opt in/out of ride/request alert emails.
- Ride coordination, safety, and account notifications still appear in-app.

Appearance:
- Theme options: Dark, Light, Auto.
- Auto mode uses light from 6 AM to 7 PM and dark outside that window.
- Preference saves to account and persists locally.

Transfer school:
- Enter new college and new college email.
- Send 6-digit verification code to the new email.
- Normalize school-name input to avoid casing/spacing mistakes.
- After verification, update account email, university, school network, same-school matching, and leaderboard school.
- Preserve ride history, wallet, ratings, profile, and member number.
- Verification email uses the clean white branded email style.

Policy agreement:
- Scrollable policy summary.
- Full Terms and Conditions.
- Full Privacy Notice.
- Latest policy acceptance required before ride services resume.

Delete account:
- Available as a normal profile subpage.
- Should not be visually alarming in the sidebar.
- Destructive action requires confirmation.

Connected to:
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/notifications`
- `POST /api/profile/invite-friend`
- `PUT /api/profile/preferences`
- `PUT /api/profile/policies`
- `PUT /api/profile/waitlist-intent`
- `POST /api/profile/school-transfer/request`
- `POST /api/profile/school-transfer/verify`
- `POST /api/profile/payment-method/setup-session`
- `POST /api/profile/payment-method/complete-setup`
- `PUT /api/profile/payout`
- `POST /api/profile/payout/onboarding`
- `DELETE /api/profile/account`
- `POST /api/auth/2fa/setup`
- `POST /api/auth/2fa/verify-setup`
- `POST /api/auth/2fa/disable`

---

## Notifications

Primary UI:
- Dashboard header Notifications button
- Compact dropdown, not a separate page
- Profile -> Notifications preferences

How it works:
- Dropdown shows ride and account updates sorted newest to oldest.
- Notification count sits on the icon itself.
- Unread notifications use a red badge/dot.
- Opening the dropdown marks the current batch as seen on the client.
- Users can save email notification preferences in Profile.
- In-app ride/safety/account notifications remain visible.

Connected to:
- `GET /api/notifications`
- `PUT /api/profile/notifications`
- `notificationPreferences` on user profile
- Push notification helpers
- Email sender for ride/request alerts

---

## Weekly Recap Emails

How it works:
- Sent automatically every Sunday at `00:00` server time.
- Counts the previous week's production-facing activity.
- Email includes:
  - Rides taken
  - New ride/account activity summary where production-approved
- Email respects the user's weekly recap preference.
- Duplicate protection prevents the same weekly recap from sending twice after a server restart.
- If California time is required, production should set `TZ=America/Los_Angeles`.

Connected to:
- `WEEKLY_RECAP_EMAILS_ENABLED`
- `notificationPreferences.weeklyRecapEmail`
- Weekly recap scheduler in `server.js`
- `sendWeeklyRecapEmail(...)`
- `sendWeeklyRecapsIfDue(...)`
- Database meta:
  - `weeklyRecapLastSentKey`
  - `weeklyRecapLastSentAt`
  - `weeklyRecapLastSentCount`
- Preview/send helper:
  - `public/previews/weekly-recap-email-preview.html`
  - `scripts/send-weekly-recap-preview-email.js`

---

## Public Profile For Ride Context

Primary screen:
- `public-profile-page`

How it works:
- Read-only profile shown when tapping another rider/driver name from ride context.
- Header says `Public profile`.
- Shows avatar or initial, display name, university, major, class year, member number, and verified university badge.
- Shows ride stats:
  - Rides offered
  - Completed as driver
  - Rides joined
  - Open requests
- Driver rating color system:
  - Green for 4.5 to 5.0
  - Yellow for 3.5 to 4.4
  - Red below 3.5
- Block/unblock user action.
- Blocking hides listings and requests from both users.

Connected to:
- `GET /api/users/:userId/profile`
- `POST /api/users/:userId/block`
- `DELETE /api/users/:userId/block`
- `db.userBlocks`
- Ride cards, request cards, and chat participant names

---

## Leaderboard

Primary screen:
- `leaderboard-page`

How it works:
- Shows school-wide ride-sharing rankings.
- Shows universities with user count and total miles traveled/saved.
- Shows total miles across the network.
- Highlights the current user's school.

Connected to:
- `GET /api/leaderboard/schools`
- `db.rides`
- `db.users`

---

## Wallet And Earnings

How it works:
- Driver earnings flow into LinkUp Wallet after completion code confirmation or auto-release.
- LinkUp commission rate defaults to 15%.
- Stripe card processing fees are deducted from driver earnings.
- Wallet credit applies to future rides by default.
- Users can manually deselect wallet credit and use their own payment card.

Connected to:
- `LINKUP_COMMISSION_RATE`
- `GET /api/profile`
- `POST /api/rides/:rideId/complete`
- `POST /api/cart/create-embedded-checkout`
- Wallet transaction helpers in `server.js`
- Stripe payment and payout flows

---

## Conduct, Reports, And Moderation

How it works:
- Users can report unsafe, harassing, fraudulent, or policy-violating behavior.
- Admins can issue conduct strikes.
- Strike levels:
  - Level 1: minor
  - Level 2: serious
  - Level 3: severe
- Three total strike points can trigger a permanent ban.
- Users can view their own conduct record.
- Admin access to safety recordings is logged.

Connected to:
- `db.userReports`
- `db.safetyRecordings`
- `db.adminAuditLog`
- Admin panel routes in `server.js`
- Profile -> Conduct record
- Report to LinkUp forms

---

## Admin Expectations

How it works:
- Admin users have an admin entry point from the dashboard.
- Admins can inspect users, rides, requests, reports, recordings, and audit activity through protected flows.
- Temporary recovery endpoints must be removed after use.
- Admin tools must not bypass launch-readiness checks.

Connected to:
- `ADMIN_EMAILS`
- `ADMIN_PAYOUT_SECRET`
- Admin routes in `server.js`
- `db.adminAuditLog`

---

## Documents To Keep Updated

- `features.md` — product/app-team feature guide.
- `public/features.json` — machine-readable feature manifest for app clients.
- `public/release-notes.md` — user-facing changelog.
- `docs/app-flowchart.md` — app flow diagrams.
- `docs/production-deploy-runbook.md` — production deployment process.
- `API.md` — API behavior for client teams.
