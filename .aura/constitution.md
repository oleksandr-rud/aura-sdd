# AURA Framework Constitution

## Metadata
- **Version:** 1.0.0
- **Last Updated:** 2025-10-27
- **Project:** AURA (Agent Unified Response Architecture)
- **Domain:** AI Agent Orchestration and Task Management
- **Owners:** Product Ops, Architect, Tech Lead, QA personas

## Purpose
- Establish **AURA** as the authoritative framework for AI agent orchestration using the Agent Unified Response Architecture.
- Capture framework-wide architecture, quality principles, and governance guardrails for multi-agent coordination.
- Ensure every transition leaves auditable metadata in Lifecycle Logs with proper tag formatting.
- Provide framework guidelines while maintaining compliance and quality-first design principles.

## AURA Framework Architecture

### Core Architecture Principles
- **Orient → Scope → Execute → Gate**: Mandatory sequence for all agent deliverables
- **Lifecycle Log**: Centralized story log capturing all transition metadata
- **Single Source of Truth**: All updates to terminology must mirror in both glossary and constitution
- **Agent Coordination**: Agents must coordinate through prescribed workflows and respect gate order

### AURA Framework Principles
• **Quality-First Design**: All agent actions must have explicit quality controls and validation requirements
• **Context Preservation**: All agent transitions must maintain context and state information
• **Accountability**: All actions must be logged with clear agent attribution and audit trails
• **Framework Compliance**: All agents must follow prescribed workflow patterns and quality standards
• **Interoperability**: Cross-agent compatibility through standardized interfaces and protocols
• **Real-Time Coordination**: Agent handoffs with <5s transition time and context preservation
• **Audit Traceability**: All agent actions must be logged with rollback capabilities and clear attribution
• **Human-in-the-Loop**: Critical decisions require human validation and confirmation mechanisms

## Task File Structure

### Standard Task Format
- Path template: `.aura/tasks/[PROJECT_PREFIX]-XXX.md` (e.g., "AURA-001.md", "VOICE-002.md", "TASK-003.md")
- Required sections (ordered):
  1. Header (DOMAIN, STATUS, OWNER, LAST UPDATED)
  2. Product Brief (Problem, Goals, Success Metrics, Constraints, Context)
  3. Lifecycle Log (transition entries with structured format)

### AURA Framework Requirements
• **Agent Coordination**: All tasks must reference agent terminology and coordination workflows
• **Quality Standards**: Tasks must consider quality gates, validation criteria, and compliance standards
• **Framework Dependencies**: Agent and skill integrations must be documented with requirements
• **Performance Targets**: All tasks must include quality metrics, success criteria, and delivery standards
• **Governance Standards**: All tasks must comply with AURA framework guidelines and agent coordination protocols
• **Documentation Standards**: All interfaces must meet framework documentation and traceability requirements
• **Integration Requirements**: Seamless integration between Claude Code agents and AURA framework governance

## Workflow Gateway Protocol

### Gate Order (Prescribed Sequence)
The workflow follows a strict 9-gate sequence for all AURA framework projects:

1. **product.discovery** → Validate problem and market need
   - **State Transition**: DRAFT ➜ PRD_READY
   - **Owner**: product-ops
   - **Implementation**: Research skill with domain-specific investigation
   - **Purpose**: User needs analysis and opportunity validation
   - **Evidence Requirements**: User interviews, stakeholder analysis, market research
   - **Success Criteria**: Problem statement validated with quantified improvements and user value

2. **product.prd** → Capture requirements and acceptance criteria
   - **State Transition**: PRD_READY ➜ PRD_READY (refinement)
   - **Owner**: product-ops
   - **Purpose**: Requirements capture with measurable acceptance criteria
   - **Evidence Requirements**: Requirements documentation, acceptance criteria, success metrics
   - **Success Criteria**: Complete requirements with clear acceptance criteria and success definitions

3. **agile.planning** → Sequence backlog and allocate capacity
   - **State Transition**: PRD_READY ➜ PLANNED
   - **Owner**: product-ops
   - **Implementation**: Planning skill with capacity allocation
   - **Purpose**: Sprint planning and resource allocation
   - **Evidence Requirements**: Capacity plan, resource allocation, timeline estimates
   - **Success Criteria**: Sprint plan approved with clear deliverables and timelines

4. **code.implement** → Build feature with automated tests
   - **State Transition**: PLANNED ➜ BUILT
   - **Owner**: tech-lead
   - **Implementation**: Code skill
   - **Purpose**: Build solution components and core functionality
   - **Evidence Requirements**: Working implementation with automated tests, core features functional
   - **Success Criteria**: Core functionality implemented with quality controls and proper error handling

5. **code.review** → Verify code quality and architecture compliance
   - **State Transition**: BUILT ➜ REVIEWED
   - **Owner**: tech-lead
   - **Implementation**: Code skill (review mode)
   - **Purpose**: Validate architecture and proper implementation practices
   - **Evidence Requirements**: Architecture review, code quality validation, performance assessment
   - **Success Criteria**: Implementation approved with quality validation and proper architecture

