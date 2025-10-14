# General Research Command - System Instructions

> **Filename:** `./spec/commands/general-research.command.md`  
> **Purpose:** Standardise open-ended research requests so agents can gather evidence-backed context, cite sources, and update the single task file without spawning side documents.

---

## Command Intent

- Use when the task requires market, technical, regulatory, or customer research to inform a decision captured in the task file.
- Output equips research agents to collect sources, synthesise insights, and publish a Rolling Summary delta plus Activity Log line.
- Keeps findings compact, cited, and traceable back to `.spec/references.json`.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug pointing to `.spec/tasks/<task_reference>/task.md` | ULID or kebab-case | `2025-demo` |
| `research_goal` | One-sentence statement of the decision or narrative to unlock | sentence | `Assess feasibility of async audit bus` |
| `key_questions` | 3–7 specific questions the research must answer | bullet list | `Operational risks vs. request/response?` |
| `time_horizon` | Time window to examine (past/future releases, roadmap span) | ISO span or natural language | `Past 18 months` |

If any required field is missing, the research agent logs an `Open Question:` with owner + due date, tags inferences `- Inferred`, and notes this in the Activity Log before proceeding.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `audience` | Stakeholders consuming the findings (e.g., Architect, Product Ops) | Tunes tone and recommended actions |
| `scope_constraints` | Boundaries (regions, competitors, tech) | Prevents rabbit holes |
| `sources_to_include` | Known repos, datasets, standards | Directs discovery |
| `sources_to_exclude` | Banned or low-signal sources | Maintains quality |
| `depth` | `quick`, `standard`, or `deep` | Sets effort expectations |
| `deliverable_format` | Requested format (`bullets`, `memo`, `table`) | Aligns with downstream needs |
| `update_scope` | Task file sections to update (e.g., `Product Brief`, `Risks`) | Focuses edits |
| `rolling_summary_delta` | Boolean (default `true`) to indicate whether to emit a new Rolling Summary line | Skip only when explicitly `false` |

## Tone & Structure

- Produce concise, referenced findings; cite sources inline (`[ref-id]`) and add entries to `.spec/references.json` for anything new.
- Separate confirmed facts from hypotheses; mark speculation with `- Inferred`.
- Highlight implications or recommended actions linked to the `research_goal`.
- Raise blockers as `Open Question:` with owner + deadline.
- Prefer ASCII-friendly tables or bulleted comparisons for quick scanning.

## Structured Output Requirements

1. **Research Summary** – 5–10 bullets covering top findings, contradictions, and unknowns.  
2. **Implications for Decisions** – map findings back to the `research_goal`.  
3. **Evidence Links** – list of sources with short justifications.  
4. **Rolling Summary Update** (unless `rolling_summary_delta: false`):
   ```
   Rolling Summary Update
   Context: ...
   Facts: ...
   Decisions: ...
   Risks: ...
   Next: ...
   ```
   Facts must cite `[ref-id]` or URLs; Decisions include owner + due date; Risks carry RAG + mitigation; Next sets explicit follow-up.

When new terminology emerges, prompt updates to `.spec/glossary.md`.

## Example Payload

```yaml
[command](general-research.command.md)
task_reference: 2025-demo
research_goal: Assess feasibility of async event bus for cross-service audit trails.
key_questions:
  - What proven designs handle 2000 TPS peak?
  - Operational risks versus synchronous publish?
  - Vendor vs OSS trade-offs for cost and lock-in?
time_horizon: past 18 months
audience:
  - architect-orchestrator
  - tech-lead-orchestrator
scope_constraints:
  - Focus on CNCF projects and Tier-1 SaaS vendors
sources_to_include:
  - cncf.io/projects
  - kafka.apache.org/documentation
depth: standard
deliverable_format: bullets + comparison table
update_scope:
  - Product Brief
  - Implementation Notes
```

## Downstream Expectations

- Research agents synthesise findings, update the specified sections in `.spec/tasks/<task_reference>/task.md`, refresh the Rolling Summary, and append an Activity Log entry (`YYYY-MM-DDTHH:MM:SS+03:00 - agent - summary`).
- Product Ops or Architect agents review the delta, assign owners to follow-ups, and escalate critical risks.
- Large artifacts (tables, matrices) are stored under `.spec/tasks/<task_reference>/artifacts/` with links from the task file.

---

**End of command spec.**
