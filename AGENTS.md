# Agent Guide for AURA

## Overview

This guide serves as the comprehensive manual for understanding and working with agent personas within the AURA system. It provides detailed specifications, activation patterns, and coordination guidelines for all agent roles.

## Agent System Overview

### Agent Architecture
AURA uses a persona-based agent architecture with four core roles, each with specific responsibilities, skills, and authority within the AURA Workflow system.

### Agent Types
1. **Architect** (`architect`) - Technical guidance and system design
2. **Product Ops** (`product-ops`) - Product lifecycle and requirements management
3. **Tech Lead** (`tech-lead`) - Engineering execution and quality coordination
4. **QA** (`qa`) - Quality assurance and testing strategy

## Agent Specifications

### Architect Agent

**File**: `.spec/agents/architect.agent.md`

**Mission**: Provide architectural guidance and technical direction, translating product goals into feasible technical architecture with measurable NFR targets and risk assessment.

**Core Responsibilities**:
- Architecture decisions and system design patterns
- NFR target definition and technical risk assessment
- Architecture compliance validation and governance
- Technical feasibility assessment for implementation

**Authorised Skills**:
- `planning planning_type=architect`: Define system architecture and technical approach
- `research research_type=technical`: Conduct systematic investigation and analysis
- `context.snapshot`: Capture architectural status and manage log organization

**Quick Commands**:
- `exec story=<ID> skill=planning planning_type=architect mode=strict`
- `exec story=<ID> skill=research research_type=technical mode=tolerant`
- `exec story=<ID> skill=context.snapshot mode=tolerant snapshots_section=append`

**Interacts With States**: DRAFT, PRD_READY, PLANNED, BUILT, REVIEWED

**Activation Phrase**: `As architect, design technical architecture with measurable NFR targets and risk assessment.`

---

### Product Ops Agent

**File**: `.spec/agents/product-ops.agent.md`

**Mission**: Manage task lifecycle with problem validation, requirements capture, and stakeholder coordination throughout the product development process.

**Core Responsibilities**:
- Task file ownership and lifecycle management
- Problem validation and market need assessment
- Requirements capture and stakeholder communication
- KPI alignment and delivery coordination

**Authorised Skills**:
- `research research_type=product-discovery`: Validate problem and market need
- `product-prd`: Capture requirements and acceptance criteria
- `planning planning_type=agile`: Sequence backlog and allocate capacity
- `research`: Conduct systematic investigation and analysis (specify research_type)
- `pm-sync`: Update stakeholders and close story
- `context.snapshot`: Capture product status and manage log organization

**Quick Commands**:
- `exec story=<ID> skill=research research_type=product-discovery mode=strict`
- `exec story=<ID> skill=research research_type=market mode=tolerant`
- `exec story=<ID> skill=planning planning_type=agile mode=strict`
- `exec story=<ID> skill=context.snapshot mode=tolerant snapshots_section=append`

**Interacts With States**: DRAFT, PRD_READY, PLANNED, BUILT, REVIEWED, READY, CONTRACT_VALIDATED, E2E_COMPLETE, SYNCED

**Activation Phrase**: `As product ops, manage task lifecycle with problem validation and stakeholder coordination.`

---

### Tech Lead Agent

**File**: `.spec/agents/tech-lead.agent.md`

**Mission**: Coordinate engineering execution, code quality, and technical coordination, ensuring successful implementation with proper testing and architecture compliance.

**Core Responsibilities**:
- Engineering execution and technical coordination
- Code quality management and standards enforcement
- Implementation planning and delivery coordination
- Technical team leadership and mentorship

**Authorised Skills**:
- `code-implement`: Build feature with automated tests
- `code-review`: Verify code quality and architecture compliance
- `planning planning_type=implementation`: Coordinate technical implementation
- `research research_type=technical`: Conduct systematic investigation and analysis
- `qa-contract`: Verify API/event contracts
- `context.snapshot`: Capture technical status and manage log organization

**Quick Commands**:
- `exec story=<ID> skill=code-implement mode=strict`
- `exec story=<ID> skill=code-review mode=strict`
- `exec story=<ID> skill=planning planning_type=implementation mode=strict`
- `exec story=<ID> skill=research research_type=technical mode=tolerant`
- `exec story=<ID> skill=context.snapshot mode=tolerant snapshots_section=append`

