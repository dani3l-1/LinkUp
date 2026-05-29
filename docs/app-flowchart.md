# LinkUp app flow chart

This file documents the main LinkUp web-app flow. The diagrams use Mermaid, so they render directly in GitHub and most Markdown previewers.

## Main user flow

```mermaid
flowchart TD
  A[Open LinkUp] --> B{Route in URL hash?}
  B -->|track viewer token| T0[Shared tracking page]
  B -->|privacy or terms| L0[Legal page]
  B -->|normal app route| C[Check session with GET /api/auth/me]

  C -->|No active session| D[Auth screen]
  C -->|Active session| E[Dashboard shell]

  D --> D1[Sign in]
  D --> D2[Create account]
  D --> D3[Forgot or reset password]
  D1 -->|2FA required| D4[Two-factor verification]
  D1 -->|Success| C
  D2 -->|University email accepted| D5[Email verification]
  D5 -->|Code verified| C
  D3 --> D1
  D4 -->|Success| C

  E --> F{Account ready?}
  F -->|Not service approved| F1[Waitlist page]
  F -->|Needs latest Terms or Privacy consent| F2[Policy agreement panel]
  F -->|Missing required settings| F3[Profile completion prompt]
  F -->|Ready| G[Dashboard home]

  F2 -->|Accept policies| G
  F3 -->|Complete profile| G

  G --> H[Browse rides]
  G --> I[Request ride]
  G --> J[List ride]
  G --> K[Your rides]
  G --> M[Chat]
  G --> N[Cart]
  G --> O[Profile]
  G --> P[Leaderboard]
  G --> Q{Admin user?}

  Q -->|Yes| Q1[Admin control room]
  Q -->|No| G

  H --> H1{Browse mode}
  H1 -->|Rider| H2[Available driver ride listings]
  H1 -->|Driver| H3[Open rider requests]
  H2 --> N
  H3 --> J

  I --> I1[Create ride or moving request]
  I1 --> H3

  J --> J1[Pick provider type]
  J1 -->|Personal car| J2[Vehicle info, seats, route, price]
  J1 -->|Rideshare service| J3[Service, spots, route, price]
  J1 -->|Moving service| J4[Vehicle/capacity, route, price]
  J2 --> J5[POST /api/rides]
  J3 --> J5
  J4 --> J5
  J5 --> K

  N --> N1[Select reserved ride seats]
  N1 --> N2[Accept checkout terms]
  N2 --> N3[Stripe embedded checkout]
  N3 -->|Payment complete| K

  K --> K1[Current rides]
  K --> K2[Ride requests]
  K --> K3[History]
  K1 --> M
  K1 --> R[Track my trip]
  K3 --> K4[Rate or complete ride]

  O --> O1[Personal info]
  O --> O2[Transfer school]
  O --> O3[Default payment method]
  O --> O4[Driver payouts]
  O --> O5[Security and 2FA]
  O --> O6[Policies, appearance, release notes, about]

  M --> M1[Ride conversation]
  P --> P1[School and miles leaderboards]
  Q1 --> Q2[Users, reports, rides, requests, activity, audit log]
```

## Backend and data flow

```mermaid
flowchart LR
  Browser[Browser UI: public/index.html and public/app.js] --> API[Express API: server.js]
  API --> Session[Session cookie and server session store]
  API --> DB{Persistence mode}
  DB -->|Local test/dev| JSON[data/db.json]
  DB -->|DATABASE_URL set| PG[PostgreSQL linkup_state JSONB]
  API --> Maps[Google Maps APIs]
  API --> Stripe[Stripe checkout, cards, payouts]
  API --> Email[SMTP or local email outbox]
  API --> Push[Web Push and APNs]
  API --> Socket[Socket.IO ride/chat updates]

  Browser -->|Hash routes| Routes[Client-side pages]
  Routes --> Auth[Auth/profile/policy gates]
  Routes --> Rides[Rides and ride requests]
  Routes --> Payments[Cart and checkout]
  Routes --> Tracking[Track my trip]
  Routes --> Admin[Admin dashboard]
```

## Auth and access gates

```mermaid
flowchart TD
  A[User submits credentials] --> B{Existing account?}
  B -->|No| C[Create account with university email]
  C --> D[Send verification code]
  D --> E[Verify email]
  B -->|Yes| F[Validate password]
  F --> G{2FA enabled?}
  G -->|Yes| H[Verify authenticator or email code]
  G -->|No| I[Create session]
  H --> I
  E --> I
  I --> J[GET /api/auth/me]
  J --> K{Can use ride services?}
  K -->|Not approved| L[Waitlist]
  K -->|Policies outdated| M[Accept required policies]
  K -->|Required profile missing| N[Complete profile]
  K -->|Ready| O[Dashboard]
  M --> O
  N --> O
```

## Ride marketplace flow

```mermaid
flowchart TD
  A[Ready user] --> B{User intent}
  B -->|Rider needs a ride| C[POST /api/ride-requests]
  B -->|Driver lists a ride| D[POST /api/rides]
  B -->|Rider browses rides| E[GET /api/rides]
  B -->|Driver browses requests| F[GET /api/ride-requests]

  C --> G[Visible to matching drivers]
  F --> H[Driver makes offer]
  H --> I[POST /api/ride-requests/:requestId/offer]
  I --> J{Rider allows shared ride?}
  J -->|Yes| K[Driver can post shared ride]
  K --> D
  J -->|No| L[Request remains offer-only]

  D --> M[Ride listing visible to matching riders]
  E --> N[Rider selects ride and seat]
  N --> O[Add to cart]
  O --> P[Checkout]
  P --> Q[Passenger reservation]
  Q --> R[Chat, tracking, completion, rating]
```

## Cart and payment flow

```mermaid
flowchart TD
  A[Rider chooses ride or seat] --> B[POST /api/cart/:rideId]
  B --> C[GET /api/cart]
  C --> D[Select cart items]
  D --> E[Accept terms]
  E --> F[POST /api/cart/create-embedded-checkout]
  F --> G[Stripe Embedded Checkout]
  G --> H{Payment result}
  H -->|Success| I[POST /api/cart/checkout/complete]
  H -->|Canceled or failed| C
  I --> J[Reserve passenger seats]
  J --> K[Record payment]
  K --> L[Driver wallet and ride history update]
```

## Trip tracking flow

```mermaid
flowchart TD
  A[User opens Track my trip] --> B[POST /api/trips/track/start]
  B --> C[Generate viewer link token]
  C --> D[Copy link or send trusted email]
  D --> E[Browser posts location updates]
  E --> F[POST /api/trips/track/:tripId/location]
  F --> G[Trusted viewer opens /track/:viewerToken]
  G --> H[GET /api/track/:viewerToken]
  H --> I[Show live location and route]
  A --> J[Stop tracking]
  J --> K[POST /api/trips/track/:tripId/stop]
```

## Admin flow

```mermaid
flowchart TD
  A[Signed-in user] --> B{Email in ADMIN_EMAILS?}
  B -->|No| C[No admin route access]
  B -->|Yes| D[GET /api/admin/overview]
  D --> E[Review metrics and tables]
  E --> F[Patch user state]
  E --> G[Resolve reports]
  E --> H[Delete rides or ride requests]
  E --> I[Audit activity]
```

