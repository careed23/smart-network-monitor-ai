import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNetworkData } from '../hooks/useNetworkData.js';

// ---------------------------------------------------------------------------
// Mock the API service so tests don't depend on random data
// ---------------------------------------------------------------------------
vi.mock('../services/api.js', () => ({
  fetchDevices: vi.fn(),
  fetchHistory: vi.fn(),
}));

import { fetchDevices, fetchHistory } from '../services/api.js';

const MOCK_DEVICES = [
  {
    id: 1,
    hostname: 'core-router-01',
    ip: '192.168.1.1',
    cpu: 45,
    memory: 55,
    latency: 12,
    bandwidth: 450,
    status: 'online',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    hostname: 'server-01',
    ip: '192.168.1.50',
    cpu: 40,
    memory: 50,
    latency: 10,
    bandwidth: 500,
    status: 'online',
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: `${23 - i}h ago`,
  bandwidth: 350,
  latency: 12,
  cpu: 45,
}));

beforeEach(() => {
  fetchDevices.mockResolvedValue(MOCK_DEVICES);
  fetchHistory.mockResolvedValue(MOCK_HISTORY);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useNetworkData', () => {
  it('starts in loading state before any data arrives', async () => {
    // Return a promise that never resolves so we can check loading state
    fetchDevices.mockReturnValue(new Promise(() => {}));
    fetchHistory.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useNetworkData());
    expect(result.current.loading).toBe(true);
  });

  it('populates devices after the first fetch resolves', async () => {
    const { result } = renderHook(() => useNetworkData());

    await act(async () => {
      // Flush all pending promises (initial poll + history fetch)
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.devices).toHaveLength(2);
    expect(result.current.devices[0].hostname).toBe('core-router-01');
  });

  it('populates historicalData from fetchHistory', async () => {
    const { result } = renderHook(() => useNetworkData());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.historicalData.length).toBeGreaterThan(0));
  });

  it('sets error state when fetchDevices rejects', async () => {
    fetchDevices.mockRejectedValueOnce(new Error('network timeout'));

    const { result } = renderHook(() => useNetworkData());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.error).toBe('network timeout'));
  });

  it('returns alerts as an array', async () => {
    const { result } = renderHook(() => useNetworkData());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(Array.isArray(result.current.alerts)).toBe(true);
  });
});
