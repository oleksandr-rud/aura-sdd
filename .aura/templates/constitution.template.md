# {{PROJECT_NAME}} Constitution

## Segment: Header

### Metadata
- **Version:** {{VERSION}}
- **Last Updated:** {{CURRENT_DATE}}
- **Owners:** {{OWNER_PERSONAS}}

### Purpose
- {{PURPOSE_STATEMENT_1}}
- {{PURPOSE_STATEMENT_2}}
- {{PURPOSE_STATEMENT_3}}

---

## Segment: State Machine Workflow

### Core Principles
- **Orient → Scope → Execute → Gate**: Mandatory sequence for all persona deliverables
- **Lifecycle Log**: Centralized story log capturing all transition metadata
- **Single Source of Truth**: All updates to terminology must mirror in both glossary and constitution
- **Registry Authority**: Agents must route through registry to load personas/skills and respect prescribed gate order

### Task File Structure
- Path template: `.aura/tasks/{{PROJECT_NAMING_PATTERN}}`
- Required sections (ordered):
  1. Header (DOMAIN, STATUS, OWNER, LAST UPDATED)
  2. Product Brief (Problem, Goals, Success Metrics, Constraints, Context)
  3. Lifecycle Log (transition entries with structured format)

### Gate Order (Prescribed Sequence)
{{#each GATE_LIST}}
{{index}}. **{{gate_name}}** → {{gate_description}}
{{/each}}

---

## Segment: Transition Standards

### Transition Modes
- **strict**: All prerequisites must be satisfied, normal state progression
- **tolerant**: Continue with missing inputs but flag gaps and owners
- **branch**: Create parallel work streams for complex features

### Transition Log Format
```
[TRANSITION|<gate.tag>] by <persona>
MODE: strict|tolerant|branch
FROM_STATE: <current_state>
TO_STATE: <target_state>
WHY:
- <concise bullet 1>
- <concise bullet 2>
OUTPUT:
=== <GATE_NAME> ===
summary: <concise summary>
inputs: <key references or n/a>
evidence: |result=<pass/fail>|ref=<artifact_path>
risks: [ ]|owner=<persona>|mitigation=<action>
next_steps: <follow-up needed or n/a>
=== END <GATE_NAME> ===
FOLLOW-UP:
- owner=<persona> - due=<date>
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[prerequisite1, prerequisite2], unblock_steps=[step1, step2])
```

---

## Segment: Architecture & Engineering Standards

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

### Quality Standards
- **CLI Readability**: Keep entries ≤120 chars per line for command line compatibility
- **Evidence Citation**: Use actionable references (ref=path#Lx or URLs)
- **Risk Management**: Document risks with owners and mitigation strategies
- **Documentation Updates**: Update glossary/constitution when introducing new concepts

---

## Segment: Persona Responsibilities

### Universal Requirements (All Personas)
- Perform orientation checks before executing transitions
- Follow prescribed gate order without deviation
- Use standardized transition log format
- Maintain CLI readability constraints
- Escalate scope gaps through proper channels

### {{PERSONA_1}} Persona
- **Core Focus**: {{PERSONA_1_FOCUS}}
- **Primary Responsibilities**:
  - {{PERSONA_1_RESPONSIBILITY_1}}
  - {{PERSONA_1_RESPONSIBILITY_2}}
  - {{PERSONA_1_RESPONSIBILITY_3}}
- **Key Skills**: {{PERSONA_1_SKILLS}}
- **Escalation Protocol**: {{PERSONA_1_ESCALATION}}

### {{PERSONA_2}} Persona
- **Core Focus**: {{PERSONA_2_FOCUS}}
- **Primary Responsibilities**:
  - {{PERSONA_2_RESPONSIBILITY_1}}
  - {{PERSONA_2_RESPONSIBILITY_2}}
  - {{PERSONA_2_RESPONSIBILITY_3}}
- **Key Skills**: {{PERSONA_2_SKILLS}}
- **Escalation Protocol**: {{PERSONA_2_ESCALATION}}

### {{PERSONA_3}} Persona
- **Core Focus**: {{PERSONA_3_FOCUS}}
- **Primary Responsibilities**:
  - {{PERSONA_3_RESPONSIBILITY_1}}
  - {{PERSONA_3_RESPONSIBILITY_2}}
  - {{PERSONA_3_RESPONSIBILITY_3}}
- **Key Skills**: {{PERSONA_3_SKILLS}}
- **Escalation Protocol**: {{PERSONA_3_ESCALATION}}

### {{PERSONA_4}} Persona
- **Core Focus**: {{PERSONA_4_FOCUS}}
- **Primary Responsibilities**:
  - {{PERSONA_4_RESPONSIBILITY_1}}
  - {{PERSONA_4_RESPONSIBILITY_2}}
  - {{PERSONA_4_RESPONSIBILITY_3}}
- **Key Skills**: {{PERSONA_4_SKILLS}}
- **Escalation Protocol**: {{PERSONA_4_ESCALATION}}

---

## Segment: Quality & Compliance

### Documentation Requirements
- All transitions must be documented in Lifecycle Log
- Evidence must be embedded directly in task files
- Risk owners and mitigation strategies must be explicit
- Decision rationale must be clearly documented

### Security Standards
- Security scanning must be integrated into workflow
- Vulnerability assessment required before progression
- Secret management and access control validation
- Compliance standards must be enforced throughout

### Performance Standards
- Performance benchmarks must be established and validated
- Load testing requirements for critical components
- Resource utilization limits and monitoring
- Service level agreements (SLAs) must be defined and met

### Risk Management
- Sev-High issues must be escalated immediately
- Scope gaps must be routed through Product persona
- Technical risks must be surfaced via Tech Lead
- Quality concerns must be flagged by QA persona

---

## Segment: Infrastructure & Tools

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

### Development Environment
- Local development environment must mirror production
- Development tools must support State Machine workflow
- Debugging and troubleshooting capabilities required
- Environment promotion pathways must be documented

### Tool Configuration
{{#each TOOL_LIST}}
- **{{tool_name}}**: {{tool_purpose}} - {{tool_status}}
{{/each}}

---

## Segment: Context Management

### Context Snapshot Protocol
- Use context.snapshot skill before handoffs between personas
- Capture unresolved questions and decision deadlines
- Document required evidence for the next agent
- Maintain audit trail in Lifecycle Log

### Context Compact Procedure
- Run context-compact when Activity Log grows large
- Archive detailed history to bottom of file or separate archive
- Reference archive path in Lifecycle Log
- Maintain Rolling Summary for current state

### Context Pack Structure
- `<<story.current_state>>`: Current story status and progress
- `<<personas.active_assignments>>`: Active persona assignments
- `<<recent_transition_log>>`: Recent transition history
- `<<<GLOSSARY(term=...)>>>`: Relevant terminology lookups

### Knowledge Preservation
- All decisions must be documented with rationale
- Technical approaches must be captured for reuse
- Lessons learned must be extracted and shared
- Knowledge transfer procedures must be established

---

*This constitution establishes the State Machine Transition Mechanism as the authoritative workflow for all persona deliverables, ensuring consistent quality, auditability, and coordination across the development lifecycle.*