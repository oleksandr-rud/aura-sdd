# Dynamic Task Template

## Quick Start
Copy this structure to create your task: `.spec/tasks/PROJECT-XXX.md`

## Task Configuration
```yaml
Task Metadata:
  Project Type: {{project-type}}  # infrastructure/feature/documentation/optimization
  Complexity Score: {{complexity-level}}/10
  Automation Level: {{automation-enabled}}
  Estimated Duration: {{time-estimate}}
  Risk Level: {{risk-assessment}}
```

## Dynamic Sections

### Header
```yaml
## Header
- **Project**: PROJECT_NAME (Project Acronym)
- **Task ID**: PROJECT-XXX (3-digit sequential number)
- **Slug**: descriptive-task-name-in-kebab-case
- **Status**: [planning|in_progress|completed|blocked|on_hold]
- **Owners**: primary-agent-name
- **Last Updated**: ISO 8601 timestamp (YYYY-MM-DDTHH:MM:SS+TZ:TZ)
- **Auto-Progress**: {{auto-progress-enabled}}
- **Dependencies**: {{dependency-list}}
```

### Product Brief
```yaml
## Product Brief

**Problem**: {{problem-statement-with-user-impact}}

**Audience**:
- Primary: {{primary-audience}}
- Secondary: {{secondary-audience}}

**Goals** (SMART):
- {{goal-1}} (Target: {{target}}, Timeline: {{timeline}})
- {{goal-2}} (Target: {{target}}, Timeline: {{timeline}})

**Constraints**:
- {{constraint-1}} (Impact: {{impact-level}})
- {{constraint-2}} (Impact: {{impact-level}})

**KPIs** (Key Performance Indicators):
- {{kpi-1}} → {{target-value}} (Measurement: {{tracking-method}})
- {{kpi-2}} → {{target-value}} (Measurement: {{tracking-method}})

**Hypotheses**:
- {{hypothesis-1}} (Validation: {{validation-method}})
- {{hypothesis-2}} (Validation: {{validation-method}})
```

### Rolling Summary
```yaml
## Rolling Summary
Context: {{current-context-summary}} | Facts: {{key-facts-and-completed-work}} | Decisions: {{important-decisions-made}} | Risks: {{current-risks-and-mitigations}} | Next: {{immediate-next-steps}}

**Progress Tracker**:
- Completion: {{completion-percentage}}%
- Milestones: {{completed-milestones}}/{{total-milestones}}
- Blockers: {{blocker-count}}
- Next Review: {{next-review-date}}
```

### Implementation Notes
```yaml
## Implementation Notes

### Architecture Overview
```yaml
Design Pattern: {{selected-pattern}}
Complexity: {{complexity-score}}/10
Decision Points: {{decision-count}}
Integration Points: {{integration-points}}
```

**High-level System Design**: {{system-design-summary}}

**Component Relationships**: {{component-interaction-summary}}

**Technology Stack**: {{technology-stack-with-versions}}

### Core Components Configuration
```yaml
Components:
  {{component-1}}:
    Status: {{status}}
    Configuration: {{config-summary}}
    Dependencies: {{dependencies}}
  {{component-2}}:
    Status: {{status}}
    Configuration: {{config-summary}}
    Dependencies: {{dependencies}}
```

### Integration Strategy
```yaml
API Contracts: {{contract-status}}
Data Flow: {{data-flow-pattern}}
Service Communication: {{communication-protocol}}
Error Handling: {{error-handling-strategy}}
```

### Security Implementation
```yaml
Authentication: {{auth-method}}
Authorization: {{authz-pattern}}
Data Protection: {{data-protection-measures}}
Compliance: {{compliance-standards}}
```

### Environment Variables Management
```yaml
Environments: [dev, staging, prod]
Secret Management: {{secret-management-method}}
Configuration Strategy: {{config-strategy}}
```

### Automated Features
- **🤖 Auto-Generation**: {{auto-gen-capabilities}}
- **📊 Monitoring**: {{monitoring-setup}}
- **🔄 CI/CD Integration**: {{cicd-status}}
- **⚡ Performance Optimization**: {{optimization-level}}
```

