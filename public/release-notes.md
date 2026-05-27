# LinkUp Release Notes

---

## v2026.05.26 BETA

### New
- **Drop-off privacy.** When you post a ride request, your exact drop-off address is hidden from public view by default. Drivers browsing requests see only a general neighborhood area — your precise location is revealed only after a driver makes you an offer. You can turn this off in the request form if you prefer your destination to be shown exactly.
- **Social profile links.** You can now add optional Instagram, LinkedIn, and X links to your profile so verified students can link up beyond a ride when you choose to share them.

### Improvements
- **Redesigned Personal Info layout.** Profile fields are now organized into labeled sections — Name, Academic, Social, and Account — so it's easier to find and edit what you need.
- **Cleaner profile identity tag.** The name, university, and member details in the profile header are now better spaced and typographically distinct, with university displayed as a credential label above your academic info.
- **Notes fields are now multi-line.** Both the ride offer and ride request forms now use a proper text box for notes, so you can write more without losing track of what you typed.
- **Member number on profiles.** Profiles now show each student's LinkUp member number based on when they joined.
- **Admin numbers are separate.** Admin accounts now show an admin number instead of taking a student member number.
- **Moving service cards show "Mover" instead of "Driver".** Listings posted as a moving service now correctly label the provider as "Mover" to match the context.
- **Budget label for moving requests.** When posting a moving service request, the price field is now labeled "Budget for move" instead of the generic rider label.

### Fixed
- **Trip completion form now appears for drivers.** After a rider pays and the trip departs, drivers can now see and submit the 6-digit completion code. This form was not appearing due to a missing payment status flag — earnings confirmation now works as intended.
- **Signup button no longer freezes.** If you tried to sign up without checking the terms checkboxes, the Create Account button would get stuck in a loading state. It now resets correctly.
- **Offer submit button no longer freezes on route errors.** If the route estimate failed during posting, the Post Ride button would get stuck. It now always resets regardless of what goes wrong.
- **Passenger data is no longer visible to other riders.** Email addresses and rating details stored on passenger records were included in API responses visible to other users on the same ride. Only the driver and each individual rider can now see their own details.
- **Completion code no longer visible in profile data.** The 6-digit trip completion PIN was inadvertently included in profile responses for drivers. It is now correctly withheld from the driver — only the confirmed rider sees it after departure.
- **Browse no longer fetches ride data twice on load.** Navigating to Browse Rides was triggering two simultaneous API calls. Only one fetch now runs.
- **Pick-up and drop-off fields now align correctly in the request form.** The hide-destination toggle was placed inside the drop-off field, making it taller than the pick-up field and causing them to appear at different heights. The toggle now sits below both fields and the two location inputs align flush.

---

## v2026.05.21 BETA

### New
- **Trip completion codes.** Every ride now has a 6-digit completion code. After the trip departs, the rider sees their code on the confirmed ride card and shares it verbally with the driver. The driver enters it in the app to confirm the trip — earnings unlock instantly. If the driver never claims it, earnings auto-release 48 hours after the ride ends. Wrong codes are locked out after 5 attempts.
- **Apply wallet credit at checkout.** Riders with a LinkUp Wallet balance now see an "Apply $X credit" button on the payment page. Tapping it deducts the credit from the trip total and shows a breakdown of credit applied and remaining card charge. Credit can be removed before paying. When the wallet covers the full amount, no card is charged.
- **Moving Service.** Drivers can now list a moving service — cargo only, no passengers. Choose your vehicle type (pickup truck, cargo van, box truck, SUV/minivan), cargo capacity (small/medium/large), and whether you offer loading/unloading help or can handle large furniture. Moving listings show a gold "Moving" badge in Browse and price is shown as a flat rate for the job.
- **Photo required for moving requests.** When posting a moving request, riders must upload at least one photo of their items. Drivers see the photo on the request card so they can confirm everything will fit before offering.
- **Two-factor authentication.** Protect your account with an authenticator app (Google Authenticator, Authy, etc.). Set up 2FA from Profile → Security. Once enabled, signing in requires your password and a 6-digit code from your app. You can disable 2FA at any time by verifying your current code.
- **Redesigned verification email.** The email verification code now arrives in a clean, branded email with each digit displayed in its own highlighted box — easier to read at a glance.

---

## v2026.05.20 BETA

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
