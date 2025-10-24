# Spec Gen Constitution

## Metadata
- **Version:** 3.1
- **Last Updated:** 2025-10-24
- **Owners:** Product Ops, Architect, Tech Lead, QA personas

## Purpose
- Establish the Spec Workflow System as the authoritative framework for all persona deliverables.
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

## Spec Workflow Gateway Protocol

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

### Workflow Flow Properties

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

#### Unified Planning Skills
The planning skill provides structured planning across multiple domains with template-driven execution:
- **Purpose**: Structured planning across different domains (agile, architecture, testing, implementation)
- **Templates**: 4 integrated planning templates with automatic intent interpretation
  - **Agile Planning**: Backlog sequencing and capacity allocation (product-ops)
  - **Architect Planning**: System architecture and technical decisions (architect)
  - **Testing Planning**: Test strategy and environment planning (qa)
  - **Implementation Planning**: Technical implementation coordination (tech-lead)
- **Selection Method**: Parameter specification (`planning_type`) or intent interpretation based on agent role
- **Execution Pattern**: Context analysis → template selection → plan creation → risk assessment
- **Evidence Requirements**: Stakeholder inputs, resource analysis, timeline validation

#### Unified Research Skills
The research skill supports systematic investigation across multiple domains with flexible methodology:
- **Purpose**: Evidence-based decision making through structured investigation
- **Templates**: 5 integrated research templates with automatic intent interpretation
  - **Product Discovery**: Problem validation and market need confirmation (product-ops)
  - **Analytics Research**: Quantitative analysis and hypothesis validation (any agent)
  - **Technical Research**: Feasibility studies and best practices (architect/tech-lead)
  - **Market Research**: Market analysis and opportunity sizing (product-ops)
  - **Competitive Research**: Competitive analysis and positioning (product-ops/architect)
- **Selection Method**: Parameter specification (`research_type`) or intent interpretation based on questions and context
- **Methodology Framework**: Question definition → evidence collection → analysis → recommendations
- **Quality Standards**: Reproducible methodology, clear citations, limitation acknowledgment
- **Special Features**: Multi-mode research support, cross-agent flexibility, automatic template selection

## Monorepo Infrastructure

### Repository Structure
- **Monorepo Architecture**: Single repository containing all projects with shared dependencies and tooling
- **Root Orchestration**: Docker Compose configuration at repository root for service coordination
- **Development Environment**: Local development setup using Docker Compose with hot-reload capabilities
- **Nested Applications**: Separate applications with distinct architectures and purposes
  - **Chat API Backend**: `apps/chat-api/` - NestJS service with hexagonal architecture
  - **Chat App Frontend**: `apps/chat-app/` - React application with feature-based organization

### Application Architecture Patterns

#### Chat API Backend - Hexagonal Architecture
- **Domain Layer**: Core business logic, entities, repository interfaces, domain services
- **Application Layer**: Use cases, application services, DTOs, business logic orchestration
- **Infrastructure Layer**: Repository implementations, external service integrations, data persistence
- **Presentation Layer**: Controllers, routes, request/response models, API documentation

#### Chat App Frontend - Feature-Based Architecture
- **Components**: Reusable UI components with composition patterns
- **Pages**: Page-level components with routing and layout
- **Hooks**: Custom React hooks for state and side effects
- **Services**: API clients, WebSocket clients, external integrations
- **Store**: Centralized state management with Redux Toolkit
- **Utils**: Shared utility functions and helpers

### Container Orchestration
- **Tesseract Platform**: Production deployment and service management platform
- **Docker Compose**: Local development environment orchestration
- **Service Ports**: API Server (4000), Client App (5173), additional services as configured

### Development Services
- **Chat API Server**: Backend service with real-time chat capabilities
  - Location: `apps/chat-api/src/`
  - Port: 4000
  - Features: Auth, Chat, Real-time messaging, Search and Archive endpoints
  - Architecture: NestJS with hexagonal architecture pattern
  - Real-time: Socket.IO with Redis adapter, Server-Sent Events
- **Chat App**: Frontend React application for chat interface
  - Location: `apps/chat-app/src/`
  - Port: 5173
  - Features: React chat application with real-time messaging
  - Architecture: Modern React with hooks, Socket.IO client, cross-tab sync

### Environment Management
- **Local Development**: Docker Compose with volume mounts for hot-reload
- **Production Deployment**: Tesseract orchestration with scaling and monitoring
- **Configuration Management**: Environment-specific configuration through Docker Compose overrides

### Nested Application Specifications

#### Application Task Format
- **Task Structure**: Single-file task packages with app-specific context
- **Location**: `.spec/tasks/PROJECT-XXX.md` for application-specific tasks
- **App Context**: Tasks reference specific application directories and modules
- **Evidence Format**: File references using `ref=<path>` format for implementation artifacts
- **Code Policy**: Tasks must NOT include code implementations, only file references and results

#### Cross-Application Integration
- **API Communication**: Frontend-backend integration through REST APIs and WebSocket connections
- **Shared Libraries**: Common utilities and types shared across applications
- **Authentication Flow**: Unified authentication across applications with token-based security
- **Real-time Features**: WebSocket integration between frontend and backend applications
- **Configuration Management**: Separate configurations with environment-specific overrides

#### Module Organization Standards
- **Backend Modules**: `apps/chat-api/src/modules/{module-name}/` with hexagonal layers
- **Frontend Features**: `apps/chat-app/src/{feature-type}/` with component organization
- **File References**: Use relative paths from monorepo root for consistency
- **Documentation**: Module-specific README files with implementation details

#### Quality Standards for Applications
- **Architecture Compliance**: Follow prescribed patterns for each application type
- **Testing Structure**: Unit, integration, and E2E tests appropriate to each application
- **Code Quality**: Biome linting and formatting across all applications
- **Documentation**: API documentation generated from backend, component docs from frontend

#### Monorepo App Architecture
- **Chat API Backend**: `apps/chat-api/` with NestJS hexagonal architecture
  - Modules: Auth, Chat, Search, Archive, Real-time
  - Structure: domain/{entities,repositories,services}, application/{use-cases,dto}, infrastructure/{repositories,providers}, presentation/{controllers,gateways}
- **Chat App Frontend**: `apps/chat-app/` with modern React architecture
  - Features: Real-time messaging, Search interface, Analytics dashboard
  - Structure: components/, pages/, hooks/, services/, lib/

#### Task-Application Integration
- **Implementation References**: Tasks reference specific file paths within applications
- **Cross-App Dependencies**: Tasks must specify dependencies between applications
- **Validation Criteria**: Success metrics tied to application functionality
- **Evidence Collection**: Artifacts located in application directories

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

### Tech Stack Requirements
- **Code Linting and Formatting**: **Biome** is the required tool for all code linting, formatting, and quality checks across all applications
- **TypeScript**: Strict TypeScript configuration is mandatory for all projects
- **Testing Framework**: Jest for unit tests, Vitest for modern testing scenarios
- **Build Tools**: Vite for frontend applications, NestJS CLI for backend services
- **Package Manager**: pnpm is the preferred package manager for the monorepo

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

*This constitution establishes the Spec Workflow System as the authoritative framework for all persona deliverables, ensuring consistent quality, auditability, and coordination across the development lifecycle.*