### Testing Notes
```yaml
## Testing Notes

### Test Configuration
```yaml
Test Matrix:
  Coverage Target: {{coverage-target}}%
  Automation Level: {{test-automation}}%
  Environment: {{test-environment}}
  Performance Baseline: {{perf-baseline}}
```

### Unit Testing
- [ ] {{component-1}} testing validation (Coverage: {{coverage}}%)
- [ ] {{component-2}} testing validation (Coverage: {{coverage}}%)
- [ ] Configuration file parsing and validation
- [ ] Service interaction testing
- [ ] Error handling and edge cases
- [ ] Performance characteristics validation

### Integration Testing
- [ ] Service-to-service communication
- [ ] Database connectivity and operations
- [ ] External API integration
- [ ] Environment promotion testing
- [ ] Configuration management validation

### Contract Testing
- [ ] API contract validation ({{api-count}} endpoints)
- [ ] Service dependency verification
- [ ] Data format and schema validation
- [ ] Response time and reliability testing

### End-to-End Testing
- [ ] Complete workflow validation ({{workflow-count}} paths)
- [ ] User journey testing
- [ ] Production simulation
- [ ] Failure scenario testing
- [ ] Rollback mechanism validation

### Stress Testing
- [ ] Load testing under peak conditions ({{target-load}})
- [ ] Resource utilization limits
- [ ] Concurrent user testing ({{concurrent-users}})
- [ ] Performance degradation analysis
- [ ] Scalability validation

**Current Status**: {{test-status-summary}} | Coverage: {{test-coverage}}% | Severity: {{critical-issues}} | **Next**: {{testing-next-steps}}

### Automated Testing Features
- **🤖 Smart Test Selection**: Auto-select relevant tests based on changes
- **📊 Coverage Tracking**: Real-time coverage monitoring
- **⚡ Performance Regression**: Auto-detect performance issues
- **🔄 Parallel Execution**: Run tests in parallel where possible
```

### Metrics & Evidence
```yaml
## Metrics & Evidence

### Performance Metrics
```yaml
Service Performance:
  Response Time: {{current-ms}}/{{target-ms}} ms
  Throughput: {{current-tps}}/{{target-tps}} tps
  Error Rate: {{current-error}}%/{{target-error}}%
  Availability: {{current-uptime}}%/{{target-uptime}}%

Resource Utilization:
  CPU Usage: {{cpu-usage}}% (Target: <{{cpu-target}}%)
  Memory Usage: {{memory-usage}}MB (Target: <{{memory-target}}MB)
  Storage: {{storage-usage}}GB (Target: <{{storage-target}}GB)
  Network: {{network-usage}}Mbps (Target: <{{network-target}}Mbps)
```

### Implementation Evidence
```yaml
Components Created/Updated:
  - {{file-1}}: {{purpose}}
  - {{file-2}}: {{purpose}}
  Configuration Changes: {{config-change-count}}
  Integration Points: {{integration-count}}
  Documentation Generated: {{doc-pages}}

Testing Results:
  Test Execution: {{tests-passed}}/{{tests-total}} passed
  Performance Benchmarks: {{benchmarks-status}}
  Security Scans: {{security-scan-result}}
  Code Coverage: {{final-coverage}}%
```

### Configuration Evidence
```yaml
Environment Setup:
  Development: {{dev-status}}
  Staging: {{staging-status}}
  Production: {{prod-status}}
  Infrastructure: {{infra-status}}

Deployment Validation:
  CI/CD Pipeline: {{pipeline-status}}
  Image Building: {{build-status}}
  Health Checks: {{health-status}}
  Monitoring: {{monitoring-status}}
```

### Automated Metrics
- **📈 Real-time Monitoring**: {{monitoring-dashboard-link}}
- **🔍 Anomaly Detection**: {{anomaly-status}}
- **📊 Trend Analysis**: {{trend-indicators}}
- **⚡ Alert Configuration**: {{alert-status}}
```

