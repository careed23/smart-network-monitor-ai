import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/** Shared tooltip style keeps the dark-theme look consistent. */
const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' },
  labelStyle: { color: '#e2e8f0' },
};

/**
 * MetricsChart — 24-hour rolling area chart for bandwidth, latency, and CPU.
 */
function MetricsChart({ data }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Network Metrics (24h)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          <Area
            type="monotone"
            dataKey="bandwidth"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Bandwidth (Mbps)"
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
            name="Latency (ms)"
          />
          <Area
            type="monotone"
            dataKey="cpu"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
            name="CPU (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

MetricsChart.propTypes = {
  /** Time-series data points for the chart */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      bandwidth: PropTypes.number.isRequired,
      latency: PropTypes.number.isRequired,
      cpu: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MetricsChart;
