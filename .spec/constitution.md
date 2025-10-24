# Spec Gen Constitution

## Metadata
- **Version:** 3.1
- **Last Updated:** 2025-10-24
- **Owners:** Product Ops, Architect, Tech Lead, QA personas

## Purpose
- Establish the Workflow Transition System as the controlling workflow for all persona deliverables.
- Capture architecture, coding principles, delivery philosophy, and quality guardrails for Orient → Scope → Execute → Gate sequence.
- Ensure every transition leaves auditable metadata in Lifecycle Logs with proper tag formatting.

## Workflow System

### Core Principles
- **Orient → Scope → Execute → Gate**: Mandatory sequence for all persona deliverables
- **Lifecycle Log**: Centralized story log capturing all transition metadata (AGENTS.MD:14-18)
- **Single Source of Truth**: All updates to terminology must mirror in both glossary and constitution
- **Registry Authority**: Agents must route through registry to load personas/skills and respect prescribed gate order

### Task File Structure
- Path template: `.spec/tasks/PROJECT-XXX.md`
- Required sections (ordered):
  1. Header (DOMAIN, STATUS, OWNER, LAST UPDATED)
  2. Product Brief (Problem, Goals, Success Metrics, Constraints, Context)
  3. Lifecycle Log (transition entries with structured format)

## State Machine Gateway Protocol

### Gate Order (Prescribed Sequence)
The workflow follows a strict 9-gate sequence that ensures comprehensive validation and delivery:

1. **product.discovery** → Validate problem and market need
   - **State Transition**: DRAFT ➜ PRD_READY
   - **Owner**: product-ops
   - **Implementation**: Research skill with `research_type=product-discovery`
   - **Purpose**: Problem validation with customer evidence and market research
   - **Evidence Requirements**: Customer interviews, market analysis, competitive landscape
   - **Success Criteria**: Problem statement validated with quantitative evidence

2. **product.prd** → Capture requirements and acceptance criteria
   - **State Transition**: PRD_READY ➜ PRD_READY (refinement)
   - **Owner**: product-ops
   - **Purpose**: Requirements capture with measurable acceptance criteria
   - **Evidence Requirements**: Stakeholder inputs, success metrics, user stories
   - **Success Criteria**: SMART requirements with clear acceptance criteria

3. **agile.planning** → Sequence backlog and allocate capacity
   - **State Transition**: PRD_READY ➜ PLANNED
   - **Owner**: product-ops
   - **Purpose**: Backlog sequencing and resource allocation
   - **Evidence Requirements**: Team capacity assessment, dependency analysis, timeline estimates
   - **Success Criteria**: Realistic timeline with proper resource allocation

4. **code.implement** → Build feature with automated tests
   - **State Transition**: PLANNED ➜ BUILT
   - **Owner**: tech-lead
   - **Purpose**: Feature implementation with automated testing
   - **Evidence Requirements**: Architecture compliance, test coverage, code quality metrics
   - **Success Criteria**: Functional implementation with defined test coverage

5. **code.review** → Verify code quality and architecture compliance
   - **State Transition**: BUILT ➜ REVIEWED
   - **Owner**: tech-lead
   - **Purpose**: Code quality validation and architecture compliance
   - **Evidence Requirements**: Code review results, quality gate validation, security scans
   - **Success Criteria**: All quality gates passed with architecture compliance

6. **qa.ready** → Prepare test environment and fixtures
   - **State Transition**: REVIEWED ➜ READY
   - **Owner**: qa
   - **Purpose**: Test environment preparation and fixture setup
   - **Evidence Requirements**: Environment validation, test fixtures, tool configuration
   - **Success Criteria**: Test environment ready with comprehensive fixtures

7. **qa.contract** → Validate API/event contracts
   - **State Transition**: READY ➜ CONTRACT_VALIDATED
   - **Owner**: qa
   - **Purpose**: API contract validation and integration testing
   - **Evidence Requirements**: Contract test results, schema validation, compatibility checks
   - **Success Criteria**: All contracts validated with compatibility confirmed

