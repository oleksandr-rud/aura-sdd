# General Compact Command - System Instructions

> **Filename:** `./spec/commands/general-compact.command.md`  
> **Purpose:** Define how to shrink the task file while preserving canonical context, archiving verbose history, and leaving a concise audit trail.

---

## Command Intent

- Use when the task file or transcript becomes unwieldy due to lengthy Activity Logs or verbose sections.
- Specify what must remain, what can move to archives, and the desired output format so compaction agents can act deterministically.
- Ensure all compaction activity results in an Activity Log entry plus refreshed Rolling Summary.

## Required Fields

| Field | Description | Format | Example |
| --- | --- | --- | --- |
| `task_reference` | Task-ID or slug for the task file to compact | ULID or kebab-case | `2025-demo` |
| `compaction_goal` | Why compaction is needed and desired end state | sentence | `Prep Rolling Summary before architecture handoff` |
| `source_material` | Sections/files/log ranges to process | bullet list | `Activity Log 2024-12-01..2025-01-15` |
| `must_keep` | Facts/decisions/risks that must remain in the task file | bullet list | `ARCH-002 async bus`, `Risk R-007 Amber` |

Missing any required field requires logging an `Open Question:` (with owner + due date) before compaction begins.

## Optional Enhancers

| Field | Description | Usage |
| --- | --- | --- |
| `target_format` | Desired output (`rolling-summary`, `memo`, `table`) | Guides the final artifact |
| `archive_path_hint` | Suggested destination under `artifacts/` | Keeps traceability organised |
| `entries_to_drop` | Status updates or resolved items safe to archive | Accelerates pruning |
| `audience` | Consumers of the compacted view | Adapts tone and emphasis |
| `update_scope` | Task file sections to refresh post-compaction | Keeps edits focused |
| `rolling_summary_delta` | Boolean (default `true`) controlling RS refresh | Set `false` only when explicitly skipping |

## Tone & Structure

- Preserve canonical facts; note deprecated items explicitly and point to their archive location.
- Keep the compacted output terse—bullets, small tables, or single paragraphs.
- Reference archive files with relative paths (`artifacts/archives/...`).
- Maintain the Rolling Summary format `Context | Facts | Decisions | Risks | Next` whenever updated.

## Structured Output Requirements

1. **Compaction Summary**
   - Reason for compaction
   - Source material covered
   - Context/facts/decisions/risks retained
   - Items archived + archive path
2. **Index of Moved Sections** – table or list pointing to archived files.
3. **Rolling Summary Update** (unless `rolling_summary_delta: false`) using the standard schema.

## Example Payload

```yaml
[command](general-compact.command.md)
task_reference: 2025-demo
compaction_goal: Refresh Rolling Summary and Activity Log before sprint handoff.
source_material:
  - Activity Log entries prior to 2025-02-01
  - Implementation Notes (legacy approach section)
must_keep:
  - Decision ARCH-002 (Async audit bus chosen)
  - Risk R-007 (Broker DLQ saturation, Amber)
  - KPI target: Audit publish p99 ≤ 300ms
target_format: rolling-summary
archive_path_hint: artifacts/archives/2025-compact-01.md
entries_to_drop:
  - Deprecated ARCH-001 sync design
audience:
  - architect-orchestrator
  - product-ops-orchestrator
update_scope:
  - Rolling Summary
  - Activity Log
```

## Downstream Expectations

- Compaction agent writes the archive file, updates referenced sections, refreshes Rolling Summary (if applicable), and appends an Activity Log line with the archive path.
- Subsequent agents consult the Compaction Summary to confirm critical context remains before continuing work.
- If gaps or inconsistencies emerge, trigger `general-research` or targeted command payloads to reconcile.

---

**End of command spec.**
