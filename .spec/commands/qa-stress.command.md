# QA Stress Command - System Instructions

> **Filename:** `./spec/commands/qa-stress.command.md`  
> **Purpose:** Define performance, load, and resilience testing so QA/Perf agents can execute scenarios, capture metrics, and document capacity risks inside the task file.

---

## Command Intent

- Use for capacity planning, load regressions, or resilience validation prior to launch/scaling events.
- Describe workload profile, SLO targets, tooling, and guardrails so runs are reproducible.
- Ensure outcomes update Testing Notes, Risks, and the Rolling Summary with quantified metrics.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug for the target task file | ULID or kebab-case | `2025-demo` |
| `test_objective` | Question the stress test must answer | sentence | `Validate audit pipeline handles 5x baseline` |
| `workload_profile` | Load pattern (ramp, sustain, spike, duration) | list/table | `Ramp 200→2000 TPS over 15m; sustain 45m` |
| `slo_targets` | Quantified SLOs/SLAs to measure against | list | `p99 ≤ 300ms`, `error rate < 0.5%`, `DLQ < 0.1%` |

Missing inputs require an `Open Question:` with owner + due date; assumptions must be tagged `- Inferred`.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `tooling` | Load tools or scripts (`k6`, `Locust`, `JMeter`) | Aligns execution |
| `test_data` | Payload generators, anonymised datasets | Ensures realism |
| `environments` | Target env + capacity notes | Guides setup |
| `failure_injection` | Chaos scenarios to trigger | Tests resilience |
| `monitoring_plan` | Dashboards/alerts to watch | Confirms observability |
| `rollback_thresholds` | Abort criteria to protect systems | Prevents outages |
| `baseline_reference` | Prior run metrics for comparison | Tracks improvements/regressions |
| `update_scope` | Task sections to refresh (`Testing Notes`, `Risks`, `Metrics`) | Focuses documentation |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS update | Set `false` to skip |

## Tone & Structure

- Correlate each workload phase with metrics to capture.
- Call out feature flags/config toggles used during the run.
- Document test duration, warm-up, and cool-down steps explicitly.
- Highlight known risks (data cost, crash potential) along with mitigations.

## Structured Output Requirements

1. **Stress Test Summary**
   - Scenario (environment, workload profile, flags)
   - Metrics (achieved throughput, latency percentiles, error rates, resource usage)
   - Bottlenecks (CPU, IO, network, external dependencies) or `None`
   - Risks (RAG + mitigation/owner)
   - Next Actions (owner + due date)
2. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using standard schema.

## Example Payload

```yaml
[command](qa-stress.command.md)
task_reference: 2025-demo
test_objective: Validate audit pipeline stays within SLO at 5x projected launch traffic.
workload_profile:
  - ramp: 200 TPS → 2,000 TPS over 15m
  - sustain: 2,000 TPS for 45m
  - spike: 3,000 TPS for 5m
slo_targets:
  - p99 publish latency ≤ 300ms
  - error rate < 0.5%
  - DLQ depth < 0.1% of messages
tooling:
  - k6 script `perf/k6/audit_ingest.js`
  - Terraform module `infra/loadtest` for transient agents
test_data:
  - Sanitised payloads `datasets/audit/telemetry.ndjson`
environments:
  - perf-audit.kafka.local (autoscaling disabled)
failure_injection:
  - Throttle broker partition to 50% throughput at T+20m
monitoring_plan:
  - Grafana dashboards `AUDIT Throughput`, `DLQ Depth`
  - Prometheus alerts `AuditErrorRateHigh`
rollback_thresholds:
  - Abort if error rate > 5% for > 2 minutes
baseline_reference: 2024-11-01 run (p99 260ms at 1500 TPS)
update_scope:
  - Testing Notes
  - Risks
  - Metrics & Evidence
```

## Downstream Expectations

- QA/perf agents execute runs, collect metrics, store evidence under `.spec/tasks/<task_reference>/artifacts/qa/stress/`, and append Activity Log entries (`YYYY-MM-DDTHH:MM:SS+03:00 - qa-orchestrator - Stress test 5x load Go`).
- If SLOs fail, log severity, update Risks, and assign follow-up tasks to Tech Lead/Product Ops for remediation.
- Product Ops and Tech Lead use the results to inform release gates, capacity planning, and subsequent experiments; Rolling Summary reflects the latest readiness state.

---

**End of command spec.**
