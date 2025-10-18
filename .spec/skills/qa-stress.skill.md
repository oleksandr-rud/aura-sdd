qa-stress.skill

## **Purpose**
Validates system capacity, resilience, and scalability under load, ensuring SLO compliance and performance reliability through systematic stress testing and capacity planning.

## **Target Agent**
QA and Performance agents who validate system capacity, resilience, and scalability under load, ensuring SLO compliance and performance reliability through systematic stress testing and capacity planning.

## **Trigger Scenarios**
- When capacity planning is needed for upcoming scaling events or launches
- When load regressions are suspected due to code changes or infrastructure updates
- When resilience validation is required before production deployment
- When scaling decisions need data-driven performance analysis and recommendations
- When SLO compliance needs verification under realistic load conditions

## **Required MCPs/Tools**
- Load testing platforms (k6, Locust, JMeter, Gatling) for generating realistic traffic patterns
- Performance monitoring tools (Grafana, Prometheus, New Relic) for real-time metrics collection
- Infrastructure orchestration (Terraform, Kubernetes) for provisioning test environments
- Chaos engineering tools (Chaos Monkey, Gremlin) for failure scenario testing
- Capacity planning analytics for trend analysis and scaling recommendations

## **Core Procedure (SOP)**

### **Phase 1: Test Planning & Objective Definition**
1. **Define Test Objectives**: Clarify specific capacity and performance questions that testing must answer
2. **Design Workload Profile**: Create realistic load patterns including ramp, sustain, spike, and recovery phases
3. **Establish SLO Targets**: Define quantified service level objectives and success criteria
4. **Plan Test Environment**: Prepare target infrastructure with monitoring and observability systems

### **Phase 2: Test Configuration & Setup**
1. **Configure Load Generation**: Setup load testing tools with scripts and scenarios
2. **Prepare Test Data**: Create realistic payload generators and anonymized datasets
3. **Setup Monitoring**: Configure dashboards, alerts, and metrics collection
4. **Establish Safety Controls**: Define rollback thresholds and abort criteria

### **Phase 3: Test Execution & Monitoring**
1. **Execute Load Phases**: Run workload profile according to defined test plan
2. **Monitor System Behavior**: Observe performance metrics, error rates, and resource utilization
3. **Apply Failure Injection**: Introduce chaos scenarios to test resilience and recovery
4. **Document Observations**: Record system responses, bottlenecks, and anomalous behavior

### **Phase 4: Analysis & Recommendations**
1. **Analyze Performance Results**: Compare achieved metrics against SLO targets
2. **Identify Bottlenecks**: Pinpoint performance constraints and limiting factors
3. **Assess System Resilience**: Evaluate failure handling and recovery capabilities
4. **Generate Recommendations**: Provide specific scaling and optimization guidance

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the target task file | ULID or kebab-case | `2025-demo` |
| `test_objective` | Question the stress test must answer | Sentence | `Validate audit pipeline handles 5x baseline` |
| `workload_profile` | Load pattern (ramp, sustain, spike, duration) | List/table | `Ramp 200→2000 TPS over 15m; sustain 45m` |
| `slo_targets` | Quantified SLOs/SLAs to measure against | List | `p99 ≤ 300ms`, `error rate < 0.5%`, `DLQ < 0.1%` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `tooling` | Load tools or scripts (`k6`, `Locust`, `JMeter`) | Aligns execution |
| `test_data` | Payload generators, anonymised datasets | Ensures realism |
| `environments` | Target env + capacity notes | Guides setup |
| `failure_injection` | Chaos scenarios to trigger | Tests resilience |
| `monitoring_plan` | Dashboards/alerts to watch | Confirms observability |
| `rollback_thresholds` | Abort criteria to protect systems | Prevents outages |
| `baseline_reference` | Prior run metrics for comparison | Tracks improvements/regressions |
| `update_scope` | Task sections to refresh (`Testing Notes`, `Risks`, `Metrics`) | Focuses documentation |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS update | Set `false` to skip |

