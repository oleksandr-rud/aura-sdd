architect-plan.skill

## **Purpose**
Provides structured architectural guidance for existing initiatives, transforming business requirements into technical architecture through systematic design decisions, risk assessment, and validation planning.

## **Target Agent**
architect-orchestrator

## **Trigger Scenarios**
- **Solution Design**: When technical architecture needs to be defined or updated
- **Risk Assessment**: When architectural risks require identification and mitigation
- **Validation Planning**: When technical decisions need experimental validation
- **Integration Design**: When system integration patterns must be established
- **Performance Planning**: When non-functional requirements need architectural solutions

## **Required MCPs/Tools**
- **Documentation Systems**: Task Package access, architectural decision logs
- **Analysis Tools**: System modeling, dependency mapping, risk assessment frameworks
- **Communication**: Stakeholder coordination, design review facilitation
- **Validation**: Prototyping environments, proof-of-concept execution

## **Core Procedure (SOP)**

### **Phase 1: Context Analysis**
1. **Extract Requirements**: Parse business requirements from Task Package
2. **Identify Constraints**: Document technical, business, and regulatory constraints
3. **Assess Current State**: Evaluate existing architecture and technical debt
4. **Define Quality Targets**: Establish measurable performance, reliability, and scalability targets

### **Phase 2: Solution Design**
1. **Generate Options**: Create multiple architectural approaches
2. **Trade-off Analysis**: Evaluate options against quality targets and constraints
3. **Decision Documentation**: Record architectural decisions with clear rationale
4. **Integration Planning**: Define system interfaces and data flows

### **Phase 3: Risk Management**
1. **Risk Identification**: Catalog technical, operational, and business risks
2. **Impact Assessment**: Evaluate probability and impact of each risk
3. **Mitigation Strategy**: Develop specific mitigation actions and owners
4. **Contingency Planning**: Create fallback approaches for high-risk scenarios

### **Phase 4: Validation Planning**
1. **Experiment Design**: Plan proof-of-concepts and validation tests
2. **Success Criteria**: Define measurable validation outcomes
3. **Resource Planning**: Identify tools, environments, and expertise needed
4. **Timeline Definition**: Establish validation milestones and dependencies

## **Required Parameters**
| Parameter | Description | Format | Example |
|---|---|---|---|
| `task_reference` | Task-ID or slug for the existing task | ULID or kebab-case | `20251013-onboarding-funnel` |
| `architecture_goal` | What the architecture work must enable or decide | sentence | `Select a resilient KYC document processing pipeline` |
| `constraints` | Key technical or business constraints | bullet list | `GDPR storage, <200ms p95, vendor SLA 1s` |
| `quality_targets` | Performance, reliability, security, or scalability targets | list or table | `p95 < 150ms, 99.9% availability` |
| `update_scope` | Sections to refresh (Architecture Overview, Decision Log, Validation) | list | `Architecture Overview`, `Decision Log` |

## **Optional Parameters**
| Parameter | Description | Usage |
|---|---|---|
| `decision_hypotheses` | Hypotheses or questions under evaluation | Seeds Decision Log and experiments |
| `current_state` | Description of existing architecture/process | Provides baseline for comparison |
| `candidate_approaches` | Options already considered or desired | Guides trade-off analysis |
| `risk_register` | List of risks with severity/likelihood | Feeds Architecture Overview and mitigations |
| `mitigation_plan` | Actions, owners, timelines for risks | Aligns with Implementation Guidance |
| `validation_plan` | Planned experiments, owners, target metrics | Populates Validation & Experiments |
| `dependencies` | Teams, systems, approvals involved | Aligns with Product Ops/Tech Lead planning |
| `prototype_requests` | Desired spikes or proof-of-concepts | Directs collaboration with code-implement |

## **Execution Templates**