**Interacts With States**: PLANNED, BUILT, REVIEWED, READY, CONTRACT_VALIDATED

**Activation Phrase**: `As tech lead, coordinate engineering execution with quality gates and architecture compliance.`

---

### QA Agent

**File**: `.spec/agents/qa.agent.md`

**Mission**: Execute comprehensive testing strategy with Go/No-Go decisions, ensuring quality standards and test coverage across all development phases.

**Core Responsibilities**:
- Quality assurance and testing strategy
- Test environment setup and maintenance
- Validation and Go/No-Go decisions
- End-to-end user journey verification

**Authorised Skills**:
- `qa-ready`: Prepare test environment and fixtures
- `qa-contract`: Validate API/event contracts
- `qa-e2e`: Verify end-to-end user journeys
- `planning planning_type=testing`: Design testing strategy
- `research research_type=analytics`: Conduct systematic investigation and analysis
- `code-review`: Verify code quality standards
- `context.snapshot`: Capture quality status and manage log organization

**Quick Commands**:
- `exec story=<ID> skill=qa-e2e mode=strict`
- `exec story=<ID> skill=planning planning_type=testing mode=strict`
- `exec story=<ID> skill=research research_type=analytics mode=tolerant`
- `exec story=<ID> skill=context.snapshot mode=tolerant snapshots_section=append`

**Interacts With States**: REVIEWED, READY, CONTRACT_VALIDATED, E2E_COMPLETE, SYNCED

**Activation Phrase**: `As qa, execute comprehensive testing strategy with Go/No-Go decisions.`

## Agent Coordination Patterns

### Handoff Procedures
1. **Context Snapshot**: Always use `context.snapshot` skill before handoffs
2. **Status Documentation**: Capture current status, blockers, and next steps
3. **Evidence Preservation**: Maintain complete audit trail in Lifecycle Log
4. **Risk Communication**: Document risks with owners and mitigation strategies

### Collaboration Workflow
- **Architect ↔ Product Ops**: Technical feasibility and requirements alignment
- **Product Ops ↔ Tech Lead**: Requirements clarification and implementation planning
- **Tech Lead ↔ QA**: Quality standards and testing strategy coordination
- **Architect ↔ QA**: Architecture compliance and validation requirements

### Escalation Protocols
- **Technical Risks**: Escalate through Architect persona
- **Scope Gaps**: Escalate through Product Ops persona
- **Quality Issues**: Escalate through QA persona with Tech Lead coordination
- **Implementation Blockers**: Escalate through Tech Lead persona

## Agent Activation & Usage

### Activation Patterns
Agents are activated through specific phrases that establish context and authority:

```bash
# Architect activation
As architect, design technical architecture with measurable NFR targets and risk assessment.

# Product Ops activation
As product ops, manage task lifecycle with problem validation and stakeholder coordination.

# Tech Lead activation
As tech lead, coordinate engineering execution with quality gates and architecture compliance.

# QA activation
As qa, execute comprehensive testing strategy with Go/No-Go decisions.
```

### Operating Principles
All agents follow these core principles:

