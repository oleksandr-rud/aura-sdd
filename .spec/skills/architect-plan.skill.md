# Architect Plan Skill

architect-plan
OVERVIEW
actor: architect | mandate: Define system architecture and technical approach | bounds: No code implementation

ORIENTATION
Confirm .spec/constitution.md for current architecture and delivery guardrails.
Review .spec/glossary.md entries relevant to architecture to keep terminology aligned.
Load the architect persona brief from .spec/agents/architect.agent.md for format expectations.

LIFECYCLE TRANSITION
from: ANY ➜ to: PLANNED
ACCEPTS_FROM: []
tag: [architect-plan] (append to story ## Lifecycle Log)

WHEN TO RUN
Architecture gaps identified requiring technical direction
System design patterns need validation for implementation
Technical decisions required for development planning
NFR targets need definition and validation

REQUIRED INPUTS
story_id
requirements (business and technical requirements)
constraints (technical, business, compliance constraints)
quality_targets (performance, security, scalability NFRs)
MCP tooling: [Read, Write, WebSearch]

CONTEXT PACK
<<story.current_state>>
<<personas.active_assignments>>
<<recent_transition_log>>
<<<GLOSSARY(term=NFR)>>>

EXECUTION ALGORITHM
Validate prerequisites (requirements, constraints). If anything missing → BLOCKED format below.
Collect evidence: requirement analysis, constraint documentation, NFR specifications.
Define system architecture with clear component boundaries.
Specify technology choices with rationale and trade-offs.
Define measurable NFR targets with validation criteria.
Identify architectural risks with mitigation strategies.
Draft gate artifact using the structure in ARTIFACT OUTPUT.
Append the TRANSITION LOG entry to the story's ## Lifecycle Log, matching persona tone.
Update glossary/constitution if new terminology or workflows were introduced.

ARTIFACT OUTPUT
=== Architecture Plan ===
summary:<concise summary of architectural decisions and NFR targets>
inputs:requirements=<ref> constraints=<ref> quality_targets=<ref>
evidence:design_review|result=<approved/pending>|ref=<path_to_review>
risks:[ ]<risk_description>|owner=<persona>|mitigation=<action>
next_steps:<follow-up needed or n/a>
=== END Architecture Plan ===

TRANSITION LOG TEMPLATE
[TRANSITION|architect-plan] by architect
MODE: strict|tolerant|branch
FROM_STATE: <current_state>
TO_STATE: PLANNED
WHY:
- Architecture gaps identified requiring technical direction
- System design patterns need validation for implementation
OUTPUT:
=== Architecture Plan ===
summary:Defined system architecture with measurable NFR targets and risk assessment.
inputs:requirements=refs=prd/requirements.md constraints=docs/constraints.pdf
evidence:design_review|result=approved|ref=arch/review-2025-10-23.md
risks:[ ]Scalability under peak load not validated|owner=architect|mitigation=load_testing_plan
next_steps:Proceed with implementation using defined architecture patterns.
=== END Architecture Plan ===
FOLLOW-UP:
- Validate implementation approach - owner=tech-lead - due=2025-10-25

BLOCKED FORMAT
BLOCKED(missing_inputs=[requirements, constraints], unblock_steps=[gather_requirements, document_constraints])

GUARDRAILS
Keep entries <=120 chars per line for CLI readability.
All NFR targets must be measurable with specific validation methods.
Technology choices must include clear rationale and trade-off analysis.
Update .spec/glossary.md if you introduce new terms, channels, or artifacts.

---

*Architect Plan skill for defining system architecture and technical approach with measurable NFR targets and risk management.*