qa-e2e.skill

## **Purpose**
Validates end-to-end user journeys and cross-system workflows, ensuring complete functionality, performance, and user experience through comprehensive testing across multiple components and services.

## **Target Agent**
QA agents who validate end-to-end user journeys and cross-system workflows, ensuring complete functionality, performance, and user experience through comprehensive testing across multiple components and services.

## **Trigger Scenarios**
- When cross-system workflows or user journeys require validation prior to release
- When new features span multiple services and require integration testing
- When preparing for release and ensuring system readiness for production deployment
- When performance or user experience issues are suspected in complex workflows
- When regression testing is needed for existing end-to-end scenarios

## **Required MCPs/Tools**
- End-to-end testing frameworks (Playwright, Cypress, Selenium) for automated user journey testing
- Performance monitoring tools (Grafana, New Relic, Datadog) for measuring system performance
- Test data management systems for creating and managing realistic test scenarios
- Environment management platforms for staging and test environment orchestration
- Bug tracking and test management systems (Jira, TestRail) for documenting results

## **Core Procedure (SOP)**

### **Phase 1: Test Planning & Scope Definition**
1. **Define Journey Objectives**: Clarify specific user workflows that require end-to-end validation
2. **Establish Acceptance Criteria**: Document measurable success conditions for each journey scenario
3. **Assess Environment Requirements**: Identify target environment configuration and access needs
4. **Plan Test Data Strategy**: Define data seeding and setup requirements for realistic testing

### **Phase 2: Test Environment & Data Preparation**
1. **Configure Test Environment**: Prepare staging environment with proper feature flags and configurations
2. **Setup Monitoring Tools**: Configure dashboards and logging systems for performance observation
3. **Prepare Test Data**: Seed required data states and user accounts for journey execution
4. **Validate Environment Health**: Confirm all systems are operational and ready for testing

### **Phase 3: Test Execution & Monitoring**
1. **Execute Manual Scenarios**: Run through user journeys manually to validate basic functionality
2. **Run Automated Test Suites**: Execute Playwright/Cypress scripts for automated journey validation
3. **Monitor System Performance**: Observe dashboards and metrics during test execution
4. **Document Issues and Defects**: Record any problems found with severity and reproduction steps

### **Phase 4: Results Analysis & Readiness Assessment**
1. **Analyze Test Results**: Review all test outcomes against acceptance criteria
2. **Assess Performance Metrics**: Evaluate system performance against SLO targets
3. **Determine Release Readiness**: Make go/no-go recommendations based on test outcomes
4. **Document Findings**: Record comprehensive test results and recommendations

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the target task file | ULID or kebab-case | `2025-demo` |
| `journey_name` | Name/description of the journey under test | String | `Refund → audit event trail` |
| `acceptance_criteria` | Success conditions that must hold | List | `audit event emitted`, `trace linked`, `p95<200ms` |
| `environment` | Target environment + access notes | String | `staging-audit (VPN req, flags on)` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `preconditions` | Seeding/config steps to run before the test | Ensures repeatability |
| `test_steps` | Ordered scenario script | Guides execution |
| `tooling` | Automation frameworks or scripts (`Playwright`, `Cypress`) | Aligns tooling |
| `data_variants` | Personas/devices/locales | Broadens coverage |
| `monitoring_checks` | Dashboards/logs to watch | Confirms telemetry |
| `exit_criteria` | Definition of done for the cycle | Sets readiness gate |
| `rollback_plan` | Steps if Sev-High defects appear | Supports release decisions |
| `update_scope` | Task sections to refresh (`Testing Notes`, `Risks`) | Focuses documentation |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS update | Set `false` if skipping |

## **Execution Templates**

