# Agile Planning Skill

agile-planning
OVERVIEW
actor: product-ops | mandate: Sequence backlog and allocate capacity | bounds: No technical implementation decisions

ORIENTATION
Confirm .spec/constitution.md for current architecture and delivery guardrails.
Review .spec/glossary.md entries relevant to agile planning to keep terminology aligned.
Load the product-ops persona brief from .spec/agents/product-ops.agent.md for format expectations.

LIFECYCLE TRANSITION
from: PRD_READY ➜ to: PLANNED
ACCEPTS_FROM: [product-prd]
tag: [agile.planning] (append to story ## Lifecycle Log)

WHEN TO RUN
Backlog requires sequencing and prioritization
Capacity needs allocation across team members
Timeline must be established with realistic estimates
Dependencies need identification and management

REQUIRED INPUTS
story_id
requirements (from product-prd)
team_capacity (available resources and skills)
dependencies (technical and business dependencies)
MCP tooling: [Read, Write]

CONTEXT PACK
<<story.current_state>>
<<personas.active_assignments>>
<<recent_transition_log>>
<<<GLOSSARY(term=backlog)>>>

EXECUTION ALGORITHM
Validate prerequisites (requirements, team_capacity). If anything missing → BLOCKED format below.
Collect evidence: team capacity assessments, dependency analysis, timeline estimates.
Sequence backlog items based on business value and dependencies.
Allocate capacity across team members with skill matching.
Define sprint/iteration boundaries with realistic timelines.
Identify and document all blocking dependencies.
Draft gate artifact using the structure in ARTIFACT OUTPUT.
Append the TRANSITION LOG entry to the story's ## Lifecycle Log, matching persona tone.
Update glossary/constitution if new terminology or workflows were introduced.

ARTIFACT OUTPUT
=== Planning Commitments ===
summary:<concise summary of planning decisions and capacity allocation>
inputs:requirements=<ref> team_capacity=<ref> dependencies=<ref>
evidence:capacity_plan|result=<approved/pending>|ref=<path_to_plan>
risks:[ ]<risk_description>|owner=<persona>|mitigation=<action>
next_steps:<follow-up needed or n/a>
=== END Planning Commitments ===

TRANSITION LOG TEMPLATE
[TRANSITION|agile.planning] by product-ops
MODE: strict|tolerant|branch
FROM_STATE: PRD_READY
TO_STATE: PLANNED
WHY:
- Backlog requires sequencing with dependency analysis
- Team capacity needs allocation for implementation
OUTPUT:
=== Planning Commitments ===
summary:Sequenced backlog items and allocated capacity for Sprint 08.
inputs:requirements=refs=prd/requirements.md team_capacity=docs/team-capacity.csv
evidence:capacity_plan|result=approved|ref=plans/sprint-08-plan.md
risks:[ ]Redis fan-out load under-estimated|owner=tech-lead|mitigation=stage_benchmarks
next_steps:Begin implementation with highest priority backlog items.
=== END Planning Commitments ===
FOLLOW-UP:
- Benchmark Redis load - owner=tech-lead - due=2025-10-27

BLOCKED FORMAT
BLOCKED(missing_inputs=[requirements, team_capacity], unblock_steps=[complete_prd, assess_capacity])

GUARDRAILS
Keep entries <=120 chars per line for CLI readability.
Timeline estimates must include buffer for unexpected delays.
All dependencies must have identified owners and resolution timelines.
Update .spec/glossary.md if you introduce new terms, channels, or artifacts.

---

*Agile Planning skill for sequencing backlog and allocating capacity with realistic timeline and dependency management.*