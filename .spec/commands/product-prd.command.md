# Product PRD Command - System Instructions

> **Filename:** `./spec/commands/product-prd.command.md`  
> **Purpose:** Capture user intent for Product Requirement Document workstreams while keeping all agents coordinated on a single Task Package file. Use this command to feed the Product Ops Orchestrator, Tech Lead, and partner agents with structured updates they can append to the shared artifact.

---

## Command Intent

- Scenario: the user is kicking off or updating a PRD initiative that must roll into the existing Task Package identified by Task-ID or slug.
- Outcome: provide the critical fields agents need to update PRD, analytics, and delivery sections without spawning new documents.
- This command never performs work; it packages user intent so downstream agents can apply templates, append changes, and log the update.

## Required Fields

| Field | Description | Format | Required | Example |
|---|---|---|---|---|
| `task_reference` | Existing Task-ID or slug so agents append to the right Task Package | ULID or kebab-case | yes | `20251013-onboarding-funnel` |
| `title` | Short initiative name | plain text | yes | `Onboarding friction fix` |
| `problem` | Primary problem statement (who/what/where) | paragraph | yes | `New EU users abandon during KYC review` |
| `goal` | Business outcome with measurable target | sentence | yes | `Raise D1 activation to 45%` |
| `audience` | Target segments or personas | list or sentence | yes | `New EU consumer accounts` |
| `success_metrics` | KPIs tied to the goal | bullets or mini-table | yes | `Activation rate (P1)` |
| `deadline_or_window` | Desired launch date or timebox | ISO date or month | yes | `2025-11-30` |

If a mandatory field is missing, agents infer conservatively, mark the entry `- Inferred`, and add an Activity Log note describing the assumption.

## Optional Enhancers

| Field | Description | Usage |
|---|---|---|
| `constraints` | Legal, technical, or operational limits | Sets guardrails for PRD scope and delivery risks |
| `alignment` | Strategy, OKR, or roadmap links | Guides prioritization and stakeholder messaging |
| `hypotheses` | Existing hypotheses or insights | Seeds Analytics & Research before PRD drafting |
| `competitive_refs` | Competitor benchmarks, screenshots | Supports design and positioning decisions |
| `dependencies` | Teams, systems, or approvals needed | Feeds agile plan, risk register, and staffing |
| `artifacts` | Links to decks, dashboards, docs | Land in Task Package Section 4 (Artifacts) |
| `update_scope` | Sections to refresh (for example, `2.PRD`, `3.Agile Plan backlog`) | Directs agents to target their edits |
| `rolling_summary_delta` | Compact snippet using the schema `Context, Facts, Decisions, Risks, Next` | Feeds the Rolling Summary without reloading full history |

## Tone & Structure

- Use plain English, concise sentences, and executive-ready bullets.
- Quantify wherever possible (targets, cohorts, sample sizes, budgets).
- Tag known unknowns as `Open Question: ...` and reference the affected section.
- Reference internal sources by name only (no secret URLs or tokens).
- When revising an existing target or metric, call out the delta (for example, `Activation target increased from 42% to 45%`) so the Activity Log is precise.
- Provide an updated `Rolling Summary Update` block whenever material facts change so downstream agents can ingest context quickly.

## Structured Output Requirements

- Command executions should append, alongside full PRD content, a compact block:
  ```
  Rolling Summary Update
  Context: ...
  Facts: ...
  Decisions: ...
  Risks: ...
  Next: ...
  ```
- Keep each line atomic and reference IDs, KPIs, and owners with due dates.
- Store verbose attachments outside the summary and reference them by link or filename.

## Example Payload

```
[command](product-prd.command.md)
task_reference: 20251013-onboarding-funnel
title: KYC flow uplift
problem: EU consumers abandon during document upload causing 32% drop in activation.
goal: Lift activation from 38% to 48% by Q1 2026.
audience: New EU consumer accounts
success_metrics:
  - Activation rate (P1) -> 48% weekly (Updated from 45%)
  - KYC completion rate (P1) -> 75%
deadline_or_window: 2026-03-31
constraints:
  - Must comply with GDPR and local KYC retention policies.
  - No SMS fallback in DE market.
dependencies:
  - Compliance sign-off
  - Data Engineering for event audit
update_scope:
  - 2.PRD
  - 3.Agile Plan backlog
rolling_summary_delta:
  Context: Drop at KYC causing EU onboarding churn; GDPR constraints.
  Facts: Task-ID 20251013-onboarding-funnel; p95 KYC latency 210ms baseline.
  Decisions: Pursue automated retry flow with legal oversight (Owner: PM).
  Risks: Legal review delay (Amber) mitigated by weekly checkpoints.
  Next: PM → 2025-11-05 deliver revised PRD scope for review.
Open Question: Confirm availability of identity verification vendor throughput.
```

## Downstream Expectations

- Product Ops Orchestrator uses this payload to append or revise the Task Package (Sections 0-5), update metadata, and record the Activity Log entry.
- Tech Lead agent consumes the same payload to plan technical discovery, document risks, and adjust delivery sequencing in the shared artifact.
- Analytics, QA, Engineering, and PM Sync commands read from the Task Package, honor the declared deadlines and dependencies, and document their contributions directly in that file to keep the agentic flow single-sourced.

---

**End of command spec.**
