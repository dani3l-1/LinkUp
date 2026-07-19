# LinkUp Release Notes

---

## v2026.07.19 BETA

### Improvements
- **Built to stay fast as more students join.** Rides, messages, and payments are now stored more efficiently behind the scenes, so LinkUp keeps loading quickly as campuses fill up. Nothing changes in how you use the app.

---

## v2026.07.17 BETA

### New
- **Events discovery.** Riders and drivers can open Events, search event rides, and jump directly into Browse Rides with the event venue already selected. Event names are optional when listing or requesting a ride.
- **LinkUp LinkLine icons.** Primary navigation and account controls now use LinkUp's own rounded, node-based icon language instead of generic stock glyphs.

---

## v2026.07.16 BETA

### Improvements
- **Browse Rides now keeps the map in place.** On desktop, the map matches the visible height of three collapsed ride cards while only the rides column scrolls, making it easier to compare routes without losing map context.

---

## v2026.07.10 BETA

### New
- **Interactive production UI demo.** Waitlist visitors can explore the real LinkUp interface with isolated fictional data, including ride browsing, Google Maps, seat booking, the cart, reserved ride details, and the driver wallet and payouts experience. Demo actions do not create accounts, charge payments, or modify production data.
- **Guided demo shortcuts.** Four large shortcuts take visitors directly to Find a Ride, Book a Seat, Ride Day, and Drive & Earn, with each shortcut loading the matching production screen and sample state.

---

## v2026.07.07 BETA

### Fixed
- **Waitlisted users can return from Sign In.** If a signed-in user's account is still on the waitlist and they land on the Sign In screen, a **Back to waitlist** button now returns them to their waitlist status page without signing in again.
- **Dashboard pages no longer slide under the logo in light or dark mode.** The dashboard header and greeting now stay in normal page flow instead of floating transparently over content, preventing profile forms and other pages from passing underneath the centered logo while scrolling.

---

## v2026.07.04 BETA

### New
- **Rotating landing headlines.** The guest landing page now cycles through four slogans — "Your campus, connected.", "Get there together.", "Link up, ride together.", and "Connecting campuses, one ride at a time." — showing the next one on each visit.
- **"What you get" feature overview.** The landing page now includes a six-card grid summarizing the product — Find a ride, Request a ride, List a ride, Ride dashboard, Driver tools, and Safety tools — so visitors can see everything LinkUp does without leaving the page.
- **Faster waitlist signup.** Joining the waitlist now takes just a university email and a Ride / Drive / Not sure choice — the name field was removed, and full details are collected later during account setup.
- **Live waitlist momentum.** A counter under the signup form shows how many students across how many schools are already on the waitlist, updated from real signup data.
- **Expandable school leaderboard.** The leaderboard shows the top five schools and, when more are waiting, a "Show all N schools" button expands the full list in place.

### Improvements
- **Landing page fits one screen on desktop.** The page now uses a wide two-column layout above 960px, with the pitch and signup side by side and the supporting content below.

### Fixed
- **Light mode landing page rendered a dark signup panel.** Guest landing elements now follow the selected theme.

---

## v2026.06.08 BETA

### New
- **Public landing page.** Visitors who aren't signed in now see a proper landing page instead of the login form. The page shows the app's value proposition, three benefit points, and a live waitlist leaderboard with real school counts — everything you need to decide whether to join. Clicking Sign Out also brings you here instead of the login screen.
- **Hyperspace warp login animation.** After signing in, 16 glowing teal lines converge simultaneously from every edge of the screen toward the center — diagonal, cardinal, and in-between directions — creating a warp-drive effect. On impact, a radial burst expands, then the LinkUp logo materializes at the center of the screen. The background matches your chosen dark or light theme. The white logo automatically inverts to dark on light backgrounds.
- **iOS-style 6-digit code input.** Email verification and two-factor authentication now use six individual digit boxes instead of a single text field. Typing fills and advances automatically, backspace moves back, paste distributes digits across all boxes, and the form submits the moment the sixth digit is entered — no need to tap Verify.