8. **qa.e2e** → Verify end-to-end user journeys
   - **State Transition**: CONTRACT_VALIDATED ➜ E2E_COMPLETE
   - **Owner**: qa
   - **Purpose**: End-to-end user journey validation
   - **Evidence Requirements**: E2E test results, performance validation, user experience testing
   - **Success Criteria**: Critical user journeys validated with performance within SLA

9. **pm.sync** → Update stakeholders and close story
   - **State Transition**: E2E_COMPLETE ➜ SYNCED
   - **Owner**: product-ops
   - **Purpose**: Stakeholder communication and story closure
   - **Evidence Requirements**: Delivery metrics, KPI validation, stakeholder communication
   - **Success Criteria**: Stakeholders updated with delivery completed and documented

### State Machine Flow Properties

#### State Progression Rules
- **Linear Progression**: Gates must be completed in prescribed order
- **State Persistence**: Current state is maintained in task file header
- **Rollback Capability**: States can be rolled back when blockers are identified
- **Branch Execution**: Complex features can create parallel work streams

#### Transition Validation
- **Prerequisites**: Each gate requires specific inputs and evidence
- **Quality Gates**: Validation criteria must be met before progression
- **Risk Assessment**: Risks must be documented with mitigation strategies
- **Evidence Requirements**: All decisions must be supported by evidence

#### Agent Authorization Matrix
| Gate | Primary Owner | Supporting Agents | Authority Level |
|------|---------------|-------------------|-----------------|
| product.discovery | product-ops | architect | Product validation (via research skill) |
| product.prd | product-ops | architect, tech-lead | Requirements authority |
| agile.planning | product-ops | tech-lead, architect | Planning authority |
| code.implement | tech-lead | architect | Implementation authority |
| code.review | tech-lead | architect | Quality authority |
| qa.ready | qa | tech-lead | Test environment authority |
| qa.contract | qa | tech-lead | Contract validation authority |
| qa.e2e | qa | product-ops | Quality validation authority |
| pm.sync | product-ops | all agents | Closure authority |

### Universal Supporting Skills

#### Generic Planning Skills
Planning skills follow a universal template that can be specialized by context:
- **Purpose**: Structured planning across different domains (agile, architecture, testing)
- **Template Variables**: Planning scope, stakeholders, deliverables, success criteria
- **Execution Pattern**: Context analysis → option evaluation → plan creation → risk assessment
- **Evidence Requirements**: Stakeholder inputs, resource analysis, timeline validation

#### Generic Research Skills
Research skills support systematic investigation across multiple domains:
- **Purpose**: Evidence-based decision making through structured investigation
- **Research Modes**: analytics, technical, market, competitive
- **Methodology Framework**: Question definition → evidence collection → analysis → recommendations
- **Quality Standards**: Reproducible methodology, clear citations, limitation acknowledgment

## Monorepo Infrastructure

### Repository Structure
- **Monorepo Architecture**: Single repository containing all projects with shared dependencies and tooling
- **Root Orchestration**: Docker Compose configuration at repository root for service coordination
- **Development Environment**: Local development setup using Docker Compose with hot-reload capabilities

### Container Orchestration
- **Tesseract Platform**: Production deployment and service management platform
- **Docker Compose**: Local development environment orchestration
- **Service Ports**: API Server (4000), Client App (5173), additional services as configured

### Development Services
- **API Server**: Backend service with demo endpoints for development and testing
  - Location: `apps/api/src/`
  - Port: 4000
  - Features: Auth, CRM, Chat, Content Generation endpoints
- **Client App**: Frontend React application for user interface development
  - Location: Root of monorepo
  - Port: 5173
  - Features: React application with development server

### Environment Management
- **Local Development**: Docker Compose with volume mounts for hot-reload
- **Production Deployment**: Tesseract orchestration with scaling and monitoring
- **Configuration Management**: Environment-specific configuration through Docker Compose overrides

