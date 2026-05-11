# LinkUp — Release Notes

---

## v2026.05.11 BETA

### New features
- **Public user profiles.** Clicking a driver, rider, request poster, cart driver, or chat sender name now opens a public LinkUp profile with safe profile details and ride stats.
- **User reporting.** Users can report drivers or riders from ride cards and ride assignment lists, with report details saved for review.
- **User blocking.** Public profiles now include Block/Unblock controls. Blocking hides each user's ride listings and ride requests from the other person.

### Bug fixes
- **Blocked-user marketplace filtering.** Blocked users can no longer reserve each other's rides, offer on each other's ride requests, or post shared rides from each other's requests.
- **Blocked rides removed from carts.** If a blocked user's ride was already in the cart, it is filtered out automatically.
- **Rideshare rider manifests now support rider reporting.** Drivers can report riders even on rideshare-service rides that do not use exact seat maps.
- **Public profile links avoid button styling conflicts.** Clickable names now render like inline links instead of inheriting full ride-card button styling.

---

## v2026.05.10.1 BETA

### New features
- **Document content split into own files.** Privacy Notice, Terms and Conditions, and Release Notes have been moved out of `index.html` into dedicated `privacy.html`, `terms.html`, and `release-notes.md` files. The app now fetches and injects the content at runtime, so updating these documents only requires editing the relevant file — no touching the main app template.
- **Legal loading state.** The Privacy Notice and Terms pages now show a "Loading…" placeholder while content is being fetched, instead of rendering empty.

### Bug fixes
- **Fixed "Return to Cart" button on the payment page navigating to browse rides instead of the cart.** The payment page back button now correctly returns to the cart page.
- **Fixed same-gender ride validation always silently passing or failing.** The offer form was calling `canMatchSameGender(driver, driver)` which returns `false` for any gender not visible (non-binary, prefer-not-to-say, or empty), meaning drivers with those values could never post same-gender rides even if they wanted to bypass the check, while the error message was misleading. Validation now directly checks that the driver has a visible gender set before allowing a same-gender listing.
- **Fixed offer form accepting rides with unresolved pickup or drop-off coordinates.** Previously, if a driver typed a location name but never selected an autocomplete suggestion (so lat/lng were blank), the ride would post with null coordinates. The form now validates that both coordinate pairs are resolved before submitting.
- **Fixed empty cart not being caught on the payment page.** If a user navigated directly to the payment route with an empty cart (e.g. via the browser back button after checking out), the payment page would show 0 rides. It now redirects back to the cart with a clear message.
- **Fixed tracking invite error message when no session is active.** The message now reads "No active tracking session. Start sharing your location first." instead of the ambiguous previous wording.
- **Fixed tracking link copy error message.** The message now reads "No tracking link available. Start sharing your location first." for consistency.
- **Fixed missing period on empty-cart error message in checkout button handler.**

---

## v2026.05.10 BETA

### New features
- Added a first-step choice for listing type: Personal Car or Rideshare Service.
- Personal Car listings keep vehicle details, vehicle layout, and exact passenger seat selection.
- Rideshare Service listings remove car details and seat selection, ask for the service name, and use general rider spots.
- Updated ride cards, cart items, and profile ride summaries so rideshare-service listings show shared-spot language instead of exact seats.

### Bug fixes
- Fixed release notes so every version includes a bug-fixes section with cleaner spacing.
- Fixed a stylesheet selector typo that could interfere with label color styling.
- Fixed driver ride summaries so rideshare-service listings do not show a personal-car seat manifest.
- Refined labels to say Personal Car and Rideshare Service without adding extra "ride" wording.

---

## v2026.05.9 BETA

### New features
- Improved trip tracking so trusted viewers can see live location updates and route context when a ride route is available.
- Restored a visible live-location fallback pin and Google Maps link when the embedded map is still loading or unavailable.
- Allowed trusted-person invite emails to be added or resent after location sharing has already started.
- Hardened location lookup to avoid ambiguous out-of-region routes and keep ride maps focused on supported school regions.

### Bug fixes
- Fixed Track My Trip getting stuck on plain coordinates when Google Maps loaded after the first location update.
- Fixed missing route data for eligible tracking sessions by refreshing the ride route when a location update or shared tracking link is opened.
- Fixed ambiguous campus searches that could choose an out-of-region route instead of a supported school-area result.

---

## v2026.05.8.1 BETA

### New features
- Added a required identity-settings gate for missing name, birthday, or gender before ride services unlock.
- Allowed legacy accounts to add missing birthday or gender once, then lock those fields.
- Removed default payment method from required settings so riders can use services without saving a card first.
- Improved policy and required-settings routing so users are sent to the exact Profile tab they need.

### Bug fixes
- Fixed gender updates for accounts that still needed to complete required identity settings.
- Fixed the access gate so payment method is optional while identity and policy requirements remain enforced.
- Fixed policy/profile routing loops that could leave users on the wrong Profile panel.

---

## v2026.05.8 BETA

### New features
- Updated LinkUp's Terms and Conditions and Privacy Notice with the May 8, 2026 versions.
- Existing users must review and accept the latest policies before using ride services.

### Bug fixes
- Fixed the legal-page Return to Browse Rides button so users can return to the page they were browsing.
- Fixed policy acceptance checks so users are prompted again when the required policy version changes.

---

## v2026.05.3 BETA

### New features
- Release notes now show the newest version at the top.
- Older versions stay in the same box below the current version.

### Bug fixes
- Fixed release-note ordering so the newest version no longer appears below older entries.
- Fixed the release-note panel layout so older entries remain grouped in the same scrollable history.

---

## v2026.05.2 BETA

### New features
- Added a reset filters button for browse rides.
- Moved Sort by into the available rides results box.
- Clarified rider walking radius and driver detour radius.
- Stopped map clicks from changing pickup or drop-off locations.
- Fixed maps treating blank coordinates as location 0,0.

### Bug fixes
- Fixed blank coordinate fields being interpreted as 0,0 on ride maps.
- Fixed accidental pickup or drop-off changes caused by clicking the map while browsing or editing a route.
- Fixed browse controls so radius and sorting changes are easier to reset and compare.

---

## v2026.05.1 BETA

### New features
- Added Track My Trip route sharing with rider location on the same map.
- Added policy agreement flow for Terms and Conditions and Privacy Notice updates.
- Added profile payment method and driver payout sections.
- Added requested rides, ride history, chat, driver ratings, and seat reservations.

### Bug fixes
- Fixed early tracking-route display issues by showing rider location and route context on the same map.
- Fixed ride-history and seat-reservation visibility so riders can better review current and past trips.
- Fixed profile organization by separating payment and payout information into clearer sections.
