import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';

/**
 * DashboardHeader — top banner with title and live network-health summary stats.
 */
function DashboardHeader({ devices, alertCount }) {
  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const healthPercentage = devices.length ? Math.round((onlineCount / devices.length) * 100) : 0;
  const avgLatency = devices.length
    ? Math.round(devices.reduce((sum, d) => sum + d.latency, 0) / devices.length)
    : 0;
  const totalBandwidth = Math.round(devices.reduce((sum, d) => sum + d.bandwidth, 0));

  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
        <Activity className="text-blue-400" size={40} aria-hidden="true" />
        Smart Network Monitor AI
      </h1>
      <p className="text-slate-400 mb-6">
        Real-time monitoring with AI-powered anomaly detection and predictive analytics
      </p>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Network Health"
          value={`${healthPercentage}%`}
          sub={`${onlineCount}/${devices.length} devices online`}
        />
        <StatCard label="Active Alerts" value={alertCount} sub="AI-detected anomalies" />
        <StatCard label="Avg Latency" value={`${avgLatency}ms`} sub="Across all devices" />
        <StatCard
          label="Total Bandwidth"
          value={`${totalBandwidth} Mbps`}
          sub="Current utilisation"
        />
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  /** Array of current device snapshots */
  devices: PropTypes.array.isRequired,
  /** Number of active anomaly alerts */
  alertCount: PropTypes.number.isRequired,
};

// ---------------------------------------------------------------------------
// Internal sub-component — not exported (used only by DashboardHeader)
// ---------------------------------------------------------------------------

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
      <div className="text-slate-400 text-sm mb-1">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string.isRequired,
};

export default DashboardHeader;
