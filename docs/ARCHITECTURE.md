# Cloud Reference Architecture (Target)

> Note: The current repository is a frontend-only dashboard with simulated data. This document describes the target cloud architecture for a production deployment.

## Reference Architecture Overview
- Real-time ingestion of device telemetry with event-driven processing.
- AI-driven anomaly detection, forecasting, and alert correlation.
- API-first services with multi-tenant access controls.

## Logical Layers
1. **Data Collection**: Edge agents/SNMP pollers, secure outbound collection.
2. **Ingestion & Streaming**: API gateway, ingestion service, schema validation, message bus.
3. **Processing & Enrichment**: Stream processing, rules engine, correlation.
4. **Storage**: Time-series store, relational metadata DB, object storage, cache.
5. **AI/ML**: Feature store, training pipeline, model registry, inference service.
6. **Service/API**: Alerting, reporting, inventory, Role-Based Access Control (RBAC), integrations.
7. **Presentation**: Web UI, dashboards, admin portal.
8. **Platform Ops**: Continuous Integration/Continuous Deployment (CI/CD), Infrastructure as Code (IaC), secrets, observability, governance.

## Physical Deployment (Cloud Mapping)
- VPC/VNet with public ingress and private app/data subnets.
- Global DNS + WAF + Layer-7 load balancer.
- Container orchestration for services; serverless jobs for burst workloads.
- Managed data services for relational, time-series, cache, and object storage.
- Managed ML platform for training/inference, with GPU burst capacity.
- Centralized logging, metrics, tracing, and audit logs.

## Data Flow (Happy Path)
1. Agents/pollers push metrics to the ingestion endpoint.
2. Metrics enter the stream bus; validators enrich with device metadata.
3. Stream processors compute aggregates and detect anomalies.
4. Inference service generates forecasts and persists results.
5. Alert service triggers notifications and publishes to APIs/streams.
6. UI consumes APIs/WebSocket for real-time updates.

## Non-Functional Requirements (Targets)
- **Availability**: Multi-AZ services; 99.9%+ Service Level Agreement (SLA) for API tier.
- **Scalability**: Horizontal autoscaling; partitioned streams and sharded storage.
- **Security**: Zero-trust networking, Identity and Access Management (IAM) least privilege, TLS, encryption at rest, secrets manager.
- **Observability**: Metrics/logs/traces with Service Level Objectives (SLOs) for latency, error rates, and data freshness.
- **Backup/DR**: Automated backups; multi-AZ restores with optional cross-region replication; Recovery Point Objective (RPO) ≤ 15 min, Recovery Time Objective (RTO) ≤ 2 hrs.
- **Cost**: Retention tiers, downsampled metrics, autoscaling, reserved capacity for steady workloads.
