# Spec Gen Agents

## Spec Ops Overview
- Purpose: centralize multi-agent workflows for drafting and iterating on Task Packages inside the Spec Gen workspace.
- Key artifacts live under `.spec/` (agents, skills, glossary) with Task Packages materializing as single files under `.spec/tasks/<PROJECT-XXX>.md`.
- Agents coordinate via skill prompts; keep conversations minimal and embed all findings directly into the single task file.
- **Single File Documentation**: All evidence, metrics, and results embedded directly in task file - no separate artifact folders.

### Quick Start
- From the project root, launch your preferred AI assistant.
- Invoke an agent with its activation phrase, for example `As architect orchestrator, scope task SPEC-001`.
- Before long sessions, record the task ID and pin a Rolling Summary (`Context | Facts | Decisions | Risks | Next`).
- Reset context when switching Task Packages; archive conclusions in the Activity Log first.

### Spec Stack Notes
- Authoring format: Single Markdown task files per `PROJECT-XXX` ID; skills (analytics, architecture, code, QA) embed results directly in task file sections.
- Skills provide structured payloads; see `.spec/skills/*.skill.md` for required fields and execution patterns.
- Glossary terms resolve in `.spec/glossary.md`; extend it when you introduce new domain vocabulary.
- **Content Embedding**: All test results, metrics, design decisions, and evidence included directly in task file using markdown code blocks, structured lists, and tables.
- References map skill/agent IDs to their specs for quick routing.
- **Context Compact**: Skill manages Activity Log size by archiving old content when log grows large.

### Skill Surface (Routes)
| Skill | When To Trigger | Typical Owner | Output Location |
| ----- | --------------- | ------------- | -------------- |
| `analytics-research` | Validate metrics, hypotheses, or data gaps before design or delivery | Product Ops / Analytics | Metrics & Evidence |
| `architect-plan` | Capture architecture options, decisions, and risks | Architect Orchestrator | Implementation Notes |
| `agile-plan` | Translate approved scope into sprint planning artifacts | Product Ops | Implementation Notes |
| `product-prd` | Shape product narratives, KPIs, acceptance criteria | Product Ops | Product Brief |
| `code-review` | Run code audit loops with severity classifications | Tech Lead / QA | Implementation Notes |
| `code-unit` | Unit test scaffolding and coverage analysis | Tech Lead / QA | Testing Notes |
| `qa-contract` | Interface compatibility validation across systems | QA Orchestrator | Testing Notes |
| `qa-e2e` | End-to-end user journey validation | QA Orchestrator | Testing Notes |
| `qa-stress` | System capacity and scalability validation | QA Orchestrator | Testing Notes |
| `pm-sync` | Prepare updates for stakeholder syncs | Product Ops | Rolling Summary |
| `research` | Explore market, competitive, or feasibility context | Any agent needing background | Relevant Section |
| `context-compact` | Manage Activity Log size when content grows | Any agent | Activity Log/Archive |

## Agent Directory

| Title | ID | Activation Phrase | Focus |
| ----- | -- | ----------------- | ----- |
| Architect Orchestrator | `architect-orchestrator` | `As architect orchestrator, …` | Embed architecture decisions, NFR targets, and risks directly in task file Implementation Notes |
| Product Ops Orchestrator | `product-ops-orchestrator` | `As product ops orchestrator, …` | Own the single task file, run product cycle first, keep Rolling Summary + Activity Log current with embedded evidence |
| Tech Lead Orchestrator | `tech-lead-orchestrator` | `As tech lead orchestrator, …` | Drive execution planning, code reviews, and embed technical details in task file sections |
| QA Orchestrator | `qa-orchestrator` | `As qa orchestrator, …` | Coordinate QA coverage and embed Go/No-Go signals with evidence directly in Testing Notes |

## Agent Details

### Architect Orchestrator
- Source: `.spec/agents/architect.agent.md`
- Activation: `As architect orchestrator, …`
- Focus: Keep Implementation Notes aligned with architecture decisions, quantify NFRs, surface risks, and embed all findings directly in task file.
- Skills: `architect-plan`, `analytics-research`, `research`, `context-compact`

### Product Ops Orchestrator
- Source: `.spec/agents/product-ops.agent.md`
- Activation: `As product ops orchestrator, …`
- Focus: Create/maintain the single task file, run product framing, refresh Rolling Summary, and embed all results with timestamped Activity Log entries.
- Skills: `analytics-research`, `product-prd`, `agile-plan`, `pm-sync`, `context-compact`, `research`

### Tech Lead Orchestrator
- Source: `.spec/agents/tech-lead.agent.md`
- Activation: `As tech lead orchestrator, …`
- Focus: Sequence engineering work, coordinate reviews/tests, and embed all technical evidence directly in task file sections.
- Skills: `architect-plan`, `code-review`, `code-unit`, `qa-contract`, `qa-e2e`, `qa-stress`, `research`, `analytics-research`, `context-compact`

### QA Orchestrator
- Source: `.spec/agents/qa.agent.md`
- Activation: `As qa orchestrator, …`
- Focus: Run QA suites, embed Go/No-Go decisions with evidence directly in Testing Notes, and maintain Activity Log entries.
- Skills: `code-unit`, `qa-contract`, `qa-e2e`, `qa-stress`, `code-review`, `research`, `context-compact`
