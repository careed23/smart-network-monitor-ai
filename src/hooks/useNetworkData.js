/**
 * useNetworkData.js
 *
 * Custom hook that manages all network-data state:
 *   - Polling device metrics via the api service layer
 *   - Maintaining per-device rolling windows for Z-score anomaly detection
 *   - Deriving alerts with confidence scores
 *   - Maintaining chart history
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchDevices, fetchHistory } from '../services/api.js';
import { POLLING_INTERVAL_MS, ANOMALY, THRESHOLDS, MAX_ALERTS, HISTORY_LENGTH } from '../config.js';

// ---------------------------------------------------------------------------
// Anomaly detection helpers
// ---------------------------------------------------------------------------

/**
 * Compute the mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
export function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Compute the population standard deviation of an array of numbers.
 * @param {number[]} values
 * @param {number} [m] - Pre-computed mean (optional optimisation)
 * @returns {number}
 */
export function stddev(values, m) {
  if (values.length < 2) return 0;
  const avg = m !== undefined ? m : mean(values);
  const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Compute the Z-score for a value given a set of reference samples.
 * @param {number} value - The current observation
 * @param {number[]} window - Recent historical samples
 * @returns {number} Absolute Z-score (distance from mean in std deviations)
 */
export function zScore(value, window) {
  if (window.length < 2) return 0;
  const m = mean(window);
  const s = stddev(window, m);
  if (s === 0) return 0;
  return Math.abs((value - m) / s);
}

/**
 * Convert a Z-score to a 0–100 confidence score.
 * Uses a sigmoid-like mapping: confidence approaches 100 % for very high Z-scores.
 * @param {number} z
 * @returns {number} Integer between 0 and 100
 */
export function confidenceFromZ(z) {
  // Normalise: at z = ANOMALY.Z_THRESHOLD the confidence starts from ~50 %
  const normalised = Math.min(z / (ANOMALY.Z_THRESHOLD * 2), 1);
  return Math.round(normalised * 100);
}

/**
 * Analyse a single device snapshot against its rolling window.
 * Returns zero or more anomaly objects when a metric deviates more than
 * ANOMALY.Z_THRESHOLD standard deviations from the rolling mean.
 *
 * @param {import('../services/mock-api.js').DevicePayload} device
 * @param {{ cpu: number[], memory: number[], latency: number[], bandwidth: number[] }} windows
 * @returns {Array<{type:string, device:string, metric:string, value:number, message:string, prediction:string, confidence:number}>}
 */
export function detectAnomalies(device, windows) {
  const anomalies = [];

  /** @type {Array<[string, number, string]>} [metricKey, value, unit] */
  const metrics = [
    ['cpu', device.cpu, '%'],
    ['memory', device.memory, '%'],
    ['latency', device.latency, 'ms'],
    ['bandwidth', device.bandwidth, 'Mbps'],
  ];

  for (const [key, value, unit] of metrics) {
    const win = windows[key] ?? [];
    const z = zScore(value, win);

    if (z >= ANOMALY.Z_THRESHOLD) {
      const confidence = confidenceFromZ(z);
      const isCritical =
        key === 'cpu'
          ? value > THRESHOLDS.CPU_CRIT
          : key === 'memory'
            ? value > THRESHOLDS.MEMORY_CRIT
            : key === 'latency'
              ? value > THRESHOLDS.LATENCY_CRIT
              : false;

      anomalies.push({
        type: isCritical ? 'critical' : 'warning',
        device: device.hostname,
        ip: device.ip,
        metric: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        unit,
        message: `${key.charAt(0).toUpperCase() + key.slice(1)} is ${value.toFixed(1)}${unit} — Z-score ${z.toFixed(2)} (${z.toFixed(1)}σ above mean)`,
        prediction: isCritical
          ? 'Immediate intervention may be required'
          : 'Monitor closely — trend may worsen',
        confidence,
      });
    }
  }

  return anomalies;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useNetworkData — primary data hook for the dashboard.
 *
 * @returns {{
 *   devices: import('../services/mock-api.js').DevicePayload[],
 *   historicalData: object[],
 *   alerts: object[],
 *   loading: boolean,
 *   error: string|null,
 * }}
 */
export function useNetworkData() {
  const [devices, setDevices] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Per-device rolling windows keyed by device id.
   * Stored in a ref to avoid triggering re-renders when the window updates.
   * Shape: { [deviceId]: { cpu: number[], memory: number[], latency: number[], bandwidth: number[] } }
   */
  const windowsRef = useRef({});

  /** Update a single device's rolling window, capping at ANOMALY.WINDOW_SIZE. */
  const updateWindow = useCallback((deviceId, snapshot) => {
    const existing = windowsRef.current[deviceId] ?? {
      cpu: [],
      memory: [],
      latency: [],
      bandwidth: [],
    };

    const push = (arr, val) => {
      const next = [...arr, val];
      return next.length > ANOMALY.WINDOW_SIZE ? next.slice(-ANOMALY.WINDOW_SIZE) : next;
    };

    windowsRef.current[deviceId] = {
      cpu: push(existing.cpu, snapshot.cpu),
      memory: push(existing.memory, snapshot.memory),
      latency: push(existing.latency, snapshot.latency),
      bandwidth: push(existing.bandwidth, snapshot.bandwidth),
    };
  }, []);

  // Load initial history once
  useEffect(() => {
    fetchHistory(HISTORY_LENGTH)
      .then(setHistoricalData)
      .catch((err) => setError(err.message));
  }, []);

  // Poll devices on an interval
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const data = await fetchDevices();
        if (cancelled) return;

        setDevices(data);
        setLoading(false);

        // Update rolling windows and compute anomalies
        const newAlerts = [];
        data.forEach((device) => {
          updateWindow(device.id, device);
          const anomalies = detectAnomalies(device, windowsRef.current[device.id]);
          newAlerts.push(...anomalies);
        });

        // Append one new history point per poll
        setHistoricalData((prev) => {
          const next = [
            ...prev.slice(1),
            {
              time: 'now',
              bandwidth: data.reduce((s, d) => s + d.bandwidth, 0) / data.length,
              latency: data.reduce((s, d) => s + d.latency, 0) / data.length,
              cpu: data.reduce((s, d) => s + d.cpu, 0) / data.length,
            },
          ];
          return next;
        });

        setAlerts(newAlerts.slice(0, MAX_ALERTS));
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };

    poll(); // immediate first fetch
    const id = setInterval(poll, POLLING_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [updateWindow]);

  return { devices, historicalData, alerts, loading, error };
}
