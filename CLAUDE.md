# Claude AI Assistant Guide for Spec Gen

## Overview

This guide serves as the comprehensive manual for Claude AI assistants working within the Spec Gen monorepo environment. It provides the necessary context, workflows, and guidelines to effectively assist with development, architecture, product management, and quality assurance tasks.

## Quick Start

### For Claude AI Assistants
1. **Load Context**: From the project root, familiarize yourself with the `.spec/` directory structure
2. **Agent Activation**: Use activation phrases to assume specific agent roles:
   - `As architect orchestrator, scope task SPEC-001`
   - `As product ops orchestrator, run product cycle for SPEC-002`
   - `As tech lead orchestrator, execute implementation for SPEC-003`
   - `As qa orchestrator, validate quality for SPEC-004`
3. **Task Management**: Record task IDs and maintain Rolling Summaries
4. **Context Reset**: Archive conclusions in Activity Log when switching tasks

### Development Environment
**🆕 Development Startup Script**: Use the comprehensive development script for managing all services:

```bash
# Start all services (API + Client)
npm run dev:full
# or: ./dev-startup.sh start

# Stop all services
npm run dev:stop
# or: ./dev-startup.sh stop

# Check service status
npm run dev:status

# Install dependencies and setup environment
npm run dev:install

# Show help
npm run dev:help
```

**Services Started**:
- **API Server**: http://localhost:4000 (with demo endpoints)
- **Client App**: http://localhost:5173 (React application)
- **Demo Endpoints**: Auth, CRM, Chat, Content Generation with realistic AI responses

### 🆕 **State Machine Templates**
The templates have been consolidated into 5 main files with comprehensive State Machine features:
- **Constitution Template**: Complete workflow definition with 8 markdown segments
- **Agent Template**: Agent specifications with transition mechanisms and specializations
- **Skill Template**: Skill specifications with orientation, execution, and validation procedures
- **Glossary Template**: Comprehensive terminology definitions with cross-references
- **Task Template**: Single-file task package with Lifecycle Log
- **Template Variables**: Use `{{PROJECT_NAME}}`, `{{AGENT_NAME}}`, `{{CURRENT_DATE}}` for personalization
- **Segment Headers**: Clean markdown organization with `## Segment:` format
- **Transition Protocols**: BLOCKED protocol and structured transition logging
- **Quality Standards**: Built-in validation checklists and compliance requirements

### Project Structure
```
.spec/
├── agents/          # Agent specifications and workflows
├── skills/          # Standard Operating Procedures (SOPs) for tasks
├── tasks/           # Single-file task packages (PROJECT-XXX.md)
├── templates/       # Consolidated templates (5 main files)
│   ├── constitution.template.md
│   ├── agent.template.md
│   ├── skill.template.md
│   ├── glossary.template.md
│   └── task-template.md
├── glossary.md      # Domain vocabulary and terminology
└── register.json    # Skill and concept registry
```

## Core Concepts

### State Machine Transition Mechanism
- **Principle**: Orient → Scope → Execute → Gate sequence governs all persona deliverables
- **Benefit**: Consistent workflow, auditability, and structured handoffs
- **Implementation**: Use prescribed gate order with structured transition logging

### Task Package Structure
Each task follows the `PROJECT-XXX` naming convention and contains:
- **Header**: Domain, Status, Owner, Last Updated
- **Product Brief**: Problem, Goals, Success Metrics, Constraints, Attached Context
- **Lifecycle Log**: Centralized story log with structured transition entries

### Context Management
- **Lifecycle Log**: Centralized log capturing all transition metadata with proper tag formatting
- **Context Snapshot**: Skill to capture current status before/after handoffs or stalls
- **BLOCKED Protocol**: Format for missing prerequisites with resolution steps
- **Transition Modes**: strict, tolerant, or branch execution modes

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

## Agent System

### Agent Directory

| Agent | ID | Activation Phrase | Primary Focus |
|-------|----|-------------------|---------------|
| Architect | `architect` | `As architect, …` | Architecture decisions, NFR targets, risk assessment |
| Product Ops | `product-ops` | `As product ops, …` | Task file ownership, product framing, stakeholder communication |
| Tech Lead | `tech-lead` | `As tech lead, …` | Engineering execution, code reviews, technical coordination |
| QA | `qa` | `As qa, …` | Quality assurance, testing coordination, Go/No-Go decisions |

