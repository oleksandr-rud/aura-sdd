# Glossary

- **SpecStory**: Internal shorthand for the single source-of-truth feature documentation pattern. Superseded by the multi-artifact layout (spec.md, plan.md, stories).
- **Storylet**: BMAD story context packet; now stored under `stories/FEAT-XXX/STORY-YYY.md`.
- **Specx**: Thin controller wrapping Spec Kit, BMAD, Specmatic, and PM adapters. Configured via `tools/specx/specx.config.yaml`.
- **Task Package**: Single Markdown task file (`.spec/tasks/<task_reference>/task.md`) containing all sections and logs for the initiative.
- **Rolling Summary**: One-line snapshot in the format `Context | Facts | Decisions | Risks | Next`, refreshed after meaningful changes.
- **Compaction Archive**: External file or directory storing detailed history when context is compressed via `general-compact`.
- **Activity Log Line**: Single-line entry (`YYYY-MM-DDTHH:MM:SS+03:00 - agent - summary`) capturing the outcome of an agent or command run.
- **Sev-High / Sev-Medium / Sev-Low**: Defect severity levels indicating impact to release readiness; Sev-High blocks launch until resolved.
- **RAG Status**: Risk color coding (Red, Amber, Green) used to signal urgency and mitigation progress across findings.
