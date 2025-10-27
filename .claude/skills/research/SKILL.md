---
name: aura-research
description: Conduct systematic investigation and analysis across multiple domains (product-discovery, analytics, technical, market, competitive). Use when research investigations are needed for decision making, hypotheses need validation, or domain patterns require analysis.
---

# AURA Research Skill

## Segment: Identity

- **Skill ID**: research
- **Version**: 2.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (any agent)

## Segment: Purpose

### Core Purpose
Conduct systematic investigation and analysis to provide evidence-based insights and recommendations for informed decision-making across multiple research domains.

### Success Criteria
- Research questions clearly defined and answered
- Evidence collected from reliable sources
- Analysis methodology appropriate and documented
- Insights actionable and well-supported
- Recommendations evidence-based with clear next steps

### Trigger Scenarios
- **Decision Making**: Research investigations needed for critical decisions
- **Hypothesis Validation**: Hypotheses need validation with quantitative/qualitative data
- **Domain Analysis**: {{research_domain}} patterns and constraints require analysis
- **Market Intelligence**: {{research_domain}} research or competitive analysis needed
- **Best Practices**: Best practices investigation required for implementation

## Segment: Required MCPs/Tools

### MCP Dependencies
- **WebSearch**: External research and information gathering
- **WebFetch**: Access to specific web resources and documentation
- **FileSystem**: Access to research files and documentation
- **Read**: File content analysis and review

### Tool Requirements
- **Web Search**: Market research, competitive analysis, trend identification
- **Documentation Analysis**: Technical research, best practices investigation
- **Data Analysis**: Analytics research, quantitative validation
- **File Management**: Research documentation and evidence storage
- **Task-Based Organization**: Store research outputs in task-specific folders under .aura/tasks/<task_name>/
- **Reference Management**: Add references to research documents in the corresponding task file
- **Unified Index**: Maintain single index.md in task root folder pointing to research and docs

### Prerequisites
- **Story Context**: Current task state and requirements available
- **Research Questions**: Specific questions to answer clearly defined
- **Research Context**: Decision requirements or problems identified
- **Domain Inputs**: {{research_domain_inputs}} available if applicable

## Segment: Orientation

### Orientation Checks
- **Architecture Review**: Confirm ../../../.aura/constitution.md for delivery guardrails
- **Glossary Alignment**: Review ../../../.aura/glossary.md for terminology consistency
- **Persona Context**: Load {{actor}} persona from ../../../.claude/agents/{{actor}}.md
- **Research Type**: Validate research_type parameter selection

### Pre-execution Validation
- **Agent Authorization**: Verify agent has research skill authorization
- **Tool Availability**: Confirm WebSearch, WebFetch, and Read tools accessible
- **Context Loading**: Load current task state and recent transition log
- **Prerequisite Check**: Validate all required inputs are available

## Segment: Execution Algorithm

### Step-by-Step Procedure

1. **Validate Prerequisites**
   - **Purpose**: Ensure all required inputs are available
   - **Tools**: Read, FileSystem
   - **Output**: Prerequisite validation result
   - **Validation**: All required inputs present or BLOCKED format

2. **Collect Evidence**
   - **Purpose**: Gather relevant information based on research type
   - **Tools**: WebSearch, WebFetch, Read
   - **Output**: Research evidence and source documentation
   - **Validation**: Evidence from reliable sources with proper citations

3. **Execute Analysis**
   - **Purpose**: Apply appropriate analysis methodology
   - **Tools**: Domain-specific analysis tools
   - **Output**: Analysis results and insights
   - **Validation**: Analysis methods appropriate to research type

4. **Generate Insights**
   - **Purpose**: Extract actionable insights from findings
   - **Tools**: Analysis tools, documentation
   - **Output**: Actionable insights and recommendations
   - **Validation**: Insights well-supported by evidence

5. **Document Methodology**
   - **Purpose**: Document research process and evidence sources
   - **Tools**: FileSystem, Write
   - **Output**: Research methodology documentation
   - **Validation**: Methodology clear and reproducible

