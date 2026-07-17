# LinkUp Production Deploy Runbook

Use this flow when GitHub has updates that you want to push into production.
The production checkout is `/home/ubuntu/linkup`. Run exactly one PM2 process in
fork mode while application state, rate limits, and Socket.IO remain process-local.

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
cd /home/ubuntu/linkup
git pull --ff-only origin main
npm ci
npm test
```

Only restart production if `npm test` passes on the server.

## 4. Restart Production

Use the restart command for however LinkUp is running on the production server.

If using PM2:

```bash
pm2 restart linkup --update-env
pm2 save
```

If using systemd:

```bash
sudo systemctl restart linkup
```

## 5. Verify Production

```bash
curl -I https://www.linkuprides.com/
curl http://localhost:4000/health
curl http://localhost:4000/ready
curl https://www.linkuprides.com/ready
curl https://www.linkuprides.com/api/auth/me
```

When logged out, `/api/auth/me` should return:

```json
{"error":"Not authenticated"}
```

That is normal. It means the API is responding.

`/ready` must return HTTP 200 with `"ready":true`. It returns HTTP 503 during
startup, graceful shutdown, or a database outage so new traffic can be withheld.

## Current resource limits

Set these values in the production `.env`:

```env
APP_INSTANCE_COUNT=1
DATABASE_POOL_MAX=5
LINKUP_BITES_ENABLED=false
LINKUP_SOCIAL_ENABLED=false
```

The server refuses to start production with more than one declared application
instance. This prevents accidental unsafe PM2 cluster mode. Before increasing
instances, move the JSONB application state to normalized transactional tables
and add shared adapters for rate limiting and Socket.IO.

## Important

Do not use this command for production:

```bash
npm run start:test
```

That command is only for local testing. Production should use the real production environment variables and the normal production restart command.
