# Spec Gen Constitution

## Metadata
- **Version:** 2  
- **Last Updated:** 2025-02-20  
- **Owners:** Product Ops Orchestrator, Architect Orchestrator, Tech Lead Orchestrator, QA Orchestrator

## Purpose
- Establish a single-file task workflow for each `task_reference`.
- Capture the architecture, coding principles, delivery philosophy, infra guidance, and diagram practices that every agent must follow.
- Ensure every command run leaves an auditable, single-line Activity Log entry.

## Task File Workflow

### Location & Sections
- Path template: `.spec/tasks/<task_reference>/task.md`
- Required sections (ordered):
  1. Header (Task ID, Slug, Status, Owners, Last Updated)
  2. Product Brief (Problem, Audience, Goals, Constraints)
  3. Rolling Summary (`Context | Facts | Decisions | Risks | Next`)
  4. Implementation Notes (architecture + engineering highlights)
  5. Testing Notes (QA coverage: unit, contract, E2E, stress)
  6. Metrics & Evidence (links to logs, dashboards, coverage)
  7. Activity Log (newest-first, single-line entries)

### Principles
- Maintain exactly one task file per `task_reference`; no parallel briefs.
- Prefer terse bullets or short sentences—link out to artifacts stored under `.spec/tasks/<task_reference>/artifacts/`.
- Keep feature flags, NFR targets, and risk owners explicitly noted.

## Initial Creation Playbook (Product Ops)
1. Create the task file with all sections populated.
2. Capture problem framing, KPIs, hypotheses, and the command plan.
3. Seed the Rolling Summary with a one-line snapshot.
4. Pre-log expected command payloads in the Activity Log with status `Planned`.

## Command Usage Matrix
| Payload | Expectation |
| --- | --- |
| `analytics-research` | Validate hypotheses/metrics before design choices; cite sources and log outcome. |
| `architect-plan` | Record options, selected decision, risks, and validation plan inside Implementation Notes. |
| `code-implement` | Outline delivery scope, feature flags, dependencies; sync with Tech Lead plan. |
| `code-review` | Summarize verdict, blockers, follow-ups; log review result line. |
| `code-unit` | Document coverage expectations, frameworks, and results under Testing Notes. |
| `qa-contract` | Verify API/event contracts; note pass/fail and downstream impact. |
| `qa-e2e` | Capture journey readiness and Go/No-Go decision. |
| `qa-stress` | Record load results, achieved SLOs, and capacity risks. |
| `general-research` | Provide cited findings; update Product Brief or Metrics & Evidence. |
| `general-compact` | Archive verbose history, refresh Rolling Summary, and reference archive path. |

## Activity Log Standard
- Format: `YYYY-MM-DDTHH:MM:SS+03:00 - <agent_or_command_id> - <≤120 char summary>`
- One entry per run; append newest entries at the top.
- Summaries must contain the verdict or next action (e.g., `Go`, `Blocked`, `Needs follow-up`) and link to artifacts when relevant.

## Rolling Summary Standard
- Maintain a single-line snapshot using `Context | Facts | Decisions | Risks | Next`.
- Refresh after any material change; remove stale items promptly.
- Mark assumptions as `- Inferred`; highlight owners and due dates in the `Next` portion.

## Quality Bars

### Documentation
- Header metadata stays current (Task ID, Slug, Status, Last Updated).
- Product Brief includes measurable goals and constraints.
- Implementation & Testing Notes reference artifacts instead of embedding large logs.

### Testing
- Record frameworks, commands, environments, and evidence paths for every suite.
- Highlight coverage gaps with owner and target date.

### Risk Management
- Attach RAG status to every open risk; mirror critical changes in the Activity Log.
- Escalate Sev-High issues immediately in both Rolling Summary and Activity Log.

## Knowledge Base

### Architecture Principles
- Prefer modular service boundaries with versioned contracts.
- Strive for stateless execution paths; document stateful components explicitly.
- Quantify NFR commitments (latency, availability, throughput) alongside decisions.

### Code Principles
- Keep new functionality behind feature flags until validated; record flag names in the task file.
- Require automated tests for critical paths; note expected coverage and commands.
- Enforce secure defaults (least privilege, sanitized inputs, audited outputs).

### Design Philosophy
- Start from user journeys in the Product Brief; derive architecture and QA scope from them.
- Maintain one source of truth per `task_reference`; avoid parallel specs or slide decks.
- Compact historical context early so the Rolling Summary remains actionable.

### Infrastructure Guidance
- Store infrastructure-as-code under `infra/`; reference module paths in task files.
- Mirror staging, preprod, and prod parity; document deltas and mitigations.
- Log monitoring and alert expectations (dashboards, SLOs) within Metrics & Evidence.

### Diagram Practices
- Save diagrams under `.spec/tasks/<task_reference>/artifacts/diagrams/`.
- Link diagrams via relative paths and annotate captions with review date + owner.
- Use ASCII diagrams when lightweight visuals suffice to keep diffs readable.

## Fallback Playbooks
- **Insufficient Context:** Trigger `general-research` or `analytics-research`, mark assumptions `- Inferred`, and log a `Blocked` entry with owner.
- **Token Pressure:** Run `general-compact`, note archive path in Activity Log, and capture remaining gaps in Rolling Summary if compaction fails.