6. **Store Research Outputs**
   - **Purpose**: Store research documents in organized task folders
   - **Tools**: FileSystem, Write
   - **Output**: Research files in `.aura/tasks/<task_name>/research/`
   - **Validation**: Files properly organized with naming conventions

7. **Create Transition Log**
   - **Purpose**: Document research outcome in task lifecycle
   - **Tools**: Read, Write
   - **Output**: Transition log entry in task file
   - **Validation**: Log format matches persona and standards

8. **Update Task References**
   - **Purpose**: Add document references to task file
   - **Tools**: Read, Write
   - **Output**: Updated task file with research document links
   - **Validation**: All research documents referenced and accessible

9. **Update Unified Index**
   - **Purpose**: Update unified index.md with research document references
   - **Tools**: Read, Write
   - **Output**: Updated index.md with all research and docs
   - **Validation**: Index provides comprehensive navigation to all outputs

### Quality Gates
- **Evidence Quality**: All findings supported by reliable evidence
- **Methodology Clarity**: Research methods clearly documented
- **Insight Relevance**: Insights directly address research questions
- **Recommendation Actionability**: Recommendations have clear next steps
- **Documentation Completeness**: All research components documented

### Error Handling
- **Missing Evidence**: Expand research scope or adjust questions
- **Conflicting Information**: Acknowledge conflicts and seek resolution
- **Analysis Limitations**: Document limitations and assumptions
- **Tool Failures**: Use alternative research methods or sources

## Segment: Artifact Output

### Primary Outputs
- **Research Summary**: Concise findings and recommendations, stored in `.aura/tasks/<task_name>/research/`
- **Evidence Documentation**: Source materials and citations
- **Methodology Report**: Research process and methods used
- **Actionable Recommendations**: Next steps based on findings
- **Task File Updates**: References to all research documents added to corresponding task file
- **Unified Index Update**: Single index.md in task root folder updated with all research and docs

### Evidence Requirements
- **Quantitative Metrics**: Statistical validation, sample sizes, confidence intervals
- **Qualitative Evidence**: Expert opinions, case studies, qualitative analysis
- **Validation Criteria**: Research questions answered with supporting evidence

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|research] by {{actor}}
MODE: tolerant
FROM_STATE: {{current_state}}
TO_STATE: SAME
WHY:
- Research investigation required for informed decision making
- {{research_type}} analysis needed to answer critical questions
OUTPUT:
=== Research Summary ===
summary: Conducted {{research_type}} research and provided evidence-based recommendations.
inputs: research_type={{research_type}} research_questions={{questions_ref}} research_context={{context_ref}}
evidence: {{research_evidence_type}}|result=hypothesis_supported|ref=.aura/tasks/{{task_name}}/research/{{research_file}}
risks: [ ]{{research_risk}}|owner={{actor}}|mitigation={{research_mitigation}}
next_steps: Proceed with implementation using validated research findings.
=== END Research Summary ===
RESEARCH_DOCUMENTS:
- [{{research_title}}](.aura/tasks/{{task_name}}/research/{{research_file}}) - {{research_type}}
FOLLOW-UP:
- Apply research findings - owner={{actor}} - due={{follow_up_date}}
- Update task file with research document references
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[research_questions, research_context], unblock_steps=[define_questions, clarify_context])
```

## Research Templates

### Template Selection Mechanism

The research skill supports 5 research templates:

1. **Product Discovery** - Problem validation and market need confirmation
2. **Analytics** - Quantitative analysis and hypothesis validation
3. **Technical** - Feasibility studies and best practices investigation
4. **Market** - Market analysis and opportunity sizing
5. **Competitive** - Competitive analysis and positioning

### Usage Examples

#### Quick Start
```bash
# Direct template specification
exec story=PROJECT-001 skill=research research_type=analytics

# System interpretation based on questions
exec story=PROJECT-001 skill=research research_questions="validate user engagement hypothesis"
```

#### Advanced Usage
```bash
# Multi-mode research
exec story=PROJECT-001 skill=research research_type="market+competitive"