---

## v2026.06.04 BETA

### New
- **Notification dropdown.** A new Notifications button in the dashboard header shows ride updates and LinkUp alerts in a compact dropdown list, sorted newest to oldest, without taking users to a separate page.
- **Friendlier invite links.** Profile invite links now use readable names and member numbers when available, while still supporting older invite codes.

### Improvements
- **Unread notification badge.** The notification count now sits directly on the bell icon as a red unread badge, showing `9+` when there are more than nine unread updates.

---

## v2026.06.03 BETA

### New
- **Boarding pass on the dashboard.** Your next ride now appears as a boarding pass at the top of the dashboard. It shows your full pickup and drop-off addresses, passenger name, date, departure time, driver, seat, vehicle, duration, distance, and a decorative barcode stub — all in one place before you head out.
- **Ride-role checklists.** A step-by-step checklist appears on the dashboard starting one hour before your departure time, inspired by the airline gate experience. Riders and drivers get different checklists tailored to what each person needs to do. The checklist stays visible through the ride so you can complete steps like giving your arrival code and rating after you arrive. Progress saves per ride.
- **Driver route navigation.** Drivers now see a dedicated route card with the next/current stop, all rider drop-off stops, the final destination, and one-tap buttons to open the full route in Google Maps or Apple Maps.
- **Driver dashboard preview.** A new driver dashboard preview shows the driver boarding pass, seat manifest, route navigation, driver checklist, Google Maps route view, and the same safety tools riders have.
- **Send feedback from Profile.** A new "Send feedback" section in Profile lets you submit bug reports, feature requests, or general feedback directly to the LinkUp team. Messages are delivered by email with your name, university, and member number attached so we can follow up.
- **University directory expanded to 2,400+ schools.** The school directory now covers virtually every U.S. and Canadian university, college, and community college with a `.edu` or `.ca` email domain. Students whose schools weren't previously recognized will now see their correct university name instead of a fallback.

### Improvements
- **Driver disclaimer on List a Ride.** Drivers must now confirm they have a valid license and current auto insurance, and acknowledge that LinkUp is a peer-to-peer platform rather than a commercial transportation service, before posting any ride.

### Fixed
- **Safety features apply to drivers and riders.** Live tracking, Safety Mode recording, and Report to LinkUp are now presented as ride-wide tools for both sides instead of rider-only tools.
- **Live tracking map shows the route before GPS starts.** The tracking map can draw the ride route first, then add the current-location dot once GPS begins updating.
- **Create Account has a sign-in escape hatch.** Users who realize they already have an account can return from Create Account to Sign In without reloading the page.

---

## v2026.06.02 BETA

### New
- **Rider Safety hub.** The Trip Tracking section has been redesigned as a dedicated Rider Safety feature with a shield icon and mission statement. Three tools are now clearly separated: Live Location sharing, Safety Recording ("Record this ride"), and Report to LinkUp. Each tool lives in its own card with a clear header, description, and actions.
- **Safety recording without mid-ride consent prompts.** Drivers consent to safety recording when they list a ride — it is written into the Terms and Conditions at listing time. Riders no longer need to check a box mid-ride, so the feature works silently when they actually need it.
- **Conduct strike system.** Admins can issue conduct strikes to any user for Terms of Service violations. Three severity levels: Level 1 (minor — rude behavior, no-show, late cancellation), Level 2 (serious — harassment, property damage, discrimination), Level 3 (severe — assault, illegal activity, sexual harassment, fraud). Accumulating three total strike points results in a permanent account ban. Users receive an email with the violation category, admin note, and remaining points when a strike is issued.
- **Private conduct record.** Users can view their own conduct history from Profile → Conduct record — strike level, category, date, and any note from the moderator. Only you can see your own record.
- **Refreshed Browse, List, and Request ride pages.** All three pages now share a unified design language: icon-based role selection cards (I'm a Driver / I'm a Rider), icon-based ride provider cards (Personal Car / Rideshare / Moving Service), glass-panel filter sections, pill-style back buttons, and consistent uppercase section labels.
- **Refreshed dashboard home.** Cleaner welcome bar with mixed-case greeting and university label, pill-style navigation tabs with active state highlighting per page, ride stats shown as metric cards instead of a flat divider, and proper SVG icons on the Find a Ride and List a Ride buttons.

