# [PROJECT_NAME] Constitution - AURA Implementation

## Metadata
- **Version:** [AURA_VERSION: e.g., "3.1.0"]
- **Last Updated:** [CONSTITUTION_DATE: e.g., "2025-10-24"]
- **Project:** [PROJECT_NAME: e.g., "TaskMaster Pro", "DataFlow Analytics", "CloudSync Platform"]
- **Domain:** [PROJECT_DOMAIN: e.g., "Project Management", "Data Analytics", "Cloud Infrastructure", "Healthcare", "Financial Services"]
- **Owners:** Product Ops, Architect, Tech Lead, QA personas

## Purpose
- Establish **[PROJECT_NAME]** as an authoritative AURA (Agent Unified Response Architecture) implementation for all persona deliverables.
- Capture project-specific architecture, coding principles, delivery philosophy, and quality guardrails for Orient → Scope → Execute → Gate sequence.
- Ensure every transition leaves auditable metadata in Lifecycle Logs with proper tag formatting.
- Provide [PROJECT_DOMAIN] specific guidelines while maintaining AURA framework compliance.

## Project-Specific Framework

### Core AURA Principles (Maintained)
- **Orient → Scope → Execute → Gate**: Mandatory sequence for all persona deliverables
- **Lifecycle Log**: Centralized story log capturing all transition metadata
- **Single Source of Truth**: All updates to terminology must mirror in both glossary and constitution
- **Registry Authority**: Agents must route through registry to load personas/skills and respect prescribed gate order

### [PROJECT_NAME] Specific Principles
[PROJECT_SPECIFIC_PRINCIPLES: e.g.,
• **Data-Driven Decisions**: All product decisions must be supported by quantitative analytics and user behavior data
• **Real-Time Collaboration**: All user interactions must be reflected in real-time across all clients and devices
• **Scalable Architecture**: All components must be designed for horizontal scaling and automatic load balancing
• **Security-First Design**: Security reviews and penetration testing mandatory for all feature implementations
• **Compliance-First Approach**: All development must comply with [DOMAIN_COMPLIANCE: e.g., "HIPAA", "PCI DSS", "GDPR", "SOX"] regulations
• **User Experience Priority**: All features must meet accessibility standards (WCAG 2.1 AA) and respond within [PERFORMANCE_TARGET: e.g., "2 seconds"] on [DEVICE_TARGET: e.g., "mobile and desktop"]]

## Task File Structure

### Standard AURA Format
- Path template: `.spec/tasks/[PROJECT_PREFIX]-XXX.md` (e.g., "TM-001.md", "DF-002.md", "HC-003.md")
- Required sections (ordered):
  1. Header (DOMAIN, STATUS, OWNER, LAST UPDATED)
  2. Product Brief (Problem, Goals, Success Metrics, Constraints, Context)
  3. Lifecycle Log (transition entries with structured format)