### **Architecture Decision Summary**
```
Architecture Decision Summary
- Goal: [What this architecture enables]
- Approach Selected: [Chosen architectural approach]
- Key Decisions: [Critical architectural decisions with IDs]
- Trade-offs: [Primary trade-offs and rationale]
- Validation Required: [Experiments or proof-of-concepts needed]
```

### **Decision Log Template**
| Decision ID | Description | Rationale | Owner | Status |
|---|---|---|---|---|
| ARCH-001 | [Decision description] | [Reasoning and trade-offs] | [Owner] | [Proposed/Approved/Rejected] |

### **Risk Assessment Template**
| Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|
| [Risk description] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation strategy] | [Owner] |

### **Rolling Summary Update Template**
```
Context: [Updated architectural context and constraints]
Facts: [Technical baselines, benchmarks, and validation results]
Decisions: [Architectural decisions made and their implications]
Risks: [Technical risks identified and mitigation status]
Next: [Next architectural validation or implementation steps]
```

## **Quality Standards & Guardrails**

### **Principled Design Requirements**
- Follow established architectural principles and patterns
- Ensure all non-functional requirements are measurable and quantified
- Maintain traceability from business requirements to technical decisions
- Require validation before committing to major architectural decisions

### **Process Compliance**
- Document all architectural decisions with clear rationale and trade-offs
- Ensure quality targets are specific, measurable, and time-bound
- Include probability, impact, and mitigation strategies in risk assessments
- Define owners, success criteria, and timelines for all validation plans
- Identify and track dependencies across all relevant teams

### **Boundary Conditions**
- Never propose solutions that violate specified constraints
- Always consider impact and dependencies before making decisions
- Address scalability, maintainability, and operational concerns
- Validate critical assumptions before proceeding with implementation
- Respect security, compliance, and governance requirements

### **Validation Protocols**
- Verify proposed solutions meet all quality targets and constraints
- Validate architectural decisions through prototyping or proof-of-concepts
- Test scalability and performance under realistic conditions
- Review security implications and compliance adherence
- Ensure operational readiness and monitoring capabilities

## **Execution Parameters**

### **Success Criteria**
- Architecture decisions are documented with clear rationale
- Quality targets are established and measurable
- Risks are identified with mitigation strategies
- Validation plans have defined success criteria and owners
- Dependencies are documented and tracked

### **Error Handling**
- When constraints conflict with requirements, escalate with trade-off analysis
- When validation fails, document learnings and revise approach
- When dependencies are blocked, create mitigation plans and alternative paths
- When quality targets cannot be met, adjust scope or timeline with stakeholder approval

## **Example Usage**
```
Use the architect-plan skill with these parameters:
task_reference: 20251013-onboarding-funnel
architecture_goal: Select resilient architecture for automated KYC document processing
constraints:
  - GDPR-compliant storage in EU region only
  - Vendor API SLA 99.5%, max 3 retries
  - Latency budget p95 < 150ms end-to-end
quality_targets:
  - p95 latency < 150ms
  - Error rate < 0.5%
  - Availability 99.9%
update_scope:
  - Architecture Overview
  - Decision Log
  - Validation & Experiments
decision_hypotheses:
  - H1: Queue-based retry reduces failure rate by 40%
  - H2: Streaming pipeline improves latency but adds complexity
current_state: Manual review workflow with synchronous vendor calls; no retries
candidate_approaches:
  - Queue + worker retry
  - Streaming pipeline with backpressure
risk_register:
  - Vendor throttling under spikes (Severity High, Likelihood Medium)
  - Increased operational load for monitoring queues (Severity Medium, Likelihood Medium)
mitigation_plan:
  - Implement autoscaling for retry workers (Owner: Tech Lead, due 2025-11-15)
  - Add vendor status cache with circuit breaker (Owner: Architect, due 2025-11-10)
validation_plan:
  - Load test vendor failure scenarios (Owner: Engineer, target p95 < 150ms)
prototype_requests:
  - Spike: simulate vendor failure rates with queue retry logic
```