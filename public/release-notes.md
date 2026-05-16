# LinkUp Release Notes

---

## v2026.05.15 BETA

### New
- **PostgreSQL support.** Production deployments now connect to PostgreSQL via `DATABASE_URL`. Local development still uses `data/db.json`.
- **Sessions survive restarts.** Production sessions are stored outside process memory, so users stay signed in across server restarts.
- **Stripe webhook recovery.** Closing the browser mid-checkout no longer loses a reservation — webhooks finalize the payment automatically.
- **Exact rider stops.** Personal Car rides with flexible areas now collect exact pickup and drop-off spots before checkout. Drivers see them after confirmation.
- **Leaderboard saved miles.** The school leaderboard now shows total miles saved across all confirmed shared rides.
- **Driver wallet.** Drivers can now see this week's net earnings, completed-ride payout balance, pending earnings, and all-time earnings from Profile.
- **Future-ready payment providers.** Payment and payout records now store provider-neutral ids so LinkUp can move beyond Stripe more cleanly later.
- **Live chat notifications.** Riders and drivers can enable browser push notifications for new ride chat messages.

### Fixed
- **Leaderboard accuracy.** Miles now count only completed rides with confirmed riders — future or unused listings no longer inflate the total.
- **Cleaner current activity.** Departed rides and expired requests no longer appear in current activity.
- **Cart preserves stop details.** Exact pickup and drop-off details stay attached through the full cart and payment flow.
- **Tracking links expire reliably.** Expiry is now enforced across viewer access, location updates, and invite resends.
- **Ride chat updates live.** Messages and typing indicators now update in real time for confirmed ride chats.
- **Payout fields block sensitive data.** Bank account, routing, card, CVV, SSN, IBAN, and similar numbers are rejected at input.
- **Driver payout page simplified.** Manual payout fields were removed in favor of a wallet view and Stripe payout connection.
- **Stricter security defaults.** Helmet headers and strict session cookie same-site behavior are now active.
- **Secret files harder to commit.** Local session files and reset backups are now excluded by Git.
- **Google Maps setup docs updated.** All required Google Maps Platform APIs are now listed in the setup guide.

---

## v2026.05.14 BETA

### New
- **Native card checkout.** Riders enter payment details directly in LinkUp — no redirect to a separate Stripe page.
- **Save a card from Profile.** Riders can set a default card from Profile using a secure in-app Stripe form.
- **Stripe payout connection.** Drivers can connect Stripe payouts from Profile and track payout status inside the app.

### Fixed
- **Expired rides hidden from Browse.** Rides whose departure has passed no longer appear in Browse Rides.
- **Drivers don't see their own listings.** Browse Rides now shows only rides a rider can actually reserve.
- **Full rides filtered out.** Rides with no remaining spots are excluded from Browse Rides.
- **Stale pages can't reserve departed rides.** Checkout blocks rides that already departed, even if the page was open before they expired.

---

## v2026.05.13 BETA

### New
- **Multi-trip cart.** Add multiple trips, select individual ones or use Select all, and review a subtotal before paying.
- **Cart reservation reminder.** The cart now makes clear that trips aren't reserved until checkout is complete.
- **Single Terms agreement at checkout.** Riders agree to the Terms once for all selected trips — not per item.
- **Profile photos.** Upload, preview, crop, and display a profile picture. Shown on public profiles.
- **Academic details.** Optionally add a major and class year. Both appear on your public profile when set.
- **Legal docs open in-context.** Tapping Terms or Privacy Notice text opens the full document in a popup without leaving the page.

### Fixed
- **Expired cart rides auto-removed.** Trips past their departure are cleared from the cart with a one-time notice.
- **Checkout reserves only selected trips.** Unselected trips stay in the cart after payment.
- **Past rides fully blocked.** Expired rides are blocked from cart add and checkout even on a stale open page.
- **Password recovery is clearer.** Recovery now focuses on password reset — no separate username step.
- **Password length enforced.** Minimum 8 characters is validated on both frontend and backend at signup and reset.

---

## v2026.05.12 BETA

### New
- **Same-school restrictions.** Drivers can list rides for same-school riders only. Riders can filter for same-school drivers.
- **More private driver names.** Full driver names are only visible to riders with a confirmed reservation. Everyone else sees first name and last initial.
- **Driving distance mileage.** New rides and requests use actual driving distance from route data instead of straight-line estimates.

### Fixed
- **Cleaner browse cards.** Results no longer show raw coordinates, empty Notes rows, or combined detour radius text.
- **Detour radius split into separate rows.** Pickup and drop-off radius now appear as distinct rows.

---

## v2026.05.11 BETA

