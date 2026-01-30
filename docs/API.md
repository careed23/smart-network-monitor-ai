# API Reference (Target)

> Note: The current repository is a frontend-only dashboard with simulated data. This API reference describes the target backend services.

## API Principles
- REST/JSON with versioned endpoints (`/api/v1`).
- OAuth2/OIDC authentication with JWTs and Role-Based Access Control (RBAC).
- Pagination, filtering, and consistent error formats.

## Core Endpoints (Summary)
- `GET /api/v1/devices`
- `GET /api/v1/devices/{id}`
- `GET /api/v1/devices/{id}/metrics?from=&to=&interval=`
- `GET /api/v1/alerts?status=&severity=`
- `POST /api/v1/alerts/{id}/ack`
- `GET /api/v1/anomalies?deviceId=`
- `GET /api/v1/predictions?deviceId=`
- `POST /api/v1/feedback` (model feedback)
- `GET /api/v1/health`
- `WS /api/v1/stream` (metrics, alerts)

## Data Shapes (Excerpt)
- **Device**: `id`, `name`, `status`, `site`, `tags`
- **Metric**: `timestamp`, `cpu`, `memory`, `latency`, `bandwidth`
- **Alert**: `id`, `severity`, `state`, `createdAt`, `deviceId`, `message`
- **Prediction**: `timestamp`, `metric`, `value`, `confidence`

## Non-Functional Expectations
- Rate limiting and quotas per tenant.
- Audit logging for admin and alert actions.
- TLS everywhere; encryption at rest for stored telemetry.
