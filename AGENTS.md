# Spec Gen Agents

## Spec Ops Overview
- Purpose: centralize multi-agent workflows for drafting and iterating on Task Packages inside the Spec Gen workspace.
- Key artifacts live under `.spec/` (agents, commands, glossary) with Task Packages materializing inside `.spec/tasks/<task_reference>/`.
- Agents coordinate via Codex prompts; keep conversations minimal and promote findings into Task Package sections as soon as they stabilize.

### Quick Start
- From the project root, launch `codex` (or your Codex-enabled terminal).
- Invoke an agent with its activation phrase, for example `As architect orchestrator, scope task 2025-INIT`.
- Before long sessions, record the task slug and pin a Rolling Summary (`Context, Facts, Decisions, Risks, Next`).
- Reset context when switching Task Packages; archive conclusions in the Activity Log first.

### Spec Stack Notes
- Authoring format: Single Markdown task files per `task_reference`; commands (analytics, architecture, code, QA) feed updates into shared sections.
- Commands provide structured payloads; see `.spec/commands/*.command.md` for required fields and tone.
- Glossary terms resolve in `.spec/glossary.md`; extend it when you introduce new domain vocabulary.
- Constitution (`.spec/constitution.md`) captures architecture and code principles, delivery philosophy, structure diagrams, infra guidance, and other project-specific guardrails—stay aligned and log divergences as risks.
- References map command/agent IDs to their specs for quick routing.

### Command Surface (Routes)
| Command | When To Trigger | Typical Owner |
| ------- | --------------- | ------------- |
| `analytics-research` | Validate metrics, hypotheses, or data gaps before design or delivery | Product Ops / Analytics |
| `architect-plan` | Capture architecture options, decisions, and risks | Architect Orchestrator |
| `agile-plan` | Translate approved scope into sprint planning artifacts | Product Ops |
| `product-prd` | Shape product narratives, KPIs, acceptance criteria | Product Ops |
| `code-implement` | Launch implementation tasks, spikes, or prototypes | Tech Lead / Dev Implementer |
| `code-review` / `code-unit` | Run code audit loops or unit test scaffolding | Tech Lead / QA |
| `qa-contract` / `qa-e2e` / `qa-stress` | Build verification matrices, end-to-end, or load suites | QA Orchestrator |
| `pm-sync` | Prepare updates for stakeholder syncs | Product Ops |
| `general-research` | Explore market, competitive, or feasibility context | Any agent needing background |

## Agent Directory

| Title | ID | Activation Phrase | Focus |
| ----- | -- | ----------------- | ----- |
| Architect Orchestrator | `architect-orchestrator` | `As architect orchestrator, …` | Embed concise architecture decisions, NFR targets, and risks into the task file |
| Product Ops Orchestrator | `product-ops-orchestrator` | `As product ops orchestrator, …` | Own the single task file, run the product cycle first, and keep Rolling Summary + Activity Log current |
| Tech Lead Orchestrator | `tech-lead-orchestrator` | `As tech lead orchestrator, …` | Drive execution planning, code reviews, and testing readiness updates |
| QA Orchestrator | `qa-orchestrator` | `As qa orchestrator, …` | Coordinate QA coverage and log Go/No-Go signals with evidence |

## Agent Details

### Architect Orchestrator
- Source: `.spec/agents/architect.agent.md`
- Activation: `As architect orchestrator, …`
- Focus: Keep Implementation Notes aligned with architecture decisions, quantify NFRs, surface risks, and log each run succinctly.
```yaml
{file:./.spec/agents/architect.agent.md}
```

### Product Ops Orchestrator
- Source: `.spec/agents/product-ops.agent.md`
- Activation: `As product ops orchestrator, …`
- Focus: Create/maintain the task file, run product framing, refresh the one-line Rolling Summary, and append timestamped activity entries.
```yaml
{file:./.spec/agents/product-ops.agent.md}
```

### Tech Lead Orchestrator
- Source: `.spec/agents/tech-lead.agent.md`
- Activation: `As tech lead orchestrator, …`
- Focus: Sequence engineering work, coordinate reviews/tests, and record delivery status in the task file.
```yaml
{file:./.spec/agents/tech-lead.agent.md}
```

### QA Orchestrator
- Source: `.spec/agents/qa.agent.md`
- Activation: `As qa orchestrator, …`
- Focus: Run QA suites, document Go/No-Go decisions, and keep Testing Notes plus Activity Log entries tight.
```yaml
{file:./.spec/agents/qa.agent.md}
```
