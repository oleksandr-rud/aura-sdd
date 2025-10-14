# Code Review Command - System Instructions

> **Filename:** `./spec/commands/code-review.command.md`  
> **Purpose:** Provide consistent review briefs so reviewers surface findings with severity, link them to risks/tests, and log verdicts in the task file.

---

## Command Intent

- Use when a PR, branch, or change set is ready for review within an existing task.
- Align reviewers on scope, risk focus, and expected tests so findings map directly to task sections.
- Ensure each review run appends a single Activity Log entry and, when needed, updates the Rolling Summary.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug for the target task file | ULID or kebab-case | `2025-demo` |
| `review_target` | Identifier for the change (PR link, branch, commit) | string or URL | `PR#128` |
| `change_summary` | One-line description of what changed and why | sentence | `Adds Kafka producer + Terraform topic` |
| `risk_focus` | Areas to scrutinise (perf, security, correctness, etc.) | list | `idempotency`, `schema evolution` |

Missing any required field triggers an `Open Question:` log with owner + due date; assumptions must be tagged `- Inferred`.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `diff_paths` | Specific files/directories to prioritise | Prevents scope drift |
| `technical_constraints` | NFRs or compliance requirements to verify | Frames acceptance criteria |
| `tests_expected` | Suites reviewers expect to see or run | Guides validation |
| `deployment_notes` | Feature flags, rollout, or migration considerations | Flags release implications |
| `stakeholders` | Reviewers/approvers to loop in | Aids coordination |
| `update_scope` | Task sections to update (`Risks`, `Implementation Notes`, etc.) | Keeps documentation focused |
| `rolling_summary_delta` | Boolean (default `true`) controlling Rolling Summary refresh | Set to `false` to skip |

## Tone & Structure

- Deliver actionable findings with severity labels (`Blocker`, `Major`, `Minor`, `Note`).
- Reference file paths/lines and link to evidence where possible.
- Confirm reviewed areas to avoid double work (`Reviewed: billing/producer/*`).
- State verification status (tests run or needed) in the summary.
- Keep the Activity Log entry within 120 characters and include verdict (`Approve`, `Changes requested`, etc.).

## Structured Output Requirements

1. **Review Summary**
   - Verdict (`Approve` / `Request changes` / `Pending`)
   - Findings grouped by severity with file references
   - Tests run / required (command references)
   - Next Actions with owner + due date
2. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using the standard schema.

## Example Payload

```yaml
[command](code-review.command.md)
task_reference: 2025-demo
review_target: PR#128
change_summary: Adds Kafka producer and Terraform topic module.
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

## Downstream Expectations

- Review agents document findings in the task file, refresh sections per `update_scope`, and append an Activity Log line (`YYYY-MM-DDTHH:MM:SS+03:00 - tech-lead-orchestrator - Code-review PR128 changes requested`).
- Blockers or major findings must create/adjust Risks with RAG status and mitigation owners.
- Once blockers resolve, reviewers log approval, include verification evidence (tests rerun), and update the Rolling Summary if status changes.

---

**End of command spec.**
