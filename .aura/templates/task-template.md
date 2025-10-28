# State Machine Task Template

## Quick Start
Copy this structure to create your task: `.aura/tasks/PROJECT-XXX.md`

## Task Configuration
```yaml
Task Metadata:
  Project Type: {{project-type}}  # infrastructure/feature/documentation/optimization
  Complexity Score: {{complexity-level}}/10
  Automation Level: {{automation-enabled}}
  Estimated Duration: {{time-estimate}}
  Risk Level: {{risk-assessment}}
```

## Dynamic Sections

### Header
```yaml
DOMAIN: <domain-context>
STATUS: <draft|in_progress|blocked|done>
OWNER: <persona role from .claude/agents/>
LAST UPDATED: <ISO 8601 timestamp>
RESEARCH_DOCUMENTS: <links to research outputs in ./research/>
CREATED_DOCUMENTS: <links to documents in ./docs/>
UNIFIED_INDEX: <link to index.md in task root>
```

### Product Brief
```yaml
## Product Brief

Problem
{{problem-statement-with-user-impact}}

Goals
— {{goal-1}} <target & timeframe>
— {{goal-2}} <target & timeframe>
Success Metrics
— {{metric-1}} <target & timeframe>
— {{metric-2}} <target & timeframe>
Constraints & Notes
Architecture: <repositories/services/modules impacted>
Delivery: <timeline, sequencing, capacity considerations>
Compliance/Security:
Attached Context
<path/to/file> — <description>
<link or doc> — <description>
```

### Activity Log
**DEFAULT WORKFLOW**: All agents use progressive task execution by default:
1. Load task context → 2. Execute work → 3. Append timestamped log entry → 4. Validate integrity → 5. Prepare handoff
**PRINCIPLE**: NEVER modify existing content - always append new log entries to preserve complete work history

#### Standard Log Entry Format:
```
YYYY-MM-DDTHH:MM:SS+TZ:TZ - persona-name - Detailed description of work completed, including:
- Work performed and technical approach taken
- Evidence collected (file paths, metrics, test results)
- Decisions made with rationale
- Risk assessment and mitigation approaches
- Next steps and immediate priorities
```

**Special Skills**: Use specific skill templates for structured transitions (product.discovery, qa.e2e, etc.) and context.snapshot for handoffs/checkpoints/log organization.

### Document Organization
**TASK FOLDER STRUCTURE**: Each task creates organized folders for outputs:
```
.aura/tasks/
├── <task_name>/                  # Task folder with organized outputs
│   ├── <task_name>.md           # Main task file with lifecycle logs
│   ├── index.md                 # Unified index pointing to all outputs
│   ├── research/                # Research skill outputs
│   │   ├── YYYY-MM-DD-research-type.md
│   │   ├── evidence/            # Source materials, screenshots, data
│   │   └── assets/              # Research diagrams, charts, etc.
│   └── docs/                    # Technical writing outputs
│       ├── YYYY-MM-DD-document-type.md
│       └── assets/              # Images, diagrams, etc.
```

**FILE NAMING CONVENTIONS**:
- Research files: `YYYY-MM-DD-research-type.md` (e.g., `2025-10-27-market-analysis.md`)
- Document files: `YYYY-MM-DD-document-type.md` (e.g., `2025-10-27-PRD.md`)
- Unified index: Always named `index.md` in task root folder
- Asset files: Descriptive names with dates (e.g., `2025-10-27-architecture-diagram.png`)
- Use relative paths from task file for references (e.g., `./research/2025-10-27-market-analysis.md`)

**DOCUMENT REFERENCES**: Always update task file with:
- `## Research Documents` section with clickable markdown links
- `## Created Documents` section with document references
- Update unified index.md with all research and docs
- Maintain cross-references between related documents

**UNIFIED INDEX TEMPLATE**: Each task's `index.md` should include:
- Overview of task purpose and current status
- **Research Documents** section with links to all research outputs
- **Technical Documents** section with links to all docs
- **Quick Navigation** with status indicators and creation dates
- **Document Summary** with brief descriptions of each document's purpose
- Cross-references between related research and writing documents

Example Flow (replace with real entries)
[TRANSITION|product.discovery] 2025-01-10 by product
MODE: strict
FROM_STATE: DRAFT
TO_STATE: PRD_READY
WHY:
- Validated customer pain via support tickets.
- Confirmed market gap in existing solutions.
OUTPUT:
=== Discovery Summary ===
summary:Confirmed ENG leads lack duplicate visibility and experience manual escalation loops.
inputs:refs=support_tickets/duplicates#L12-L45
evidence:interviews|result=completed|ref=notes/2025-01-09.md
risks:[ ]Dependency on HR hierarchy accuracy|owner=product|mitigation=sync_with_ops
next_steps:Capture PRD requirements aligned with hierarchy data.
=== END Discovery Summary ===
FOLLOW-UP:
- Schedule PRD workshop - owner=product - due=2025-01-12