## **Execution Templates**

### **Stress Test Summary**
```
Test Objective: [Question the stress test must answer]
Environment: [Target environment with capacity notes]
Test Duration: [Start time] → [End time] ([X]h [Y]m)

Workload Profile Executed:
- [Phase 1]: [Description] ([Start] → [End], [X] TPS, [Y] duration)
- [Phase 2]: [Description] ([Start] → [End], [X] TPS, [Y] duration)

SLO Results:
- [SLO 1]: [Achieved] / [Target] (Status: Pass/Fail)
- [SLO 2]: [Achieved] / [Target] (Status: Pass/Fail)

Performance Metrics:
- Throughput: [Value] (Target: [value])
- Latency p50: [Value]ms, p95: [Value]ms, p99: [Value]ms
- Error Rate: [Value]% (Target: < [value]%)
- Resource Utilization: [CPU/Memory/Network metrics]

Bottlenecks Identified:
- [Component 1]: [Description] (Impact: High/Medium/Low)
- [Component 2]: [Description] (Impact: High/Medium/Low)
- None identified

Resilience Testing:
- [Failure Scenario 1]: [System response] (Pass/Fail)
- [Failure Scenario 2]: [System response] (Pass/Fail)

Capacity Assessment:
- Current Capacity: [Value with units]
- Recommended Scaling: [Scaling recommendations]
- Headroom Available: [Percentage or units]

Next Actions:
- [Action 1] (Owner: [Name], Due: [Date])
- [Action 2] (Owner: [Name], Due: [Date])
```

### **Rolling Summary Update**
```
Context: [Updated context based on stress testing outcomes]
Facts: [Test objective, environment, SLO results, capacity metrics]
Decisions: [Capacity planning decisions, scaling recommendations]
Risks: [Performance risks with RAG status and mitigation strategies]
Next: [Immediate next steps for capacity improvements or retesting]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Correlate each workload phase with metrics to capture
- Call out feature flags/config toggles used during the run
- Document test duration, warm-up, and cool-down steps explicitly
- Highlight known risks (data cost, crash potential) along with mitigations
- Reference existing Task Package using task_reference parameter

### **Process Compliance**
- Tag unresolved items as `Open Question:` with owner + due date
- Store test artifacts under `artifacts/qa/stress/` with timestamps
- Update Activity Log with stress test verdicts and performance findings
- Maintain comprehensive documentation of test execution and results
- Ensure test reproducibility through proper configuration management

### **Boundary Conditions**
- Do not run stress tests against production environments without explicit approval
- Do not exceed rollback thresholds or cause system outages
- Do not use production data without proper anonymization
- Avoid testing unrealistic load patterns that don't represent expected usage
- Do not bypass safety controls or monitoring systems during testing

### **Validation Protocols**
- Verify monitoring and observability systems are functional during tests
- Confirm rollback thresholds are appropriate and automated where possible
- Validate test data accurately represents production traffic patterns
- Ensure SLO targets are realistic and aligned with business requirements
- Test emergency response procedures and communication protocols

## **Execution Parameters**

### **Success Criteria**
- All SLO targets are achieved or clearly explained failures are documented
- System capacity is quantified with specific performance characteristics
- Bottlenecks are identified with actionable optimization recommendations
- Resilience testing validates system behavior under failure conditions
- Clear scaling guidance is provided based on test results

### **Error Handling**
- If monitoring systems fail during tests, pause execution and restore observability
- When SLO targets are not met, conduct detailed root cause analysis
- For system instability, implement immediate rollback procedures and safety measures
- If test data issues occur, regenerate realistic datasets and re-execute scenarios
- When unexpected failures happen, document thoroughly and adjust test parameters

## **Example Usage**
```
Use the qa-stress skill with these parameters:
task_reference: 2025-demo
test_objective: Validate audit pipeline stays within SLO at 5x projected launch traffic
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