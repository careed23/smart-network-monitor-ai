# Architecture Overview

> **Status**: Work in progress — this stub will be expanded as the project matures.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React + Vite)                │
│                                                         │
│  App.jsx                                                │
│  ├── DashboardHeader   (summary stats)                  │
│  ├── AnomalyFeed       (AI insights panel)              │
│  ├── MetricsChart      (24-hour time-series chart)      │
│  ├── AlertPanel        (real-time anomaly alerts)       │
│  └── DeviceCard ×N     (per-device status cards)        │
│                                                         │
│  hooks/useNetworkData.js                                │
│  ├── Polling via services/api.js                        │
│  ├── Rolling Z-score anomaly detection (20-sample win)  │
│  └── Derived alerts with confidence scores              │
│                                                         │
│  services/api.js  →  services/mock-api.js               │
│  (swap base URL to point at real FastAPI backend)       │
└─────────────────────────────────────────────────────────┘
              │  HTTP REST (future)
              ▼
┌─────────────────────────────────────────────────────────┐
│            Backend (planned — Python FastAPI)            │
│  /api/v1/devices          → SNMP-polled device metrics  │
│  /api/v1/metrics/history  → time-series store           │
└─────────────────────────────────────────────────────────┘
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Z-score anomaly detection | Statistical model adapts to each device's baseline; more robust than fixed thresholds |
| Rolling 20-sample window | Balances responsiveness with noise reduction |
| `services/api.js` abstraction | Single swap point to move from mock to real backend |
| `config.js` constants | Centralises all magic numbers for easy tuning |

## Directory Structure

```
src/
├── __tests__/          Unit tests (Vitest + React Testing Library)
├── components/         Presentational React components
├── hooks/              Custom React hooks
├── services/           Data-fetching layer (api.js + mock-api.js)
├── config.js           App-wide constants and env-var bindings
├── App.jsx             Root layout component
└── main.jsx            React entry point
```