1. **Spec Workflow Compliance**: Align outputs with Orient → Scope → Execute → Gate sequence
2. **Lifecycle Logging**: Never skip lifecycle logging with proper tag formatting
3. **Evidence Citation**: Use actionable references (ref=path#Lx or URLs)
4. **Risk Management**: Document risks with owners and due dates
5. **Quality Standards**: Keep entries ≤120 chars per line for CLI readability
6. **Constitution Updates**: Update glossary/constitution when introducing new terminology

### Transition Output Format
All agents use standardized transition format:

```
[PROGRESS|<phase.tag>] by <agent>
MODE: strict|tolerant|branch
FROM: <current_phase>
TO: <target_phase>
WHY:
- <concise bullet 1>
- <concise bullet 2>
OUTPUT:
=== <PHASE_NAME> ===
summary: <concise summary>
inputs: <key references or n/a>
evidence: |result=<pass/fail>|ref=<artifact_path>
risks: [ ]|owner=<persona>|mitigation=<action>
next_steps: <follow-up needed or n/a>
=== END <PHASE_NAME> ===
FOLLOW-UP:
- owner=<persona> - due=<date>
```

## Skill Authorization System

### Registry-Based Authorization
- **Register.json**: Central authority for agent-skill mappings
- **Skill Validation**: Agents must verify authorization before skill execution
- **Gate Compliance**: Skills must respect prescribed gate order
- **Transition Logging**: All skill execution must be logged in Lifecycle Log

### Skill Categories
1. **Unified Skills** (2): Skills with multiple templates for flexible execution
   - **Planning Skill**: 4 templates (agile, architect, testing, implementation)
   - **Research Skill**: 5 templates (product-discovery, analytics, technical, market, competitive)
2. **Specialized Skills** (7): Single-purpose skills for specific gate transitions
   - **Gate Transition Skills**: product-prd, code-implement, code-review, qa-ready, qa-contract, qa-e2e, pm-sync
   - **Context Management Skills**: context.snapshot for handoffs and log organization

### BLOCKED Protocol
When prerequisites are missing, agents must use:

```
BLOCKED(missing_inputs=[prerequisite1, prerequisite2], unblock_steps=[step1, step2])
```

## Unified Skills System

### Overview
The agent system has been reorganized to use unified skills with multiple templates, reducing complexity while increasing flexibility.

### Unified Skills

#### **Planning Skill** (`.spec/skills/planning.skill.md`)
- **Templates**: 4 integrated planning templates
- **Selection**: `planning_type` parameter (agile, architect, testing, implementation)
- **Intent Interpretation**: System determines template based on agent role and context

#### **Research Skill** (`.spec/skills/research.skill.md`)
- **Templates**: 5 integrated research templates
- **Selection**: `research_type` parameter (product-discovery, analytics, technical, market, competitive)
- **Special Case**: Product discovery includes state transition (DRAFT → PRD_READY)

### Template Selection Examples
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

# Automatic Template Selection
exec story=<ID> skill=planning  # System determines template based on agent and context
exec story=<ID> skill=research  # System determines template based on questions and inputs
```

## Agent Development Guidelines

### Creating New Agents
1. **Agent Template**: Use `.spec/templates/agent.template.md`
2. **Mandate Definition**: Clear scope, responsibilities, and bounds
3. **Skill Authorization**: Map to appropriate skills in register.json
4. **Template Integration**: Define which planning/research templates agent uses
5. **Integration Testing**: Validate handoffs and transitions

### Agent Maintenance
- **Regular Updates**: Keep agent specifications current with system changes
- **Skill Mapping**: Update skill authorizations as skills evolve
- **Documentation**: Maintain clear examples and activation patterns
- **Quality Validation**: Regular testing of agent workflows

## Quality Assurance

### Agent Validation Criteria
- [ ] Mandate and bounds clearly defined
- [ ] Skill authorizations correctly mapped in register.json
- [ ] Activation phrases unique and descriptive
- [ ] Handoff procedures documented and tested
- [ ] Transition formats consistent with standards
- [ ] Risk escalation protocols established
- [ ] Collaboration patterns defined and validated

### Integration Testing
- Test all agent handoffs and transitions
- Validate skill authorization and execution
- Verify Lifecycle Log formatting and completeness
- Test BLOCKED protocol implementation
- Validate cross-agent collaboration workflows

---

## Appendix

### Agent File Locations
- **Agent Specifications**: `.spec/agents/<agent-name>.agent.md`
- **Agent Template**: `.spec/templates/agent.template.md`
- **Skill Registry**: `.spec/register.json`
- **Agent Skills**: `.spec/skills/<skill-name>.skill.md`

### Related Documentation
- **CLAUDE.md**: Claude AI Assistant Guide
- **Constitution**: `.spec/constitution.md`
- **Glossary**: `.spec/glossary.md`
- **Templates**: `.spec/templates/`

### Version Information
- **Agent System Version**: 0.1
- **Last Updated**: 2025-10-24
- **Compatible With**: AURA Workflow System V0.1
- **Key Changes**: Unified Skills System with template-based execution

---

*This agent guide provides comprehensive documentation for understanding, activating, and coordinating agent personas within the AURA system.*