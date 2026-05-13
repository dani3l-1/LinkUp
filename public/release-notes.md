# LinkUp Release Notes

---

## v2026.05.13 BETA

### New features
- **Multiple-trip cart checkout.** Riders can keep multiple trips in the cart, select individual trips for checkout, use Select all, and see a selected-trip subtotal before paying.
- **Clearer cart reservation status.** The cart now reminds riders that trips are not reserved until checkout is completed.
- **Single cart Terms agreement.** Riders only need to agree to the Terms once at the bottom of the cart for the selected checkout trips.
- **Profile photos.** Users can add, preview, adjust, save, remove, and display a profile picture on their public profile.
- **Optional academic details.** Users can add an optional major and Class of year to their profile, and those details appear on public profiles when provided.
- **Legal popups from agreement text.** Underlined Terms and Conditions and Privacy Notice text now opens the full legal documents in a popup without leaving the current page.

### Bug fixes
- **Expired cart rides are removed automatically.** Trips whose departure time has passed are removed from the cart and users see a one-time notice when that happens.
- **Checkout only reserves selected trips.** Unselected cart trips stay in the cart after checkout instead of being removed.
- **Past rides cannot be added or checked out.** Expired rides are blocked from cart add and checkout flows even if the page was already open.
- **Password recovery is clearer.** Account recovery now focuses on password reset only because users sign in with their school email, not a separate username.
- **Password length is enforced.** Signup and reset passwords now require at least 8 characters, with frontend and backend validation.
- **Profile save alignment is cleaner.** The Save Profile button is centered in the profile form.
- **Chat access is easier to find.** The Chat button now sits on the top-left side of the header.
- **Reload logo flash is fixed.** Reloading the app no longer briefly shows the large login logo before the correct page finishes loading.

---

## v2026.05.12 BETA

### New features
- **Same-school ride restrictions.** Drivers can list rides for same-school riders only, and riders can request same-school drivers only.
- **More private driver names.** Driver full names are only shown to riders who reserved the ride; other users see first name and last initial.
- **More accurate mileage.** New rides and ride requests now use driving distance from route data instead of straight-line distance when available.

### Bug fixes
- **Checkout Terms prompt is visible when needed.** Cart items that still need ride Terms agreement now show a checkbox before payment.
- **Browse cards are cleaner.** Browse results no longer show raw pickup/drop-off coordinates, empty Notes rows, or combined detour radius text.
- **Detour radius is easier to read.** Pickup and drop-off detour/walking radius now appear as separate rows.
- **Cart actions are less cluttered.** Report Driver no longer appears inside cart items.
- **Navigation wording is clearer.** Browse role choices, recovery actions, back buttons, and checkout buttons now use more specific labels.
- **Release notes are more user-focused.** Internal implementation details were removed from past release notes.

---

## v2026.05.11 BETA

### New features
- **Public user profiles.** Click a driver's, rider's, requester's, or chat sender's name to view their public LinkUp profile and ride stats.
- **User reporting.** Report a driver or rider from ride cards and ride assignment lists when something needs review.
- **User blocking.** Block or unblock another user from their public profile. When blocked, you and that user will not see each other's ride listings or ride requests.

### Bug fixes
- **Blocked users stay separated across ride actions.** Blocked users can no longer reserve each other's rides, offer on each other's ride requests, or post shared rides from each other's requests.
- **Blocked rides are removed from carts.** If you block someone whose ride is already in your cart, that ride is removed automatically.
- **Rideshare-service rides now support rider reporting.** Drivers can report riders even when the ride uses general spots instead of exact seats.
- **Clickable names look cleaner.** Names that open public profiles now look like inline links instead of full action buttons.

---

## v2026.05.10.1 BETA

### New features
- **Policy and release note pages stay current.** Users can view the latest Terms, Privacy Notice, and Release Notes from the app.

### Bug fixes
- **Payment page back button now returns to the cart.** The payment page back button now correctly returns to the cart instead of Browse Rides.
- **Same-gender ride listings now show clearer validation.** Drivers must have a visible gender set before offering same-gender rides.
- **Ride listings now require confirmed map locations.** Drivers must select pickup and drop-off locations with coordinates before posting a ride.
- **Empty carts no longer show a payment page.** Opening the payment page with an empty cart now sends you back to the cart with a clear message.
- **Tracking messages are clearer.** Track My Trip now gives clearer messages when no sharing session or tracking link is active.
- **Checkout empty-cart message is polished.** The empty-cart checkout message now uses consistent punctuation.

---

## v2026.05.10 BETA