## Transition Execution Standards

### Transition Modes
- **strict**: All prerequisites must be satisfied, normal state progression
- **tolerant**: Continue with missing inputs but flag gaps and owners
- **branch**: Create parallel work streams for complex features

### Progress Log Format
```
[PROGRESS|<phase.tag>] by <persona>
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

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[prerequisite1, prerequisite2], unblock_steps=[step1, step2])
```

## Architecture and Engineering Standards

### Engineering Execution Principles
- **Async/Await Patterns**: Use structured async programming for all service interactions
- **Repository Helpers**: Leverage standardized data access patterns
- **Structured Logging**: Maintain consistent log formats across all services
- **Backward Compatibility**: Ensure all payload changes maintain compatibility
- **Redis Channel Validation**: Mandatory validation loop for all pub/sub operations

### System Integration Requirements
- **Lifecycle Artifacts**: QA handoff and story logs must use shared abstractions
- **Operational Utilities**: QueueInstance and connection tracking provide reusable patterns
- **State Management**: All state transitions must be auditable and reversible

### Quality Guardrails
- **CLI Readability**: Keep entries ≤120 chars per line for command line compatibility
- **Evidence Citation**: Use actionable references (ref=path#Lx or URLs)
- **Risk Management**: Document risks with owners and mitigation strategies
- **Documentation Updates**: Update glossary/constitution when introducing new concepts

## Persona Responsibilities

### Universal Requirements (All Personas)
- Perform orientation checks before executing transitions
- Follow prescribed gate order without deviation
- Use standardized transition log format
- Maintain CLI readability constraints
- Escalate scope gaps through proper channels

### Product Ops Persona
- Own task file lifecycle and product framing
- Validate problem statements and market needs
- Manage stakeholder communication
- Ensure KPI alignment and success metrics

### Architect Persona
- Provide technical direction and NFR targets
- Assess architecture decisions and risks
- Validate system design patterns
- Ensure compliance with architectural guardrails

### Tech Lead Persona
- Coordinate engineering execution
- Manage code quality and reviews
- Ensure test coverage and quality
- Coordinate technical handoffs

### QA Persona
- Validate quality standards and testing
- Ensure proper test environment setup
- Validate end-to-end user journeys
- Provide Go/No-Go decisions

## Compliance and Security

### Documentation Requirements
- All transitions must be documented in Lifecycle Log
- Evidence must be embedded directly in task files
- Risk owners and mitigation strategies must be explicit
- Decision rationale must be clearly documented

### Quality Standards
- Code must pass all quality gates before progression
- Automated tests are required for critical paths
- Security scanning must be integrated into workflow
- Performance benchmarks must be established

### Escalation Protocols
- Sev-High issues must be escalated immediately
- Scope gaps must be routed through Product persona
- Technical risks must be surfaced via Tech Lead
- Quality concerns must be flagged by QA persona

## Context Management

### Context Snapshot Protocol
- Use context.snapshot skill before handoffs between personas
- Capture unresolved questions and decision deadlines
- Document required evidence for next agent
- Maintain audit trail in Lifecycle Log

### Context Management Procedure
- Run context.snapshot compact operation when Activity Log grows large
- Archive detailed history to bottom of file or separate archive
- Reference archive path in Lifecycle Log
- Maintain Rolling Summary for current state

## Tool and Infrastructure Requirements

### MCP Tools Integration
- All skills must specify required MCP tools
- Tool access must be validated before execution
- Tool failures must be documented and escalated
- Registry must track tool availability and usage

### Infrastructure Standards
- Services must be containerized with proper health checks
- Monitoring and alerting must be integrated
- Configuration must be externalized and versioned
- Deployment must be automated and reversible

---

*This constitution establishes the State Machine Transition Mechanism as the authoritative workflow for all persona deliverables, ensuring consistent quality, auditability, and coordination across the development lifecycle.*
