# API Service Constitution

## Mission
Expose domain services over HTTP with intelligent automation and dynamic spec governance, enabling client apps and partner integrations to iterate safely with real-time quality monitoring.

## Constitution Apps Framework

### App Configuration
```yaml
App ID: api-service
App Type: REST API Service
Version: {{current-version}}
Last Updated: {{current-date}}
Active Skills: 8/8
Automation Level: {{automation-percentage}}%
```

### Agent Orchestration
```yaml
Primary Agents:
  - tech-lead-orchestrator: Engineering execution and API development
  - architect-orchestrator: API design and architecture decisions
  - qa-orchestrator: API quality assurance and contract testing
  - product-ops-orchestrator: API roadmap and stakeholder coordination

Skill Execution:
  Development: [api-development, code-quality, devops-automation]
  Quality: [qa-testing, research-analysis]
  Architecture: [architect-plan]
  Management: [context-compact]
```

## Architectural Tenets
- **🤖 Intelligent API Development**: Auto-generated endpoints with dynamic scaffolding
- **📊 Contract-First Design**: OpenAPI/Zod contracts with automatic client generation
- **🔧 Modular Architecture**: Layered modules with clear separation of concerns
- **⚡ Performance Optimization**: Intelligent caching and response optimization
- **🛡️ Security by Design**: Automated security scanning and compliance checking

## Dynamic Capabilities
```yaml
API Intelligence:
  Schema Generation: {{schema-generation-status}}
  Client Auto-Generation: {{client-generation-status}}
  Performance Monitoring: {{perf-monitoring-status}}
  Quality Scoring: {{quality-scoring-status}}

Automation Features:
  - Endpoint Scaffolding: {{endpoint-scaffolding}}
  - Validation Generation: {{validation-generation}}
  - Documentation Auto-Update: {{doc-auto-update}}
  - Test Generation: {{test-generation}}
```

## Runtime & Delivery
```yaml
Tech Stack:
  Framework: Fastify {{version}}
  Language: TypeScript {{version}}
  Runtime: Node.js 20 LTS
  Validation: Zod {{version}}
  Documentation: Swagger/OpenAPI 3.0
  Testing: Jest + Supertest
  Monitoring: Prometheus + Grafana

Build & Deployment:
  Bundler: tsup (ESM + CJS)
  Container: Docker multi-stage build
  Runtime: Non-root user execution
  Health Checks: /health endpoint
  Observability: Structured logging + tracing
```

## Reliability Targets
```yaml
Performance Metrics:
  Response Time: p50 ≤ 100ms, p95 ≤ 250ms
  Throughput: {{target-throughput}} requests/sec
  Error Rate: < 0.5% per 24h window
  Availability: 99.5% uptime

Quality Gates:
  Code Coverage: > 90%
  API Contract Compliance: 100%
  Security Scan Pass: 100%
  Performance Tests: All pass
```

## Security & Compliance
```yaml
Security Measures:
  HTTPS Enforcement: Via reverse proxy
  Input Validation: Zod schema validation
  PII Redaction: Automatic logging redaction
  Secret Management: Vault/Kubernetes secrets
  Rate Limiting: Per-client limits
  CORS: Configured origins

Compliance Standards:
  {{compliance-framework}} compliance
  Audit logging enabled
  Data retention policies enforced
  Security scans automated
```

## Risk & Mitigation
```yaml
Risk Management:
  Schema Drift:
    Risk: High
    Mitigation: Auto-generated clients + backward-compat tests
    Status: {{mitigation-status}}

  Blocking I/O:
    Risk: Medium
    Mitigation: Async worker queue integration
    Status: {{mitigation-status}}

  Performance Degradation:
    Risk: Medium
    Mitigation: Real-time monitoring + auto-scaling
    Status: {{mitigation-status}}

  Security Vulnerabilities:
    Risk: High
    Mitigation: Automated scanning + rapid patching
    Status: {{mitigation-status}}
```

## Dynamic Skill Integration
```yaml
API Development Pipeline:
  1. architect-plan: Design API architecture and contracts
  2. api-development: Generate endpoints and implementation
  3. code-quality: Review and validate code quality
  4. qa-testing: Execute comprehensive API testing
  5. devops-automation: Deploy and monitor API service
  6. research-analysis: Analyze performance and usage metrics
  7. context-compact: Maintain clean documentation

Auto-Execution:
  - Endpoint Generation: {{endpoint-auto-gen}}
  - Validation Schemas: {{validation-auto-gen}}
  - Test Suites: {{test-auto-gen}}
  - Documentation: {{doc-auto-gen}}
  - Monitoring Setup: {{monitoring-auto-gen}}
```

## Quality Standards
```yaml
Code Quality:
  TypeScript Strict Mode: Enabled
  ESLint Configuration: Standard + custom rules
  Prettier Formatting: Automated
  Pre-commit Hooks: Quality checks enforced

API Quality:
  OpenAPI Compliance: 100%
  Response Format Consistency: 100%
  Error Handling: Standardized format
  Documentation Coverage: 100%

Testing Standards:
  Unit Tests: > 90% coverage
  Integration Tests: All endpoints covered
  Contract Tests: Consumer compatibility validated
  Performance Tests: Load and stress testing
```

## Monitoring & Observability
```yaml
Metrics Collection:
  - Request/response metrics
  - Error rates and types
  - Performance distribution
  - Resource utilization

Logging Strategy:
  - Structured JSON logging
  - Request correlation IDs
  - Error stack traces
  - Performance benchmarks

Alerting:
  - High error rate alerts
  - Performance degradation alerts
  - Security event alerts
  - Resource exhaustion alerts
```

## Integration Points
```yaml
Internal Integrations:
  - Database: PostgreSQL connection pool
  - Cache: Redis for session and response caching
  - Queue: Async job processing
  - Monitoring: Prometheus metrics endpoint

External Integrations:
  - Authentication: OAuth provider
  - Payments: Payment gateway APIs
  - Notifications: Email/SMS services
  - Analytics: Event tracking
```

---

*Dynamic API Service Constitution with intelligent automation and comprehensive spec governance*