# Claude AI Assistant Guide for Spec Gen

## Overview

This guide serves as the comprehensive manual for Claude AI assistants working with the Spec Gen Workflow System. It provides the necessary context, workflows, and guidelines to effectively assist with development, architecture, product management, and quality assurance tasks.

## Quick Start

### For Claude AI Assistants
1. **Load Context**: From the project root, familiarize yourself with the `.spec/` directory structure
2. **Agent Activation**: Use activation phrases to assume specific agent roles:
   - `As architect orchestrator, scope task SPEC-001`
   - `As product ops orchestrator, run product cycle for SPEC-002`
   - `As tech lead orchestrator, execute implementation for SPEC-003`
   - `As qa orchestrator, validate quality for SPEC-004`
3. **Task Management**: Record task IDs and maintain Rolling Summaries
4. **Context Reset**: Archive conclusions in Activity Log when switching tasks

### 🆕 **Unified Skills System**
The skill system has been reorganized into unified skills with multiple templates:

#### **Unified Planning Skill**
- **File**: `.spec/skills/planning.skill.md`
- **Templates**: 4 integrated planning templates
  - **Agile Planning** (product-ops) - Backlog sequencing and capacity allocation
  - **Architect Planning** (architect) - System architecture and technical decisions
  - **Testing Planning** (qa) - Test strategy and environment planning
  - **Implementation Planning** (tech-lead) - Technical implementation coordination

#### **Unified Research Skill**
- **File**: `.spec/skills/research.skill.md`
- **Templates**: 5 integrated research templates
  - **Product Discovery** (product-ops) - Problem validation and market need confirmation
  - **Analytics Research** - Quantitative analysis and hypothesis validation
  - **Technical Research** - Feasibility studies and best practices
  - **Market Research** - Market analysis and opportunity sizing
  - **Competitive Research** - Competitive analysis and positioning

#### **Template Selection Mechanism**
- **Intent Interpretation**: System automatically determines appropriate template based on:
  - Agent role and context
  - Available inputs and keywords
  - Current state and domain clues
- **Parameter Override**: Agents can specify exact template: `exec story=<ID> skill=planning planning_type=agile`
- **Cross-Agent Flexibility**: Any agent can use any template with appropriate parameters

### Project Structure
```
.spec/
├── agents/          # Agent specifications and workflows
├── skills/          # Unified skills with multiple templates
│   ├── planning.skill.md      # 4 planning templates (agile, architect, testing, implementation)
│   ├── research.skill.md      # 5 research templates (product-discovery, analytics, technical, market, competitive)
│   └── [other specialized skills...]
├── tasks/           # Single-file task packages (PROJECT-XXX.md)
├── templates/       # Consolidated templates (5 main files)
│   ├── constitution.template.md
│   ├── agent.template.md
│   ├── skill.template.md
│   ├── glossary.template.md
│   └── task-template.md
├── glossary.md      # Domain vocabulary and terminology
├── register.json    # Skill and concept registry
└── constitution.md   # Spec Workflow Gateway Protocol
```


### Implementation Guidelines
- **File References**: Use `ref=<path>` format instead of including code
- **Template Usage**: Follow established templates for consistency
- **Documentation Standards**: Maintain clear, comprehensive documentation

## Core Concepts

### Spec Workflow Transition Mechanism
- **Principle**: Orient → Scope → Execute → Gate sequence governs all persona deliverables
- **Benefit**: Consistent workflow, auditability, and structured handoffs
- **Implementation**: Use prescribed gate order with structured transition logging

### Task Package Structure
Each task follows the `PROJECT-XXX` naming convention and contains:
- **Header**: Domain, Status, Owner, Last Updated
- **Product Brief**: Problem, Goals, Success Metrics, Constraints, Attached Context
- **Lifecycle Log**: Centralized story log with structured transition entries

### Context Management
- **Lifecycle Log**: Centralized log capturing all transition metadata with proper tag formatting
- **Context Snapshot**: Skill to capture current status before/after handoffs or stalls
- **BLOCKED Protocol**: Format for missing prerequisites with resolution steps
- **Transition Modes**: strict, tolerant, or branch execution modes