### Safety & Privacy
- **Driver consent to safety recording built into Terms of Service.** When a driver lists any ride on LinkUp, they acknowledge and consent that riders may silently record audio for personal safety purposes. This is the same legal approach used by Uber and Lyft. No mid-ride announcement is required from the rider.
- **Conduct strike system with automatic permanent bans.** Three total strike points trigger a permanent ban with no manual admin step. Level 3 violations (assault, illegal activity, sexual harassment, fraud) are an immediate ban. Bans are communicated to the user by email with the reason clearly stated.
- **Safety recording access audit trail.** Every time an admin loads and plays a safety recording, the access is recorded in the admin audit log with the admin's identity, timestamp, recording ID, and the linked ride.
- **Updated Privacy Notice — recording access clause.** The Privacy Notice now explicitly states that LinkUp only accesses recordings when: a safety report is filed; moderators have reasonable cause; or access is required by law. Uploading a recording constitutes user authorization for LinkUp to review it for safety and legal purposes.
- **Policy re-acceptance required for all users.** Both the Terms and Conditions (v2026.06.2) and Privacy Notice (v2026.06.2) were updated on June 2, 2026. All existing users are prompted to review and accept the updated documents before using ride services.

---

## v2026.05.28 BETA

### New
- **Friend invites from Profile.** You can now send a LinkUp invite email to a friend directly from Profile → Personal info.
- **Interactive ride checklist.** When you have an upcoming ride as a passenger, a step-by-step checklist now appears directly on your dashboard below the ride card. Tap each step to mark it done — your progress is saved per ride and persists across sessions. Steps cover reserving your seat, verifying the driver, sharing live tracking, giving your arrival code, and rating the driver after arrival.
- **Ride confirmation email upgrade.** Reservation emails now include polished ride details, the driver's vehicle and plate when available, a 6-digit arrival code for offline use, support contact info, and a link back to the ride checklist.

### Improvements
- **Wallet credit applied by default.** LinkUp Wallet credit is now selected automatically on the payment page when available. Riders can still choose "Use card instead" before checkout.
- **Payment page review panel.** Ride details and payment method selection now live together on the right side of the payment page, keeping payment entry separate from trip review.
- **Cleaner checkout flow.** The no-refund notice in the cart and payment panels is now a subtle footnote rather than a prominent warning box. The checkout button now reads "Reserve your seat →" to better reflect what's happening.

### Safety & Privacy
- **6-digit arrival code for in-person driver verification.** Every rider receives a unique 6-digit code in their confirmation email and on the ride card. Sharing it verbally with the driver at pickup confirms identity — drivers cannot claim a completed trip without it. Codes are never included in driver-facing data.
- **Checklist step for driver verification.** The new ride checklist explicitly prompts riders to verify the driver's vehicle, plate, and name before getting in the car — reducing the risk of boarding the wrong vehicle.

---

## v2026.05.27 BETA

### New
- **School transfer verification.** Students can now move their LinkUp account to a new college by entering their new school and verifying a 6-digit code sent to their new university email.

### Improvements
- **Member numbers.** Student profiles show member numbers based on join order.
- **Community safety rules.** LinkUp now has clearer rules for fake listings, harassment, scams, off-app pressure, reports, emergency guidance, and moderation actions.

### Fixed
- **Policy document buttons open correctly.** The Policy Agreement page now opens expanded Terms and Conditions or Privacy Notice views and loads the full markdown documents.

### Safety & Privacy
- **School transfer requires verified university email.** Transferring an account to a new school requires a 6-digit code sent to the new university address — preventing takeovers or false affiliation claims by entering any email.
- **Community safety rules published.** Explicit prohibitions against fake listings, off-platform payment pressure, harassment, scams, and impersonation are now part of the Terms, giving LinkUp clear grounds to ban violators.

