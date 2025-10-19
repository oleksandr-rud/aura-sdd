# API Service Agents

## Agent Orchestration Configuration

### Primary Agents
```yaml
Tech Lead Orchestrator:
  Activation: "As tech lead orchestrator, execute complete API development pipeline with intelligent automation and quality gates."
  Skills: [api-development, code-quality, devops-automation, architect-plan, research-analysis, context-compact]
  Responsibilities:
    - API endpoint development and implementation
    - Code quality review and validation
    - DevOps automation and deployment coordination
    - Integration with architecture decisions
    - Performance optimization and monitoring

Architect Orchestrator:
  Activation: "As architect orchestrator, design API architecture, define contracts, and establish non-functional requirements."
  Skills: [architect-plan, research-analysis, context-compact]
  Responsibilities:
    - API architecture and contract design
    - Performance and scalability planning
    - Integration strategy definition
    - Security architecture decisions
    - Risk assessment and mitigation

QA Orchestrator:
  Activation: "As qa orchestrator, execute comprehensive API testing strategy with dynamic quality gates and Go/No-Go decisions."
  Skills: [qa-testing, code-quality, research-analysis, context-compact]
  Responsibilities:
    - API testing strategy and execution
    - Contract testing and consumer validation
    - Performance and load testing
    - Security testing and validation
    - Quality gate enforcement

Product Ops Orchestrator:
  Activation: "As product ops orchestrator, manage API roadmap, coordinate stakeholder requirements, and maintain task file integrity."
  Skills: [product-prd, agile-plan, research-analysis, pm-sync, context-compact]
  Responsibilities:
    - API roadmap planning and coordination
    - Stakeholder requirement management
    - Task file stewardship and coordination
    - External integration management
    - Communication and reporting
```

## Dynamic Skill Execution

### API Development Pipeline
```yaml
Phase 1: Planning & Architecture
  architect-plan:
    - Design API architecture and contracts
    - Define performance and security requirements
    - Establish integration patterns
    - Risk assessment and mitigation

Phase 2: Development & Implementation
  api-development:
    - Generate API endpoints and implementation
    - Create validation schemas and middleware
    - Implement error handling and logging
    - Auto-generate documentation and tests

  code-quality:
    - Review and validate code quality
    - Execute static analysis and security scanning
    - Ensure compliance with coding standards
    - Generate quality metrics and reports

Phase 3: Quality Assurance
  qa-testing:
    - Execute comprehensive API testing
    - Perform contract testing with consumers
    - Conduct performance and load testing
    - Validate security requirements
    - Generate Go/No-Go decisions

Phase 4: Deployment & Operations
  devops-automation:
    - Deploy API service with automation
    - Configure monitoring and alerting
    - Set up CI/CD pipeline
    - Implement rollback procedures

Phase 5: Analysis & Optimization
  research-analysis:
    - Analyze API performance and usage metrics
    - Identify optimization opportunities
    - Monitor quality trends and patterns
    - Generate insights and recommendations

Phase 6: Documentation Management
  context-compact:
    - Maintain clean task documentation
    - Archive completed activities
    - Update API documentation
    - Ensure knowledge continuity
```

## Agent Coordination Matrix

### Skill Assignment by Agent
| Skill | Primary Agent | Secondary Agent | Auto-Execute |
|---|---|---|---|
| `api-development` | tech-lead-orchestrator | - | ✅ |
| `architect-plan` | architect-orchestrator | tech-lead-orchestrator | 🏗️ |
| `qa-testing` | qa-orchestrator | tech-lead-orchestrator | ✅ |
| `code-quality` | qa-orchestrator | tech-lead-orchestrator | 🔍 |
| `devops-automation` | tech-lead-orchestrator | - | 🔧 |
| `research-analysis` | product-ops-orchestrator | All agents | 📊 |
| `product-prd` | product-ops-orchestrator | - | 📋 |
| `agile-plan` | product-ops-orchestrator | tech-lead-orchestrator | 📅 |
| `pm-sync` | product-ops-orchestrator | - | 🔗 |
| `context-compact` | product-ops-orchestrator | All agents | 🔄 |