[TRANSITION|agile.planning] 2025-01-12 by tech-lead
MODE: strict
FROM_STATE: PRD_READY
TO_STATE: PLANNED
WHY:
- Sequenced backlog items for Sprint 08.
- Allocated resources for implementation.
OUTPUT:
=== Planning Commitments ===
summary:Committed backend + QA capacity to ENG duplicates visibility slice.
inputs:sprint_window=2025-01-12..2025-01-25
evidence:capacity_plan|result=approved|ref=docs/sprint-08-plan.md
risks:[ ]Redis fan-out load under-estimated|owner=tech-lead|mitigation=stage_benchmarks
next_steps:Start implementation with duplicates query utilities update.
=== END Planning Commitments ===
FOLLOW-UP:
- Benchmark Redis load - owner=backend - due=2025-01-16

[TRANSITION|code.implement] 2025-01-18 by tech-lead
MODE: strict
FROM_STATE: PLANNED
TO_STATE: BUILT
WHY:
- Delivered hierarchy-aware duplicate counters and unit coverage.
- Code reviewed and tests passing.
OUTPUT:
=== Implementation Summary ===
summary:Added ENG hierarchy filters and updated Redis publication tests.
inputs:prs=#1234
evidence:npx jest duplicates|result=pass|ref=records/jest-2025-01-18.out
risks:[ ]Need QA account fixtures|owner=qa|mitigation=prepare_sandbox_data
next_steps:Request review, prep QA handoff.
=== END Implementation Summary ===
FOLLOW-UP:
- Provision ENG QA accounts - owner=qa - due=2025-01-19

Use BLOCKED(missing_inputs=[...], unblock_steps=[...]) if prerequisites are absent. Update .aura/glossary.md and .aura/constitution.md when new terminology, channels, or workflows emerge during this story.

### Document Reference Templates

#### Research Documents Section
```yaml
## Research Documents
- [2025-10-27-market-analysis.md](./research/2025-10-27-market-analysis.md) - Market research and competitive analysis
- [2025-10-27-technical-feasibility.md](./research/2025-10-27-technical-feasibility.md) - Technical validation and feasibility study
```

#### Created Documents Section
```yaml
## Created Documents
- [2025-10-27-PRD.md](./docs/2025-10-27-PRD.md) - Product Requirements Document
- [2025-10-27-architecture-spec.md](./docs/2025-10-27-architecture-spec.md) - System architecture specification
```

#### Unified Index Template
```markdown
# Task: <task_name>

## Overview
<Brief description of task purpose and current status>

## Research Documents
- [Market Analysis](./research/2025-10-27-market-analysis.md) - Market research and competitive analysis
- [Technical Feasibility](./research/2025-10-27-technical-feasibility.md) - Technical validation

## Technical Documents
- [PRD](./docs/2025-10-27-PRD.md) - Product Requirements Document
- [Architecture Spec](./docs/2025-10-27-architecture-spec.md) - System architecture

## Quick Navigation
| Document | Type | Status | Created |
|----------|------|--------|---------|
| Market Analysis | Research | Completed | 2025-10-27 |
| PRD | Documentation | Completed | 2025-10-27 |
```

---

## Template Usage Guidelines

### State Machine Transition Flow
Follow the prescribed gate order for each story:
1. **product.discovery** → Validate problem and market need
2. **product.prd** → Capture requirements and acceptance criteria
3. **agile.planning** → Sequence backlog and allocate capacity
4. **code.implement** → Build feature with automated tests
5. **code.review** → Verify code quality and architecture compliance
6. **qa.ready** → Prepare test environment and fixtures
7. **qa.contract** → Validate API/event contracts
8. **qa.e2e** → Verify end-to-end user journeys
9. **pm.sync** → Update stakeholders and close story

### Transition Modes
- **strict**: All prerequisites must be satisfied, normal state progression
- **tolerant**: Continue with missing inputs but flag gaps and owners
- **branch**: Create parallel work streams for complex features

### Required Elements
Each transition must include:
- MODE: strict|tolerant|branch
- FROM_STATE: Current state
- TO_STATE: Target state
- WHY: 2-3 concise bullets explaining the transition
- OUTPUT: Structured summary with evidence, risks, and next steps
- FOLLOW-UP: Action items with owners and due dates

### BLOCKED Protocol
Use when prerequisites are missing:
```
BLOCKED(missing_inputs=[prerequisite1, prerequisite2], unblock_steps=[step1, step2])
```

---

*State Machine template with transition mechanism, lifecycle logging, and structured workflow.*