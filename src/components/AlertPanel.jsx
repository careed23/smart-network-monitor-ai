import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * AlertPanel — scrollable list of AI-detected anomaly alerts.
 */
function AlertPanel({ alerts }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-400" aria-hidden="true" />
        Active Alerts &amp; Anomalies
      </h2>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-slate-400 text-center py-8">
            <CheckCircle className="mx-auto mb-2 text-green-400" size={32} aria-hidden="true" />
            No anomalies detected
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <AlertItem key={`${alert.device}-${alert.metric}-${idx}`} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}

AlertPanel.propTypes = {
  /** Array of anomaly alert objects produced by the detection engine */
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['critical', 'warning']).isRequired,
      device: PropTypes.string.isRequired,
      metric: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      prediction: PropTypes.string.isRequired,
      confidence: PropTypes.number.isRequired,
    })
  ).isRequired,
};

// ---------------------------------------------------------------------------
// Internal sub-component
// ---------------------------------------------------------------------------

function AlertItem({ alert }) {
  const isCritical = alert.type === 'critical';

  return (
    <div
      className={`rounded-lg p-4 border ${isCritical ? 'bg-red-950 border-red-800' : 'bg-yellow-950 border-yellow-800'}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={isCritical ? 'text-red-400' : 'text-yellow-400'}
          size={20}
          aria-hidden="true"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white font-medium text-sm">
              {alert.device} — {alert.metric}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Confidence: {alert.confidence}%</span>
              <span
                className={`text-xs px-2 py-1 rounded ${isCritical ? 'bg-red-800 text-red-200' : 'bg-yellow-800 text-yellow-200'}`}
              >
                {alert.type.toUpperCase()}
              </span>
            </div>
          </div>
          <p className="text-slate-300 text-xs mb-2">{alert.message}</p>
          <p className="text-slate-400 text-xs italic">Prediction: {alert.prediction}</p>
        </div>
      </div>
    </div>
  );
}

AlertItem.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.string.isRequired,
    device: PropTypes.string.isRequired,
    metric: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    prediction: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
  }).isRequired,
};

export default AlertPanel;
