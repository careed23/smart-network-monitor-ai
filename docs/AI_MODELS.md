# AI Model Documentation

> **Status**: Work in progress — describes the current statistical anomaly detection model and the roadmap toward ML-based models.

## Current Implementation: Z-Score Statistical Model

### Algorithm

For each device and each metric (CPU, memory, latency, bandwidth):

1. Maintain a **rolling window** of the last 20 observed samples.
2. Compute the **rolling mean** (μ) and **population standard deviation** (σ).
3. Compute the **Z-score** for the current observation:

   ```
   Z = |value − μ| / σ
   ```

4. If `Z ≥ 2.5` (configurable via `ANOMALY.Z_THRESHOLD` in `src/config.js`), flag as an anomaly.
5. Assign a **confidence score** (0–100%) using a sigmoid normalisation of the Z-score:

   ```
   confidence = min(Z / (Z_THRESHOLD × 2), 1) × 100
   ```

### Why Z-Score?

| Property | Detail |
|----------|--------|
| **Adaptive baseline** | Automatically adjusts to each device's normal operating range |
| **No training data required** | Works from the first 20 samples |
| **Interpretable** | Easy to explain to network operators |
| **Lightweight** | O(1) update per sample |

### Configuration

All model parameters live in `src/config.js`:

```js
export const ANOMALY = {
  WINDOW_SIZE: 20,   // samples kept per device metric
  Z_THRESHOLD: 2.5,  // standard deviations to flag anomaly
};
```

---

## Planned ML Enhancements

| Phase | Model | Benefit |
|-------|-------|---------|
| Phase 1 | Isolation Forest (scikit-learn) | Multivariate anomaly detection across correlated metrics |
| Phase 2 | LSTM (PyTorch / TensorFlow) | Sequence-aware anomaly detection for time-series |
| Phase 3 | Prophet (Meta) | Seasonal trend decomposition for capacity planning |

These models would run in the FastAPI backend and return anomaly scores via `/api/v1/devices`, keeping the frontend model-agnostic.