### Gate Order (Prescribed Sequence)
1. **product.discovery** → Validate problem and market need (via `research research_type=product-discovery`)
2. **product.prd** → Capture requirements and acceptance criteria
3. **agile.planning** → Sequence backlog and allocate capacity (via `planning planning_type=agile`)
4. **code.implement** → Build feature with automated tests
5. **code.review** → Verify code quality and architecture compliance
6. **qa.ready** → Prepare test environment and fixtures
7. **qa.contract** → Validate API/event contracts
8. **qa.e2e** → Verify end-to-end user journeys
9. **pm.sync** → Update stakeholders and close story

#### **Supporting Skills Integration**
- **Planning Templates**: Available throughout workflow for domain-specific planning
- **Research Templates**: Available throughout workflow for investigation and analysis
- **Context Management**: `context.snapshot` skill for handoffs and status capture

## Agent System

### Agent Directory

| Agent | ID | Activation Phrase | Primary Focus |
|-------|----|-------------------|---------------|
| Architect | `architect` | `As architect, …` | Architecture decisions, NFR targets, risk assessment |
| Product Ops | `product-ops` | `As product ops, …` | Task file ownership, product framing, stakeholder communication |
| Tech Lead | `tech-lead` | `As tech lead, …` | Engineering execution, code reviews, technical coordination |
| QA | `qa` | `As qa, …` | Quality assurance, testing coordination, Go/No-Go decisions |

### Agent Responsibilities

#### Architect
- **Location**: `.spec/agents/architect.agent.md`
- **Core Focus**: Architecture decisions, non-functional requirements, risk mitigation
- **Key Skills**:
  - `planning planning_type=architect` - Define system architecture and technical approach
  - `research research_type=technical` - Conduct systematic investigation and analysis
  - `context.snapshot` - Capture architectural status and manage log organization
- **Output Location**: Lifecycle Log with transition entries
- **Quick Commands**: `exec story=<ID> skill=planning planning_type=architect mode=strict`

#### Product Ops
- **Location**: `.spec/agents/product-ops.agent.md`
- **Core Focus**: Task file ownership, product lifecycle, stakeholder communication
- **Key Skills**:
  - `research research_type=product-discovery` - Validate problem and market need
  - `product-prd` - Capture requirements and acceptance criteria
  - `planning planning_type=agile` - Sequence backlog and allocate capacity
  - `pm-sync` - Update stakeholders and close story
  - `research` - Conduct systematic investigation and analysis (specify research_type)
  - `context.snapshot` - Capture product status and manage log organization
- **Output Location**: Lifecycle Log with transition entries
- **Quick Commands**: `exec story=<ID> skill=research research_type=product-discovery mode=strict`

#### Tech Lead
- **Location**: `.spec/agents/tech-lead.agent.md`
- **Core Focus**: Engineering execution, code quality, technical coordination
- **Key Skills**:
  - `code-implement` - Build feature with automated tests
  - `code-review` - Verify code quality and architecture compliance
  - `planning planning_type=implementation` - Coordinate technical implementation
  - `research research_type=technical` - Conduct systematic investigation and analysis
  - `qa-contract` - Verify API/event contracts
  - `context.snapshot` - Capture technical status and manage log organization
- **Output Location**: Lifecycle Log with transition entries
- **Quick Commands**: `exec story=<ID> skill=planning planning_type=implementation mode=strict`

#### QA
- **Location**: `.spec/agents/qa.agent.md`
- **Core Focus**: Quality assurance, testing strategy, validation
- **Key Skills**:
  - `qa-ready` - Prepare test environment and fixtures
  - `qa-contract` - Validate API/event contracts
  - `qa-e2e` - Verify end-to-end user journeys
  - `planning planning_type=testing` - Design testing strategy
  - `research research_type=analytics` - Conduct systematic investigation and analysis
  - `code-review` - Verify code quality standards
  - `context.snapshot` - Capture quality status and manage log organization
- **Output Location**: Lifecycle Log with transition entries
- **Quick Commands**: `exec story=<ID> skill=planning planning_type=testing mode=strict`

## Skill System

### Skill Surface (Routes)

#### **Unified Skills**
| Skill | Templates | Usage Examples | Output Location |
|-------|-----------|----------------|-----------------|
| `planning` | 4 templates (agile, architect, testing, implementation) | `exec story=<ID> skill=planning planning_type=agile` | Lifecycle Log |
| `research` | 5 templates (product-discovery, analytics, technical, market, competitive) | `exec story=<ID> skill=research research_type=product-discovery` | Lifecycle Log |

