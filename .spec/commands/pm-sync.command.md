# PM Sync Command - System Instructions

> **Filename:** `./spec/commands/pm-sync.command.md`  
> **Purpose:** Synchronize the Task Package with external work trackers (Jira, Trello, MCP, etc.) for status updates, comments, and field alignment. Use this command when the user wants to push or pull task metadata between connectors and the unified artifact.

---

## Command Intent

- Scenario: the user needs the Task Package to reflect the latest tracker state or to broadcast Task Package updates back to connected tools.
- Outcome: provide a structured payload so agents can fetch, reconcile, and record status/comment changes without creating duplicate documents.
- Execution happens through PM agents or connector-enabled tools that update the Task Package Activity Log and, when necessary, call external APIs.

## Required Fields

| Field | Description | Format | Required | Example |
|---|---|---|---|---|
| `task_reference` | Task-ID or slug linking to the Task Package | ULID or kebab-case | yes | `20251013-onboarding-funnel` |
| `connector` | External system identifier | enum (`jira`, `trello`, `mcp`, ...) | yes | `jira` |
| `sync_direction` | `pull` (tracker -> Task Package), `push` (Task Package -> tracker), or `two-way` | enum | yes | `two-way` |
| `target_items` | Issues/cards/records to sync (IDs or URLs) | list | yes | `["PROJ-418", "PROJ-419"]` |
| `fields_to_sync` | Statuses, comments, labels, or custom fields to reconcile | list | yes | `status`, `comment`, `assignee` |

When a required field is missing, agents infer cautiously, tag the inferred element in the Task Package (`- Inferred`), and log the assumption.

## Optional Enhancers

| Field | Description | Usage |
|---|---|---|
| `status_mapping` | Mapping between tracker and Task Package status vocabulary | Keeps lifecycle states aligned |
| `comment_template` | Format for mirrored comments/notes | Ensures consistent phrasing when pushing updates |
| `include_history` | Boolean to fetch historical changes | Controls activity log granularity |
| `filters` | Query constraints (e.g., sprint, label, board) | Limits scope of pull operations |
| `rate_limit_guard` | Max API calls per minute | Prevents hitting connector throttles |
| `update_scope` | Task Package sections affected (`Activity Log`, `Initial Context`, etc.) | Helps downstream agents focus reviews |
| `rolling_summary_delta` | Compact snippet using `Context, Facts, Decisions, Risks, Next` showing tracker deltas | Keeps Rolling Summary aligned with external tools |

## Tone & Structure

- Be explicit about connector details; reference project keys, board IDs, or MCP namespaces clearly.
- Use bullet lists for `target_items` and `fields_to_sync`; include full issue identifiers.
- Note any secrets or auth requirements as `Open Question: confirm credential alias`—never paste credentials.
- Mention deltas when re-syncing (for example, `Status mapping updated: Jira "In Review" -> Task Package "QA"`).
- Keep payload concise; avoid attaching large tracker exports inline—link if necessary.
- Produce a compact tracker summary so context remains light after synchronization.

## Structured Output Requirements

- Include a sync-oriented summary block:
  ```
  Rolling Summary Update
  Context: ...
  Facts: ...
  Decisions: ...
  Risks: ...
  Next: ...
  ```
- Facts should list issue IDs and new statuses/assignees. Decisions capture any ownership changes. Risks highlight blockers (e.g., overdue tasks) with RAG. Next should specify follow-up actions or sync cadence.
- Store detailed tracker exports externally and reference them by URL or file identifier.

## Example Payload

```
[command](pm-sync.command.md)
task_reference: 20251013-onboarding-funnel
connector: jira
sync_direction: two-way
target_items:
  - PROJ-418
  - PROJ-419
fields_to_sync:
  - status
  - comment
  - assignee
status_mapping:
  - To Do -> Planned
  - In Progress -> In Flight
  - In Review -> QA
  - Done -> Shipped
comment_template: "[Codex] {{task_reference}} {{summary}}"
include_history: false
filters:
  sprint: "Sprint 3"
rate_limit_guard: 45
update_scope:
  - Activity Log
  - Initial Context (status summary)
rolling_summary_delta:
  Context: Sprint 3 sync across Jira PROJ-418/419; focus on KYC uplift.
  Facts: PROJ-418 -> In Flight (Assignee TL); PROJ-419 -> QA; comment synced 2025-10-18.
  Decisions: Align Task Package status with Jira mapping (Owner: PM).
  Risks: PROJ-419 blocked by compliance review (Amber) due 2025-10-21.
  Next: PM → 2025-10-20 confirm compliance sign-off; rerun sync in 48h.
Open Question: Confirm API credential alias `jira_ops` is active.
```

## Downstream Expectations

- PM agent or connector tool runs the sync, updates the Task Package sections listed in `update_scope`, and logs the transaction with timestamp and verb (`Updated`, `Merged`, etc.).
- Product Ops Orchestrator references the synced status/comments when assembling PRD or Agile updates, avoiding manual duplication.
- Engineering and QA agents rely on reconciled statuses to plan implementation and testing, reducing drift between the Task Package and external trackers.

---

**End of command spec.**
