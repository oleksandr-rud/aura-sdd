---
name: aura-planning
description: Create structured plans across multiple domains (agile, architect, testing, implementation). Use when you need to organize work, allocate resources, define timelines, or coordinate complex activities. Supports backlog sequencing, system architecture planning, test strategy design, and implementation coordination.
---

# AURA Planning Skill

## Segment: Identity

- **Skill ID**: planning
- **Version**: 2.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (any agent)

## Segment: Purpose

### Core Purpose
Create structured, actionable plans that organize work, allocate resources effectively, define realistic timelines, and coordinate complex activities across multiple planning domains.

### Success Criteria
- Plan objectives clearly defined and measurable
- Resources allocated appropriately to skills and availability
- Dependencies identified with owners and resolution paths
- Timelines realistic with appropriate buffers
- Quality gates defined with validation criteria
- Risks identified with mitigation strategies

### Trigger Scenarios
- **Project Initiation**: New projects need comprehensive planning structure
- **Backlog Organization**: Work items need sequencing and prioritization
- **Resource Allocation**: Team capacity needs to be allocated to specific tasks
- **Architecture Design**: System architecture needs detailed planning and documentation
- **Test Strategy**: Testing approach needs comprehensive strategy and environment planning
- **Implementation Coordination**: Technical work needs breakdown and coordination

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: Access to planning documents and resources
- **Read**: Analysis of requirements, constraints, and existing plans
- **Write**: Creation and updating of planning documents
- **Bash**: Execution of planning scripts and validation tools

### Tool Requirements
- **Document Management**: Create, update, and organize planning documents
- **Template Processing**: Work with planning templates and formats
- **Resource Analysis**: Analyze team capacity and skill availability
- **Dependency Tracking**: Identify and manage task dependencies
- **Timeline Calculation**: Generate realistic timeline estimates

### Prerequisites
- **Clear Objectives**: Well-defined goals and success criteria
- **Resource Information**: Team capacity, skills, and availability data
- **Constraints Documentation**: Technical, business, and time constraints
- **Requirements Analysis**: Clear understanding of what needs to be planned

## Segment: Orientation

### Orientation Checks
- **Architecture Review**: Confirm ../../../.aura/constitution.md for planning standards
- **Glossary Alignment**: Review ../../../.aura/glossary.md for planning terminology
- **Persona Context**: Load {{actor}} persona from ../../../.claude/agents/{{actor}}.md
- **Planning Type**: Validate planning_type parameter and context

### Pre-execution Validation
- **Agent Authorization**: Verify agent has planning skill authorization
- **Tool Availability**: Confirm FileSystem, Read, Write tools accessible
- **Context Loading**: Load current task state and requirements
- **Prerequisite Check**: Validate all planning inputs are available

## Segment: Execution Algorithm

### Step-by-Step Procedure

1. **Validate Planning Context**
   - **Purpose**: Ensure all planning prerequisites are available
   - **Tools**: Read, FileSystem
   - **Output**: Planning validation result
   - **Validation**: All required inputs present or BLOCKED format

2. **Analyze Requirements and Constraints**
   - **Purpose**: Understand what needs to be planned and limitations
   - **Tools**: Read, analysis tools
   - **Output**: Requirements analysis and constraint documentation
   - **Validation**: Requirements clear, constraints documented

3. **Resource Assessment**
   - **Purpose**: Evaluate available resources and capabilities
   - **Tools**: Analysis tools, resource data
   - **Output**: Resource capacity and skill availability assessment
   - **Validation**: Resources quantified, skills mapped

4. **Dependency Analysis**
   - **Purpose**: Identify and analyze all task dependencies
   - **Tools**: Analysis tools, dependency mapping
   - **Output**: Dependency graph with owners and timelines
   - **Validation**: Dependencies identified, owners assigned

5. **Plan Structure Design**
   - **Purpose**: Create logical plan structure and phases
   - **Tools**: Planning templates, design tools
   - **Output**: Plan structure with phases and milestones
   - **Validation**: Structure logical, milestones achievable

6. **Timeline and Resource Allocation**
   - **Purpose**: Allocate resources and define realistic timelines
   - **Tools**: Calculation tools, resource allocation algorithms
   - **Output**: Detailed timeline with resource assignments
   - **Validation**: Timelines realistic, resources appropriately allocated

7. **Risk Assessment and Mitigation**
   - **Purpose**: Identify risks and define mitigation strategies
   - **Tools**: Risk analysis frameworks
   - **Output**: Risk register with mitigation plans
   - **Validation**: Risks identified, mitigations actionable

8. **Quality Gates Definition**
   - **Purpose**: Define validation criteria and success metrics
   - **Tools**: Quality frameworks, metric definitions
   - **Output**: Quality gate definitions and validation criteria
   - **Validation**: Gates measurable, criteria clear

9. **Documentation and Communication**
   - **Purpose**: Create comprehensive plan documentation
   - **Tools**: Write, document templates
   - **Output**: Complete plan document with all components
   - **Validation**: Documentation complete, communication clear

### Quality Gates
- **Requirements Coverage**: All requirements addressed in plan
- **Resource Feasibility**: Resource allocation realistic and achievable
- **Timeline Logic**: Timeline dependencies logical and achievable
- **Risk Management**: All major risks identified with mitigation
- **Quality Clarity**: Success criteria and quality gates clearly defined

### Error Handling
- **Missing Requirements**: Gather additional requirements information
- **Resource Constraints**: Adjust scope or acquire additional resources
- **Timeline Conflicts**: Resolve dependency conflicts or adjust timelines
- **Unclear Dependencies**: Work with stakeholders to clarify relationships

## Segment: Artifact Output