### Agent Responsibilities

#### Architect
- **Location**: `.spec/agents/architect.agent.md`
- **Core Focus**: Architecture decisions, non-functional requirements, risk mitigation
- **Key Skills**: `architect-plan`, `analytics-research`, `research`, `context-compact`
- **Output Location**: Lifecycle Log with transition entries

#### Product Ops
- **Location**: `.spec/agents/product-ops.agent.md`
- **Core Focus**: Task file ownership, product lifecycle, stakeholder communication
- **Key Skills**: `analytics-research`, `product-prd`, `agile-plan`, `pm-sync`, `context-compact`, `research`
- **Output Location**: Lifecycle Log with transition entries

#### Tech Lead
- **Location**: `.spec/agents/tech-lead.agent.md`
- **Core Focus**: Engineering execution, code quality, technical coordination
- **Key Skills**: `architect-plan`, `code-review`, `code-unit`, `qa-contract`, `qa-e2e`, `qa-stress`, `research`, `analytics-research`, `context-compact`
- **Output Location**: Lifecycle Log with transition entries

#### QA
- **Location**: `.spec/agents/qa.agent.md`
- **Core Focus**: Quality assurance, testing strategy, validation
- **Key Skills**: `code-unit`, `qa-contract`, `qa-e2e`, `qa-stress`, `code-review`, `research`, `context-compact`
- **Output Location**: Lifecycle Log with transition entries

## Skill System

### Skill Surface (Routes)

| Skill | Gate Transition | Typical Owner | Output Location |
|-------|----------------|---------------|-----------------|
| `product-discovery` | Validate problem and market need | Product Ops | Lifecycle Log |
| `product-prd` | Capture requirements and acceptance criteria | Product Ops | Lifecycle Log |
| `agile-planning` | Sequence backlog and allocate capacity | Product Ops | Lifecycle Log |
| `code-implement` | Build feature with automated tests | Tech Lead | Lifecycle Log |
| `code-review` | Verify code quality and architecture compliance | Tech Lead | Lifecycle Log |
| `qa-ready` | Prepare test environment and fixtures | QA | Lifecycle Log |
| `qa-contract` | Validate API/event contracts | QA | Lifecycle Log |
| `qa-e2e` | Verify end-to-end user journeys | QA | Lifecycle Log |
| `pm-sync` | Update stakeholders and close story | Product Ops | Lifecycle Log |
| `context-snapshot` | Capture status before/after handoffs | Any agent | Lifecycle Log |
| `context-compact` | Manage Lifecycle Log size | Any agent | Lifecycle Log/Archive |

### Additional Skills
| Skill | Trigger Scenario | Typical Owner | Output Location |
|-------|------------------|---------------|-----------------|
| `analytics-research` | Validate metrics, hypotheses, or data gaps | Product Ops / Analytics | Lifecycle Log |
| `architect-plan` | Architecture options, decisions, risks | Architect | Lifecycle Log |
| `research` | Market, competitive, or feasibility investigation | Any agent | Lifecycle Log |

### Skill Execution Pattern
1. **Load Context**: Understand task state and requirements
2. **Execute SOP**: Follow standardized procedure defined in skill file
3. **Embed Evidence**: Include all results, metrics, and decisions in task file
4. **Update Status**: Modify Rolling Summary and add Activity Log entry
5. **Handoff**: Flag next actions and responsible agents

## Workflow Patterns

### Task Lifecycle
1. **Initiation**: Product Ops creates task with Product Brief
2. **Architecture**: Architect provides technical direction and NFRs
3. **Planning**: Tech Lead creates execution plan and milestones
4. **Implementation**: Tech Lead coordinates development and testing
5. **Validation**: QA ensures quality standards are met
6. **Completion**: Product Ops validates delivery and updates stakeholders

### Agent Handoffs
- **Clear Transition**: Explicit handoff statements in Rolling Summary
- **Context Preservation**: Complete state information in task file
- **Next Actions**: Clear ownership and next steps defined
- **Status Updates**: Current status and blocking issues highlighted

### Quality Gates
- **Product Brief Complete**: All sections filled with SMART goals
- **Architecture Approved**: Technical approach validated and documented
- **Implementation Ready**: Code reviewed and tests passing
- **Testing Complete**: All test levels executed with evidence
- **Delivery Validated**: KPIs met and stakeholders informed

