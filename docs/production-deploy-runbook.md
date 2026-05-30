# LinkUp Production Deploy Runbook

Use this flow when GitHub has updates that you want to push into production.

## 1. Check Locally Before Pushing

From your local LinkUp repo:

```bash
git pull origin main
npm ci
npm test
git status
```

Only continue if `npm test` passes.

## 2. Push Your Changes To GitHub

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

## 3. Update The Production Server

SSH into the production server, then run:

```bash
cd /path/to/LinkUp
git pull origin main
npm ci
npm test
```

Only restart production if `npm test` passes on the server.

## 4. Restart Production

Use the restart command for however LinkUp is running on the production server.

If using PM2:

```bash
pm2 restart linkup
```

If using systemd:

```bash
sudo systemctl restart linkup
```

## 5. Verify Production

```bash
curl -I https://www.linkuprides.com/
curl https://www.linkuprides.com/api/auth/me
```

When logged out, `/api/auth/me` should return:

```json
{"error":"Not authenticated"}
```

That is normal. It means the API is responding.

## Important

Do not use this command for production:

```bash
npm run start:test
```

That command is only for local testing. Production should use the real production environment variables and the normal production restart command.

