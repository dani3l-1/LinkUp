# LinkUp Release Notes

---

## v2026.05.20

### New
- **Stripe Embedded Checkout.** Checkout now uses Stripe's fully hosted payment form — Apple Pay, Google Pay, Link, and card are all supported without a redirect. Your card details never touch LinkUp servers.
- **In-app Stripe payout onboarding.** Drivers can now complete their Stripe Connect setup without ever leaving LinkUp — the full onboarding flow renders inside the app. A new "View bank payout history" button also lets verified drivers see their Stripe payout ledger directly in-app.
- **Auto theme.** A new Auto option in Appearance automatically switches between light and dark mode based on the time of day — light from 6 AM to 7 PM, dark outside those hours. The app updates live while it's open.

### Improvements
- **Redesigned Personal Info page.** Your profile photo now works like Instagram — hover over the avatar to see the edit overlay, then click to choose Upload photo or Remove photo. A profile tag next to the avatar shows your name, university, major, class year, and when you joined LinkUp. Locked fields (birthday, gender, email) now display a lock badge so it's clear they can't be changed.
- **Sharper light mode.** Text throughout the app — labels, navigation items, subtitles, form fields, and placeholder text — is now noticeably darker and easier to read in light mode, meeting accessibility contrast standards.

---

## v2026.05.17 BETA

### Improvements
- **Better search previews.** LinkUp now appears with a cleaner logo and description in Google and social media link previews.
- **Light and dark mode.** Profile now has an Appearance section where users can switch LinkUp between dark mode and light mode.
- **Security hardening.** API writes now reject untrusted origins, sensitive API responses avoid browser/CDN storage, and profile photo uploads verify real image data.
- **Safer Stripe payout onboarding.** Stripe onboarding now starts from a protected action and opens in a separate tab instead of using a state-changing link.
- **Safer admin payouts.** Weekly payout admin access now has tighter request limits and safer secret checks.

---

## v2026.05.16 BETA

### New
- **Branded verification email.** Email verification codes now arrive in a clean, branded LinkUp email with a plain-text fallback.
- **Reservation confirmation email.** Riders get a thank-you email with trip details after successfully reserving a seat.
- **Spend your wallet credits.** Completed driver earnings can now be applied automatically toward future rides before charging your card.
- **Wallet breakdown at checkout.** Checkout now shows your LinkUp Wallet balance, how much is applied, and the remaining card charge.

### Fixed
- **Legal pages load again.** Privacy Notice and Terms & Conditions now open correctly inside the app.
- **Cleaner checkout.** The card form is tidier and Apple Pay / Google Pay buttons only appear when your device supports them.
- **Order summary layout.** Subtotal and service fee now display cleanly, like a receipt.

> **Note:** Browsing rides, making reservations, chat, tracking, and checkout are temporarily paused while payment setup is being finalized.

---

## v2026.05.15 BETA

### New
- **Checkout recovery.** Closing the browser mid-checkout no longer loses your reservation — payment finalizes automatically.
- **Exact pickup and drop-off.** Flexible-area rides now ask for your precise pickup and drop-off spots before checkout. Drivers see them after confirming.
- **Leaderboard miles.** Your school's leaderboard now shows total miles saved across all confirmed shared rides.
- **Driver earnings dashboard.** Drivers can now see this week's earnings, completed payout balance, pending earnings, and all-time totals from Profile.
- **Live chat notifications.** Riders and drivers can enable push notifications for new messages in a confirmed ride chat.

### Fixed
- **Accurate leaderboard miles.** Miles now count only completed rides with confirmed riders — future or unused listings no longer inflate the total.
- **Cleaner activity view.** Departed rides and expired requests no longer appear in current activity.
- **Real-time chat.** Messages and typing indicators now update live in confirmed ride chats.

---

## v2026.05.14 BETA

### New
- **Pay directly in the app.** Riders enter card details inside LinkUp — no redirect to an external Stripe page.
- **Save a default card.** Set a default payment card from your Profile using a secure in-app form.
- **Driver payout connection.** Drivers can connect bank payouts and track payout status inside the app.

### Fixed
- **Browse shows only available rides.** Expired, full, and your own rides are no longer shown in Browse Rides.
- **Stale pages blocked.** Checkout prevents reservations on rides that departed while the page was open.

---

## v2026.05.13 BETA

### New
- **Multi-trip cart.** Add multiple trips, select the ones you want, and review a subtotal before paying.
- **Profile photos.** Upload, crop, and display a profile picture. It appears on your public profile.
- **Academic details.** Optionally add your major and class year — both appear on your public profile.
- **In-context legal docs.** Tapping Terms or Privacy Notice opens the full document in a popup without leaving the page.

### Fixed
- **Expired trips auto-removed.** Rides past their departure are cleared from your cart with a one-time notice.
- **Password recovery improved.** Account recovery now focuses on password reset — no separate username step needed.

---

## v2026.05.12 BETA

### New
- **Same-school rides.** Drivers can list rides for same-school riders only. Riders can filter for same-school drivers.
- **More private driver names.** Full driver names are only visible to riders with a confirmed reservation. Everyone else sees first name and last initial.
- **Accurate driving distances.** Mileage now uses actual driving distance from route data, not straight-line estimates.

---

## v2026.05.11 BETA

### New
- **Public profiles.** Tap any driver, rider, or chat sender's name to see their public profile and ride stats.
- **Report a user.** Report a driver or rider directly from ride cards and assignment lists.
- **Block a user.** Block or unblock someone from their public profile. Blocked users won't see each other's listings or requests.

---

## v2026.05.10 BETA

### New
- **Personal Car and Rideshare Service.** Drivers choose a ride type when listing. Personal Car supports vehicle details and seat selection. Rideshare Service uses general spots.

---

## v2026.05.9 BETA

### New
- **Live route in tracking.** Track My Trip now shares your location with full route context on one map.
- **Add a trusted person mid-trip.** Invite or resend a trusted-person link while location sharing is already active.

---

## v2026.05.8 BETA

### New
- **Updated Terms and Privacy Notice.** LinkUp now shows the May 8, 2026 Terms and Privacy Notice. Existing users are prompted to review and accept before using ride services.
- **Required profile fields.** Name, birthday, and gender must be completed before accessing ride services. Older accounts can fill these in once.

---

## v2026.05.1 BETA

### New
- **Track My Trip.** Share your live location and route context together on one map with trusted people.
- **Payment and payout in Profile.** Riders manage payment details. Drivers manage payout details. Each in a dedicated section.
- **Full ride workflow.** Requested rides, ride history, chat, ratings, and seat reservations — the complete flow from request to review.
