# Glossary

## Workflow Transition Terms

- **Workflow Transition System**: The controlling workflow that governs all persona deliverables through Orient → Scope → Execute → Gate sequence.
- **Lifecycle Log**: Centralized story log that captures all progress metadata with proper tag formatting (AGENTS.MD:14-18).
- **Transition Modes**:
  - **strict**: All prerequisites must be satisfied, normal phase progression
  - **tolerant**: Continue with missing inputs but flag gaps and owners
  - **branch**: Create parallel work streams for complex features
- **Phase Order**: Prescribed sequence of transitions: product.discovery → product.prd → agile.planning → code.implement → code.review → qa.ready → qa.contract → qa.e2e → pm.sync
- **Progress Log Entry**: Structured entry format: `[PROGRESS|<phase.tag>] by <persona> MODE: <mode> FROM: <phase> TO: <phase> WHY: <bullets> OUTPUT: <artifact> FOLLOW-UP: <actions>`
- **BLOCKED Protocol**: Format for missing prerequisites: `BLOCKED(missing_inputs=[...], unblock_steps=[...])`
- **Context Snapshot**: Enhanced skill for capturing current status and managing log organization with both snapshot and compact operations.

## Legacy Terms (Updated for Workflow Compatibility)

- **SpecStory**: Internal shorthand for the single source-of-truth feature documentation pattern. Now integrated into Workflow Transition System.
- **Storylet**: BMAD story context packet; now managed through workflow transitions and Lifecycle Log.
- **Specx**: Thin controller wrapping Spec Kit, BMAD, Specmatic, and PM adapters. Configured via `tools/specx/specx.config.yaml`.
- **Task Package**: Single Markdown task file (`.spec/tasks/<PROJECT-XXX>.md`) containing all sections, embedded evidence, and Lifecycle Log for the initiative.
- **Single File Documentation**: Documentation approach where all task information, evidence, metrics, and results are embedded directly in one markdown file without external artifacts.
- **Rolling Summary**: One-line snapshot in the format `Context | Facts | Decisions | Risks | Next`, refreshed after meaningful changes. Now integrated into Lifecycle Log entries.
- **Content Embedding**: Practice of including all evidence, metrics, and results directly in the task file using markdown code blocks, structured lists, and tables.
- **Context Compact**: Integrated operation within Context Snapshot skill that manages Lifecycle Log size by archiving old content while preserving audit trails.
- **Compaction Archive**: Section at bottom of task file or separate archive file storing detailed history when context is compressed via Context Snapshot compact operation.
- **Activity Log Line**: Legacy format for single-line entries. Now superseded by structured Transition Log entries in Lifecycle Log.
- **Embedded Evidence**: All test results, metrics, design decisions, and artifacts included directly in task file sections rather than external files.
- **Sev-High / Sev-Medium / Sev-Low**: Defect severity levels indicating impact to release readiness; Sev-High blocks launch until resolved.
- **RAG Status**: Risk color coding (Red, Amber, Green) used to signal urgency and mitigation progress across findings.

## Persona and Skill Terms

- **Persona**: Agent role with specific responsibilities, skills, and authority within the State Machine workflow (e.g., product-ops, tech-lead, architect, qa).
- **Skill**: Standardized procedure that agents execute to perform specific transitions between states (e.g., product-discovery, code-review, qa-e2e).
- **Orientation Checks**: Required alignment procedures that personas must perform before executing transitions (constitution review, glossary lookup, registry inspection).
- **MCP Tools**: Model Context Protocol tools that skills require for execution (file operations, web access, development tools).
- **Artifact Output**: Standardized format for transition results: `=== <GATE_NAME> === summary: inputs: evidence: risks: next_steps: === END <GATE_NAME> ===`
- **Research Modes**: Operation types within Research skill including analytics (quantitative data analysis), technical (pattern investigation), market (trend analysis), and competitive (landscape analysis).
- **Research Operation Types**: Different research approaches within the unified Research skill that accommodate various investigation needs while maintaining consistent methodology.

## Quality and Compliance Terms

- **Guardrails**: Quality standards and escalation protocols that enforce workflow compliance and artifact quality.
- **CLI Readability**: Requirement to keep entries ≤120 chars per line for command line interface compatibility.
- **Evidence Citation**: Practice of referencing artifacts with actionable formats (ref=path#Lx or URLs).
- **Risk Escalation**: Protocol for surfacing scope gaps through Product persona and technical risks via Tech Lead.
- **Constitution Update**: Requirement to update .spec/constitution.md when introducing new terminology, channels, or workflows.
- **Glossary Update**: Requirement to update .spec/glossary.md when introducing new terms, channels, or artifacts.

## Infrastructure and Development Terms

- **Monorepo**: Single repository containing multiple related projects with shared dependencies and tooling.
- **Tesseract**: Container orchestration platform used for deployment and service management in production environments.
- **Docker Compose**: Local development environment setup using `docker-compose.yml` at repository root for consistent development workflows.
- **Root Docker Compose**: Main `docker-compose.yml` file at repository root that orchestrates all services for local development.
- **API Server**: Backend service running on port 4000 with demo endpoints for development and testing.
- **Client App**: Frontend React application running on port 5173 for user interface development.