## File Management

### Task Files
- **Format**: `.spec/tasks/PROJECT-XXX.md`
- **Structure**: Follow task template with all required sections
- **Updates**: Single file approach - all modifications in one place
- **Version Control**: Git tracking with clear commit messages

### Skill Files
- **Format**: `.spec/skills/skill-name.skill.md`
- **Structure**: SOP format with Purpose, Target Agent, Trigger Scenarios, Required MCPs/Tools, Core Procedure
- **Updates**: Template-based with parameterization for flexibility

### Agent Files
- **Format**: `.spec/agents/agent-name.agent.md`
- **Structure**: Comprehensive agent specification with skills, workflows, quality standards
- **Updates**: Maintain consistency across agent ecosystem

## Communication Standards

### Lifecycle Log Format
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

### BLOCKED Format
```
BLOCKED(missing_inputs=[prerequisite1, prerequisite2], unblock_steps=[step1, step2])
```

### Status Updates
- **Header Status**: Update task status (draft, in_progress, blocked, done)
- **Transition Modes**: Use strict, tolerant, or branch modes as appropriate
- **CLI Readability**: Keep entries ≤120 chars per line for command line compatibility

## Quality Standards

### Documentation Quality
- **Completeness**: All sections filled with accurate, relevant information
- **Clarity**: Clear, concise language with minimal ambiguity
- **Evidence**: All claims supported by data and embedded evidence
- **Consistency**: Follow established templates and formatting guidelines

### Technical Quality
- **Code Standards**: Follow language-specific best practices
- **Test Coverage**: Meet defined coverage thresholds
- **Security**: Implement security-by-design principles
- **Performance**: Meet defined performance targets

### Process Quality
- **Traceability**: Complete audit trail of all decisions and actions
- **Accountability**: Clear ownership and responsibility assignment
- **Communication**: Timely, accurate, and relevant updates
- **Continuous Improvement**: Learn from experience and refine processes

## Tools and Integration

### Required Tools
- **Git**: Version control and collaboration
- **Docker**: Containerization and environment management
- **GitHub Actions**: CI/CD pipeline automation
- **Node.js**: Runtime environment for applications
- **Testing Frameworks**: Jest, Cypress, or equivalent

### MCP Integration
- **Context Management**: Maintain conversation context across sessions
- **Tool Usage**: Leverage available tools for file operations, web access, etc.
- **Skill Execution**: Use skill system for standardized procedures
- **Agent Coordination**: Facilitate multi-agent collaboration

### Development Environment
- **Local Development**: Docker Compose with hot-reload
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Production**: Tesseract orchestration with monitoring
- **Security**: Vulnerability scanning and secret management

## Best Practices

### For Claude AI Assistants
1. **Understand Context**: Always load and understand current task state before acting
2. **Follow SOPs**: Use skill system for standardized procedures
3. **Embed Evidence**: Include all results and decisions in task files
4. **Communicate Clearly**: Use established formats for status updates
5. **Maintain Audit Trail**: Never modify existing Activity Log entries

### For Task Management
1. **Single File Approach**: Keep all task information in one file
2. **Rolling Summaries**: Update context continuously
3. **Quality Gates**: Ensure each phase meets standards before proceeding
4. **Evidence Collection**: Gather quantitative data throughout process
5. **Stakeholder Communication**: Keep all parties informed of progress

### For Code Quality
1. **Review Process**: All code must be reviewed before integration
2. **Test Coverage**: Meet or exceed coverage thresholds
3. **Security First**: Implement security measures from the beginning
4. **Performance Awareness**: Consider performance implications
5. **Documentation**: Maintain clear, accurate documentation

## Troubleshooting

### Common Issues
- **Context Loss**: Use Rolling Summary and Activity Log to recover state
- **Missing Information**: Check task file and related documentation
- **Tool Failures**: Verify tool availability and permissions
- **Agent Confusion**: Clear role definition and activation phrases
- **File Conflicts**: Use git status and resolve conflicts systematically

### Escalation Procedures
1. **Document Issue**: Add detailed description to task file
2. **Flag Blocker**: Update Rolling Summary with clear blocking issue
3. **Assign Owner**: Identify responsible agent for resolution
4. **Set Timeline**: Define expected resolution time
5. **Follow Up**: Monitor progress and provide support