---

## v2026.05.26 BETA

### New
- **Drop-off privacy.** When you post a ride request, your exact drop-off address is hidden from public view by default. Drivers browsing requests see only a general neighborhood area — your precise location is revealed only after a driver makes you an offer. You can turn this off in the request form if you prefer your destination to be shown exactly.

### Fixed
- **Trip completion form now appears for drivers.** After a rider pays and the trip departs, drivers can now see and submit the 6-digit completion code.
- **Signup button no longer freezes.** If you tried to sign up without checking the terms checkboxes, the Create Account button would get stuck in a loading state. It now resets correctly.
- **Offer submit button no longer freezes on route errors.** If the route estimate failed during posting, the Post Ride button would get stuck. It now always resets regardless of what goes wrong.
- **Passenger data is no longer visible to other riders.** Email addresses and rating details stored on passenger records were included in API responses visible to other users on the same ride. Only the driver and each individual rider can now see their own details.
- **Completion code no longer visible in profile data.** The 6-digit trip completion PIN was inadvertently included in profile responses for drivers. It is now correctly withheld.

### Safety & Privacy
- **Exact drop-off hidden by default.** Riders' precise destination addresses are not shown publicly — only a general area is visible until a driver is matched. This prevents a rider's home address or other sensitive destination from being broadcast to all browsing drivers.
- **Passenger personal data scoped to authorized parties only.** A fix closed a data exposure issue where riders on the same trip could see each other's email addresses and rating details. Each rider's information is now only visible to themselves and the driver.
- **Completion code withheld from driver-facing data.** The 6-digit trip completion PIN is no longer exposed in driver API responses. Only the confirmed rider sees it after departure.

---

## v2026.05.21 BETA

### New
- **Trip completion codes.** Every ride now has a 6-digit completion code. After the trip departs, the rider sees their code on the confirmed ride card and shares it verbally with the driver. The driver enters it in the app to confirm the trip — earnings unlock instantly. If the driver never claims it, earnings auto-release 48 hours after the ride ends. Wrong codes are locked out after 5 attempts.
- **Apply wallet credit at checkout.** Riders with a LinkUp Wallet balance now see an "Apply $X credit" button on the payment page.
- **Moving Service.** Drivers can now list a moving service — cargo only, no passengers.
- **Photo required for moving requests.** When posting a moving request, riders must upload at least one photo of their items.
- **Two-factor authentication.** Protect your account with an authenticator app (Google Authenticator, Authy, etc.). Set up 2FA from Profile → Security. Once enabled, signing in requires your password and a 6-digit code from your app.
- **Redesigned verification email.** The email verification code now arrives in a clean, branded email with each digit displayed in its own highlighted box.

### Safety & Privacy
- **Completion code prevents earnings fraud.** Drivers cannot mark a trip complete without the rider's verbal 6-digit code. This closes a path where a driver could falsely claim a trip happened. Codes lock out after 5 wrong attempts to prevent brute-force guessing.
- **Earnings auto-release after 48 hours.** Even if a completion code is never exchanged, earnings release automatically — preventing drivers from withholding a code to pressure riders.

---

## v2026.05.20 BETA

### New
- **Stripe Embedded Checkout.** Checkout now uses Stripe's fully hosted payment form — Apple Pay, Google Pay, Link, and card are all supported without a redirect.
- **In-app Stripe payout onboarding.** Drivers can now complete their Stripe Connect setup without ever leaving LinkUp.
- **Auto theme.** Automatically switches between light and dark mode based on the time of day.

### Improvements
- **Redesigned Personal Info page.** Profile photo editing now uses a familiar hover-to-edit overlay, then click to upload or remove.

### Safety & Privacy
- **Card details never touch LinkUp servers.** Stripe's Embedded Checkout means payment card data is entered directly into Stripe's hosted form. LinkUp receives only a payment summary — no raw card numbers, CVV, or full PANs are ever transmitted to or stored on LinkUp infrastructure.
- **Apple Pay and Google Pay support.** Both use device-level tokenized payments — the actual card number is never transmitted, reducing fraud exposure for riders.
- **Driver payout setup is protected.** Connecting your bank details for payouts now opens through a secure, verified link, so the setup flow can't be tampered with or hijacked.