6. **qa.ready** → Prepare test environment and fixtures
   - **State Transition**: REVIEWED ➜ QA_READY
   - **Owner**: qa
   - **Implementation**: QA skill
   - **Purpose**: Design comprehensive testing strategy and environment
   - **Evidence Requirements**: Test strategy, test cases, environment setup, quality criteria
   - **Success Criteria**: Test strategy complete with validation scenarios and coverage plans

7. **qa.contract** → Validate API/event contracts
   - **State Transition**: QA_READY ➜ CONTRACT_VALIDATED
   - **Owner**: qa
   - **Implementation**: QA skill (contract validation)
   - **Purpose**: Validate interfaces, contracts, and integration points
   - **Evidence Requirements**: Interface validation, contract compliance, integration testing
   - **Success Criteria**: All contracts validated with proper error handling and compliance

8. **qa.e2e** → Verify end-to-end user journeys
   - **State Transition**: CONTRACT_VALIDATED ➜ E2E_VALIDATED
   - **Owner**: qa
   - **Implementation**: QA skill (e2e testing)
   - **Purpose**: Validate complete user workflows and system integration
   - **Evidence Requirements**: End-to-end workflows, integration validation, user acceptance testing
   - **Success Criteria**: End-to-end workflows validated with quality controls and user satisfaction

9. **pm.sync** → Update stakeholders and close story
   - **State Transition**: E2E_VALIDATED ➜ DELIVERED
   - **Owner**: product-ops
   - **Implementation**: Technical writing skill (stakeholder communication)
   - **Purpose**: Demonstrate working system and capture lessons learned
   - **Evidence Requirements**: Stakeholder demo results, performance metrics, delivery documentation
   - **Success Criteria**: Solution delivered with all features functional and stakeholders satisfied

### Domain Adaptations

#### Project-Specific Requirements
• **Technology Stack**: Adapt to project-specific technology requirements and constraints
• **Quality Standards**: Define project-specific quality metrics and success criteria
• **Integration Requirements**: Specify system integration needs and compatibility requirements
• **Performance Targets**: Set appropriate performance targets based on project domain and user needs
• **Accessibility Standards**: Ensure compliance with relevant accessibility and usability standards
• **Platform Support**: Define target platforms and deployment requirements

## Architecture Patterns for VoiceOps Assistant

### Recommended Voice Automation Architecture
• **Pipeline Pattern**: Sequential processing (Wake-word → STT → Intent → RPA) with confidence thresholds at each stage
• **Safety-First Pattern**: Explicit confirmation requirements and rollback capabilities for destructive actions
• **Adapter Pattern**: Platform-specific adapters with unified interface for cross-platform RPA execution
• **Delegation Pattern**: LangGraph-based workflow decomposition with human-in-the-loop validation for complex tasks
• **Privacy-First Pattern**: Local-only processing with no cloud data transmission and explicit user consent
• **Event-Driven Pattern**: Asynchronous message passing between components with real-time response requirements

### Voice Automation Integration Patterns
• **Audio Integration**: Real-time audio capture with platform-specific audio APIs and noise cancellation preprocessing
• **Speech Engine Integration**: Local STT engines (Vosk/Whisper) with confidence scoring and streaming recognition
• **Platform Automation**: OS-specific automation APIs (Windows Win32, macOS AppleScript, Linux CLI) with unified adapter interface
• **LangGraph Integration**: State machine workflow management with human-in-the-loop checkpoints and delegation capabilities
• **Safety Integration**: Permission management, audit logging, and rollback mechanisms for all RPA actions
• **Accessibility Integration**: Screen reader compatibility, alternative input methods, and WCAG 2.1 AA compliance validation

## Testing Strategy for VoiceOps Assistant

### Voice Automation Testing Requirements
• **Safety Testing**: Destructive action prevention, confirmation requirement validation, rollback mechanism testing
• **Accuracy Testing**: STT accuracy validation in various noise conditions, intent recognition accuracy, confidence threshold testing
• **Integration Testing**: Cross-platform adapter compatibility, audio device integration, platform automation API validation
• **Load Testing**: Concurrent command processing, audio stream handling, intent recognition throughput under load
• **Accessibility Testing**: WCAG 2.1 AA compliance validation, voice-first interaction testing, disabled user workflow validation
• **Delegation Testing**: LangGraph workflow validation, human-in-the-loop checkpoint testing, complex multi-step workflow execution

### Voice Automation Performance Benchmarks
• **Response Time**: Wake-word detection <100ms, STT processing <500ms, intent parsing <50ms, RPA execution <200ms, end-to-end latency <1s
• **Throughput**: 50+ concurrent command processing, 100+ intents/second recognition capacity, real-time audio stream processing
• **Availability**: 99.9% uptime with local processing fallback and graceful degradation for unsupported commands
• **Accuracy**: STT accuracy >95% (clear), >90% (moderate noise), intent recognition >95%, wake-word false positive <5%
• **Platform Performance**: Windows 100% intent support, macOS 80% intent support, Linux 70% intent support with consistent response times
• **Safety Performance**: Zero unintended destructive actions, 100% confirmation requirement compliance for dangerous operations

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

*This constitution establishes VoiceOps Assistant with Voice Automation & RPA specific adaptations while maintaining the core framework's integrity, safety-first principles, and quality standards.*