# Domain-specific research
exec story=PROJECT-001 skill=research research_type=technical research_topics="microservices architecture"
```

### Research Template Details

#### 1. Product Discovery Template
**Intended for**: product-ops agent
**When to use**: Problem validation, market need confirmation, customer pain point analysis
**Additional Required Inputs**: customer_interviews, market_analysis, stakeholder_requirements
**Evidence Type**: validation_survey with quantitative evidence

#### 2. Analytics Template
**Intended for**: Any agent with data-driven questions
**When to use**: Hypothesis validation, metrics analysis, quantitative insights
**Additional Required Inputs**: data_sources, analysis_requirements
**Evidence Type**: data_analysis with statistical validation

#### 3. Technical Template
**Intended for**: architect, tech-lead agents
**When to use**: Technology evaluation, feasibility studies, best practices
**Additional Required Inputs**: research_topics, technical_constraints
**Evidence Type**: findings with technical documentation

#### 4. Market Template
**Intended for**: product-ops agent
**When to use**: Market analysis, opportunity sizing, trend identification
**Additional Required Inputs**: market_scope, competitive_landscape
**Evidence Type**: market_analysis with trend identification

#### 5. Competitive Template
**Intended for**: product-ops, architect agents
**When to use**: Competitive analysis, positioning, differentiation
**Additional Required Inputs**: competitor_list, analysis_criteria
**Evidence Type**: competitive_analysis with feature comparison

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - System architecture and workflow
- [AURA Glossary](../../../.aura/glossary.md) - Terminology and definitions
- [Agent Specifications](../../../../../../.claude/agents/) - Agent-specific guidance
- [Research Examples](../examples/) - Additional research skill examples

## File Organization & Naming Conventions

### Directory Structure
```
.aura/tasks/
├── <task_name>/
│   ├── <task_name>.md              # Main task file
│   ├── index.md                   # Unified index pointing to research and docs
│   ├── research/                   # All research outputs
│   │   ├── YYYY-MM-DD-research-type.md  # Individual research documents
│   │   ├── evidence/              # Source materials, screenshots, data
│   │   └── assets/                # Research diagrams, charts, etc.
│   └── docs/                      # Technical writing outputs
```

### Naming Conventions
- **Research Files**: `YYYY-MM-DD-research-type.md` (e.g., `2025-10-27-market-analysis.md`)
- **Unified Index**: Always named `index.md` in task root folder
- **Evidence Files**: Organized by type in `evidence/` subfolder
- **Asset Files**: Descriptive names with dates (e.g., `2025-10-27-competitive-matrix.png`)
- **Task References**: Use relative paths from task file (e.g., `./research/2025-10-27-market-analysis.md`)

### Task File Integration
- Add `## Research Documents` section to task files
- Include research document references with clickable markdown links
- Update research status in task lifecycle logs
- Maintain research metadata in task file for tracking

### Unified Index Template
The task's `index.md` should include:
- Overview of task purpose and current status
- **Research Documents** section with links to all research outputs
- **Technical Documents** section with links to all docs
- **Quick Navigation** with status indicators and creation dates
- **Document Summary** with brief descriptions of each document's purpose
- Cross-references between related research and writing documents

### Evidence Management
- Store all source materials, screenshots, and data files in `evidence/` subfolder
- Maintain evidence log with source URLs and access dates
- Organize evidence by research project or question
- Include evidence quality assessment and reliability ratings

## Guardrails

- Keep entries <=120 characters per line for CLI readability
- All findings must be supported by evidence and appropriate citations
- Research methodology must be clearly documented and reproducible
- Limitations and assumptions must be explicitly stated
- Conflicting information must be acknowledged and resolved
- Update glossary if new terminology is introduced
- Always store research outputs in task-specific folders with proper references
- Research naming must follow established conventions for consistency
- Evidence sources must be properly documented and accessible

---

*AURA Research skill supporting multiple research methodologies with template-driven execution and progressive disclosure capabilities.*