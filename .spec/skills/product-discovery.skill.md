# Product Discovery Skill

product-discovery
OVERVIEW
actor: product-ops | mandate: Validate problem and market need | bounds: No technical architecture decisions

ORIENTATION
Confirm .spec/constitution.md for current architecture and delivery guardrails.
Review .spec/glossary.md entries relevant to product discovery to keep terminology aligned.
Load the product-ops persona brief from .spec/agents/product-ops.agent.md for format expectations.

LIFECYCLE TRANSITION
from: DRAFT ➜ to: PRD_READY
ACCEPTS_FROM: []
tag: [product.discovery] (append to story ## Lifecycle Log)

WHEN TO RUN
New initiative requires problem validation
Market gap needs confirmation with evidence
Customer pain points need quantification
Stakeholder alignment on problem statement required

REQUIRED INPUTS
story_id
customer_interviews (notes, recordings, transcripts)
market_analysis (competitive landscape, market sizing)
stakeholder_requirements (initial stakeholder inputs)
MCP tooling: [WebSearch, WebFetch]

CONTEXT PACK
<<story.current_state>>
<<personas.active_assignments>>
<<recent_transition_log>>
<<<GLOSSARY(term=problem_validation)>>>

EXECUTION ALGORITHM
Validate prerequisites (customer_interviews, market_analysis). If anything missing → BLOCKED format below.
Collect evidence: customer interviews, market research, competitive analysis.
Validate problem statement with quantitative evidence.
Assess market size and viability.
Document customer pain points with supporting data.
Draft gate artifact using the structure in ARTIFACT OUTPUT.
Append the TRANSITION LOG entry to the story's ## Lifecycle Log, matching persona tone.
Update glossary/constitution if new terminology or workflows were introduced.

ARTIFACT OUTPUT
=== Discovery Summary ===
summary:<concise summary of problem validation findings>
inputs:customer_interviews=<ref> market_analysis=<ref> stakeholder_inputs=<ref>
evidence:validation_survey|result=<pass/fail_percentage>|ref=<path_to_data>
risks:[ ]<risk_description>|owner=<persona>|mitigation=<action>
next_steps:<follow-up needed or n/a>
=== END Discovery Summary ===

TRANSITION LOG TEMPLATE
[TRANSITION|product.discovery] by product-ops
MODE: strict|tolerant|branch
FROM_STATE: DRAFT
TO_STATE: PRD_READY
WHY:
- Problem statement requires validation with market research
- Customer pain points need confirmation and quantification
OUTPUT:
=== Discovery Summary ===
summary:Validated customer pain via support tickets and confirmed market gap.
inputs:customer_interviews=refs=interviews/2025-10-23.md market_analysis=reports/competitive-landscape.pdf
evidence:validation_survey|result=85%_confirmed_need|ref=surveys/discovery-2025-10-23.csv
risks:[ ]Market size smaller than estimated|owner=product-ops|mitigation=expand_research_segments
next_steps:Capture detailed PRD requirements with acceptance criteria.
=== END Discovery Summary ===
FOLLOW-UP:
- Schedule stakeholder review - owner=product-ops - due=2025-10-25

BLOCKED FORMAT
BLOCKED(missing_inputs=[customer_interviews, market_analysis], unblock_steps=[conduct_interviews, perform_analysis])

GUARDRAILS
Keep entries <=120 chars per line for CLI readability.
Escalate scope gaps through stakeholder review before proceeding.
Validate problem statement with at least 3 different customer sources.
Update .spec/glossary.md if you introduce new terms, channels, or artifacts.

---

*Product Discovery skill for validating problem statements and market need with customer evidence and quantitative validation.*