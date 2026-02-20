# API Reference

> **Status**: Work in progress — documents the planned FastAPI backend contract that the frontend mock mirrors.

## Base URL

```
VITE_API_BASE_URL=http://localhost:8000
```

Set this environment variable to point the frontend at a real backend instance. When unset, the app uses `services/mock-api.js`.

---

## Endpoints

### `GET /api/v1/devices`

Returns current metrics for all monitored devices.

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "hostname": "core-router-01",
    "ip": "192.168.1.1",
    "status": "online",
    "cpu": 45.2,
    "memory": 62.1,
    "latency": 12.4,
    "bandwidth": 452.0,
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique device identifier |
| `hostname` | string | SNMP sysName |
| `ip` | string | Management IP address |
| `status` | `"online"` \| `"warning"` \| `"critical"` | Derived from metric thresholds |
| `cpu` | float | CPU utilisation (%) |
| `memory` | float | Memory utilisation (%) |
| `latency` | float | ICMP round-trip latency (ms) |
| `bandwidth` | float | Current throughput (Mbps) |
| `updatedAt` | ISO 8601 | Timestamp of last SNMP poll |

---

### `GET /api/v1/metrics/history`

Returns aggregated time-series data for charting.

**Query parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `points` | integer | 24 | Number of historical data points to return |

**Response** `200 OK`

```json
[
  { "time": "23h ago", "bandwidth": 380.5, "latency": 11.2, "cpu": 42.0 },
  { "time": "22h ago", "bandwidth": 395.1, "latency": 10.8, "cpu": 44.3 },
  ...
  { "time": "now",     "bandwidth": 410.0, "latency": 12.1, "cpu": 46.5 }
]
```