## Continuous Improvement

### Learning Collection
- **Success Patterns**: Document effective approaches and outcomes
- **Failure Analysis**: Analyze issues and prevention strategies
- **Process Refinement**: Update templates and SOPs based on experience
- **Tool Enhancement**: Identify and implement tool improvements

### Template Evolution
- **Usage Patterns**: Adapt based on actual task execution
- **Agent Feedback**: Incorporate improvements from AI assistant experience
- **Quality Metrics**: Refine based on success rates and quality measures
- **New Capabilities**: Integrate new tools and techniques

## Appendix

### Template Files
- **Task Template**: `.spec/templates/task-template.md` - Single-file task package with Lifecycle Log
- **Constitution Template**: `.spec/templates/constitution.template.md` - Complete State Machine workflow with 8 segments
- **Agent Template**: `.spec/templates/agent.template.md` - Agent specifications with transition mechanisms and specializations
- **Skill Template**: `.spec/templates/skill.template.md` - Skill specifications with orientation, execution, and validation procedures
- **Glossary Template**: `.spec/templates/glossary.template.md` - Comprehensive terminology definitions with cross-references

### 🆕 **State Machine Template Features**

#### **Constitution Template**
- **8 Segments**: Complete coverage from Header to Context Management
- **Markdown Headers**: Clean `## Segment:` organization format
- **Gate Sequence**: Prescribed 9-step workflow from product.discovery to pm.sync
- **Persona Responsibilities**: Defined roles for architect, product-ops, tech-lead, qa
- **Quality Standards**: Built-in compliance and validation requirements
- **Infrastructure Integration**: MCP tools and registry coordination

#### **Agent Template**
- **Agent Specifications**: Complete agent definitions with mandates and bounds
- **State Machine Compliance**: Orientation checks and transition protocols
- **BLOCKED Protocol**: Structured escalation for missing prerequisites
- **Specialization Patterns**: Architect, Product Ops, Tech Lead, QA patterns
- **Quality Standards**: Documentation and execution standards
- **Integration Guidelines**: Registry coordination and skill execution flow

#### **Skill Template**
- **Skill Specifications**: Complete skill definitions with purpose and execution
- **Orientation Procedures**: Pre-execution validation and context loading
- **Execution Algorithms**: Step-by-step procedures with quality gates
- **Evidence Requirements**: Quantitative metrics and validation criteria
- **Specialization Patterns**: Gate transitions and supporting skills
- **Integration Guidelines**: MCP tools and registry coordination

#### **Glossary Template**
- **Comprehensive Terminology**: Complete State Machine and workflow terminology
- **7 Segments**: Header, State Machine Terms, Agent & Workflow Terms, Quality & Compliance, Technical Infrastructure, Template Variables, Usage Examples
- **Cross-Reference System**: Internal linking between related concepts
- **Quality Standards**: Definition clarity, accuracy, completeness requirements
- **Integration Guidelines**: Registry, template system, and usage coordination
- **Maintenance Framework**: Update processes and evolution management

#### **Template Usage**
- **Variable System**: Handlebars syntax for dynamic content
- **CLI Readability**: ≤120 characters per line constraint
- **Quality Validation**: Built-in checklists and testing procedures
- **Documentation Standards**: Evidence embedding and transition logging

### Registry and Glossary
- **Skill Registry**: `.spec/register.json`
- **Glossary**: `.spec/glossary.md`
- **Configuration**: `.spec/config.json` (if exists)

### Example Tasks
- **SPEC-001**: Tesseract Deployment Configuration (completed)
- **Reference**: Check `.spec/tasks/` directory for additional examples

## Support and Contact

### Getting Help
- **Documentation**: Refer to this guide and template files
- **Templates**: Use established templates for consistency
- **Examples**: Review completed tasks for patterns
- **Glossary**: Check terminology in `.spec/glossary.md`

### Contributing
- **Improvements**: Suggest enhancements to templates and processes
- **Bug Reports**: Document issues in task files with clear descriptions
- **New Patterns**: Share effective approaches and techniques
- **Feedback**: Provide constructive feedback for continuous improvement

---

*This guide is a living document, continuously updated based on experience and feedback. Last updated: 2025-10-18T19:00:00+03:00*