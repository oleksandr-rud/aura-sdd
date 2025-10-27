# Product Discovery Research Example

## Scenario

A product manager needs to validate whether users experience pain points with manual data entry workflows before investing in automation features.

## Execution

```bash
exec story=AUTO-001 skill=research research_type=product-discovery research_questions="Do users experience significant pain with manual data entry?" research_context="Feature investment decision for workflow automation" customer_interviews="interviews/user-feedback-jan2025.md" market_analysis="competitive/automation-solutions.md"
```

## Expected Output

```
[TRANSITION|research] by product-ops
MODE: tolerant
FROM_STATE: DRAFT
TO_STATE: PRD_READY
WHY:
- Product discovery research required for feature investment decision
- User pain point validation needed before automation development
OUTPUT:
=== Research Summary ===
summary: Validated significant user pain points with manual data entry workflows, supporting automation feature investment.
inputs: research_type=product-discovery research_questions=interviews/user-feedback-jan2025.md research_context=feature-investment-decision.md
evidence: validation_survey|result=pain_points_confirmed|ref=research/product-discovery-report-2025-10-27.pdf
risks: [ ]Market size validation uncertainty|owner=product-ops|mitigation=expand_research_segments
next_steps: Proceed with PRD development for workflow automation features.
=== END Research Summary ===
FOLLOW-UP:
- Create detailed PRD - owner=product-ops - due=2025-10-30
```

## Research Methodology

1. **Customer Interview Analysis**: Reviewed 15 user interviews focusing on data entry workflows
2. **Market Sizing**: Analyzed TAM for workflow automation solutions
3. **Competitive Analysis**: Evaluated existing automation solutions in the market
4. **Pain Point Quantification**: Measured time spent and frustration levels with manual processes

## Key Findings

- **Pain Point Validation**: 87% of users reported significant frustration with manual data entry
- **Time Impact**: Average 4.2 hours/week spent on manual data entry tasks
- **Market Opportunity**: $2.3B TAM for workflow automation solutions
- **Competitive Gap**: No current solutions address our specific use case effectively

## Recommendations

1. **Proceed with Feature Development**: Strong evidence supports automation investment
2. **Focus on Core Pain Points**: Prioritize most time-consuming manual tasks
3. **Market Differentiation**: Leverage unique use case for competitive advantage
4. **User Validation**: Continue user testing throughout development process