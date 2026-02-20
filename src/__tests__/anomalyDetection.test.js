import { describe, it, expect } from 'vitest';
import { mean, stddev, zScore, confidenceFromZ, detectAnomalies } from '../hooks/useNetworkData.js';

// ---------------------------------------------------------------------------
// mean
// ---------------------------------------------------------------------------
describe('mean', () => {
  it('returns 0 for an empty array', () => {
    expect(mean([])).toBe(0);
  });

  it('returns the single value for a one-element array', () => {
    expect(mean([42])).toBe(42);
  });

  it('computes the arithmetic mean', () => {
    expect(mean([2, 4, 6])).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// stddev
// ---------------------------------------------------------------------------
describe('stddev', () => {
  it('returns 0 for arrays with fewer than 2 elements', () => {
    expect(stddev([])).toBe(0);
    expect(stddev([10])).toBe(0);
  });

  it('computes population standard deviation', () => {
    // For [2, 4, 4, 4, 5, 5, 7, 9], population stddev = 2
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(stddev(values)).toBeCloseTo(2, 5);
  });

  it('accepts a pre-computed mean to avoid double calculation', () => {
    const values = [10, 20, 30];
    const m = mean(values);
    expect(stddev(values, m)).toBeCloseTo(stddev(values), 10);
  });
});

// ---------------------------------------------------------------------------
// zScore
// ---------------------------------------------------------------------------
describe('zScore', () => {
  it('returns 0 for fewer than 2 samples in window', () => {
    expect(zScore(100, [])).toBe(0);
    expect(zScore(100, [50])).toBe(0);
  });

  it('returns 0 when all values are identical (zero stddev)', () => {
    expect(zScore(5, [5, 5, 5, 5])).toBe(0);
  });

  it('computes an absolute Z-score', () => {
    // mean=10, stddev=0, values=[10,10,10] — but let's use a spread set
    // Window: [10, 10, 10, 10, 10, 20] → mean≈11.67, stddev≈3.73
    // Z for value 20 ≈ 2.24
    const samples = [10, 10, 10, 10, 10, 20];
    const z = zScore(20, samples);
    expect(z).toBeGreaterThan(0);
  });

  it('returns positive Z-score for both below and above mean', () => {
    const mixedWindow = [40, 45, 50, 55, 60];
    const zAbove = zScore(80, mixedWindow);
    const zBelow = zScore(20, mixedWindow);
    expect(zAbove).toBeGreaterThan(0);
    expect(zBelow).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// confidenceFromZ
// ---------------------------------------------------------------------------
describe('confidenceFromZ', () => {
  it('returns a value between 0 and 100', () => {
    [0, 1, 2.5, 5, 100].forEach((z) => {
      const c = confidenceFromZ(z);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(100);
    });
  });

  it('increases with higher Z-scores (up to cap)', () => {
    expect(confidenceFromZ(1)).toBeLessThan(confidenceFromZ(3));
  });
});

// ---------------------------------------------------------------------------
// detectAnomalies
// ---------------------------------------------------------------------------
describe('detectAnomalies', () => {
  /**
   * Build a rolling window with slight variance around normalValue so that the
   * population stddev > 0, enabling Z-score computation for the spikeValue.
   */
  const buildSpike = (normalValue, _spikeValue, windowSize = 20) => {
    // Alternate slightly around normalValue to create real variance
    const window = Array.from(
      { length: windowSize - 1 },
      (_, i) => normalValue + (i % 2 === 0 ? 1 : -1)
    );
    return { window };
  };

  it('returns no anomalies when all metrics are within normal range', () => {
    const device = {
      id: 1,
      hostname: 'test-device',
      ip: '10.0.0.1',
      cpu: 50,
      memory: 50,
      latency: 15,
      bandwidth: 400,
      status: 'online',
    };
    // Small window with similar values → Z will be below threshold
    const windows = {
      cpu: Array(20).fill(50),
      memory: Array(20).fill(50),
      latency: Array(20).fill(15),
      bandwidth: Array(20).fill(400),
    };
    const anomalies = detectAnomalies(device, windows);
    expect(anomalies).toHaveLength(0);
  });

  it('flags a CPU spike as an anomaly', () => {
    const { window } = buildSpike(40, 95);
    const device = {
      id: 1,
      hostname: 'test-device',
      ip: '10.0.0.1',
      cpu: 95,
      memory: 50,
      latency: 15,
      bandwidth: 400,
      status: 'critical',
    };
    const windows = {
      cpu: window,
      memory: Array(20).fill(50),
      latency: Array(20).fill(15),
      bandwidth: Array(20).fill(400),
    };
    const anomalies = detectAnomalies(device, windows);
    const cpuAlert = anomalies.find((a) => a.metric === 'Cpu');
    expect(cpuAlert).toBeDefined();
    expect(cpuAlert.confidence).toBeGreaterThan(0);
    expect(cpuAlert.confidence).toBeLessThanOrEqual(100);
  });

  it('each anomaly object has required fields', () => {
    const { window } = buildSpike(10, 90);
    const device = {
      id: 2,
      hostname: 'router-01',
      ip: '192.168.1.1',
      cpu: 90,
      memory: 90,
      latency: 10,
      bandwidth: 300,
      status: 'critical',
    };
    const windows = {
      cpu: window,
      memory: window,
      latency: Array(20).fill(10),
      bandwidth: Array(20).fill(300),
    };
    const anomalies = detectAnomalies(device, windows);
    anomalies.forEach((a) => {
      expect(a).toHaveProperty('type');
      expect(a).toHaveProperty('device');
      expect(a).toHaveProperty('metric');
      expect(a).toHaveProperty('value');
      expect(a).toHaveProperty('message');
      expect(a).toHaveProperty('prediction');
      expect(a).toHaveProperty('confidence');
      expect(['critical', 'warning']).toContain(a.type);
    });
  });

  it('does not flag anomaly when window is too small (< 2 samples)', () => {
    const device = {
      id: 3,
      hostname: 'switch-01',
      ip: '192.168.1.2',
      cpu: 99,
      memory: 99,
      latency: 99,
      bandwidth: 1,
      status: 'critical',
    };
    // Insufficient window — Z-score will be 0
    const windows = { cpu: [10], memory: [10], latency: [10], bandwidth: [400] };
    const anomalies = detectAnomalies(device, windows);
    expect(anomalies).toHaveLength(0);
  });
});