### **E2E Test Summary**
```
Journey: [Name/description of journey under test]
Environment: [Target environment with access requirements]
Test Duration: [Start time] → [End time] ([X]h [Y]m)

Acceptance Criteria Results:
- [Criterion 1]: [Pass/Fail] - [Measured result]
- [Criterion 2]: [Pass/Fail] - [Measured result]

Test Scenarios Executed:
- [Scenario 1]: [Automated/Manual] - [Pass/Fail] ([X]s duration)
- [Scenario 2]: [Automated/Manual] - [Pass/Fail] ([X]s duration)

Performance Metrics:
- [Metric 1]: [Value] (Target: [value])
- [Metric 2]: [Value] (Target: [value])

Defects Identified:
- [Defect ID]: [Severity] - [Description] (Status: [Open/Fixed])

Readiness Assessment:
- Overall Status: [Go / Conditional Go / No-Go]
- Blocking Issues: [None / List of blockers]
- Release Recommendation: [Proceed / Hold / Retest required]

Evidence: [Embedded screenshots, logs, metrics in Testing Notes section]

Next Actions:
- [Action 1] (Owner: [Name], Due: [Date])
- [Action 2] (Owner: [Name], Due: [Date])
```

### **Rolling Summary Update**
```
Context: [Updated context based on E2E testing outcomes]
Facts: [Journey tested, environment, readiness status, key metrics]
Decisions: [Release readiness decisions, defect prioritization]
Risks: [System integration risks with RAG status and mitigation]
Next: [Immediate next steps for release or retesting]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Map each acceptance criterion to corresponding test cases and evidence
- Distinguish automated vs manual steps; cite scripts/commands clearly
- Embed all evidence (screenshots, HAR files, metrics) directly in Testing Notes section using markdown code blocks
- Assign severity to defects (Sev-High/Med/Low) with owner + ETA for retest
- Reference existing Task Package using task_reference parameter

### **Process Compliance**
- Tag unresolved items as `Open Question:` with owner + due date
- Embed all test evidence directly in Testing Notes section with timestamps
- Update Activity Log with E2E verdicts and readiness status
- Maintain comprehensive documentation of test execution and results
- Ensure test reproducibility through proper environment and data management

### **Boundary Conditions**
- Do not modify production data during E2E testing
- Do not test individual component functionality; focus on integration scenarios
- Do not bypass security or authentication controls for test convenience
- Avoid testing edge cases that don't represent realistic user behavior
- Do not execute tests that could impact production systems or real users

### **Validation Protocols**
- Verify test environment accurately reflects production configuration
- Confirm acceptance criteria are measurable and achievable
- Validate test data supports all required scenarios and variants
- Ensure monitoring and observability tools are functional during tests
- Test rollback procedures and emergency response plans

## **Execution Parameters**

### **Success Criteria**
- All acceptance criteria are met with measurable evidence
- Performance metrics meet or exceed SLO targets
- No blocking defects remain unresolved
- Test coverage adequately represents realistic user scenarios
- Clear release readiness recommendation is provided

### **Error Handling**
- If test environment issues arise, resolve configuration problems before proceeding
- When acceptance criteria are not met, identify root causes and required fixes
- For performance issues, conduct detailed analysis and optimization recommendations
- If defects are discovered, prioritize by severity and create remediation plans
- When test data problems occur, refresh data setup and re-execute affected scenarios

## **Example Usage**
```
Use the qa-e2e skill with these parameters:
task_reference: 2025-demo
journey_name: Refund creates audit event trail
acceptance_criteria:
  - audit event persisted with unique trace
  - Grafana dashboard reflects event within 5 minutes
  - end-user sees status update within 2 minutes
environment: staging-audit (VPN required, flags audit_bus_producer + audit_bus_strict_schema enabled)
preconditions:
  - Seed refund order `REF-123`
  - Enable feature flags in config service
test_steps:
  1. Trigger refund via admin UI (Playwright script `e2e/refund.spec.ts`)
  2. Verify audit topic message via `scripts/check_audit_event.sh`
  3. Confirm dashboard panel updates (Grafana AUDIT-PROD-01)
tooling:
  - Playwright suite `e2e/refund.spec.ts`
  - Shell script `scripts/check_audit_event.sh`
data_variants:
  - Persona: Admin vs Support agent
  - Browser: Chrome stable, Firefox ESR
monitoring_checks:
  - Grafana AUDIT latency panel
  - Kibana index `audit-events-*`
exit_criteria: All acceptance criteria met with ≤ Sev-Med defects outstanding
rollback_plan: Disable audit flags; revert to synchronous logging
update_scope:
  - Testing Notes
  - Risks
```