code-review.skill

## **Purpose**
Provides systematic code review evaluation for existing initiatives, transforming code changes into documented findings with severity classifications, risk assessments, and actionable next steps.

## **Target Agent**
tech-lead-orchestrator, qa-orchestrator

## **Trigger Scenarios**
- **PR Review**: When pull requests are ready for systematic evaluation
- **Branch Assessment**: When feature branches require quality gate validation
- **Change Set Validation**: When specific code changes need thorough review
- **Risk-Based Review**: When high-risk areas require focused examination
- **Compliance Review**: When code changes must meet regulatory or security standards

## **Required MCPs/Tools**
- **Version Control**: Git repository access, PR/branch examination capabilities
- **Code Analysis**: Static analysis tools, linting frameworks, dependency scanners
- **Testing Frameworks**: Unit test runners, integration test suites
- **Documentation Systems**: Task Package access, Activity Log management
- **Communication**: Review commenting systems, stakeholder notification

## **Core Procedure (SOP)**

### **Phase 1: Review Preparation**
1. **Scope Definition**: Identify review boundaries and target files/directories
2. **Risk Assessment**: Determine high-risk areas requiring focused scrutiny
3. **Quality Criteria**: Establish specific review criteria based on change type
4. **Test Validation**: Confirm required test suites are available and executable

### **Phase 2: Systematic Evaluation**
1. **Code Structure Review**: Evaluate architectural adherence and design patterns
2. **Security Assessment**: Check for vulnerabilities and compliance violations
3. **Performance Analysis**: Identify potential performance bottlenecks
4. **Test Coverage**: Verify adequate test coverage and quality
5. **Documentation Review**: Ensure code comments and documentation are adequate

### **Phase 3: Finding Classification**
1. **Severity Assignment**: Classify findings by impact (Blocker, Major, Minor, Note)
2. **Risk Mapping**: Link findings to specific project risks and mitigation plans
3. **Action Planning**: Define specific actions required for each finding
4. **Owner Assignment**: Assign responsibility for addressing each issue

### **Phase 4: Review Completion**
1. **Verdict Determination**: Provide overall review decision (Approve/Request Changes/Pending)
2. **Documentation**: Document findings in appropriate Task Package sections
3. **Activity Logging**: Record review completion and key outcomes
4. **Rolling Summary Update**: Update task context with review outcomes

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the target task file | ULID or kebab-case | `2025-demo` |
| `review_target` | Identifier for the change (PR link, branch, commit) | String or URL | `PR#128` |
| `change_summary` | One-line description of what changed and why | Sentence | `Adds Kafka producer + Terraform topic` |
| `risk_focus` | Areas to scrutinize (perf, security, correctness) | List | `idempotency`, `schema evolution` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `diff_paths` | Specific files/directories to prioritize | Prevents scope drift |
| `technical_constraints` | NFRs or compliance requirements to verify | Frames acceptance criteria |
| `tests_expected` | Suites reviewers expect to see or run | Guides validation |
| `deployment_notes` | Feature flags, rollout, or migration considerations | Flags release implications |
| `stakeholders` | Reviewers/approvers to loop in | Aids coordination |
| `update_scope` | Task sections to update (`Risks`, `Implementation Notes`) | Keeps documentation focused |
| `rolling_summary_delta` | Boolean (default `true`) controlling Rolling Summary refresh | Set to `false` to skip |

## **Execution Templates**

### **Code Review Summary Template**
```
Review Target: [PR/branch/commit identifier]
Change Summary: [What changed and why]
Verdict: [Approve / Request changes / Pending]

Findings by Severity:
Blocker:
- [Issue 1]: [Description] (File: [path], Line: [number])

Major:
- [Issue 2]: [Description] (File: [path], Line: [number])

Minor:
- [Issue 3]: [Description] (File: [path], Line: [number])

Note:
- [Suggestion 1]: [Description] (File: [path])

Tests Status:
- [Test suite 1]: [Pass/Fail/Required]
- [Test suite 2]: [Pass/Fail/Required]

Reviewed Areas:
- [Directory/component 1]: Complete
- [Directory/component 2]: Complete

Next Actions:
- [Action 1] (Owner: [Name], Due: [Date])
- [Action 2] (Owner: [Name], Due: [Date])
```

### **Rolling Summary Update Template**
```
Context: [Updated context based on review outcomes]
Facts: [PR identifier, review verdict, key findings, test status]
Decisions: [Approval/rejection decisions, scope changes]
Risks: [Code quality risks with RAG status and mitigation]
Next: [Immediate next steps for addressing review findings]
```

## **Quality Standards & Guardrails**

### **Review Quality Requirements**
- Deliver actionable findings with severity labels (`Blocker`, `Major`, `Minor`, `Note`)
- Reference file paths/lines and link to evidence where possible
- Confirm reviewed areas to avoid double work (`Reviewed: billing/producer/*`)
- State verification status (tests run or required) in the summary

### **Process Compliance**
- Reference existing Task Package using task_reference parameter
- Keep Activity Log entry within 120 characters with clear verdict
- Tag unresolved items as `Open Question:` with owner + due date
- Update relevant task sections per update_scope parameter

### **Boundary Conditions**
- Never merge or approve changes directly; only provide review guidance
- Never rewrite code during review; suggest improvements instead
- Never review areas outside specified diff_paths unless critical issues found
- Avoid personal commentary; focus on technical merit and adherence to standards

### **Validation Protocols**
- Verify review_target exists and is accessible
- Confirm risk_focus areas are relevant to the change scope
- Validate technical_constraints are measurable and testable
- Ensure all Blocker/Major findings have clear resolution paths

## **Execution Parameters**

### **Success Criteria**
- All findings are classified by severity with clear action items
- Review verdict is supported by specific evidence and rationale
- Test status is clearly documented with coverage information
- All reviewed areas are documented to prevent duplicate work

### **Error Handling**
- When review_target is inaccessible, document as Blocker and request access
- When tests fail, document as Major finding with reproduction steps
- When technical_constraints are violated, classify severity based on impact
- When scope is unclear, document as Note and request clarification

## **Example Usage**
```
Use the code-review skill with these parameters:
task_reference: 2025-demo
review_target: PR#128
change_summary: Adds Kafka producer and Terraform topic module
risk_focus:
  - idempotency
  - schema evolution
  - retries under broker failure
diff_paths:
  - billing/producer/**
  - infra/kafka/topic.tf
technical_constraints:
  - p95 publish latency ≤ 200ms
tests_expected:
  - go test ./billing/producer
  - contract tests on audit.v1 schema
deployment_notes:
  - gated by flags audit_bus_producer + audit_bus_strict_schema
stakeholders:
  - tech-lead-orchestrator
  - qa-orchestrator
update_scope:
  - Risks
  - Implementation Notes
```