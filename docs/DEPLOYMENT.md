# Deployment Guide

> **Status**: Work in progress.

## Quick Start (Docker)

The easiest way to run the app in production is with Docker Compose:

```bash
# 1. Copy and configure environment variables
cp .env.example .env
# Edit .env as needed

# 2. Build and start
docker compose up --build -d

# 3. Open the app
open http://localhost:3000
```

The `Dockerfile` uses a two-stage build:
1. **builder** — Node 20 Alpine; installs dependencies and runs `vite build`
2. **runner** — nginx Alpine; serves the static `dist/` output

---

## Manual / Node.js

```bash
npm ci --legacy-peer-deps
npm run build
npm run preview          # preview locally
# or serve dist/ with any static server (nginx, Caddy, S3+CloudFront, etc.)
```

---

## Environment Variables

See [`.env.example`](../.env.example) for the full list.

Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | *(empty)* | Backend API base URL. Empty = use mock data. |
| `VITE_POLLING_INTERVAL_MS` | `3000` | How often to poll for new device data (ms) |
| `VITE_ALERT_WEBHOOK_URL` | *(empty)* | Optional webhook for critical alert notifications |

---

## CI/CD

A GitHub Actions workflow at `.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. ESLint
2. Prettier format check
3. Vitest unit tests
4. Production build (`vite build`)

---

## Planned Production Hardening

- [ ] HTTPS via reverse proxy (nginx + Certbot / AWS ACM)
- [ ] Environment-specific Docker Compose overrides
- [ ] Health-check endpoint
- [ ] Kubernetes manifests (Deployment + Service + Ingress)