---

## v2026.05.17 BETA

### Improvements
- **Better search previews.** LinkUp now appears with a cleaner logo and description in Google and external link previews.
- **Light and dark mode.** Profile now has an Appearance section where users can switch LinkUp between dark mode and light mode.

### Safety & Privacy
- **Your details aren't left behind on shared computers.** Pages containing personal or payment information are no longer stored by the browser, so using LinkUp on a library or lab machine doesn't leave your info cached after you sign out.
- **Profile photo content verification.** Uploaded photos are validated as real image data before being accepted. This prevents injecting non-image payloads disguised as profile pictures.

---

## v2026.05.16 BETA

### New
- **Branded verification email.** Email verification codes now arrive in a clean, branded LinkUp email with a plain-text fallback.
- **Reservation confirmation email.** Riders get a thank-you email with trip details after successfully reserving a seat.
- **Spend your wallet credits.** Completed driver earnings can now be applied automatically toward future rides before charging your card.
- **Wallet breakdown at checkout.** Checkout now shows your LinkUp Wallet balance, how much is applied, and the remaining card charge.

### Fixed
- **Legal pages load again.** Privacy Notice and Terms & Conditions now open correctly inside the app.

### Safety & Privacy
- **Branded emails help users identify legitimate LinkUp messages.** Consistent branding and formatting on verification and confirmation emails makes phishing attempts easier to spot — users can visually distinguish real LinkUp emails from impersonation attempts.
- **Stale checkout blocked.** Checkout prevents a seat from being reserved on a ride that has already departed while the payment page was open — closing a race condition where a rider could pay for an expired seat.

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
- **Accurate leaderboard miles.** Miles now count only completed rides with confirmed riders.
- **Real-time chat.** Messages and typing indicators now update live in confirmed ride chats.

### Safety & Privacy
- **Exact pickup and drop-off shared only after reservation.** Precise stop locations are collected at checkout and shared with the driver only after the reservation is confirmed — not visible to browsing drivers beforehand.
- **Checkout recovery prevents reservation state loss.** When payment finalizes automatically after a browser close, there is no window where a seat could be held but unpaid — preventing scenarios where a seat was blocked without a completed payment.

---

## v2026.05.14 BETA

### New
- **Pay directly in the app.** Riders enter card details inside LinkUp — no redirect to an external Stripe page.
- **Save a default card.** Set a default payment card from your Profile using a secure in-app form.
- **Driver payout connection.** Drivers can connect bank payouts and track payout status inside the app.

### Fixed
- **Browse shows only available rides.** Expired, full, and your own rides are no longer shown in Browse Rides.
- **Stale pages blocked.** Checkout prevents reservations on rides that departed while the page was open.

### Safety & Privacy
- **Stale page protection at checkout.** If a ride departs while the checkout page is open, attempting to pay returns an error rather than completing a reservation for a trip that has already left.
- **Your own rides excluded from Browse.** Drivers cannot accidentally add their own ride to a cart or interact with it as a rider, preventing self-booking exploits.

---

## v2026.05.13 BETA

### New
- **Multi-trip cart.** Add multiple trips, select the ones you want, and review a subtotal before paying.
- **Profile photos.** Upload, crop, and display a profile picture.
- **Academic details.** Optionally add your major and class year.
- **In-context legal docs.** Tapping Terms or Privacy Notice opens the full document in a popup without leaving the page.

### Fixed
- **Expired trips auto-removed.** Rides past their departure are cleared from your cart with a one-time notice.
- **Password recovery improved.** Account recovery now focuses on password reset.

### Safety & Privacy
- **Legal documents accessible in-app before acceptance.** Riders and drivers can read the full Terms and Privacy Notice without navigating away from the sign-up or policy agreement screen — ensuring informed consent is possible without friction.
- **Expired cart items auto-cleared.** Rides that have already departed are automatically removed from the cart, preventing payment for a trip that can no longer happen.