### Activity Log
```yaml
## Activity Log

*Append-only log - never modify existing entries*

{{current-date}} - {{agent-name}} - {{activity-description}}

**Recent Activity**:
- {{date-1}} - {{agent-1}} - {{action-1}}
- {{date-2}} - {{agent-2}} - {{action-2}}
- {{date-3}} - {{agent-3}} - {{action-3}}

**Activity Statistics**:
- Total Entries: {{total-entries}}
- Last Update: {{last-update}}
- Active Agents: {{active-agents}}
- Automation Level: {{automation-percentage}}%
```

## Dynamic Automation Features

### Auto-Progress Configuration
```yaml
Auto-Progress Rules:
  - When: {{condition}}
    Action: {{automated-action}}
    Owner: {{responsible-agent}}

Smart Notifications:
  - Status Changes: {{notification-enabled}}
  - Blocker Alerts: {{alert-enabled}}
  - Milestone Completion: {{milestone-alerts}}
```

### Quality Gates Automation
```yaml
Gate Configuration:
  Quality Score Threshold: {{min-score}}/100
  Test Coverage Minimum: {{min-coverage}}%
  Performance Limits: {{perf-limits}}
  Security Requirements: {{security-gates}}

Auto-Approval:
  Score ≥ {{auto-approve-threshold}}: ✅ Auto-approve
  Score {{review-range}}: 🔍 Human review required
  Score < {{rejection-threshold}}: ❌ Auto-reject
```

### Task Creation Guidelines

### 1. Dynamic Initialization
- Use project tag + 3-digit sequential ID
- Set complexity score (1-10) to auto-adjust expectations
- Configure automation level based on task type
- Set up dependency tracking

### 2. Smart Product Brief
- Use problem-impact mapping for clear articulation
- Set SMART goals with auto-tracking
- Configure KPIs with automatic measurement
- Enable hypothesis validation tracking

### 3. Intelligent Rolling Summary
- Auto-update based on Activity Log entries
- Track completion percentages automatically
- Generate next steps based on current state
- Alert on blockers and risks

### 4. Enhanced Documentation
- Enable auto-generation of configuration examples
- Set up integration pattern detection
- Configure security best practices checking
- Enable environment-specific documentation

### 5. Automated Testing Strategy
- Configure smart test selection based on changes
- Set up automatic coverage tracking
- Enable performance regression detection
- Configure parallel test execution

### 6. Dynamic Evidence Collection
- Set up automatic metrics collection
- Configure performance benchmarking
- Enable security scan automation
- Set up trend analysis and alerting

## Status Values
- **planning**: Initial task creation and requirements gathering
- **in_progress**: Active development and implementation
- **completed**: All deliverables finished and validated
- **blocked**: External dependencies preventing progress
- **on_hold**: Temporarily paused by decision or priority change

## Dynamic Quality Standards
- All sections must be complete and accurate
- Auto-validation for configuration examples
- Metrics automatically collected and validated
- Decisions automatically tagged with evidence links

## Success Criteria
Task is complete when:
- [ ] All KPIs from Product Brief are met or exceeded (auto-validated)
- [ ] All testing categories have appropriate coverage (auto-tracked)
- [ ] Activity Log shows complete progression (auto-summarized)
- [ ] Rolling Summary reflects final state (auto-updated)
- [ ] All deliverables are documented and handed off (auto-verified)
- [ ] Quality gates passed (auto-evaluated)

## Template Variables
Use these variables for dynamic content:
- `{{project-type}}` - Type of project
- `{{complexity-level}}` - 1-10 complexity score
- `{{automation-enabled}}` - Automation level
- `{{current-date}}` - Current timestamp
- `{{agent-name}}` - Current agent
- `{{completion-percentage}}` - Auto-calculated progress

---

*Dynamic template with automation, intelligent features, and real-time progress tracking.*