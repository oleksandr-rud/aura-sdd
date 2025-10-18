# Glossary

- **SpecStory**: Internal shorthand for the single source-of-truth feature documentation pattern. Superseded by the multi-artifact layout (spec.md, plan.md, stories).
- **Storylet**: BMAD story context packet; now stored under `stories/FEAT-XXX/STORY-YYY.md`.
- **Specx**: Thin controller wrapping Spec Kit, BMAD, Specmatic, and PM adapters. Configured via `tools/specx/specx.config.yaml`.
- **Task Package**: Single Markdown task file (`.spec/tasks/<PROJECT-XXX>.md`) containing all sections, embedded evidence, and logs for the initiative. No separate artifact folders.
- **Single File Documentation**: Documentation approach where all task information, evidence, metrics, and results are embedded directly in one markdown file without external artifacts.
- **Rolling Summary**: One-line snapshot in the format `Context | Facts | Decisions | Risks | Next`, refreshed after meaningful changes.
- **Content Embedding**: Practice of including all evidence, metrics, and results directly in the task file using markdown code blocks, structured lists, and tables.
- **Context Compact**: Skill that manages Activity Log size by archiving old content to bottom of file or separate archive file when the log grows large.
- **Compaction Archive**: Section at bottom of task file or separate archive file storing detailed history when context is compressed via `context-compact`.
- **Activity Log Line**: Single-line entry (`YYYY-MM-DDTHH:MM:SS+03:00 - agent - summary`) capturing the outcome of an agent or command run.
- **Embedded Evidence**: All test results, metrics, design decisions, and artifacts included directly in task file sections rather than external files.
- **Sev-High / Sev-Medium / Sev-Low**: Defect severity levels indicating impact to release readiness; Sev-High blocks launch until resolved.
- **RAG Status**: Risk color coding (Red, Amber, Green) used to signal urgency and mitigation progress across findings.
