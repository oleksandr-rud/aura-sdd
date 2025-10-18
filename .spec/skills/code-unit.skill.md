code-unit.skill

## **Purpose**
Validates unit-level code quality, ensuring test coverage, edge case handling, and component reliability through systematic testing and verification processes within existing Task Packages.

## **Target Agent**
QA and Tech Lead agents who validate unit-level code quality, ensuring test coverage, edge case handling, and component reliability through systematic testing and verification processes.

## **Trigger Scenarios**
- When new code or refactors require unit-level verification before integration
- When coverage targets slip and comprehensive testing is needed to meet quality standards
- When critical components need thorough validation due to business impact or complexity
- When test failures indicate gaps in unit test coverage or quality
- When preparing for release and ensuring all components meet quality gates

## **Required MCPs/Tools**
- Test frameworks (pytest, go test, jest, JUnit) for executing unit test suites
- Coverage analysis tools (coverage.py, go tool cover, istanbul) for measuring test coverage metrics
- Mock/stub frameworks (unittest.mock, testify, sinon) for isolating components under test
- CI/CD pipeline integration (GitHub Actions, Jenkins, GitLab CI) for automated test execution
- Code quality tools (SonarQube, ESLint, golint) for static analysis and code quality assessment

## **Core Procedure (SOP)**

### **Phase 1: Test Planning & Scope Definition**
1. **Define Test Objective**: Clarify the specific quality goal that unit testing must achieve, including coverage targets and reliability requirements
2. **Identify Target Modules**: Specify the specific files, packages, functions, or classes that require unit test coverage
3. **Assess Coverage Requirements**: Define target coverage metrics (line, branch, function) based on criticality and standards
4. **Select Test Framework**: Choose appropriate testing tools and frameworks compatible with the target codebase

### **Phase 2: Test Design & Environment Setup**
1. **Design Test Scenarios**: Create comprehensive test cases covering happy paths, edge cases, and error conditions
2. **Prepare Test Data**: Set up fixtures, mocks, and test data required for deterministic and repeatable tests
3. **Configure Test Environment**: Ensure testing infrastructure is properly configured and dependencies are stubbed
4. **Define Success Criteria**: Establish clear pass/fail criteria and coverage thresholds that must be met

### **Phase 3: Test Execution & Results Analysis**
1. **Execute Test Suites**: Run unit tests across all target modules and collect coverage metrics
2. **Analyze Test Results**: Review test outcomes, identify failures, and assess coverage against targets
3. **Investigate Failures**: Debug test failures, identify root causes, and determine if issues are in code or tests
4. **Validate Edge Cases**: Ensure critical edge cases and error conditions are properly tested and handled

### **Phase 4: Quality Assurance & Documentation**
1. **Address Coverage Gaps**: Add missing tests for uncovered lines, branches, or functions to meet targets
2. **Refine Test Quality**: Improve test reliability, reduce flakiness, and enhance assertion clarity
3. **Update Documentation**: Record testing outcomes, coverage metrics, and any identified quality issues
4. **Integrate with CI**: Configure automated test execution in CI/CD pipeline to maintain quality standards

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug anchoring the test effort | ULID or kebab-case | `2025-demo` |
| `test_goal` | One-line objective for the unit test pass | Sentence | `Validate producer retries schema rejects` |
| `target_modules` | Files/packages/functions to cover | List | `billing/producer`, `billing/retry` |
| `coverage_expectation` | Target metric (line/branch/function) or threshold | String | `≥85% lines, 100% branches in retry` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `framework` | Test runner (`pytest`, `go test`, `jest`) | Ensures correct tooling |
| `fixtures` | Data/mocks required | Supports deterministic tests |
| `edge_cases` | Scenarios to emphasize | Improves coverage depth |
| `dependencies` | Services/contracts to stub | Prevents flaky tests |
| `ci_integration` | Pipelines or commands to wire into CI | Automates enforcement |
| `update_scope` | Task sections to refresh (`Testing Notes`, `Risks`) | Focuses documentation |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS refresh | Set `false` if not required |

