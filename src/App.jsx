import { useState } from 'react';
import { Server } from 'lucide-react';
import { useNetworkData } from './hooks/useNetworkData.js';
import DashboardHeader from './components/DashboardHeader.jsx';
import DeviceCard from './components/DeviceCard.jsx';
import AlertPanel from './components/AlertPanel.jsx';
import MetricsChart from './components/MetricsChart.jsx';
import AnomalyFeed from './components/AnomalyFeed.jsx';

/**
 * Static AI insights — higher-level predictive analysis separate from
 * the real-time metric anomalies produced by the Z-score engine.
 * In a production system these would also come from the backend.
 */
const AI_INSIGHTS = [
  {
    type: 'prediction',
    title: 'Predictive Analysis',
    message:
      'access-point-01 showing resource exhaustion pattern. 78% probability of service degradation within 4 hours based on current trends.',
    confidence: 78,
  },
  {
    type: 'optimization',
    title: 'Performance Optimization',
    message:
      'core-router-01 bandwidth utilisation optimal. Current load balancing configuration performing 23% better than last week.',
    confidence: 92,
  },
  {
    type: 'correlation',
    title: 'Issue Correlation',
    message:
      'Elevated latency across 2 devices correlates with increased traffic from subnet 192.168.50.0/24. Possible bandwidth saturation.',
    confidence: 85,
  },
];

/**
 * NetworkMonitorDashboard — root application component.
 *
 * Composition pattern: this component owns layout only; all data logic
 * lives in useNetworkData and all rendering logic lives in child components.
 */
const NetworkMonitorDashboard = () => {
  const { devices, historicalData, alerts, loading, error } = useNetworkData();
  const [selectedDevice, setSelectedDevice] = useState(null);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-lg">
        Error loading network data: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader devices={devices} alertCount={alerts.length} />

        <AnomalyFeed insights={AI_INSIGHTS} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MetricsChart data={historicalData} />
          <AlertPanel alerts={alerts} />
        </div>

        {/* Device Status Grid */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="text-purple-400" aria-hidden="true" />
            Device Status Monitor
            {loading && <span className="ml-2 text-sm font-normal text-slate-400">(loading…)</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} onClick={setSelectedDevice} />
            ))}
          </div>
          {/* Selected device detail — kept minimal; extend as needed */}
          {selectedDevice && (
            <p className="mt-4 text-slate-400 text-xs">
              Selected: {selectedDevice.hostname} ({selectedDevice.ip})
            </p>
          )}
        </div>

        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>AI-Powered Network Monitoring • Real-time Anomaly Detection • Predictive Analytics</p>
          <p className="mt-1">
            Built with React + Recharts • Z-score Statistical Anomaly Detection
          </p>
        </footer>
      </div>
    </div>
  );
};

export default NetworkMonitorDashboard;