---

## v2026.05.12 BETA

### New
- **Same-school rides.** Drivers can list rides for same-school riders only. Riders can filter for same-school drivers.
- **More private driver names.** Full driver names are only visible to riders with a confirmed reservation. Everyone else sees first name and last initial.
- **Accurate driving distances.** Mileage now uses actual driving distance from route data, not straight-line estimates.

### Safety & Privacy
- **Driver full name hidden until reservation is confirmed.** Browsing riders see only a first name and last initial. The driver's full name is revealed only to riders who have successfully reserved a seat — limiting the personal information broadcast to unconfirmed strangers.
- **Same-school filtering reduces exposure to unknown users.** Drivers and riders can choose to interact only with verified members of their own university, significantly narrowing the pool of strangers they share rides with.

---

## v2026.05.11 BETA

### New
- **Public profiles.** Tap any driver, rider, or chat sender's name to see their public profile and ride stats.
- **Report a user.** Report a driver or rider directly from ride cards and assignment lists.
- **Block a user.** Block or unblock someone from their public profile. Blocked users won't see each other's listings or requests.

### Safety & Privacy
- **In-app user reporting.** Riders and drivers can report unsafe, harassing, or fraudulent behavior directly from ride cards and chat — reports reach the LinkUp admin queue immediately without requiring an external email.
- **User blocking with mutual content hiding.** Blocking a user removes their listings, requests, and profile from your view — and removes yours from theirs. This prevents a blocked person from monitoring your activity or continuing to message you.

---

## v2026.05.10 BETA

### New
- **Personal Car and Rideshare Service.** Drivers choose a ride type when listing. Personal Car supports vehicle details and seat selection. Rideshare Service uses general spots.

### Safety & Privacy
- **Vehicle details required for Personal Car listings.** Drivers listing a personal car must provide the make, model, color, and license plate. License plate is shared only with riders who have a confirmed reservation — giving them the information needed to verify the correct vehicle at pickup.

---

## v2026.05.9 BETA

### New
- **Live route in tracking.** Track My Trip now shares your location with full route context on one map.
- **Add a trusted person mid-trip.** Invite or resend a trusted-person link while location sharing is already active.

### Safety & Privacy
- **Tracking links are time-limited and ride-scoped.** Tracking links expire when location sharing stops — there is no persistent link that could be used to monitor a user's location after a trip ends.
- **Trusted person links can be updated mid-trip.** If a rider forgets to share their location before leaving, they can add or re-send a trusted contact while the trip is already in progress.

---

## v2026.05.8 BETA

### New
- **Updated Terms and Privacy Notice.** LinkUp now shows the May 8, 2026 Terms and Privacy Notice. Existing users are prompted to review and accept before using ride services.
- **Required profile fields.** Name, birthday, and gender must be completed before accessing ride services.

### Safety & Privacy
- **Mandatory policy re-acceptance gates service access.** Users cannot browse rides, list rides, or make reservations until they have read and accepted the current Terms and Privacy Notice — ensuring all active users are bound by the current rules.
- **Required profile completion before service access.** Name, birthday, and gender are required before a user can interact with the ride marketplace, enabling consistent identification of all active users.

---

## v2026.05.1 BETA

### New
- **Track My Trip.** Share your live location and route context together on one map with trusted people.
- **Payment and payout in Profile.** Riders manage payment details. Drivers manage payout details. Each in a dedicated section.
- **Full ride workflow.** Requested rides, ride history, chat, ratings, and seat reservations — the complete flow from request to review.

### Safety & Privacy
- **Track My Trip — opt-in location sharing with trusted contacts only.** Live location is never collected passively. Sharing is entirely user-initiated, transmitted only to a specific trusted person via a one-time link, and stops automatically when the user ends the session.
- **University email required for all accounts.** Only verified `.edu` email addresses from supported universities can create accounts — preventing anonymous signups and limiting the platform to the intended campus community.
