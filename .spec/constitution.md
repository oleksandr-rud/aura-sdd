# Spec Gen Constitution

## Metadata
- **Version:** 3.0
- **Last Updated:** 2025-10-23
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

### Gate Order (Prescribed Sequence)
1. **product.discovery** → Validate problem and market need
2. **product.prd** → Capture requirements and acceptance criteria
3. **agile.planning** → Sequence backlog and allocate capacity
4. **code.implement** → Build feature with automated tests
5. **code.review** → Verify code quality and architecture compliance
6. **qa.ready** → Prepare test environment and fixtures
7. **qa.contract** → Validate API/event contracts
8. **qa.e2e** → Verify end-to-end user journeys
9. **pm.sync** → Update stakeholders and close story

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
