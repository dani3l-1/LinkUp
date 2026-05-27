# LinkUp — Pages & Features

Every user-facing page in the app, with the features available on each.

---

## Auth

**ID:** `auth-section`  
Entry point for all unauthenticated users.

- Sign in with university email and password
- Create account (first name, last name, middle name, birthday, gender, university email, password)
- Password strength requirements (8+ chars, uppercase, lowercase, number, special character)
- Forgot password / reset via email code
- Email verification (6-digit code, resend option)
- Terms and Conditions + Privacy Notice agreement at signup
- 2FA challenge step after sign-in when 2FA is enabled

---

## Home / Dashboard

**ID:** `home-section` (inside `dashboard-mode`)  
Landing page after sign-in.

- Quick-action buttons: Browse Rides, Request a Ride, List a Ride, Your Rides, Leaderboard
- Stats summary: rides taken, rides driven, total savings vs Uber
- Recent rides panel (last few confirmed rides)
- Trip tracking controls: start/stop live location sharing, trusted person email input, copy/send tracking link, live map preview

---

## Browse Rides

**ID:** `browse-page`  
Dual-role marketplace for finding rides or seeing incoming requests.

**Driver mode**
- Lists open ride requests posted by riders
- Each request card shows: route, date/time, price offered, rider count, request type (ride or moving)
- Fuzzy drop-off display (exact location hidden until driver offers)
- Make an offer on a request
- Post a shared ride directly from a request card

**Rider mode**
- Lists available rides posted by drivers
- Filters: destination search, pick-up area + radius, drop-off area + radius, date, minimum seats, maximum price
- Checkboxes: same school only, same gender drivers only
- Sort: soonest departure, lowest price, highest price, most seats
- Live map panel (sticky) showing pick-up radius and matching ride pins
- Add ride to cart from listing card
- View driver public profile from card

---

## Request a Ride

**ID:** `request-ride-page`  
Form for riders to post a trip they need.

**Ride request**
- Pick-up location with autocomplete
- Drop-off location with autocomplete
- Hide drop-off from public view toggle (on by default — shows only approximate area until a driver offers)
- Route preview map
- Pick-up and drop-off flex radius inputs
- Date and time
- Rider count (1–7)
- Price willing to pay
- Share ride with other riders toggle
- Same gender driver only checkbox
- Same school driver only checkbox
- Notes (multi-line)

**Moving request** (toggled from Ride)
- Replaces rider count with cargo size selector (Small / Medium / Large)
- Required photo upload of items (PNG, JPG, WebP, max 2 MB)
- Budget field instead of price
- Notes adapted for moving context

---

## List a Ride

**ID:** `list-ride-page`  
Form for drivers to post a ride, plus a live activity panel.

**Offer a ride form**
- Ride type selector: Personal Car, Rideshare Service, Moving Service
- Pick-up and drop-off location with autocomplete
- Route preview map
- Pickup and drop-off detour radius inputs
- Date and departure time
- Same gender riders only checkbox
- Same school riders only checkbox

  *Personal Car fields:* car maker, model, color, license plate (hidden until reservation), vehicle layout (2–7 seats), interactive seat picker (choose which seats are available)

  *Rideshare Service fields:* service name (Uber, Lyft, etc.), available spots

  *Moving Service fields:* vehicle type, cargo capacity, loading/unloading help checkbox, large furniture checkbox

- Price per seat (or flat rate for moving)
- Notes (multi-line)
- Terms agreement checkbox
- Post ride button

**My ride activity panel** (right column)
- Lists the driver's current and past rides with status

---

## Your Rides

**ID:** `your-rides-page`  
Full ride history and active trip management.

**Current rides tab**
- Confirmed reservations as a rider
- Active rides as a driver (with passenger list, confirmed rider details, seat assignments)
- Completion code entry for drivers (6-digit code, unlocks earnings)
- Rating prompt after trip completes
- Chat access per ride

**Requested rides tab**
- Open ride requests the user posted
- Incoming driver offers on each request
- Accept or decline an offer
- Cancel a request

**Ride history tab**
- Completed and departed rides (as driver or rider)
- Rating display

---

## Chat

**ID:** `chat-page`  
In-app messaging for confirmed rides.

- Ride list on the left (one entry per confirmed ride the user is part of)
- Message thread on the right for the selected ride
- Real-time message delivery and typing indicators
- Push notification opt-in per ride

