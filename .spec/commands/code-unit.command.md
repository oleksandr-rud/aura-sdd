# Code Unit Command - System Instructions

> **Filename:** `./spec/commands/code-unit.command.md`  
> **Purpose:** Capture unit testing goals, coverage expectations, and evidence requirements so QA and Tech Lead agents can validate code paths and log results in the task file.

---

## Command Intent

- Use when new code or refactors require unit-level verification or when coverage targets slip.
- Define scope, frameworks, and edge cases so tests can be implemented or executed consistently.
- Ensure outcomes update Testing Notes, Risks, and the Rolling Summary as needed.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug anchoring the test effort | ULID or kebab-case | `2025-demo` |
| `test_goal` | One-line objective for the unit pass | sentence | `Validate producer retries schema rejects` |
| `target_modules` | Files/packages/functions to cover | list | `billing/producer`, `billing/retry` |
| `coverage_expectation` | Target metric (line/branch/function) or threshold | string | `≥85% lines, 100% branches in retry` |

Missing any required field requires an `Open Question:` entry with owner + deadline; assumptions must be tagged `- Inferred`.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `framework` | Test runner (`pytest`, `go test`, `jest`, etc.) | Ensures correct tooling |
| `fixtures` | Data/mocks required | Supports deterministic tests |
| `edge_cases` | Scenarios to emphasise | Improves coverage depth |
| `dependencies` | Services/contracts to stub | Prevents flaky tests |
| `ci_integration` | Pipelines or commands to wire into CI | Automates enforcement |
| `update_scope` | Task sections to refresh (`Testing Notes`, `Risks`) | Focuses documentation |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS refresh | Set `false` if not required |

## Tone & Structure

- Specify inputs/outputs clearly; reference fixtures and mocks by path.
- Map each test scenario to acceptance criteria, decisions, or defects where relevant.
- Capture expected run commands and coverage tooling.
- Note any gaps or follow-up items explicitly with owners.

## Structured Output Requirements

1. **Unit Test Summary**
   - Suites executed (commands)
   - Coverage achieved vs target
   - Findings (failures, gaps, flakes)
   - Next Actions (owner + due date)
2. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using standard schema.

## Example Payload

```yaml
[command](code-unit.command.md)
task_reference: 2025-demo
test_goal: Ensure producer handles schema rejects and retries gracefully.
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

## Downstream Expectations

- QA or Tech Lead agents execute/author tests, log outcomes in the task file, attach coverage reports under `artifacts/qa/unit/`, and append Activity Log entries.
- Coverage gaps or failures become Risks with RAG status and owners.
- Product Ops ensures Rolling Summary reflects updated coverage status and next steps.

---

**End of command spec.**
