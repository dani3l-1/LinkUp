# LinkUp App Team Handoff

This folder contains the files the app team should use to make the mobile app accurately match the LinkUp website and backend.

## Read First

1. `features.md`
   - Product behavior source of truth.
   - Explains each production-facing feature, how it should work, and what it connects to.

2. `API.md`
   - Backend route and data-contract reference.
   - Use this to wire app screens to the website backend.

3. `features.json`
   - Machine-readable feature manifest for app clients.
   - Keep aligned with `features.md`.

## Supporting Files

- `app-flowchart.md`
  - Main LinkUp user, checkout, tracking, admin, and backend flows.

- `release-notes.md`
  - User-facing production changelog.

- `production-deploy-runbook.md`
  - Production update and deployment process.

- `terms-and-conditions.md`
  - Current Terms and Conditions.

- `privacy-notice.md`
  - Current Privacy Notice.

## App Team Rule

The mobile app should be a client of the LinkUp backend, not a separate version of LinkUp.

Match the website's:

- Auth and waitlist rules
- Ride marketplace behavior
- Cart and payment behavior
- Wallet behavior
- Safety and tracking behavior
- Notification preferences
- Email-triggered backend events
- Profile and policy requirements

If the app and website disagree, the website/backend behavior wins until this handoff folder is updated.
