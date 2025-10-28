# AURA Framework Glossary

## AURA Framework Core Terms

- **AURA (Agent Unified Response Architecture)**: Framework for AI agent orchestration providing governance, workflows, and quality standards for multi-agent coordination.
- **Agent**: Specialized AI persona with defined responsibilities, skills, and authority within the AURA framework (architect, product-ops, tech-lead, qa).
- **Skill**: Reusable capability that agents can execute to perform specific tasks (planning, research, qa, code, context-management, technical-writing).
- **Workflow Gateway Protocol**: Prescribed sequence of gates (product.discovery → product.prd → agile.planning → code.implement → code.review → qa.ready → qa.contract → qa.e2e → pm.sync).
- **Lifecycle Log**: Centralized story log capturing all transition metadata with proper tag formatting for auditability.
- **Orient → Scope → Execute → Gate**: Mandatory sequence for all agent deliverables ensuring consistent workflow execution.
- **Task Package**: Single-file task package (`.aura/tasks/PROJECT-XXX.md`) containing all sections, embedded evidence, and lifecycle log.
- **Context Management**: Process of capturing, preserving, and transferring context between agents and skills during workflow transitions.
- **Document Organization**: Structured approach to organizing task outputs with dedicated folders for research and documentation.
- **Unified Index**: Central navigation file (`index.md`) in task root folder pointing to all research and documentation outputs.
- **Task Folder Structure**: Organized folder hierarchy within `.aura/tasks/<task_name>/` for research outputs and technical documents.
- **Quality Gates**: Validation checkpoints ensuring standards compliance before progressing to next workflow phase.
- **Constitution**: Framework governance document defining rules, principles, and quality standards for all AURA operations.
- **Glossary**: Domain terminology and definitions ensuring consistent language across all agents and skills.
- **Registry**: Coordination system mapping agents to authorized skills and managing workflow state transitions.
- **Claude Code**: Implementation layer providing agents and skills for execution within AURA framework governance.
- **Memory Architecture**: Claude's memory system operating through AURA structure for persistent context management.

## Project Types and Naming Conventions

### AURA Projects
- **AURA (Agent Unified Response Architecture)**: Core framework projects focusing on framework development, skill creation, and agent coordination.
- **AURA-XXX Pattern**: Naming convention for core framework tasks (e.g., AURA-001, AURA-003).
- **AURA Project Scope**: Framework architecture, skill development, agent coordination, quality standards, and governance.
- **AURA Task Structure**: Standardized folder organization with design/, research/, docs/, and index.md for comprehensive documentation.

### VOIA Projects
- **VOIA (Voice-AURA)**: Voice integration projects focusing on voice-enabled agents, voice processing, and voice interaction capabilities.
- **VOIA-XXX Pattern**: Naming convention for voice integration tasks (e.g., VOIA-004, VOIA-005).
- **VOIA Project Scope**: Voice processing, speech-to-text, text-to-speech, voice UI/UX design, voice security, and accessibility.
- **Voice-First Design**: Design approach prioritizing voice interaction patterns and conversational user experiences.
- **Voice Processing Pipeline**: End-to-end flow from audio capture through speech recognition, intent understanding, agent response, and voice output.
- **Voice Accessibility**: Voice-specific accessibility features including voice commands, screen reader integration, and inclusive design.
- **Voice Privacy**: Security and privacy standards specific to voice data including encryption, consent management, and data retention policies.

### Project Organization
- **Project Prefix**: Standardized identifier (AURA or VOIA) indicating project type and scope.
- **Task Numbering**: Sequential numbering within each project type (AURA-001, AURA-002; VOIA-001, VOIA-002).
- **Cross-Project Integration**: Coordination between AURA and VOIA projects for unified voice-enabled framework capabilities.

## Agent & Skill Terms

- **Agent Activation**: Process of invoking a specific agent persona using activation phrases (e.g., "As architect, [task]").
- **Agent Handoff**: Transfer of context and responsibility between agents with structured transition logging.
- **Skill Execution**: Process of agents activating specific capabilities to perform tasks within their domain.
- **Template Selection**: System determines appropriate skill template based on agent role, context, and available inputs.
- **Intent Interpretation**: Automatic analysis of user requests to determine appropriate skills and execution parameters.
- **Context Preservation**: Maintaining complete state information during agent transitions and skill execution.
- **Quality Validation**: Verification that outputs meet framework standards and quality requirements.
- **Evidence Collection**: Gathering of results, metrics, and artifacts to support decision-making and audit trails.

## Claude Code Integration Terms

