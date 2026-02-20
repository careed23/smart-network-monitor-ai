import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceCard from '../components/DeviceCard.jsx';

const baseDevice = {
  id: 1,
  hostname: 'core-router-01',
  ip: '192.168.1.1',
  status: 'online',
  cpu: 45,
  memory: 55,
  latency: 12,
  bandwidth: 450,
};

describe('DeviceCard', () => {
  it('renders device hostname and IP', () => {
    render(<DeviceCard device={baseDevice} />);
    expect(screen.getByText('core-router-01')).toBeDefined();
    expect(screen.getByText('192.168.1.1')).toBeDefined();
  });

  it('renders the device status badge', () => {
    render(<DeviceCard device={baseDevice} />);
    expect(screen.getByText('online')).toBeDefined();
  });

  it('renders CPU and Memory labels', () => {
    render(<DeviceCard device={baseDevice} />);
    expect(screen.getByText('CPU')).toBeDefined();
    expect(screen.getByText('Memory')).toBeDefined();
  });

  it('renders latency and bandwidth values', () => {
    render(<DeviceCard device={baseDevice} />);
    expect(screen.getByText(/12ms/)).toBeDefined();
    expect(screen.getByText(/450 Mbps/)).toBeDefined();
  });

  it('calls onClick when the card is clicked', async () => {
    const user = userEvent.setup();
    let clicked = null;
    render(
      <DeviceCard
        device={baseDevice}
        onClick={(d) => {
          clicked = d;
        }}
      />
    );

    const card = screen.getByRole('button');
    await user.click(card);
    expect(clicked).toEqual(baseDevice);
  });

  it('renders warning status correctly', () => {
    const warningDevice = { ...baseDevice, status: 'warning' };
    render(<DeviceCard device={warningDevice} />);
    expect(screen.getByText('warning')).toBeDefined();
  });

  it('renders critical status correctly', () => {
    const criticalDevice = { ...baseDevice, status: 'critical', cpu: 90, memory: 92 };
    render(<DeviceCard device={criticalDevice} />);
    expect(screen.getByText('critical')).toBeDefined();
  });

  it('rounds float metric values for display', () => {
    const device = { ...baseDevice, cpu: 45.7, memory: 63.3, latency: 12.9, bandwidth: 450.1 };
    render(<DeviceCard device={device} />);
    // Values should be rounded to integers in the display
    expect(screen.getByText('46%')).toBeDefined();
    expect(screen.getByText('63%')).toBeDefined();
  });
});
