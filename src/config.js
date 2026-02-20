/**
 * Application-wide constants and configuration.
 * Moving magic numbers here makes them easy to tune without hunting through components.
 */

/** Polling interval for simulated real-time updates (ms) */
export const POLLING_INTERVAL_MS = Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 3000;

/** Base URL for the backend API. Change this to point at a real FastAPI server. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/** Webhook URL for external alert notifications */
export const ALERT_WEBHOOK_URL = import.meta.env.VITE_ALERT_WEBHOOK_URL || '';

/** Z-score anomaly detection settings */
export const ANOMALY = {
  /** Number of historical samples kept per device for rolling statistics */
  WINDOW_SIZE: 20,
  /** Standard deviations above mean to flag as anomaly */
  Z_THRESHOLD: 2.5,
};

/** Alert thresholds (percentage or ms) used for status derivation */
export const THRESHOLDS = {
  CPU_WARN: 75,
  CPU_CRIT: 85,
  MEMORY_WARN: 80,
  MEMORY_CRIT: 90,
  LATENCY_WARN: 20,
  LATENCY_CRIT: 35,
};

/** Maximum number of alerts to display in the AlertPanel */
export const MAX_ALERTS = 5;

/** Number of historical time-series points to maintain */
export const HISTORY_LENGTH = 24;
