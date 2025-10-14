# Analytics & Research Command - System Instructions

> **Filename:** `./spec/commands/analytics-research.command.md`  
> **Purpose:** Capture the analytical questions, hypotheses, and data needs required to inform the shared Task Package. Use this command when the user needs research, metrics validation, or experimentation guidance for an initiative already tracked by Task-ID or slug.

---

## Command Intent

- Scenario: the user requests product analytics support (descriptive, causal, or exploratory) connected to an existing Task Package.
- Outcome: supply structured context so analytics agents can populate or update the Task Package Section `Analytics & Research` and log their activity.
- The command itself gathers intent; execution occurs via the Product Ops Orchestrator or dedicated analytics agents operating on the unified artifact.

## Required Fields

| Field | Description | Format | Required | Example |
|---|---|---|---|---|
| `task_reference` | Task-ID or slug to link findings to the correct Task Package | ULID or kebab-case | yes | `20251013-onboarding-funnel` |
| `decision_to_inform` | Core decision that analysis should enable | sentence | yes | `Prioritize KYC uplift backlog items for Q1` |
| `hypotheses` | One or more hypotheses to test or validate | bullet list | yes | `H1: Manual doc review causes drop-offs` |
| `metrics` | KPIs or diagnostic metrics involved | list or mini-table | yes | `Activation rate, KYC completion rate` |
| `time_window` | Period to analyze or monitor | ISO dates or relative span | yes | `2025-07-01 -> 2025-09-30` |

If a required field is missing, agents infer carefully, tag the entry `- Inferred`, and record the assumption in the Activity Log.

## Optional Enhancers

| Field | Description | Usage |
|---|---|---|
| `data_sources` | Warehouses, tables, dashboards, or logs | Guides analysts to the right systems |
| `experiment_context` | Existing/desired experiments, variants, or MDE targets | Supports causal design recommendations |
| `segments` | User segments, cohorts, or geographies | Enables targeted cuts and comparisons |
| `bias_checks` | Known data quality issues or confounders | Flags mitigation steps (CUPED, pre-trend, etc.) |
| `deliverable_format` | Tables, charts, narrative, or deck expectations | Sets output format in the Task Package |
| `update_scope` | Whether to refresh `Analytics & Research`, `PRD`, or both | Directs downstream updates |
| `rolling_summary_delta` | Compact snippet using `Context, Facts, Decisions, Risks, Next` covering key learnings | Keeps Rolling Summary current |

## Tone & Structure

- Use clear, concise language; numeric details where possible (target lifts, sample sizes, power goals).
- Reference internal datasets by logical name only (no sensitive URIs).
- Highlight blocking questions as `Open Question: ...` and indicate which analysis step depends on them.
- When revising prior hypotheses or metrics, note the change (for example, `Updated KPI target from 40% to 45%`) to aid Activity Log entries.
- Emit a Rolling Summary update reflecting the analytical insight whenever results materially shift the plan.

## Structured Output Requirements

- Output should include a closing block:
  ```
  Rolling Summary Update
  Context: ...
  Facts: ...
  Decisions: ...
  Risks: ...
  Next: ...
  ```
- Facts must cite metric names, values, sample sizes, and time windows. Decisions should specify owners and deadlines. Risks should use RAG plus mitigation.
- Provide links or filenames for dashboards in the summary instead of embedding raw data.

## Example Payload

```
[command](analytics-research.command.md)
task_reference: 20251013-onboarding-funnel
decision_to_inform: Decide whether to expand KYC automation scope before Sprint 3.
hypotheses:
  - H1: Manual document verification causes 18% drop at step 3.
  - H2: Mobile users experience higher friction due to image quality issues.
metrics:
  - Activation rate (P1) weekly
  - KYC completion rate (P1) per segment
  - Support ticket volume related to KYC (P2)
time_window: 2025-07-01 -> 2025-09-30
data_sources:
  - warehouse.prod.kyc_events
  - analytics_dashboard.kyc_conversion
experiment_context:
  - Proposed A/B: Automated doc review vs. control; MDE 6 p.p.; alpha 0.05
segments:
  - Device type (iOS, Android, Web)
  - Geography (DE, FR, ES)
bias_checks:
  - Data loss for uploads >5MB (monitor)
deliverable_format:
  - Summary table + chart; insights logged in Task Package Section 1
update_scope:
  - Analytics & Research
rolling_summary_delta:
  Context: Decide on expanding KYC automation; EU consumer onboarding constraints.
  Facts: Baseline activation 38%; KYC completion 60%; mobile drop-off 18%.
  Decisions: Proceed with queue-based retry experiment (Owner: DS, start 2025-10-20).
  Risks: Vendor SLA data gaps (Amber) → request access logs.
  Next: DS → 2025-10-22 deliver failure-rate analysis; Architect to review.
Open Question: Confirm if vendor SLA logs can be joined to `kyc_events`.
```

## Downstream Expectations

- Product Ops Orchestrator consumes this payload to populate Section `Analytics & Research`, normalize timestamps, and append an Activity Log entry.
- Dedicated analytics agents or engineers perform the requested analysis, add findings directly to the Task Package, and cite data sources and assumptions.
- Subsequent PRD or Agile Plan updates reference the shared analytics findings rather than creating separate research artifacts.

---

**End of command spec.**