### Primary Outputs
- **Comprehensive Plan**: Complete planning document with all components
- **Resource Allocation**: Detailed resource assignments and capacity utilization
- **Timeline with Milestones**: Project timeline with key milestones and dependencies
- **Risk Register**: Identified risks with mitigation strategies and owners

### Evidence Requirements
- **Quantitative Metrics**: Resource utilization percentages, timeline buffer calculations
- **Qualitative Evidence**: Stakeholder validation, risk assessment quality
- **Validation Criteria**: Measurable success criteria and quality gate definitions

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|{{planning_type}}.planning] by {{actor}}
MODE: {{transition_mode}}
FROM_STATE: {{from_state}}
TO_STATE: {{to_state}}
WHY:
- {{planning_reason_1}}
- {{planning_reason_2}}
OUTPUT:
=== {{Planning_Type}} Plan ===
summary: Created comprehensive {{planning_type}} plan with resource allocation and timeline.
inputs: {{planning_context}}={{context_ref}} {{planning_resources}}={{resources_ref}} {{planning_dependencies}}={{dependencies_ref}}
evidence: {{planning_validation}}|result=validated|ref={{plan_path}}
risks: [ ]{{planning_risk}}|owner={{actor}}|mitigation={{planning_mitigation}}
next_steps: Execute plan according to defined milestones and quality gates.
=== END {{Planning_Type}} Plan ===
FOLLOW-UP:
- Begin plan execution - owner={{next_owner}} - due={{start_date}}
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[{{planning_context}}, {{planning_resources}}], unblock_steps=[{{unblock_step_1}}, {{unblock_step_2}})
```

## Planning Templates

### Template Selection Mechanism

The planning skill supports 4 planning templates:

1. **Agile Planning** - Backlog sequencing and capacity allocation
2. **Architect Planning** - System architecture and technical approach
3. **Testing Planning** - Test strategy and quality planning
4. **Implementation Planning** - Technical implementation coordination

### Usage Examples

#### Quick Start
```bash
# Agile planning (product-ops default)
exec story=PROJECT-001 skill=planning planning_type=agile

# Architect planning (architect default)
exec story=PROJECT-001 skill=planning planning_type=architect

# Testing planning (qa default)
exec story=PROJECT-001 skill=planning planning_type=testing

# Implementation planning (tech-lead default)
exec story=PROJECT-001 skill=planning planning_type=implementation
```

#### Advanced Usage
```bash
# Cross-agent planning
exec story=PROJECT-001 skill=planning planning_type=agile actor=tech-lead

# Planning with specific context
exec story=PROJECT-001 skill=planning planning_type=architect constraints=performance+security
```

### Planning Template Details

#### 1. Agile Planning Template
**Intended for**: product-ops agent
**When to use**: Backlog sequencing, capacity allocation, sprint planning
**Key Focus**: Business value prioritization, team capacity optimization, delivery节奏
**Additional Required Inputs**: requirements, team_capacity, dependencies
**Output Focus**: Sequenced backlog, resource allocation, sprint boundaries

#### 2. Architect Planning Template
**Intended for**: architect agent
**When to use**: System architecture, technology decisions, NFR definition
**Key Focus**: Technical architecture, technology selection, quality attributes
**Additional Required Inputs**: requirements, constraints, quality_targets
**Output Focus**: Architecture decisions, technology choices, NFR targets

#### 3. Testing Planning Template
**Intended for**: qa agent
**When to use**: Test strategy, environment planning, quality gates
**Key Focus**: Quality assurance, test coverage, environment setup
**Additional Required Inputs**: test_requirements, environment_specifications
**Output Focus**: Test strategy, environment plan, quality gates

#### 4. Implementation Planning Template
**Intended for**: tech-lead agent
**When to use**: Technical implementation, task breakdown, coordination
**Key Focus**: Technical execution, task sequencing, resource coordination
**Additional Required Inputs**: architecture_plan, development_resources, implementation_requirements
**Output Focus**: Implementation tasks, resource assignments, integration points

## Planning Best Practices

### General Principles
- **SMART Goals**: Make all objectives Specific, Measurable, Achievable, Relevant, Time-bound
- **Buffer Management**: Include appropriate time and resource buffers for uncertainty
- **Dependency Management**: Clearly identify and manage all task dependencies
- **Stakeholder Communication**: Ensure all stakeholders understand and agree to plans

### Resource Planning
- **Skill Matching**: Match tasks to team members with appropriate skills
- **Capacity Planning**: Consider individual capacity and availability
- **Load Balancing**: Distribute work evenly across team members
- **Growth Planning**: Include time for skill development and learning

### Timeline Planning
- **Critical Path**: Identify and manage critical path dependencies
- **Milestone Definition**: Define clear, measurable milestones
- **Buffer Allocation**: Include appropriate buffers for risks and uncertainties
- **Validation Points**: Plan regular validation and review points

### Risk Management
- **Risk Identification**: Systematically identify all potential risks
- **Impact Assessment**: Assess risk probability and potential impact
- **Mitigation Planning**: Develop specific mitigation strategies
- **Contingency Planning**: Plan alternative approaches for high-impact risks

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - System architecture and workflow
- [AURA Glossary](../../../.aura/glossary.md) - Planning terminology and definitions
- [Planning Templates](../templates/) - Additional planning template examples
- [Best Practices Guide](docs/best-practices.md) - Comprehensive planning guidance

## Guardrails

- Keep entries <=120 characters per line for CLI readability
- All timeline estimates must include buffer for unexpected delays
- All dependencies must have identified owners and resolution timelines
- Resource allocation must match team skill sets and availability
- Quality gates must be measurable and verifiable
- All planning assumptions must be explicitly stated and validated

---

*AURA Planning skill supporting multiple planning domains with template-driven execution, resource optimization, and comprehensive risk management.*