### Handoff Patterns
```yaml
Architecture → Development:
  Trigger: Architecture decisions completed
  Handoff: architect-orchestrator → tech-lead-orchestrator
  Artifacts: API contracts, NFRs, integration patterns

Development → Quality:
  Trigger: API implementation completed
  Handoff: tech-lead-orchestrator → qa-orchestrator
  Artifacts: API code, documentation, initial tests

Quality → Deployment:
  Trigger: Quality gates passed
  Handoff: qa-orchestrator → tech-lead-orchestrator
  Artifacts: Test results, quality metrics, Go decision

Development → Operations:
  Trigger: Deployment ready
  Handoff: tech-lead-orchestrator → devops-automation
  Artifacts: Deployable code, configuration, monitoring setup
```

## Quality Standards & Governance

### API Quality Standards
```yaml
Code Quality:
  TypeScript Strict Mode: Required
  ESLint/Prettier: Automated enforcement
  Test Coverage: > 90%
  Security Scanning: Zero high-severity issues

API Quality:
  OpenAPI Compliance: 100%
  Response Format Consistency: 100%
  Error Handling: Standardized format
  Documentation Coverage: 100%
  Contract Testing: All consumer compatibility validated

Performance Standards:
  Response Time: p50 ≤ 100ms, p95 ≤ 250ms
  Throughput: {{target-throughput}} requests/sec
  Error Rate: < 0.5% per 24h
  Availability: 99.5% uptime

Security Standards:
  Input Validation: Zod schema validation required
  Authentication: OAuth 2.0 implementation
  Authorization: Role-based access control
  PII Handling: Automatic redaction in logs
```

### Decision Governance
```yaml
Architecture Decisions:
  Process: architect-plan → review → approval
  Documentation: In task file with ARCH-XXX IDs
  Impact: High - affects service boundaries and contracts

Code Decisions:
  Process: code-quality → review → merge
  Documentation: In PR comments and task file
  Impact: Medium - affects implementation quality

Quality Decisions:
  Process: qa-testing → gates → Go/No-Go
  Documentation: In Testing Notes with clear verdict
  Impact: High - affects release readiness

Operational Decisions:
  Process: research-analysis → recommendations
  Documentation: In Metrics & Evidence section
  Impact: Variable - depends on analysis scope
```

## Communication Protocols

### Stakeholder Communication
```yaml
Product Updates:
  Frequency: Weekly or milestone-based
  Format: Rolling Summary + Activity Log
  Owner: product-ops-orchestrator
  Channels: Task file + stakeholder updates

Technical Updates:
  Frequency: As needed during development
  Format: Rolling Summary + Implementation Notes
  Owner: tech-lead-orchestrator
  Channels: Task file + team communication

Quality Updates:
  Frequency: Each quality gate completion
  Format: Testing Notes + Rolling Summary
  Owner: qa-orchestrator
  Channels: Task file + quality dashboards
```

### Escalation Procedures
```yaml
Architecture Escalation:
  Trigger: High-impact architectural decisions
  Process: architect-orchestrator → stakeholder review
  Timeline: Immediate for blockers, 48h for major decisions

Quality Escalation:
  Trigger: Critical quality issues or No-Go decisions
  Process: qa-orchestrator → product-ops-orchestrator → stakeholders
  Timeline: Immediate for production issues, 24h for major concerns

Performance Escalation:
  Trigger: Performance targets missed or degradation
  Process: tech-lead-orchestrator → architect-orchestrator → stakeholders
  Timeline: 4h for production issues, 24h for sustained problems
```

## Integration with External Systems

### Consumer Integration Management
```yaml
Client Generation:
  Automation: Auto-generated TypeScript clients
  Validation: Contract testing with all consumers
  Communication: Through product-ops-orchestrator
  Documentation: In API documentation and task files

Backward Compatibility:
  Policy: Maintain backward compatibility for major versions
  Process: Semantic versioning + deprecation notices
  Validation: Contract testing with existing consumers
  Communication: Through release notes and stakeholder updates
```

### External Service Integration
```yaml
Third-Party APIs:
  Management: Through adapter pattern
  Monitoring: Health checks and performance metrics
  Error Handling: Circuit breakers and retry logic
  Documentation: In integration specifications and task files

Internal Services:
  Management: Direct service-to-service communication
  Monitoring: Distributed tracing and metrics
  Error Handling: Standardized error formats
  Documentation: In API specifications and task files
```

---

*API Service Agent Configuration with dynamic orchestration and comprehensive governance*