## **Execution Templates**

### **Unit Test Summary**
```
Test Goal: [Objective of the unit test pass]
Target Modules: [Files/packages/functions under test]
Framework: [Test runner and version]

Coverage Results:
- Line Coverage: [Achieved]% / [Target]%
- Branch Coverage: [Achieved]% / [Target]%
- Function Coverage: [Achieved]% / [Target]%

Test Suites Executed:
- [Suite 1]: [Pass/Fail/Error] ([X] tests, [Y]s duration)
- [Suite 2]: [Pass/Fail/Error] ([X] tests, [Y]s duration)

Key Findings:
- [Finding 1]: [Description] (Impact: High/Medium/Low)
- [Finding 2]: [Description] (Impact: High/Medium/Low)

Edge Cases Tested:
- [Case 1]: [Expected result] - [Actual result]
- [Case 2]: [Expected result] - [Actual result]

Next Actions:
- [Action 1] (Owner: [Name], Due: [Date])
- [Action 2] (Owner: [Name], Due: [Date])
```

### **Rolling Summary Update**
```
Context: [Updated context based on unit testing outcomes]
Facts: [Modules tested, coverage achieved, test framework used]
Decisions: [Test adequacy decisions, coverage target adjustments]
Risks: [Code quality risks with RAG status and mitigation plans]
Next: [Immediate next steps for addressing test gaps]
```

## **Quality Standards & Guardrails**

### **Requirements**
- Specify inputs/outputs clearly; reference fixtures and mocks by path
- Map each test scenario to acceptance criteria, decisions, or defects
- Capture expected run commands and coverage tooling explicitly
- Note gaps or follow-up items with clear owners and timelines
- Reference existing Task Package using task_reference parameter

### **Process Compliance**
- Tag unresolved items as `Open Question:` with owner + due date
- Store coverage reports under `artifacts/qa/unit/` with timestamps
- Update Activity Log with test execution results and verdicts
- Maintain reproducible test execution with documented dependencies
- Ensure test independence and isolation from external systems

### **Boundary Conditions**
- Do not modify production code during unit testing
- Do not test integration concerns; focus on isolated unit behavior
- Do not create flaky tests that depend on external systems
- Avoid testing implementation details; focus on observable behavior
- Do not use real databases, network services, or external APIs in unit tests

### **Validation Protocols**
- Verify framework compatibility with target codebase
- Confirm coverage expectations are realistic and achievable
- Validate fixtures and mocks accurately represent real data scenarios
- Ensure edge cases cover realistic failure modes and boundary conditions
- Test reproducibility across different environments and execution runs

## **Execution Parameters**

### **Success Criteria**
- All target modules meet or exceed specified coverage thresholds
- Test suites pass consistently without flaky failures
- Critical edge cases and error conditions are properly tested
- Tests are maintainable, readable, and well-documented
- CI/CD integration successfully enforces quality gates

### **Error Handling**
- If tests fail, debug and identify root causes in code or test logic
- When coverage targets are not met, identify missing scenarios and add appropriate tests
- For flaky tests, refactor to eliminate external dependencies or timing issues
- If framework compatibility issues arise, migrate to supported testing tools
- When edge cases are missed, analyze code paths and add comprehensive test coverage

## **Example Usage**
```
Use the code-unit skill with these parameters:
task_reference: 2025-demo
test_goal: Ensure producer handles schema rejects and retries gracefully
target_modules:
  - billing/producer
  - billing/retry
coverage_expectation: ≥85% lines; 100% branches on retry handler
framework: go test
fixtures:
  - tests/fixtures/audit_payload_valid.json
  - tests/fixtures/audit_payload_invalid.json
edge_cases:
  - broker timeout
  - schema evolution mismatch
  - DLQ full
dependencies:
  - mock kafka broker
ci_integration: add suite to `ci/unit-tests`
update_scope:
  - Testing Notes
  - Risks
```