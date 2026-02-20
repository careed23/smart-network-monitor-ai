import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';

/**
 * AnomalyFeed — displays the static AI insights / prediction panel.
 *
 * Insights represent higher-level correlations and predictive analysis
 * that sit above raw metric alerts.
 */
function AnomalyFeed({ insights }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" aria-hidden="true" />
        AI Insights &amp; Predictions
      </h2>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} />
        ))}
      </div>
    </div>
  );
}

AnomalyFeed.propTypes = {
  /** Array of AI insight objects to display */
  insights: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      confidence: PropTypes.number.isRequired,
    })
  ).isRequired,
};

// ---------------------------------------------------------------------------
// Internal sub-component
// ---------------------------------------------------------------------------

function InsightCard({ insight }) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
          <h3 className="text-white font-medium">{insight.title}</h3>
        </div>
        <span className="text-xs text-slate-400">Confidence: {insight.confidence}%</span>
      </div>
      <p className="text-slate-300 text-sm">{insight.message}</p>
    </div>
  );
}

InsightCard.propTypes = {
  insight: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
  }).isRequired,
};

export default AnomalyFeed;