#### **Gate Transition Skills** (Specialized)
| Skill | Gate Transition | Typical Owner | Output Location |
|-------|----------------|---------------|-----------------|
| `product-prd` | Capture requirements and acceptance criteria | Product Ops | Lifecycle Log |
| `code-implement` | Build feature with automated tests | Tech Lead | Lifecycle Log |
| `code-review` | Verify code quality and architecture compliance | Tech Lead | Lifecycle Log |
| `qa-ready` | Prepare test environment and fixtures | QA | Lifecycle Log |
| `qa-contract` | Validate API/event contracts | QA | Lifecycle Log |
| `qa-e2e` | Verify end-to-end user journeys | QA | Lifecycle Log |
| `pm-sync` | Update stakeholders and close story | Product Ops | Lifecycle Log |
| `context-snapshot` | Capture status before/after handoffs | Any agent | Lifecycle Log |

#### **Template Selection Examples**
```bash
# Planning Templates
exec story=<ID> skill=planning planning_type=agile        # Product Ops: backlog sequencing
exec story=<ID> skill=planning planning_type=architect     # Architect: system architecture
exec story=<ID> skill=planning planning_type=testing       # QA: test strategy
exec story=<ID> skill=planning planning_type=implementation # Tech Lead: implementation coordination

# Research Templates
exec story=<ID> skill=research research_type=product-discovery # Product Ops: problem validation
exec story=<ID> skill=research research_type=analytics         # Any agent: quantitative analysis
exec story=<ID> skill=research research_type=technical         # Architect/Tech Lead: feasibility studies
exec story=<ID> skill=research research_type=market            # Product Ops: market analysis
exec story=<ID> skill=research research_type=competitive       # Product Ops/Architect: competitive analysis

# Intent Interpretation (automatic template selection)
exec story=<ID> skill=planning  # System determines template based on agent and context
exec story=<ID> skill=research  # System determines template based on questions and inputs
```

### Skill Execution Pattern
1. **Load Context**: Understand task state and requirements
2. **Template Selection**: System interprets intent or uses specified parameters
3. **Execute SOP**: Follow standardized procedure from selected template
4. **Embed Evidence**: Include all results, metrics, and decisions in task file
5. **Update Status**: Modify Rolling Summary and add Activity Log entry
6. **Handoff**: Flag next actions and responsible agents

#### **Template Selection Process**
1. **Parameter Specification**: Direct template selection with `planning_type` or `research_type`
2. **Intent Interpretation**: System analyzes:
   - Agent role and current state
   - Available inputs and keywords
   - Question context and domain clues
3. **Template Loading**: System loads appropriate template with variable substitution
4. **Context Validation**: Verify prerequisites and template applicability

## Workflow Patterns

### Task Lifecycle
1. **Initiation**: Product Ops creates task with Product Brief
2. **Architecture**: Architect provides technical direction and NFRs
3. **Planning**: Tech Lead creates execution plan and milestones
4. **Implementation**: Tech Lead coordinates development and testing
5. **Validation**: QA ensures quality standards are met
6. **Completion**: Product Ops validates delivery and updates stakeholders

### Agent Handoffs
- **Clear Transition**: Explicit handoff statements in Rolling Summary
- **Context Preservation**: Complete state information in task file
- **Next Actions**: Clear ownership and next steps defined
- **Status Updates**: Current status and blocking issues highlighted

### Quality Gates
- **Product Brief Complete**: All sections filled with SMART goals
- **Architecture Approved**: Technical approach validated and documented
- **Implementation Ready**: Code reviewed and tests passing
- **Testing Complete**: All test levels executed with evidence
- **Delivery Validated**: KPIs met and stakeholders informed

## File Management

### Task Files
- **Format**: `.spec/tasks/PROJECT-XXX.md`
- **Structure**: Follow task template with all required sections
- **Updates**: Single file approach - all modifications in one place
- **Version Control**: Git tracking with clear commit messages

### Skill Files
- **Format**: `.spec/skills/skill-name.skill.md`
- **Structure**: SOP format with Purpose, Target Agent, Trigger Scenarios, Required MCPs/Tools, Core Procedure
- **Updates**: Template-based with parameterization for flexibility

