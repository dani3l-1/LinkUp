# GitHub File Guide

Use this list when uploading LinkUp to GitHub.

## Upload

- `README.md`
- `package.json`
- `package-lock.json`
- `server.js`
- `.env.example`
- `.gitignore`
- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `public/assets/images/`
- `docs/assets/`
- `data/.gitkeep`

## Hide

- `.env`
- `node_modules/`
- `data/db.json`
- `data/email-outbox.json`
- `.DS_Store`
- `public/.DS_Store`
- debug logs such as `npm-debug.log*`, `yarn-debug.log*`, and `yarn-error.log*`

## Why

- `.env` stores private keys and secrets.
- `data/db.json` stores local user, ride, cart, and chat data.
- `data/email-outbox.json` can include emails, verification codes, and reset messages.
- `node_modules/` can be recreated with `npm install`.