### New features
- **Choose Personal Car or Rideshare Service when listing a ride.** Drivers now start by selecting the type of ride they are offering.
- **Personal Car rides support vehicle and seat details.** Personal Car listings include vehicle information, vehicle layout, and exact passenger seat selection.
- **Rideshare Service rides use general spots.** Rideshare Service listings ask for the rideshare service name and number of rider spots, without car details or exact seat selection.
- **Ride summaries match the ride type.** Ride cards, cart items, and profile ride summaries now show shared-spot language for Rideshare Service rides.

### Bug fixes
- **Driver summaries are clearer for Rideshare Service rides.** Rideshare Service listings no longer show personal-car seat assignments.
- **Ride type labels are cleaner.** Labels now say "Personal Car" and "Rideshare Service" without extra wording.

---

## v2026.05.9 BETA

### New features
- **Trusted viewers can see live trip route context.** Track My Trip now shares live location updates with route context when available.
- **Track My Trip has a better fallback view.** If the embedded map is still loading or unavailable, users still see a visible live-location pin and Google Maps link.
- **Trusted-person emails can be added after sharing starts.** You can add or resend a trusted-person invite while location sharing is already active.
- **Campus route lookup is more reliable.** Ride maps are better at staying focused on supported school regions.

### Bug fixes
- **Track My Trip no longer gets stuck on plain coordinates.** The map updates properly after Google Maps loads.
- **Shared tracking links show route data more reliably.** Eligible tracking sessions refresh route context when location updates arrive or when a shared tracking link opens.
- **Campus searches avoid out-of-region routes.** Ambiguous school searches are less likely to route to the wrong state or region.

---

## v2026.05.8.1 BETA

### New features
- **Required profile details are enforced before ride services.** Users must complete required name, birthday, and gender fields before using ride services.
- **Older accounts can complete missing identity details.** Legacy users can add missing birthday or gender once, then those fields lock.
- **Payment method is optional.** Riders can use LinkUp without saving a default payment method first.
- **Profile prompts open the right section.** Policy and required-profile prompts now send users directly to the Profile tab they need.

### Bug fixes
- **Gender can be saved for accounts missing required details.** Users who still need to complete identity settings can now save gender correctly.
- **Required settings no longer ask for payment method.** Identity and policy requirements still apply, but saved payment method is not required.
- **Profile prompts avoid wrong-tab loops.** Users are less likely to get stuck on the wrong Profile section.

---

## v2026.05.8 BETA

### New features
- **Updated Terms and Privacy Notice.** LinkUp now shows the May 8, 2026 Terms and Conditions and Privacy Notice.
- **Users must accept updated policies.** Existing users are asked to review and accept the latest policies before using ride services.

### Bug fixes
- **Return to Browse Rides works on legal pages.** The legal-page back button now returns users to the page they were browsing.
- **Policy update prompts are more reliable.** Users are prompted again when a required policy version changes.

---

## v2026.05.3 BETA

### New features
- **Release notes are easier to read.** The newest release now appears first.
- **Older release history stays visible.** Previous releases remain available below the current version.

### Bug fixes
- **Release note ordering is fixed.** Newer releases no longer appear below older entries.
- **Release history layout is cleaner.** Older entries stay grouped in the release history view.

---

## v2026.05.2 BETA

### New features
- **Reset browse filters.** Browse Rides now includes a reset filters button.
- **Sort controls are easier to find.** Sort by now appears inside the available rides results area.
- **Radius labels are clearer.** Rider walking radius and driver detour radius are easier to understand.
- **Map browsing is safer.** Clicking the map no longer accidentally changes pickup or drop-off locations.

### Bug fixes
- **Blank map coordinates no longer become 0,0.** Ride maps no longer treat empty coordinates as a real location.
- **Map clicks no longer change routes by accident.** Browsing or editing a route is less likely to be disrupted by accidental map clicks.
- **Browse controls are easier to reset and compare.** Radius and sorting changes are clearer when filtering rides.

---

## v2026.05.1 BETA

### New features
- **Track My Trip route sharing.** Riders can share their live location and route context on the same map.
- **Policy agreement flow.** Users can review and accept updated Terms and Conditions and Privacy Notice from Profile.
- **Profile payment and payout sections.** Riders can manage payment details, and drivers can manage payout details.
- **Requested rides, ride history, chat, ratings, and seat reservations.** LinkUp now supports more of the core ride workflow from request to reservation and review.

### Bug fixes
- **Tracking route display is clearer.** Rider location and route context appear together more reliably.
- **Ride history and seat reservations are easier to review.** Riders can better review current and past trips.
- **Profile sections are better organized.** Payment and payout information are separated into clearer sections.