### Agent Files
- **Format**: `.spec/agents/agent-name.agent.md`
- **Structure**: Comprehensive agent specification with skills, workflows, quality standards
- **Updates**: Maintain consistency across agent ecosystem

## Communication Standards

### Lifecycle Log Format
```
[TRANSITION|<gate.tag>] by <persona>
MODE: strict|tolerant|branch
FROM_STATE: <current_state>
TO_STATE: <target_state>
WHY:
- <concise bullet 1>
- <concise bullet 2>
OUTPUT:
=== <GATE_NAME> ===
summary: <concise summary>
inputs: <key references or n/a>
evidence: |result=<pass/fail>|ref=<artifact_path>
risks: [ ]|owner=<persona>|mitigation=<action>
next_steps: <follow-up needed or n/a>
=== END <GATE_NAME> ===
FOLLOW-UP:
- owner=<persona> - due=<date>
```

### BLOCKED Format
```
BLOCKED(missing_inputs=[prerequisite1, prerequisite2], unblock_steps=[step1, step2])
```

### Status Updates
- **Header Status**: Update task status (draft, in_progress, blocked, done)
- **Transition Modes**: Use strict, tolerant, or branch modes as appropriate
- **CLI Readability**: Keep entries ≤120 chars per line for command line compatibility

## Quality Standards

### Documentation Quality
- **Completeness**: All sections filled with accurate, relevant information
- **Clarity**: Clear, concise language with minimal ambiguity
- **Evidence**: All claims supported by data and embedded evidence
- **Consistency**: Follow established templates and formatting guidelines

### Technical Quality
- **Code Standards**: Follow language-specific best practices and Biome linting rules
- **Test Coverage**: Meet defined coverage thresholds
- **Security**: Implement security-by-design principles
- **Performance**: Meet defined performance targets
- **Code Quality**: All code must comply with Biome linting and formatting standards per constitution

### Process Quality
- **Traceability**: Complete audit trail of all decisions and actions
- **Accountability**: Clear ownership and responsibility assignment
- **Communication**: Timely, accurate, and relevant updates
- **Continuous Improvement**: Learn from experience and refine processes

## Tools and Integration

### Required Tools
- **Git**: Version control and collaboration
- **Text Editor/IDE**: For editing specification files
- **Markdown Viewer**: For reviewing documentation
- **Node.js**: Optional, for validation scripts (>=20.10.0)
- **Biome**: Code linting, formatting, and quality checks (for generated code)

### MCP Integration
- **Context Management**: Maintain conversation context across sessions
- **Tool Usage**: Leverage available tools for file operations, web access, etc.
- **Skill Execution**: Use skill system for standardized procedures
- **Agent Coordination**: Facilitate multi-agent collaboration

## Best Practices

### For Claude AI Assistants
1. **Understand Context**: Always load and understand current task state before acting
2. **Follow SOPs**: Use skill system for standardized procedures
3. **Embed Evidence**: Include all results and decisions in task files
4. **Communicate Clearly**: Use established formats for status updates
5. **Maintain Audit Trail**: Never modify existing Activity Log entries

### For Task Management
1. **Single File Approach**: Keep all task information in one file
2. **Rolling Summaries**: Update context continuously
3. **Quality Gates**: Ensure each phase meets standards before proceeding
4. **Evidence Collection**: Gather quantitative data throughout process
5. **Stakeholder Communication**: Keep all parties informed of progress

### For Code Quality
1. **Review Process**: All code must be reviewed before integration
2. **Test Coverage**: Meet or exceed coverage thresholds
3. **Security First**: Implement security measures from the beginning
4. **Performance Awareness**: Consider performance implications
5. **Documentation**: Maintain clear, accurate documentation
6. **Code Standards**: All code must comply with Biome linting and formatting requirements
7. **Linting**: Run Biome before committing to ensure code quality standards are met

## Troubleshooting

### Common Issues
- **Context Loss**: Use Rolling Summary and Activity Log to recover state
- **Missing Information**: Check task file and related documentation
- **Tool Failures**: Verify tool availability and permissions
- **Agent Confusion**: Clear role definition and activation phrases
- **File Conflicts**: Use git status and resolve conflicts systematically

### Escalation Procedures
1. **Document Issue**: Add detailed description to task file
2. **Flag Blocker**: Update Rolling Summary with clear blocking issue
3. **Assign Owner**: Identify responsible agent for resolution
4. **Set Timeline**: Define expected resolution time
5. **Follow Up**: Monitor progress and provide support