- **Claude Code Implementation**: Practical execution layer providing agents and skills within AURA framework governance.
- **Framework Governance**: AURA constitution and glossary providing standards and terminology for Claude Code operations.
- **Memory Architecture**: Claude's persistent memory system operating through AURA structure for context management.
- **Task Management**: Storage and tracking of work in `.aura/tasks/` with comprehensive lifecycle logging.
- **Skill Integration**: Claude Code skills referencing AURA framework for governance, terminology, and quality standards.
- **Agent Coordination**: Multi-agent collaboration with structured handoffs and context preservation.

## Voice-Specific Terms

- **Voice Agent**: AURA agent enhanced with voice interaction capabilities for voice-first user engagement.
- **Voice Skill**: Specialized skill for voice processing, speech recognition, and voice interaction management.
- **Speech-to-Text (STT)**: Technology for converting spoken language into written text for agent processing.
- **Text-to-Speech (TTS)**: Technology for converting agent text responses into natural-sounding voice output.
- **Natural Language Understanding (NLU)**: AI capability for interpreting user intent from voice commands and queries.
- **Voice Session**: Continuous voice interaction between user and voice-enabled agent with context preservation.
- **Voice Context Management**: Process of maintaining conversation context and history across voice interactions.
- **Voice Activation**: Process of initiating voice interaction through wake words or voice commands.
- **Voice Persona**: Characteristic voice style and personality defined for voice-enabled agents.
- **Real-Time Voice Processing**: Sub-second voice interaction with minimal latency for natural conversation flow.
- **Voice Error Recovery**: Graceful handling of voice recognition errors with clarification requests and fallback mechanisms.
- **Voice Authentication**: Security mechanisms using voice biometrics for user identification and access control.
- **Multi-Modal Interaction**: Combined voice and visual/text interaction patterns for enhanced user experience.

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
- **Task Package**: Single Markdown task file (`.aura/tasks/<PROJECT-XXX>.md`) containing all sections, embedded evidence, and Lifecycle Log for the initiative. PROJECT follows AURA-XXX or VOIA-XXX patterns.
- **Single File Documentation**: Documentation approach where all task information, evidence, metrics, and results are embedded directly in one markdown file without external artifacts.
- **Rolling Summary**: One-line snapshot in the format `Context | Facts | Decisions | Risks | Next`, refreshed after meaningful changes. Now integrated into Lifecycle Log entries.
- **Content Embedding**: Practice of including all evidence, metrics, and results directly in the task file using markdown code blocks, structured lists, and tables.
- **Context Compact**: Integrated operation within Context Snapshot skill that manages Lifecycle Log size by archiving old content while preserving audit trails.
- **Compaction Archive**: Section at bottom of task file or separate archive file storing detailed history when context is compressed via Context Snapshot compact operation.
- **Activity Log Line**: Legacy format for single-line entries. Now superseded by structured Transition Log entries in Lifecycle Log.
- **Embedded Evidence**: All test results, metrics, design decisions, and artifacts included directly in task file sections rather than external files.
- **Sev-High / Sev-Medium / Sev-Low**: Defect severity levels indicating impact to release readiness; Sev-High blocks launch until resolved.
- **RAG Status**: Risk color coding (Red, Amber, Green) used to signal urgency and mitigation progress across findings.

## Nested Applications Terms

- **Monorepo**: Single repository containing multiple applications with shared dependencies and tooling.
- **Nested Applications**: Separate applications within the monorepo with distinct architectures and purposes:
  - **Chat API Backend**: Backend service using NestJS with hexagonal architecture pattern
  - **Chat App Frontend**: Frontend application using React with feature-based organization
- **Hexagonal Architecture**: Architectural pattern with domain/application/infrastructure/presentation layers for backend applications.
- **Feature-Based Architecture**: Frontend architectural pattern organizing code by features rather than file types.
- **Application Architecture Patterns**: Prescribed architectural approaches for different application types defined in the constitution.
- **Cross-Application Integration**: Communication and dependencies between different applications within the monorepo.
- **Module Organization**: Structural organization of code within applications following prescribed patterns.
- **File Reference Format**: `ref=<path>` notation used to reference implementation files without including code.
- **Application Task Format**: Task structure that includes application-specific context and references.

## Persona and Skill Terms

- **Persona**: Agent role with specific responsibilities, skills, and authority within the Spec Workflow system (e.g., product-ops, tech-lead, architect, qa).
- **Skill**: Standardized procedure that agents execute to perform specific transitions between states. Skills are either **Unified Skills** with multiple templates or **Specialized Skills** for specific gate transitions.
- **Unified Skills**: Skills that contain multiple templates for flexible execution:
  - **Planning Skill**: 4 templates (agile, architect, testing, implementation) for domain-specific planning
  - **Research Skill**: 5 templates (product-discovery, analytics, technical, market, competitive) for systematic investigation
  - **Technical Writing Skill**: Professional documentation creation supporting Diátaxis framework and 7-stage writing process
  - **Context Management Skill**: State preservation, handoff coordination, and audit trail maintenance
