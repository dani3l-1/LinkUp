# LinkUp

Ride Connect Save - A university-only ride-sharing app for students to offer and join rides together.

## Features
- **Account system**: Create an account with university email and password
- **University-only**: Must use a valid university email domain (.edu, .ac.uk, etc.)
- **Google Maps integration**: Select pickup and drop-off locations using interactive maps
- **Ride offers**: Post rides with location coordinates, date, available seats, and notes
- **Ride matching**: Browse and join rides within your university network
- **Ride history**: View rides you've posted and rides you've joined
- **Session management**: Secure login with sessions
- **Driver wallet and payouts**: Drivers can track weekly earnings and connect a payout provider for completed rides
- **Default payment method**: Users can save a masked default card through the active payment provider for faster checkout
- **Privacy Policy and Terms**: In-app legal pages explain data handling, user responsibilities, payments, safety, and liability basics
- **Security hardening**: Adds safer response headers, smaller request bodies, stronger session cookie settings, and rate limits on sensitive endpoints

## Requirements
- Node.js and npm
- University email address (required for sign-up)
- Google Maps API key (for location selection)

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local test server:
   ```bash
   npm run start:test
   ```
3. Open http://localhost:4000 in your browser

`npm run start:test` uses `.env.local` and the local JSON database, so test accounts and rides do not touch production.

## Setup with Google Maps

### 1. Get a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Google Maps Platform > Maps JavaScript API
   - Google Maps Platform > Places API
   - Google Maps Platform > Directions API
   - Google Maps Platform > Distance Matrix API
   - Google Maps Platform > Geocoding API
4. Create an API key (Web application)
5. Copy your API key

### 2. Configure the app
Create a `.env` file in the project root (copy from `.env.example`):
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NODE_ENV=development
SESSION_SECRET=your_session_secret_key_here
```

## Project structure
- `server.js` — Express backend with API endpoints and authentication
- `public/index.html` — frontend UI with Google Maps integration
- `public/app.js` — client-side logic for rides, authentication, and maps
- `public/styles.css` — styling with dark theme
- `public/*.md` — in-app legal and release-note content loaded by the frontend
- `data/` — local runtime data only; committed source keeps just `.gitkeep`
- `docs/data-structure.md` — canonical local data shape and migration notes
- `docs/deployment-setup.md` — deployment checklist for Render, Railway, or another Node host with PostgreSQL
- `docs/environment-setup.md` — local vs production environment setup
- `ios/LinkUp/` — iOS wrapper project for App Store builds
- `.env.example` — environment variable template

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Create a new account (university email required)
- `POST /api/auth/signin` — Sign in with email and password
- `GET /api/auth/me` — Get current user info
- `POST /api/auth/signout` — Sign out

### Configuration
- `GET /api/config/google-maps-key` — Get Google Maps API key

### Rides
- `GET /api/rides` — Get all available rides (requires authentication)
- `POST /api/rides` — Create a new ride with location coordinates (requires authentication)
- `POST /api/rides/:rideId/join` — Join an existing ride (requires authentication)
- `GET /api/profile` — Get your posted and joined rides (requires authentication)


## Security notes
- Do not commit `.env`, `.env.local`, `data/db.json`, or `data/email-outbox.json`.
- Use `DATABASE_URL` with managed PostgreSQL for hosted deployments.
- Keep database backups enabled before inviting real users.
- Do not store full payment cards, CVV, bank account numbers, or routing numbers in LinkUp.
- Use Stripe Checkout/Elements and Stripe Connect before production payments and payouts.
- Review the Privacy Policy and Terms of Service with a qualified attorney before public launch.
