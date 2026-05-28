# LinkUp API Guide for iOS

This document maps the existing LinkUp web backend to an iOS client. The iOS app should use the same API routes as the website so web and mobile stay feature-compatible.

## Base URL

Use the production LinkUp origin:

```text
https://your-linkup-site.com
```

For local development:

```text
http://127.0.0.1:PORT
```

## Shared Feature Manifest

The iOS app can fetch the current feature map from:

```text
GET /features.json
```

Use it for onboarding, app parity checks, settings/help screens, and deciding which screens are expected in the iOS app.

## Auth Model

The backend uses session cookies. iOS should preserve cookies between requests with `URLSessionConfiguration.default` or a shared `HTTPCookieStorage`.

Send JSON for write requests:

```http
Content-Type: application/json
```

Most ride-service routes require:

- Authenticated user
- Verified email
- Approved service access
- Latest Terms and Privacy Notice accepted
- Required profile fields completed
- Not suspended

## Auth Routes

```text
POST /api/auth/signup
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/signin
POST /api/auth/2fa/verify
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
POST /api/auth/signout
```

Notes:

- Normal users need a university-style email.
- Emails listed in `ADMIN_EMAILS` may sign up as admin exceptions.
- `POST /api/auth/signin` may return `requires2FA`; then call `POST /api/auth/2fa/verify`.
- `GET /api/auth/me` is the iOS app's startup session check.

## Profile Routes

```text
GET  /api/profile
PUT  /api/profile
POST /api/profile/school-transfer/request
POST /api/profile/school-transfer/verify
PUT  /api/profile/preferences
PUT  /api/profile/policies
GET  /api/users/:userId/profile
POST /api/users/:userId/block
DELETE /api/users/:userId/block
POST /api/reports
```

Profile supports:

- Profile photo
- Academic details
- Instagram, LinkedIn, and X profile links
- Member number or admin number
- School transfer by verifying a new university email
- Public profile stats
- Report/block workflows

## Rides

```text
GET  /api/rides
POST /api/rides
POST /api/rides/:rideId/join
GET  /api/rides/:rideId/messages
POST /api/rides/:rideId/messages
POST /api/rides/:rideId/rating
POST /api/rides/:rideId/complete
```

Use these for:

- Browsing available rides
- Posting personal car rides
- Posting rideshare-service rides
- Posting moving-service rides
- Joining/reserving rides
- Ride chat
- Completion code submission
- Post-trip rating

## Ride Requests

```text
GET  /api/ride-requests
POST /api/ride-requests
POST /api/ride-requests/:requestId/offer
POST /api/ride-requests/:requestId/post-shared-ride
```

Use these for:

- Rider trip requests
- Moving requests with photo
- Driver offers
- Posting a shared ride from a request
- Fuzzy drop-off privacy before driver offer acceptance

## Cart and Checkout

```text
GET    /api/cart
POST   /api/cart/:rideId
DELETE /api/cart/:rideId
POST   /api/cart/create-embedded-checkout
POST   /api/cart/checkout/complete
GET    /api/payments/config
GET    /api/stripe/config
```

The web app uses Stripe Embedded Checkout. For native iOS, decide whether to keep checkout in a web view, use Stripe's native iOS SDK, or continue with the embedded checkout flow inside a controlled browser session.

## Wallet, Payment Method, and Payouts

```text
POST /api/profile/payment-method/setup-session
POST /api/profile/payment-method/complete-setup
PUT  /api/profile/payout
POST /api/profile/payout/stripe-onboarding
POST /api/profile/payout/stripe-status
POST /api/stripe/account-session
```

Use Stripe-hosted/native surfaces for sensitive card and bank details. LinkUp should not collect raw card, CVV, bank account, routing, SSN, or similar financial numbers.

## Leaderboard

```text
GET /api/leaderboard/schools
```

Admin/operator accounts are excluded from student school counts and leaderboard totals.

## Track My Trip

```text
POST /api/trips/track/start
PUT  /api/trips/track/:tripId/trusted-email
POST /api/trips/track/:tripId/location
POST /api/trips/track/:tripId/stop
GET  /api/track/:viewerToken
```

The viewer token route does not require sign-in. iOS can implement native location updates with `POST /api/trips/track/:tripId/location` while a tracking session is active.

## Push Notifications

```text
GET  /api/push/config
POST /api/push/subscribe
POST /api/push/unsubscribe
POST /api/device-token
```

For iOS, register the APNs token with `POST /api/device-token`. Web push subscriptions are separate from native APNs device tokens.

## Admin Routes

```text
GET    /api/admin/overview
PATCH  /api/admin/users/:userId
PATCH  /api/admin/reports/:reportId
DELETE /api/admin/rides/:rideId
DELETE /api/admin/ride-requests/:requestId
```

Only accounts listed in `ADMIN_EMAILS` can access these routes. iOS can either omit admin screens at first or implement them as admin-only views.

## Version and Health

```text
GET /api/version
GET /health
```

Use `/api/version` to show backend version, environment, ride-service pause state, and required policy versions.

## Suggested iOS Screen Mapping

```text
AuthView                 -> Auth routes
EmailVerificationView    -> /api/auth/verify-email
DashboardView            -> /api/auth/me, /api/profile
BrowseRidesView          -> /api/rides, /api/ride-requests
RequestRideView          -> /api/ride-requests
ListRideView             -> /api/rides
YourRidesView            -> /api/profile, /api/rides
RideChatView             -> /api/rides/:rideId/messages
CartView                 -> /api/cart
CheckoutView             -> /api/cart/create-embedded-checkout
ProfileView              -> /api/profile
SchoolTransferView       -> /api/profile/school-transfer/request, /api/profile/school-transfer/verify
PublicProfileView        -> /api/users/:userId/profile
LeaderboardView          -> /api/leaderboard/schools
AdminView                -> /api/admin/overview
TrackMyTripView          -> /api/trips/track/*
```

## Swift Models for Feature Manifest

```swift
struct FeatureManifest: Decodable {
    let app: String
    let version: String
    let updatedAt: String
    let source: String
    let intendedClients: [String]
    let notes: [String]
    let sections: [FeatureSection]
}

struct FeatureSection: Decodable, Identifiable {
    let id: String
    let title: String
    let clientPriority: String
    let features: [String]
    let apiRoutes: [String]?
    let staticAssets: [String]?
}
```

## Swift Fetch Example

```swift
func fetchFeatureManifest(baseURL: URL) async throws -> FeatureManifest {
    let url = baseURL.appendingPathComponent("features.json")
    let (data, response) = try await URLSession.shared.data(from: url)
    guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
        throw URLError(.badServerResponse)
    }
    return try JSONDecoder().decode(FeatureManifest.self, from: data)
}
```

## Implementation Order for iOS

1. Auth, email verification, session restore
2. Profile and latest policy acceptance
3. Browse rides and ride requests
4. Request ride and list ride
5. Your Rides and chat
6. Cart and checkout
7. Public profiles, report, block
8. Track My Trip
9. Admin-only tools