- **Template Selection**: Method of choosing appropriate template within unified skills via:
  - **Parameter Specification**: Direct selection using `planning_type` or `research_type` parameters
  - **Intent Interpretation**: Automatic selection based on agent role, context, and available inputs
- **Specialized Skills**: Single-purpose skills for specific gate transitions (e.g., product-prd, code-implement, qa-e2e)
- **Orientation Checks**: Required alignment procedures that personas must perform before executing transitions (constitution review, glossary lookup, registry inspection).
- **MCP Tools**: Model Context Protocol tools that skills require for execution (file operations, web access, development tools).
- **Artifact Output**: Standardized format for transition results: `=== <GATE_NAME> === summary: inputs: evidence: risks: next_steps: === END <GATE_NAME> ===`
- **Template Types**: Specific variants within unified skills:
  - **Planning Templates**: agile, architect, testing, implementation
  - **Research Templates**: product-discovery, analytics, technical, market, competitive
- **Cross-Agent Skills**: Ability for any agent to use any unified skill template with appropriate parameters
- **Multi-Mode Execution**: Combined template execution for complex investigations (e.g., `research_type="market+competitive"`)

## Document Organization Terms

- **Task Folder Structure**: Standard organization pattern for task outputs:
  ```
  .aura/tasks/<task_name>/
  ├── <task_name>.md              # Main task file
  ├── index.md                   # Unified index
  ├── research/                   # Research outputs
  └── docs/                      # Technical documents
  ```
- **Research Folder**: Dedicated `./research/` subfolder for all research skill outputs and evidence materials.
- **Documentation Folder**: Dedicated `./docs/` subfolder for all technical writing skill outputs and assets.
- **Evidence Subfolder**: `./research/evidence/` directory for source materials, screenshots, and supporting data.
- **Assets Subfolder**: `./docs/assets/` directory for images, diagrams, charts, and visual elements.
- **Date-Stamped Naming**: File naming convention using `YYYY-MM-DD-document-type.md` format for chronological organization.
- **Relative Path Referencing**: Using relative paths from task file (e.g., `./research/2025-10-27-market-analysis.md`) for document links.
- **Document Reference Sections**: Task file sections (`## Research Documents`, `## Created Documents`) with clickable markdown links.
- **Unified Index Maintenance**: Process of updating `index.md` with navigation to all research and documentation outputs.
- **Cross-Document References**: Links between related research and documentation files for context preservation.
- **Document Lifecycle Management**: Complete lifecycle from creation through updates to archival with proper version control.

## Quality and Compliance Terms

- **Guardrails**: Quality standards and escalation protocols that enforce workflow compliance and artifact quality.
- **CLI Readability**: Requirement to keep entries ≤120 chars per line for command line interface compatibility.
- **Evidence Citation**: Practice of referencing artifacts with actionable formats (ref=path#Lx or URLs).
- **Risk Escalation**: Protocol for surfacing scope gaps through Product persona and technical risks via Tech Lead.
- **Constitution Update**: Requirement to update .aura/constitution.md when introducing new terminology, channels, or workflows.
- **Glossary Update**: Requirement to update .aura/glossary.md when introducing new terms, channels, or artifacts.
- **Document Quality Standards**: Framework requirements for document organization, naming conventions, and reference management.
- **Skill Integration Standards**: Requirements for skill execution including file storage, task file updates, and unified index maintenance.
- **Research Quality Requirements**: Evidence-based research with proper source documentation, citation standards, and validation criteria.
- **Technical Writing Quality Requirements**: Professional documentation standards including readability targets, stakeholder review, and accessibility compliance.
- **Context Preservation Requirements**: Standards for maintaining complete state during agent transitions and skill handoffs.

## Infrastructure and Development Terms

- **Monorepo**: Single repository containing multiple related projects with shared dependencies and tooling.
- **Tesseract**: Container orchestration platform used for deployment and service management in production environments.
- **Docker Compose**: Local development environment setup using `docker-compose.yml` at repository root for consistent development workflows.
- **Root Docker Compose**: Main `docker-compose.yml` file at repository root that orchestrates all services for local development.
- **API Server**: Backend service running on port 4000 with demo endpoints for development and testing.
- **Client App**: Frontend React application running on port 5173 for user interface development.
