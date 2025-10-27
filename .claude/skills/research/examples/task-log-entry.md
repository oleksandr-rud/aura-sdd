# Task Log Entry Example

## Scenario

Project AURA-001 requires market research to validate the opportunity for a new AI-powered workflow automation feature. The product-ops agent executes the research skill to gather evidence for the go/no-go decision.

## Task File Context

**Task**: AURA-001 - AI Workflow Automation Feature
**Current State**: DRAFT
**Last Updated**: 2025-10-27

## Research Skill Execution

### Command
```bash
exec story=AURA-001 skill=research research_type=market research_questions="What is the market size for AI workflow automation?" market_scope="Enterprise SMB segment" competitive_landscape="Existing automation tools"
```

### Lifecycle Log Entry

The following entry would be added to the task's ## Lifecycle Log section:

```markdown
[TRANSITION|research] by product-ops
MODE: tolerant
FROM_STATE: DRAFT
TO_STATE: SAME
WHY:
- Market research required for feature investment decision
- AI workflow automation market opportunity needs validation
- Competitive landscape analysis needed for positioning
OUTPUT:
=== Research Summary ===
summary: Conducted comprehensive market research validating $4.2B TAM for AI workflow automation with strong growth projections and clear competitive positioning opportunities.
inputs: research_type=market research_questions=market-research-questions.md market_scope=enterprise-smb-analysis.md competitive_landscape=competitive-automation-tools.md
evidence: market_analysis|result=opportunity_validated|ref=research/ai-automation-market-analysis-2025-10-27.pdf
risks: [ ]Market data availability limitations|owner=product-ops|mitigation=expand_research_sources
next_steps: Proceed with product discovery research to validate specific customer pain points.
=== END Research Summary ===
FOLLOW-UP:
- Execute product-discovery research - owner=product-ops - due=2025-10-29
```

### Task State Update

**Task Header Update**:
```markdown
## Header
- **Domain**: Product Development
- **Status**: in_progress (research_complete)
- **Owner**: product-ops
- **Last Updated**: 2025-10-27T14:30:00Z
```

**Rolling Summary Update**:
```markdown
## Rolling Summary
**Current Status**: Market research completed, validating $4.2B TAM opportunity. Next step: product discovery research to validate customer pain points. Research findings support proceeding to PRD development phase.

**Recent Progress**:
- ✅ Market opportunity validated through comprehensive analysis
- ✅ Competitive landscape assessed with clear positioning opportunities
- 🔄 Product discovery research in progress
- ⏳ PRD development pending research completion
```

## Evidence Artifacts

The research skill generates the following evidence artifacts:

### Primary Research Report
**File**: `research/ai-automation-market-analysis-2025-10-27.pdf`
- **Content**: 15-page comprehensive market analysis
- **Sections**: Executive Summary, Methodology, Market Sizing, Competitive Analysis, Trends, Recommendations
- **Data Sources**: Gartner, Forrester, industry reports, company financials

### Supporting Data Files
- `research/market-sizing-data.xlsx` - Raw market sizing calculations
- `research/competitive-feature-matrix.xlsx` - Detailed competitive comparison
- `research/trend-analysis-data.csv` - Market trend data and projections

### Research Documentation
- `research/sources-and-methodology.md` - Complete source documentation
- `research/data-quality-validation.md` - Data validation and quality assessment
- `research/limitations-and-assumptions.md` - Research limitations documentation

## Next Steps in AURA Workflow

Based on the research findings, the workflow progresses as follows:

### 1. Product Discovery Research (Next Gate)
```bash
exec story=AURA-001 skill=research research_type=product-discovery
```
**Purpose**: Validate specific customer pain points and use cases

### 2. Product PRD Development
```bash
exec story=AURA-001 skill=product-prd
```
**Purpose**: Create detailed product requirements based on research findings

### 3. Agile Planning
```bash
exec story=AURA-001 skill=planning planning_type=agile
```
**Purpose**: Sequence development backlog and allocate resources

## Quality Gates Validation

The research skill execution satisfies the following quality gates:

- ✅ **Evidence Quality**: Market sizing validated with 3+ independent sources
- ✅ **Methodology Clarity**: Research methods documented in methodology guide
- ✅ **Insight Relevance**: Findings directly address investment decision
- ✅ **Recommendation Actionability**: Clear next steps defined with ownership
- ✅ **Documentation Completeness**: All research components documented

## Integration Benefits

This example demonstrates how the Claude Code Skills format enhances the AURA system:

### Progressive Disclosure
- **Level 1**: Skill metadata loaded at startup for discovery
- **Level 2**: Instructions loaded when research is triggered
- **Level 3**: Research files and examples accessed as needed

### Context Optimization
- Only relevant research templates loaded based on research_type
- Supporting documentation accessed only when referenced
- Large research datasets stored outside context window

### Tool Integration
- WebSearch and WebFetch tools used for external research
- FileSystem tools for managing research files
- Read tools for analyzing existing documentation

### Reproducible Process
- Standardized research methodology across all research types
- Consistent documentation and evidence requirements
- Clear audit trail for all research activities