import PropTypes from 'prop-types';
import { CheckCircle, XCircle } from 'lucide-react';
import { THRESHOLDS } from '../config.js';

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

/**
 * Map device status to Tailwind text colour class.
 * @param {'online'|'warning'|'critical'} status
 * @returns {string}
 */
function statusTextClass(status) {
  switch (status) {
    case 'online':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Map device status to Tailwind background + border class.
 * @param {'online'|'warning'|'critical'} status
 * @returns {string}
 */
function statusBgClass(status) {
  switch (status) {
    case 'online':
      return 'bg-green-100 border-green-300';
    case 'warning':
      return 'bg-yellow-100 border-yellow-300';
    case 'critical':
      return 'bg-red-100 border-red-300';
    default:
      return 'bg-gray-100 border-gray-300';
  }
}

// ---------------------------------------------------------------------------
// MetricBar — small progress bar sub-component
// ---------------------------------------------------------------------------

/**
 * @param {{ label: string, value: number, unit: string, barColor: string }} props
 */
function MetricBar({ label, value, unit, barColor }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="font-medium text-slate-900">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <div className="w-full bg-slate-300 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(value)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

MetricBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  barColor: PropTypes.string.isRequired,
};

// ---------------------------------------------------------------------------
// DeviceCard
// ---------------------------------------------------------------------------

/**
 * DeviceCard — displays a single network device's metrics and health status.
 *
 * @param {{ device: object, onClick?: function }} props
 */
function DeviceCard({ device, onClick = null }) {
  const cpuColor =
    device.cpu > THRESHOLDS.CPU_WARN
      ? 'bg-red-500'
      : device.cpu > 60
        ? 'bg-yellow-500'
        : 'bg-green-500';
  const memoryColor =
    device.memory > THRESHOLDS.MEMORY_WARN
      ? 'bg-red-500'
      : device.memory > 65
        ? 'bg-yellow-500'
        : 'bg-blue-500';

  return (
    <div
      className={`rounded-lg p-4 border-2 cursor-pointer transition-all hover:shadow-xl ${statusBgClass(device.status)}`}
      onClick={() => onClick && onClick(device)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(device)}
      aria-label={`Device ${device.hostname} — ${device.status}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {device.status === 'online' ? (
            <CheckCircle className="text-green-600" size={20} aria-hidden="true" />
          ) : (
            <XCircle
              className={device.status === 'critical' ? 'text-red-600' : 'text-yellow-600'}
              size={20}
              aria-hidden="true"
            />
          )}
          <h3 className="font-semibold text-slate-900">{device.hostname}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusTextClass(device.status)}`}>
          {device.status}
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-3">{device.ip}</p>

      {/* Metric bars */}
      <div className="space-y-2">
        <MetricBar label="CPU" value={device.cpu} unit="%" barColor={cpuColor} />
        <MetricBar label="Memory" value={device.memory} unit="%" barColor={memoryColor} />
        <div className="flex justify-between text-xs pt-1">
          <span className="text-slate-700">
            Latency:{' '}
            <span className="font-medium text-slate-900">{Math.round(device.latency)}ms</span>
          </span>
          <span className="text-slate-700">
            BW:{' '}
            <span className="font-medium text-slate-900">{Math.round(device.bandwidth)} Mbps</span>
          </span>
        </div>
      </div>
    </div>
  );
}

DeviceCard.propTypes = {
  /** Device data object from the API */
  device: PropTypes.shape({
    id: PropTypes.number.isRequired,
    hostname: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['online', 'warning', 'critical']).isRequired,
    cpu: PropTypes.number.isRequired,
    memory: PropTypes.number.isRequired,
    latency: PropTypes.number.isRequired,
    bandwidth: PropTypes.number.isRequired,
  }).isRequired,
  /** Called with the device object when the card is clicked */
  onClick: PropTypes.func,
};

export default DeviceCard;