### [PROJECT_NAME] Specific Requirements
[PROJECT_TASK_REQUIREMENTS: e.g.,
• **Domain Reference**: All tasks must reference [PROJECT_DOMAIN] terminology and business processes
• **Stack Integration**: Tasks must consider [PROJECT_STACK] architecture patterns and capabilities
• **API Dependencies**: External service integrations must be documented with version requirements
• **Performance Targets**: All tasks must include [DOMAIN_PERFORMANCE: e.g., "response time <2s", "throughput >1000 req/s", "99.9% uptime"]
• **Security Standards**: All tasks must comply with [PROJECT_SECURITY: e.g., "OWASP Top 10", "industry-specific security guidelines"]

## AURA Workflow Gateway Protocol for [PROJECT_NAME]

### Gate Order (Prescribed Sequence)
The workflow follows a strict 9-gate sequence adapted for [PROJECT_DOMAIN]:

1. **product.discovery** → Validate problem and market need
   - **State Transition**: DRAFT ➜ PRD_READY
   - **Owner**: product-ops
   - **Implementation**: Research skill with `research_type=product-discovery`
   - **[PROJECT_NAME] Purpose**: [DOMAIN_SPECIFIC_DISCOVERY: e.g., "User workflow analysis with current process mapping", "Data source validation and quality assessment", "Patient journey optimization and clinical workflow analysis"]
   - **Evidence Requirements**: [DOMAIN_EVIDENCE: e.g., "User interviews, current process documentation, stakeholder pain points", "Data samples, quality metrics, source reliability analysis", "Clinical observations, staff interviews, regulatory requirements"]
   - **Success Criteria**: Problem statement validated with [DOMAIN_METRICS: e.g., "quantified time savings and user productivity improvements", "data quality improvements and processing efficiency gains", "patient outcome improvements and staff time savings"]

2. **product.prd** → Capture requirements and acceptance criteria
   - **State Transition**: PRD_READY ➜ PRD_READY (refinement)
   - **Owner**: product-ops
   - **Purpose**: Requirements capture with measurable acceptance criteria
   - **[PROJECT_NAME] Evidence Requirements**: [DOMAIN_PRD_EVIDENCE: e.g., "User story mapping with acceptance criteria, current workflow integration points", "Data schema requirements, transformation rules, output specifications", "Clinical requirement mapping, regulatory compliance matrix, user acceptance criteria"]
   - **Success Criteria**: [DOMAIN_PRD_SUCCESS: e.g., "Complete user journey flows with integration points defined", "Data transformation pipelines with quality gates specified", "Clinical workflow requirements with regulatory compliance validation"]

[Continue gates 3-9 with project-specific adaptations...]

### [PROJECT_NAME] Domain Adaptations

#### Technology Stack Specifics
[DOMAIN_TECH_STACK: e.g.,
• **Project Management Stack**: React + Node.js + PostgreSQL + WebSocket + Docker
• **Data Analytics Stack**: Python + Apache Spark + MongoDB + Redis + Kubernetes
• **Healthcare Stack**: FHIR + HL7 + HIPAA-compliant cloud + Audit logging
• **Financial Stack**: .NET Core + SQL Server + PCI DSS + Encryption at rest
• **E-commerce Stack**: Next.js + NestJS + PostgreSQL + Stripe + CDN
• **IoT Stack**: Go + InfluxDB + MQTT + Kubernetes + Edge computing]

#### Quality Standards
[DOMAIN_QUALITY_STANDARDS: e.g.,
• **Project Management**: 99.9% uptime, <2s response time, mobile-first responsive design
• **Data Analytics**: 95%+ data accuracy, <1min processing time, GDPR compliance validation
• **Healthcare**: HIPAA compliance, FDA 21 CFR Part 11, EMR integration standards
• **Financial**: SOC 2 Type II compliance, PCI DSS Level 1, audit logging with 7-year retention
• **E-commerce**: 3s page load time, 99.95% uptime, ADA compliance, PCI compliance

## Architecture Patterns for [PROJECT_NAME]

### Recommended Architecture
[PROJECT_ARCHITECTURE: e.g.,
• **Microservices Pattern**: Service decomposition by business capability with database per service
• **Event-Driven Architecture**: Kafka/RabbitMQ for service communication with event sourcing
• **CQRS Pattern**: Command Query Responsibility Segregation for complex read/write operations
• **API Gateway Pattern**: Single entry point with authentication, rate limiting, and monitoring
• **[DOMAIN_SPECIFIC_PATTERN: e.g., "Data Mesh Pattern for analytics pipelines", "Clinical Data Repository Pattern for healthcare", "Ledger Pattern for financial services"]

### Integration Patterns
[PROJECT_INTEGRATION: e.g.,
• **Database Integration**: [SPECIFIC_DB_PATTERN: e.g., "Multi-tenant PostgreSQL with row-level security", "Time-series InfluxDB with retention policies", "FHIR-compliant data storage for healthcare"]
• **External APIs**: [INTEGRATION_APIS: e.g., "Slack, Microsoft Teams, Google Workspace", "Snowflake, Databricks, ML platforms", "Epic, Cerner, medical billing systems"]
• **Authentication**: [AUTH_PATTERN: e.g., "OAuth 2.0 + SAML SSO", "JWT with refresh tokens and MFA", "SMART on FHIR for healthcare"]
• **[DOMAIN_INTEGRATION: e.g., "HL7 interface for hospital systems", "FIX protocol for trading systems", "EDI integration for supply chain"]

## Testing Strategy for [PROJECT_NAME]

### [PROJECT_NAME] Testing Requirements
[PROJECT_TESTING_STRATEGY: e.g.,
• **User Acceptance Testing**: Real user workflows with production-like data and [DOMAIN_SPECIFIC_TESTING: e.g., "clinical scenario testing", "financial transaction testing", "analytics accuracy validation"]
• **Integration Testing**: Cross-platform compatibility and API integrations with [EXTERNAL_SYSTEMS: e.g., "EHR systems", "payment gateways", "data sources"]
• **Load Testing**: [DOMAIN_LOAD_TESTING: e.g., "1000 concurrent users with <5s response", "1M records/hour processing capacity", "10,000 concurrent patient encounters"]
• **Security Testing**: [DOMAIN_SECURITY: e.g., "Penetration testing, vulnerability scanning", "HIPAA privacy validation", "PCI DSS compliance testing"]
• **[DOMAIN_ADDITIONAL_TESTING: e.g., "Interoperability testing for healthcare", "Regulatory compliance validation", "Disaster recovery testing"]

### Performance Benchmarks
[PROJECT_PERFORMANCE: e.g.,
• **Response Time**: <[RESPONSE_TIME_TARGET: e.g., "2s"] for 95th percentile
• **Throughput**: [DOMAIN_THROUGHPUT: e.g., "1000 tasks/hour", "10M records processed/day", "500 concurrent patient visits"]
• **Availability**: 99.[AVAILABILITY_TARGET: e.g., "9%"] uptime with automatic failover to [BACKUP_LOCATION: e.g., "AWS us-west-2", "Azure West Europe"]
• **Scalability**: Horizontal scaling to [SCALING_FACTOR: e.g., "10x"] current load within [SCALING_TIME: e.g., "5 minutes"]
• **[DOMAIN_PERFORMANCE_ADDITIONAL: e.g., "Data processing accuracy >99.8%", "Clinical decision support response <3s", "Financial transaction processing <500ms"]

## Deployment Standards

### Environment Configuration
[PROJECT_ENVIRONMENTS: e.g.,
• **Development**: Local Docker with hot reload and test data for [DOMAIN_DEV_DATA: e.g., "anonymized patient data", "sample financial transactions"]
• **Staging**: Production-like environment with anonymized data and full integration testing
• **Production**: Blue-green deployment with automated rollback and [DOMAIN_PROD_FEATURES: e.g., "clinical data encryption", "financial audit logging"]
• **Monitoring**: [PROJECT_MONITORING: e.g., "Application performance, user behavior tracking, error rate monitoring", "Patient safety monitoring, financial transaction tracking"]
• **Compliance**: [DOMAIN_COMPLIANCE_MONITORING: e.g., "HIPAA compliance monitoring", "PCI DSS validation", "Data residency verification"]

### Infrastructure Requirements
[PROJECT_INFRASTRUCTURE: e.g.,
• **Container Orchestration**: Kubernetes with auto-scaling and [DOMAIN_CLUSTER_CONFIG: e.g., "HIPAA-compliant cluster configuration", "PCI DSS network segmentation"]
• **Database**: [PROJECT_DB_REQUIREMENTS: e.g., "PostgreSQL with read replicas and WAL archiving", "MongoDB sharded cluster with automated backups", "FHIR-compliant database with audit logging"]
• **Caching**: [PROJECT_CACHING: e.g., "Redis for session management", "CDN for static assets and distributed caching", "Secure cache for clinical data with automatic expiration"]
• **Message Queue**: [PROJECT_QUEUING: e.g., "RabbitMQ for task processing", "Kafka for real-time data streams", "HIPAA-compliant message queue with encryption"]
• **[DOMAIN_INFRA_ADDITIONAL: e.g., "Secure backup with geographical redundancy", "Clinical decision support integration", "Regulatory reporting automation"]

## Compliance and Security

### [PROJECT_DOMAIN] Compliance Requirements
[DOMAIN_COMPLIANCE: e.g.,
• **Healthcare**: HIPAA, HITECH, FDA 21 CFR Part 11, HITECH, CMS requirements
• **Financial**: PCI DSS, SOX, GLBA, Dodd-Frank, FINRA, SEC regulations
• **European**: GDPR, ePrivacy Directive, Digital Services Act, PSD2, MiFID II
• **Government**: FISMA, FedRAMP, NIST 800-53, DFARS, ITAR requirements
• **[DOMAIN_ADDITIONAL_COMPLIANCE: e.g., "Industry-specific standards", "Regional regulations", "Certification requirements"]

### Security Standards
[PROJECT_SECURITY: e.g.,
• **Data Classification**: [DATA_CLASSIFICATION: e.g., "PHI, Confidential, Internal, Public classification with handling rules", "PII, Financial, Public data classification"]
• **Access Control**: Role-based access with least privilege principle and [DOMAIN_ACCESS_CONTROL: e.g., "Clinical role-based access", "Financial transaction approval workflow"]
• **Encryption**: [ENCRYPTION_STANDARDS: e.g., "AES-256 for data at rest, TLS 1.3 for data in transit", "FIPS 140-2 validated encryption for healthcare"]
• **Audit Logging**: [AUDIT_REQUIREMENTS: e.g., "All access and modifications logged with tamper-proof storage", "7-year retention for financial records", "Immutable audit trail for clinical data"]
• **[DOMAIN_SECURITY_ADDITIONAL: e.g., "Business Associate Agreements", "Data Processing Agreements", "Security Assessment Requirements"]

## Tool Integration

### Required Development Tools
[PROJECT_DEV_TOOLS: e.g.,
• **IDE Extensions**: [DOMAIN_EXTENSIONS: e.g., "Jira integration, workflow modeling plugins", "Epic integration, clinical workflow tools", "Trading platform integration, risk assessment tools"]
• **Testing Tools**: [DOMAIN_TESTING_TOOLS: e.g., "User session recording, A/B testing framework", "Clinical scenario testing tools", "Financial transaction testing suites"]
• **Monitoring**: [DOMAIN_MONITORING_TOOLS: e.g., "User journey analytics, conversion funnel tracking", "Patient safety monitoring, clinical decision support tracking"]
• **Security Tools**: [DOMAIN_SECURITY_TOOLS: e.g., "Static code analysis, vulnerability scanning", "HIPAA compliance tools", "PCI DSS validation suite"]
• **[DOMAIN_DEV_TOOLS_ADDITIONAL: e.g., "Data modeling tools", "Regulatory compliance automation", "Performance profiling tools"]

### AI/ML Integration
[PROJECT_AI_INTEGRATION: e.g.,
• **Machine Learning**: [DOMAIN_ML_FEATURES: e.g., "Task priority prediction, deadline estimation", "Clinical decision support, risk stratification", "Fraud detection, algorithmic trading"]
• **Natural Language**: [DOMAIN_NLP_FEATURES: e.g., "Automated task summarization, sentiment analysis", "Clinical documentation processing, transcription", "Financial document analysis, contract review"]
• **Computer Vision**: [DOMAIN_CV_FEATURES: e.g., "Document scanning and OCR for task creation", "Medical imaging analysis, diagnostic support", "Check processing, document verification"]
• **[DOMAIN_AI_ADDITIONAL: e.g., "Predictive analytics", "Anomaly detection", "Automated decision support"]

---

*This constitution establishes [PROJECT_NAME] as an AURA implementation with [PROJECT_DOMAIN] specific adaptations while maintaining the core framework's integrity and quality standards.*