/**
 * api.js — Data-fetching abstraction layer.
 *
 * When VITE_API_BASE_URL is set the functions call the real FastAPI backend.
 * When it is empty (default) they fall through to the local mock implementation.
 * Swapping backends requires only setting the environment variable.
 */

import { API_BASE_URL } from '../config.js';
import * as mockApi from './mock-api.js';

/**
 * Fetch current device metrics.
 * @returns {Promise<import('./mock-api.js').DevicePayload[]>}
 */
export async function fetchDevices() {
  if (!API_BASE_URL) return mockApi.fetchDevices();

  const res = await fetch(`${API_BASE_URL}/api/v1/devices`);
  if (!res.ok) throw new Error(`fetchDevices failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch historical time-series data for charting.
 * @param {number} [points=24]
 * @returns {Promise<Array<{time:string, bandwidth:number, latency:number, cpu:number}>>}
 */
export async function fetchHistory(points = 24) {
  if (!API_BASE_URL) return mockApi.fetchHistory(points);

  const res = await fetch(`${API_BASE_URL}/api/v1/metrics/history?points=${points}`);
  if (!res.ok) throw new Error(`fetchHistory failed: ${res.status}`);
  return res.json();
}