## Continuous Improvement

### Learning Collection
- **Success Patterns**: Document effective approaches and outcomes
- **Failure Analysis**: Analyze issues and prevention strategies
- **Process Refinement**: Update templates and SOPs based on experience
- **Tool Enhancement**: Identify and implement tool improvements

### Template Evolution
- **Usage Patterns**: Adapt based on actual task execution
- **Agent Feedback**: Incorporate improvements from AI assistant experience
- **Quality Metrics**: Refine based on success rates and quality measures
- **New Capabilities**: Integrate new tools and techniques

## Appendix

### Template Files
- **Task Template**: `.spec/templates/task-template.md` - Single-file task package with Lifecycle Log
- **Constitution Template**: `.spec/templates/constitution.template.md` - Complete State Machine workflow with 8 segments
- **Agent Template**: `.spec/templates/agent.template.md` - Agent specifications with transition mechanisms and specializations
- **Skill Template**: `.spec/templates/skill.template.md` - Skill specifications with orientation, execution, and validation procedures
- **Glossary Template**: `.spec/templates/glossary.template.md` - Comprehensive terminology definitions with cross-references

### 🆕 **State Machine Template Features**

#### **Constitution Template**
- **8 Segments**: Complete coverage from Header to Context Management
- **Markdown Headers**: Clean `## Segment:` organization format
- **Gate Sequence**: Prescribed 9-step workflow from product.discovery to pm.sync
- **Persona Responsibilities**: Defined roles for architect, product-ops, tech-lead, qa
- **Quality Standards**: Built-in compliance and validation requirements
- **Infrastructure Integration**: MCP tools and registry coordination

#### **Agent Template**
- **Agent Specifications**: Complete agent definitions with mandates and bounds
- **State Machine Compliance**: Orientation checks and transition protocols
- **BLOCKED Protocol**: Structured escalation for missing prerequisites
- **Specialization Patterns**: Architect, Product Ops, Tech Lead, QA patterns
- **Quality Standards**: Documentation and execution standards
- **Integration Guidelines**: Registry coordination and skill execution flow

#### **Skill Template**
- **Skill Specifications**: Complete skill definitions with purpose and execution
- **Orientation Procedures**: Pre-execution validation and context loading
- **Execution Algorithms**: Step-by-step procedures with quality gates
- **Evidence Requirements**: Quantitative metrics and validation criteria
- **Specialization Patterns**: Gate transitions and supporting skills
- **Integration Guidelines**: MCP tools and registry coordination

#### **Glossary Template**
- **Comprehensive Terminology**: Complete State Machine and workflow terminology
- **7 Segments**: Header, State Machine Terms, Agent & Workflow Terms, Quality & Compliance, Technical Infrastructure, Template Variables, Usage Examples
- **Cross-Reference System**: Internal linking between related concepts
- **Quality Standards**: Definition clarity, accuracy, completeness requirements
- **Integration Guidelines**: Registry, template system, and usage coordination
- **Maintenance Framework**: Update processes and evolution management

#### **Template Usage**
- **Variable System**: Handlebars syntax for dynamic content
- **CLI Readability**: ≤120 characters per line constraint
- **Quality Validation**: Built-in checklists and testing procedures
- **Documentation Standards**: Evidence embedding and transition logging

### Registry and Glossary
- **Skill Registry**: `.spec/register.json`
- **Glossary**: `.spec/glossary.md`
- **Configuration**: `.spec/config.json` (if exists)

### Example Tasks
- **Reference**: Check `.spec/templates/task-template.md` for task structure examples

## Support and Contact

### Getting Help
- **Documentation**: Refer to this guide and template files
- **Templates**: Use established templates for consistency
- **Examples**: Review completed tasks for patterns
- **Glossary**: Check terminology in `.spec/glossary.md`

### Contributing
- **Improvements**: Suggest enhancements to templates and processes
- **Bug Reports**: Document issues in task files with clear descriptions
- **New Patterns**: Share effective approaches and techniques
- **Feedback**: Provide constructive feedback for continuous improvement

---

*This guide is a living document, continuously updated based on experience and feedback. Last updated: 2025-10-24T19:00:00+03:00*