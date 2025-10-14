# QA E2E Command - System Instructions

> **Filename:** `./spec/commands/qa-e2e.command.md`  
> **Purpose:** Define end-to-end journey validation so QA can execute scenarios, capture evidence, and record Go/No-Go readiness inside the task file.

---

## Command Intent

- Use when cross-system workflows or user journeys require validation prior to release.
- Provide environment, acceptance criteria, and tooling so QA can run automation/manual scripts consistently.
- Ensure results update Testing Notes, Risks, and the Rolling Summary with clear readiness status.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug for the target task file | ULID or kebab-case | `2025-demo` |
| `journey_name` | Name/description of the journey under test | string | `Refund → audit event trail` |
| `acceptance_criteria` | Success conditions that must hold | list | `audit event emitted`, `trace linked`, `p95<200ms` |
| `environment` | Target environment + access notes | string | `staging-audit (VPN req, flags on)` |

Missing required fields demand an `Open Question:` (owner + due date) before execution; inferences must be tagged `- Inferred`.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `preconditions` | Seeding/config steps to run before the test | Ensures repeatability |
| `test_steps` | Ordered scenario script | Guides execution |
| `tooling` | Automation frameworks or scripts (`Playwright`, `Cypress`, shell) | Aligns tooling |
| `data_variants` | Personas/devices/locales | Broadens coverage |
| `monitoring_checks` | Dashboards/logs to watch | Confirms telemetry |
| `exit_criteria` | Definition of done for the cycle | Sets readiness gate |
| `rollback_plan` | Steps if Sev-High defects appear | Supports release decisions |
| `update_scope` | Task sections to refresh (`Testing Notes`, `Risks`) | Focuses documentation |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS update | Set `false` if skipping |

## Tone & Structure

- Map each acceptance criterion to corresponding test cases and evidence.
- Distinguish automated vs manual steps; cite scripts/commands.
- Capture evidence paths (screenshots, HAR files, metrics) under `artifacts/qa/e2e/`.
- Assign severity to defects (Sev-High/Med/Low) with owner + ETA for retest.

## Structured Output Requirements

1. **E2E Test Summary**
   - Scenarios executed (automation/manual)
   - Results (pass/fail counts, key timings)
   - Defects (IDs, severity, status or `None`)
   - Readiness (Go / Conditional Go / No-Go with rationale)
   - Next Actions (owner + due date)
2. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using standard schema.

## Example Payload

```yaml
[command](qa-e2e.command.md)
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

## Downstream Expectations

- QA executes scenarios, stores evidence under `artifacts/qa/e2e/`, updates Testing Notes/Risks, and logs verdicts (`YYYY-MM-DDTHH:MM:SS+03:00 - qa-orchestrator - E2E refund trail No-Go (Sev-High defect QA-217)`).
- Product Ops reviews readiness status in Rolling Summary; Tech Lead coordinates fixes and re-tests as required.
- If compaction is needed later, reference this run in Compaction Summary archives.

---

**End of command spec.**
