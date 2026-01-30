# AI Models (Target)

> Note: The current repository uses simulated data and UI-only heuristics. This document outlines the target ML architecture.

## Model Catalog
- **Anomaly Detection**: Isolation Forests or autoencoders for multivariate metrics.
- **Forecasting**: Prophet/LSTM for latency, bandwidth, and capacity trends.
- **Correlation**: Graph-based clustering for incident grouping.
- **Classification**: Severity and root-cause labels for alerts.

## Training Pipeline
1. Collect normalized telemetry with labels from incident history.
2. Feature engineering (seasonality, rolling stats, topology features).
3. Train and track models in a managed ML platform.
4. Validate with precision/recall, Mean Absolute Error (MAE), and drift checks.
5. Deploy inference service with canary releases.

## Inference Path
- Streaming scoring for anomalies and batch forecasting for capacity planning.

## Governance
- Model registry, versioning, approvals, and explainability artifacts.
- Drift monitoring with scheduled retraining.
