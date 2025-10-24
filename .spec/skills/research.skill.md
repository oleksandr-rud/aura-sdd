# Research Skill

research
OVERVIEW
actor: product-ops|architect|tech-lead|qa | mandate: Conduct systematic investigation and analysis | bounds: Research and analysis only

ORIENTATION
Confirm .spec/constitution.md for current architecture and delivery guardrails.
Review .spec/glossary.md entries relevant to research to keep terminology aligned.
Load the relevant persona brief from .spec/agents/<persona>.agent.md for format expectations.

LIFECYCLE TRANSITION
from: ANY ➜ to: SAME
ACCEPTS_FROM: []
tag: [research] (append to story ## Lifecycle Log)

WHEN TO RUN
Research investigations needed for decision making
Hypotheses need validation with quantitative/qualitative data
Technical patterns and constraints require analysis
Market research or competitive analysis needed
Best practices investigation required for implementation

REQUIRED INPUTS
story_id
research_type (analytics/technical/market/competitive)
research_questions (specific questions to answer)
research_context (decision requirements or problems)
data_sources (available data and analytics - for analytics research)
research_topics (specific areas to investigate - for technical research)
MCP tooling: [WebSearch, WebFetch, Read]

CONTEXT PACK
<<story.current_state>>
<<personas.active_assignments>>
<<recent_transition_log>>
<<<GLOSSARY(term=research)>>>

EXECUTION ALGORITHM
Validate prerequisites (research_type, research_questions, research_context). If anything missing → BLOCKED format below.
Collect evidence based on research type:
  Analytics: data sources, analytics reports, metrics
  Technical: documentation, specifications, case studies
  Market: market reports, competitive analysis, trends
  Competitive: competitor products, positioning, analysis
Execute analysis methodology appropriate to research type:
  Analytics: Statistical analysis, hypothesis testing, data validation
  Technical: Pattern analysis, constraint evaluation, feasibility assessment
  Market: Trend analysis, opportunity sizing, gap identification
  Competitive: Feature comparison, positioning analysis, SWOT assessment
Generate insights and recommendations based on findings.
Document research methodology and evidence sources.
Provide actionable recommendations for decision-making.
Draft gate artifact using the structure in ARTIFACT OUTPUT.
Append the TRANSITION LOG entry to the story's ## Lifecycle Log, matching persona tone.
Update glossary/constitution if new terminology or workflows were introduced.

ARTIFACT OUTPUT
=== Research Summary ===
summary:<concise summary of research findings and recommendations>
inputs:research_type=<type> research_questions=<ref> research_context=<ref>
evidence:<analysis_type>|result=<validated/supported/identified>|ref=<path_to_research>
risks:[ ]<risk_description>|owner=<persona>|mitigation=<action>
next_steps:<follow-up needed or n/a>
=== END Research Summary ===

TRANSITION LOG TEMPLATE
[TRANSITION|research] by <persona>
MODE: tolerant
FROM_STATE: <current_state>
TO_STATE: SAME
WHY:
- Research investigation required for informed decision making
- <research_type> analysis needed to answer critical questions
OUTPUT:
=== Research Summary ===
summary:Conducted <research_type> research and provided evidence-based recommendations.
inputs:research_type=analytics research_questions=docs/questions.md research_context=decision-context.pdf
evidence:customer_analysis|result=hypothesis_supported|ref=research/analytics-report-2025-10-23.pdf
risks:[ ]Data quality limitations|owner=product-ops|mitigation=additional_data_collection
next_steps:Proceed with implementation using validated research findings.
=== END Research Summary ===
FOLLOW-UP:
- Apply research findings - owner=<persona> - due=2025-10-26

BLOCKED FORMAT
BLOCKED(missing_inputs=[research_questions, research_context], unblock_steps=[define_questions, clarify_context])

GUARDRAILS
Keep entries <=120 chars per line for CLI readability.
All findings must be supported by evidence and appropriate citations.
Research methodology must be clearly documented and reproducible.
Limitations and assumptions must be explicitly stated.
Data sources must be clearly identified and validated (for analytics research).
Conflicting information must be acknowledged and resolved.
Update .spec/glossary.md if you introduce new terms, channels, or artifacts.

RESEARCH MODES

### Analytics Research Mode
- **Purpose**: Validate hypotheses and metrics with quantitative data
- **Required Additional Inputs**: data_sources, analysis_requirements
- **Evidence Type**: data_analysis with statistical validation
- **Output Focus**: Quantitative insights, metrics validation, hypothesis testing

### Technical Research Mode
- **Purpose**: Investigate patterns and technical constraints
- **Required Additional Inputs**: research_topics, technical_constraints
- **Evidence Type**: findings with technical documentation
- **Output Focus**: Technical patterns, constraints, feasibility assessment

### Market Research Mode
- **Purpose**: Analyze market trends and opportunities
- **Required Additional Inputs**: market_scope, competitive_landscape
- **Evidence Type**: market_analysis with trend identification
- **Output Focus**: Market insights, opportunity sizing, trend analysis

### Competitive Research Mode
- **Purpose**: Analyze competitive landscape and positioning
- **Required Additional Inputs**: competitor_list, analysis_criteria
- **Evidence Type**: competitive_analysis with feature comparison
- **Output Focus**: Competitive insights, positioning, differentiation opportunities

---

*Unified Research skill for systematic investigation across analytics, technical, market, and competitive research domains.*