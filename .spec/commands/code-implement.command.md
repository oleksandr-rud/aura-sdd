# Code Implement Command - System Instructions

> **Filename:** `./spec/commands/code-implement.command.md`  
> **Purpose:** Describe engineering scope, guardrails, and rollout expectations so delivery agents can implement changes inside the single task file and keep Activity Log entries precise.

---

## Command Intent

- Use when new feature work, fixes, or refactors must be executed for an existing task.
- Capture scope, dependencies, flags, and rollout details so Tech Lead, Engineers, and QA have a shared plan.
- Ensure the resulting work updates Implementation Notes, Testing Notes, and the Rolling Summary with concrete data.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug anchoring work to the task file | ULID or kebab-case | `2025-demo` |
| `objective` | One-line outcome statement | sentence | `Enable async audit trail publishing` |
| `scope_summary` | Modules/files/services to touch | bullet list | `billing/producer.go`, `infra/kafka/topic.tf` |
| `feature_flags` | Flags or config toggles gating rollout | list | `audit_bus_producer`, `audit_bus_strict_schema` |
| `dependencies` | Upstream approvals, migrations, or artifacts required | list | `schema audit.v1`, `PR#128 infra` |

If any field is missing, log an `Open Question:` (owner + due date), tag assumptions `- Inferred`, and record it in the Activity Log before starting implementation.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `rollout_strategy` | Canary, % stages, or time windows | Guides release sequencing |
| `testing_plan` | Unit/integration/E2E suites expected | Aligns QA coordination |
| `observability` | Metrics/logs/traces to monitor | Ensures visibility |
| `backout_plan` | Step-by-step rollback | Keeps change reversible |
| `linked_artifacts` | Design docs, ADRs, prior PRs | Adds context |
| `deadline_or_window` | Completion or launch target | Drives scheduling |
| `update_scope` | Task sections that must be refreshed | Keeps edits concentrated |
| `rolling_summary_delta` | Boolean (default `true`) to request Rolling Summary update | Skip only when `false` |

## Tone & Structure

- Reference paths relative to repo root and call out schema/version IDs explicitly.
- Quantify expectations (throughput, latency, coverage) where known.
- Call out blockers as `Open Question:` with owners.
- Keep text concise; store verbose runbooks or diffs under `artifacts/` and link.

## Structured Output Requirements

1. **Implementation Summary**
   - Scope (modules/files, feature flags)
   - Risks (with mitigation plans and RAG)
   - Tests (planned or required suites)
   - Next Actions (owners + dates)
2. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using the standard schema.

## Example Payload

```yaml
[command](code-implement.command.md)
task_reference: 2025-demo
objective: Enable async audit trail publishing.
scope_summary:
  - billing/producer.go
  - billing/retry/retry_handler.go
  - infra/kafka/audit_topic.tf
feature_flags:
  - audit_bus_producer
  - audit_bus_strict_schema
dependencies:
  - schema: audit.v1
  - PR#128 infra topic provisioning
  - Observability dashboard AUDIT-PROD-01
rollout_strategy: 5% canary 24h → 25% 48h → 100%
testing_plan: unit on producer; contract on audit.v1; E2E on refund flow
observability: monitor p99 publish latency, DLQ depth, schema rejects
backout_plan: disable flags; drain DLQ; revert Terraform module
deadline_or_window: Ready for sprint 9 code-freeze (2025-03-25)
update_scope:
  - Implementation Notes
  - Testing Notes
```

## Downstream Expectations

- Tech Lead orchestrates execution, updates Implementation Notes, and appends Activity Log entries (e.g., `... - tech-lead-orchestrator - Code-implement scope committed`).
- QA leverages `testing_plan` to schedule code-unit/qa-* commands and log outcomes.
- Product Ops keeps Rolling Summary and Activity Log aligned with progress; any change to flags or rollout strategy must be logged explicitly.

---

**End of command spec.**