### New
- **Public profiles.** Tap any driver's, rider's, requester's, or chat sender's name to see their public profile and ride stats.
- **User reporting.** Report a driver or rider from ride cards and assignment lists.
- **User blocking.** Block or unblock someone from their public profile. Blocked users won't see each other's listings or requests.

### Fixed
- **Blocking enforced across ride actions.** Blocked users can't reserve each other's rides, offer on requests, or share rides together.
- **Blocked rides removed from carts.** If you block someone whose ride is in your cart, it's removed automatically.
- **Rideshare-service rider reporting.** Drivers can now report riders on rides using general spots, not just exact seats.

---

## v2026.05.10.1 BETA

### New
- **In-app legal and release pages.** Terms, Privacy Notice, and Release Notes are viewable from inside the app and always current.

### Fixed
- **Payment back button goes to cart.** No longer redirects to Browse Rides by mistake.
- **Same-gender listing validation.** Drivers must have a visible gender set before offering same-gender rides.
- **Map locations required before posting.** Pickup and drop-off must have confirmed coordinates before a ride can be listed.
- **Empty cart blocked from checkout.** Opening payment with an empty cart redirects back with a clear message.
- **Tracking messages clarified.** Track My Trip now gives clear messages when no sharing session or link is active.

---

## v2026.05.10 BETA

### New
- **Personal Car and Rideshare Service.** Drivers choose a ride type at the start of listing. Personal Car supports vehicle details and exact seat selection. Rideshare Service uses general rider spots without car details.
- **Ride type-aware summaries.** Ride cards, cart items, and profile summaries reflect the correct language for each ride type.

### Fixed
- **Rideshare Service summaries no longer show seat assignments.** Driver summaries for Rideshare Service listings are now correct.

---

## v2026.05.9 BETA

### New
- **Live route context in tracking.** Track My Trip shares location updates with route context when available.
- **Better tracking fallback.** While the embedded map loads, a visible location pin and Google Maps link keep trusted viewers oriented.
- **Add trusted person mid-trip.** Invite or resend a trusted-person link while location sharing is already active.
- **More reliable campus routing.** Ride maps stay focused on supported school regions more consistently.

### Fixed
- **Track My Trip map updates correctly.** The map no longer stalls on raw coordinates after Google Maps loads.
- **Shared links refresh route data.** Tracking sessions update route context when location updates arrive or a shared link opens.
- **Campus searches stay on-region.** Ambiguous school searches are less likely to route to the wrong state or region.

---

## v2026.05.8.1 BETA

### New
- **Required profile fields gated before ride access.** Name, birthday, and gender must be completed before using ride services.
- **Legacy account identity completion.** Older accounts can fill in missing birthday or gender once — those fields lock after.
- **Payment method is optional.** Riders can use LinkUp without saving a default payment method first.
- **Profile prompts go to the right section.** Policy and profile prompts send users directly to the relevant Profile tab.

### Fixed
- **Gender saves for incomplete accounts.** Users who still need to complete identity settings can now save gender correctly.
- **Payment method not required for identity prompts.** Identity and policy requirements are separate from saved payment method.

---

## v2026.05.8 BETA

### New
- **Updated Terms and Privacy Notice.** LinkUp now shows the May 8, 2026 Terms and Privacy Notice.
- **Policy re-acceptance flow.** Existing users are prompted to review and accept updated policies before using ride services.

### Fixed
- **Legal page back button restored.** Returns users to the page they were on, not the home screen.
- **Policy prompts re-trigger on version change.** Users are prompted again whenever a required policy version updates.

---

## v2026.05.3 BETA

### New
- **Newest release shown first.** Release notes now open to the most recent version.

### Fixed
- **Release note ordering corrected.** Newer releases no longer appear below older ones.

---

## v2026.05.2 BETA

### New
- **Reset browse filters.** Browse Rides now has a reset filters button.
- **Sort controls in results.** Sort by appears inside the available rides area, not above it.
- **Clearer radius labels.** Walking radius and detour radius are easier to tell apart.

### Fixed
- **Empty coordinates no longer default to 0,0.** Blank map fields no longer register as a real location.
- **Map clicks don't change routes accidentally.** Browsing or viewing a route is less likely to be disrupted by accidental taps.

---

## v2026.05.1 BETA

### New
- **Track My Trip with route sharing.** Share live location and route context together on one map.
- **Policy agreement flow.** Review and accept updated Terms and Privacy Notice from Profile.
- **Payment and payout sections in Profile.** Riders manage payment details. Drivers manage payout details. Each in a dedicated section.
- **Core ride workflow.** Requested rides, ride history, chat, ratings, and seat reservations — the full flow from request to review.

### Fixed
- **Tracking route displays correctly.** Location and route context appear together more reliably.
- **Ride history easier to review.** Current and past trips are better organized and accessible.