---

## Cart

**ID:** `cart-page`  
Multi-trip checkout basket.

- List of rides added to cart (with trip details and seat info)
- Select / deselect individual trips or all at once
- Order summary with subtotal and service fee
- LinkUp Wallet balance display and credit application
- Terms agreement checkbox
- Proceed to checkout button
- 3-step progress indicator (Cart → Payment → Confirmed)

---

## Payment (Checkout)

**ID:** `payment-page`  
Stripe-powered payment step.

- Order summary (right panel) with itemized trips, subtotal, fees
- LinkUp Wallet credit applied display
- Stripe Embedded Checkout (card, Apple Pay, Google Pay, Link)
- Payment details never stored by LinkUp
- 3-step progress indicator
- Back to cart

---

## Profile

**ID:** `profile-page`  
Account management hub with a sidebar navigation.

### Personal Info
- Avatar with hover-to-edit overlay (upload, remove; Instagram-style)
- Identity tag: display name, university (credential label), major · class year, member since + member number
- **Name section:** first name, last name, middle name
- **Academic section:** major, class year
- **Social section:** Instagram, LinkedIn, X (optional, shown on public profile)
- **Account section:** birthday (locked after set), gender (locked after set), university email (locked)
- Save profile button

### Payment Method
- View saved default card (brand, last 4, expiry)
- Add or update card via Stripe (card details never stored by LinkUp)

### Driver Payouts
- Stripe Connect onboarding (in-app, no redirect)
- Payout status and verification state
- This week's earnings, pending earnings, completed balance, all-time total
- View bank payout history (Stripe ledger in-app)
- Wallet balance and earnings flow diagram

### Security
- Two-factor authentication setup (TOTP — Google Authenticator, Authy, etc.)
- QR code and manual key for authenticator app
- Enable / disable 2FA with current code verification

### Policy Agreement
- Scrollable policy summary (Terms and Privacy Notice)
- View full Terms and Conditions
- View full Privacy Notice
- Accept latest policies to re-enable ride services

### Appearance
- Theme selector: Dark, Light, Auto (switches by time of day — light 6 AM–7 PM)
- Saved to account and persisted locally

### Release Notes
- Chronological changelog of all LinkUp updates

### About LinkUp
- Mission summary and feature overview (For Riders, For Drivers, For Schools, Safety)

---

## Public Profile

**ID:** `public-profile-page`  
Read-only profile view shown when tapping a user's name anywhere in the app.

- Avatar, display name, university
- Major, class year, member since, member number
- Social links (Instagram, LinkedIn, X) if the user has set them
- Ride stats (rides as driver, rides as rider, miles shared)
- Report user button
- Block / unblock user button

---

## Leaderboard

**ID:** `leaderboard-page`  
School-wide ride sharing rankings.

- Table of all universities with user count and total miles saved
- Total miles saved across the network
- Highlighted row for the current user's school

---

## Admin Control Room

**ID:** `admin-page`  
Restricted dashboard for accounts listed in `ADMIN_EMAILS`.

- Deployment version and environment summary
- Launch metrics: users, approved users, waitlist users, rides, requests, open reports
- Recent users with service access toggle
- Recent rides and ride requests for operational review
- User reports table with status workflow: open, reviewing, resolved, dismissed

---

## Track My Trip (Shared View)

**ID:** `shared-track-page`  
Public page opened by a tracking link — no sign-in required.

- Live map showing the traveler's current location and route
- Trip status and last-update timestamp
- Open in Google Maps link
- Updates in real time while sharing is active

---

## Legal Pages

**Privacy Notice** (`privacy-page`) and **Terms and Conditions** (`terms-page`)  
Accessible from auth, profile, cart, and inline legal links anywhere.

- Full document rendered from markdown
- Effective date displayed

---

## Waitlist

**ID:** `waitlist-page`  
Shown to users whose university hasn't launched yet.

- Waitlist confirmation message
- Notified when LinkUp launches at their school

---

## Notes

- All ride-related pages (Browse, Request, List, Cart, Checkout, Your Rides) require a verified email, completed required profile fields (name, birthday, gender), and acceptance of the latest policies.
- The shared tracking page (`/track/:token`) is the only page accessible without signing in.
- Legal pages can be opened as modals (inline) or as full pages depending on context.
