/**
 * mock-api.js
 *
 * Mirrors what a real FastAPI backend would return.
 * Uses SNMP-style payloads so swapping to a real backend means
 * only changing API_BASE_URL in config.js — no other code changes required.
 */

/** @typedef {Object} DevicePayload
 * @property {number}  id
 * @property {string}  hostname
 * @property {string}  ip
 * @property {'online'|'warning'|'critical'} status
 * @property {number}  cpu        - CPU utilisation 0-100 %
 * @property {number}  memory     - Memory utilisation 0-100 %
 * @property {number}  latency    - Round-trip latency in ms
 * @property {number}  bandwidth  - Current throughput in Mbps
 * @property {string}  updatedAt  - ISO 8601 timestamp
 */

/** Seed state so values drift realistically between polls */
const _state = [
  {
    id: 1,
    hostname: 'core-router-01',
    ip: '192.168.1.1',
    cpu: 45,
    memory: 62,
    latency: 12,
    bandwidth: 450,
  },
  {
    id: 2,
    hostname: 'main-switch-01',
    ip: '192.168.1.2',
    cpu: 32,
    memory: 48,
    latency: 8,
    bandwidth: 320,
  },
  {
    id: 3,
    hostname: 'firewall-01',
    ip: '192.168.1.3',
    cpu: 68,
    memory: 71,
    latency: 15,
    bandwidth: 280,
  },
  {
    id: 4,
    hostname: 'access-point-01',
    ip: '192.168.1.10',
    cpu: 78,
    memory: 82,
    latency: 25,
    bandwidth: 180,
  },
  {
    id: 5,
    hostname: 'server-01',
    ip: '192.168.1.50',
    cpu: 41,
    memory: 55,
    latency: 10,
    bandwidth: 520,
  },
];

/**
 * Clamp a value between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * Derive device status from current metric values.
 * @param {number} cpu
 * @param {number} memory
 * @returns {'online'|'warning'|'critical'}
 */
const deriveStatus = (cpu, memory) => {
  if (cpu > 85 || memory > 90) return 'critical';
  if (cpu > 75 || memory > 80) return 'warning';
  return 'online';
};

/**
 * Return a simulated list of device metrics.
 * Each call drifts the values slightly to mimic live SNMP polling.
 * @returns {Promise<DevicePayload[]>}
 */
export async function fetchDevices() {
  // Simulate async network round-trip
  await new Promise((r) => setTimeout(r, 50));

  return _state.map((d) => {
    d.cpu = clamp(d.cpu + (Math.random() - 0.5) * 10, 20, 95);
    d.memory = clamp(d.memory + (Math.random() - 0.5) * 8, 30, 95);
    d.latency = clamp(d.latency + (Math.random() - 0.5) * 5, 5, 50);
    d.bandwidth = clamp(d.bandwidth + (Math.random() - 0.5) * 50, 100, 800);

    return {
      id: d.id,
      hostname: d.hostname,
      ip: d.ip,
      cpu: d.cpu,
      memory: d.memory,
      latency: d.latency,
      bandwidth: d.bandwidth,
      status: deriveStatus(d.cpu, d.memory),
      updatedAt: new Date().toISOString(),
    };
  });
}

/**
 * Return simulated historical time-series data for charting.
 * @param {number} [points=24] - Number of historical data points to return
 * @returns {Promise<Array<{time:string, bandwidth:number, latency:number, cpu:number}>>}
 */
export async function fetchHistory(points = 24) {
  await new Promise((r) => setTimeout(r, 30));

  return Array.from({ length: points }, (_, i) => ({
    time: i === points - 1 ? 'now' : `${points - 1 - i}h ago`,
    bandwidth: 300 + Math.random() * 200,
    latency: 10 + Math.random() * 15,
    cpu: 40 + Math.random() * 30,
  }));
}
