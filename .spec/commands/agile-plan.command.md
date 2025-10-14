# Agile Plan Command - System Instructions

> **Filename:** `./spec/commands/agile-plan.command.md`  
> **Purpose:** Gather the inputs needed to build or update the agile delivery plan directly within the shared Task Package. Use this command whenever the user wants sprint sequencing, backlog ordering, or delivery resourcing adjustments tied to an existing initiative.

---

## Command Intent

- Scenario: the user requests an agile delivery plan for a workstream already tracked in the Task Package, or wants to update sprints/backlog for that workstream.
- Outcome: provide structured guidance so agents can refresh the Agile Plan section (roadmap, backlog, capacity, risks) without creating separate documents.
- This command does not assign work itself; it captures intent for downstream agents to apply the agile templates and append an Activity Log entry.

## Required Fields

| Field | Description | Format | Required | Example |
|---|---|---|---|---|
| `task_reference` | Task-ID or slug to ensure updates apply to the existing Task Package | ULID or kebab-case | yes | `20251013-onboarding-funnel` |
| `delivery_goal` | Desired outcome from the upcoming sprints/iterations | sentence | yes | `Ship KYC uplift MVP before Q1 close` |
| `sprint_window` | Timebox for the plan (number of sprints or date range) | ISO dates or count | yes | `2025-11-03 -> 2026-01-26 (4 sprints)` |
| `epics_or_themes` | Core epics/themes that must be delivered | list | yes | `KYC UX`, `Document processing`, `Notifications` |
| `team_setup` | Teams or roles delivering the work | list or table | yes | `Growth Squad (PM, TL, 4 FE, 2 BE)` |

If any required field is missing, the Product Ops Orchestrator infers cautiously, marks the assumption with `- Inferred`, and documents it in the Activity Log.

## Optional Enhancers

| Field | Description | Usage |
|---|---|---|
| `capacity` | Velocity, available story points, or staffing constraints | Feeds sprint sizing and risk management |
| `dependencies` | External teams, systems, or approvals blocking delivery | Drives risk register and DoR notes |
| `quality_gates` | Testing, compliance, or sign-off checkpoints | Informs QA command and DoD/DoR updates |
| `risks` | Known delivery risks with probability/impact | Populates risk register and mitigation plan |
| `backlog_seed` | Initial user stories or tasks with effort/value hints | Seeds backlog ordering |
| `release_plan` | Target release milestones or launch phases | Shapes roadmap milestones |
| `update_scope` | Sections to refresh (`Roadmap`, `Backlog`, `Capacity`, etc.) | Focuses downstream edits |
| `rolling_summary_delta` | Compact snippet using `Context, Facts, Decisions, Risks, Next` | Keeps Rolling Summary aligned with delivery status |

## Tone & Structure

- Write in concise, executive-ready bullets; quantify effort, capacity, and dates.
- Use consistent units for effort (story points, person-weeks) and note the unit.
- Tag unresolved items as `Open Question: ...` and reference the affected agile component.
- Mention changes explicitly when revising (for example, `Moved Document automation to Sprint 3 (was Sprint 2)`).
- Avoid PII; refer to teams by role or squad name.
- Provide a Rolling Summary update capturing sprint-level commitments, RAG, and next steps.

## Structured Output Requirements

- Deliverables must append:
  ```
  Rolling Summary Update
  Context: ...
  Facts: ...
  Decisions: ...
  Risks: ...
  Next: ...
  ```
- Facts should note sprint windows, velocities, and key backlog IDs. Decisions must reference owners and due dates. Risks must include RAG plus mitigation ownership.
- Link to larger roadmaps or schedules rather than embedding them verbatim.

## Example Payload

```
[command](agile-plan.command.md)
task_reference: 20251013-onboarding-funnel
delivery_goal: Ship KYC flow uplift MVP before Q1 close with monitored rollout.
sprint_window: 2025-11-03 -> 2026-01-26 (4 sprints)
epics_or_themes:
  - KYC UX rewrite
  - Document automation service
  - Notifications and recovery paths
team_setup:
  - Growth Squad: PM, Tech Lead, 3 FE, 2 BE, 1 DS
capacity:
  - Growth Squad velocity: 32 SP / sprint (Updated from 28 SP)
dependencies:
  - Compliance review (Sprint 2 gate)
  - Data Engineering event audit (Sprint 1 support)
quality_gates:
  - QA regression suite before Sprint 3 end
  - Legal retention approval prior to launch
risks:
  - Document vendor SLA variability (High impact / Medium probability)
backlog_seed:
  - US-401 Document capture redesign (13 SP, Value High)
  - US-402 Identity verification tracking (8 SP, Value Medium)
update_scope:
  - Roadmap
  - Backlog
  - Risk Register
rolling_summary_delta:
  Context: KYC uplift MVP delivery across 4 sprints; GDPR/compliance constraints.
  Facts: Velocity 32 SP; Sprint window 2025-11-03 to 2026-01-26; Epics KYC UX, Automation, Notifications.
  Decisions: Move document automation to Sprint 3 (Owner: TL, review 2025-12-01).
  Risks: Vendor SLA variability (Amber) mitigated with autoscaling spike.
  Next: QA lead → 2025-12-05 confirm regression suite readiness.
Open Question: Confirm availability of QA automation engineer for Sprint 2.
```