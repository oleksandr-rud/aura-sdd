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

### 🆕 **Enhanced Template Features**
The templates now include BMAD-inspired interactive guidance:
- **Template Variables**: Use `{{project-type}}`, `{{agent-name}}`, `{{current-date}}` for personalization
- **Interactive Guidance**: Built-in tips and examples in each template section
- **Quick Start Guides**: Step-by-step instructions for template usage
- **Pro Tips**: Expert guidance for best practices and common pitfalls
- **Success Criteria**: Clear validation checklists for each template type
- **Template Creation Guides**: Comprehensive guides for creating new templates
- **Quality Standards**: Measurable requirements and validation procedures

### Project Structure
```
.spec/
├── agents/          # Agent specifications and workflows
├── skills/          # Standard Operating Procedures (SOPs) for tasks
├── tasks/           # Single-file task packages (PROJECT-XXX.md)
├── templates/       # Reusable templates for tasks, skills, agents
├── glossary.md      # Domain vocabulary and terminology
└── register.json    # Skill and concept registry
```

## Core Concepts

### Single File Documentation
- **Principle**: All evidence, metrics, and results embedded directly in task files
- **Benefit**: Complete traceability, no scattered artifacts, easy handoffs
- **Implementation**: Use markdown code blocks, structured lists, and tables within task files

### Task Package Structure
Each task follows the `PROJECT-XXX` naming convention and contains:
- **Header**: Project metadata and task identification
- **Product Brief**: Problem definition, goals, constraints, KPIs
- **Rolling Summary**: Evolving context (Context | Facts | Decisions | Risks | Next)
- **Implementation Notes**: Technical architecture and execution details
- **Testing Notes**: Multi-layered testing strategy and results
- **Metrics & Evidence**: Quantitative validation and performance data
- **Activity Log**: Chronological append-only record of all actions

### Context Management
- **Rolling Summary**: One-line status updates with clear sections
- **Activity Log**: Append-only entries with timestamps and agent attribution
- **Context Compact**: Skill to manage log size when content grows large

## Agent System

### Agent Directory

| Agent | ID | Activation Phrase | Primary Focus |
|-------|----|-------------------|---------------|
| Architect Orchestrator | `architect-orchestrator` | `As architect orchestrator, …` | Architecture decisions, NFR targets, risk assessment |
| Product Ops Orchestrator | `product-ops-orchestrator` | `As product ops orchestrator, …` | Task file ownership, product framing, stakeholder communication |
| Tech Lead Orchestrator | `tech-lead-orchestrator` | `As tech lead orchestrator, …` | Engineering execution, code reviews, technical coordination |
| QA Orchestrator | `qa-orchestrator` | `As qa orchestrator, …` | Quality assurance, testing coordination, Go/No-Go decisions |

### Agent Responsibilities

#### Architect Orchestrator
- **Location**: `.spec/agents/architect.agent.md`
- **Core Focus**: Architecture decisions, non-functional requirements, risk mitigation
- **Key Skills**: `architect-plan`, `analytics-research`, `research`, `context-compact`
- **Output Location**: Implementation Notes with embedded architecture decisions

#### Product Ops Orchestrator
- **Location**: `.spec/agents/product-ops.agent.md`
- **Core Focus**: Task file ownership, product lifecycle, stakeholder communication
- **Key Skills**: `analytics-research`, `product-prd`, `agile-plan`, `pm-sync`, `context-compact`, `research`
- **Output Location**: Product Brief, Rolling Summary, Activity Log

#### Tech Lead Orchestrator
- **Location**: `.spec/agents/tech-lead.agent.md`
- **Core Focus**: Engineering execution, code quality, technical coordination
- **Key Skills**: `architect-plan`, `code-review`, `code-unit`, `qa-contract`, `qa-e2e`, `qa-stress`, `research`, `analytics-research`, `context-compact`
- **Output Location**: Implementation Notes, Testing Notes, Rolling Summary

#### QA Orchestrator
- **Location**: `.spec/agents/qa.agent.md`
- **Core Focus**: Quality assurance, testing strategy, validation
- **Key Skills**: `code-unit`, `qa-contract`, `qa-e2e`, `qa-stress`, `code-review`, `research`, `context-compact`
- **Output Location**: Testing Notes with Go/No-Go decisions

## Skill System

### Skill Surface (Routes)

| Skill | Trigger Scenario | Typical Owner | Output Location |
|-------|------------------|---------------|-----------------|
| `analytics-research` | Validate metrics, hypotheses, or data gaps | Product Ops / Analytics | Metrics & Evidence |
| `architect-plan` | Architecture options, decisions, risks | Architect | Implementation Notes |
| `agile-plan` | Sprint planning and execution breakdown | Product Ops | Implementation Notes |
| `product-prd` | Product narratives, KPIs, acceptance criteria | Product Ops | Product Brief |
| `code-review` | Code audit with severity classifications | Tech Lead / QA | Implementation Notes |
| `code-unit` | Unit test scaffolding and coverage | Tech Lead / QA | Testing Notes |
| `qa-contract` | Interface compatibility validation | QA | Testing Notes |
| `qa-e2e` | End-to-end user journey validation | QA | Testing Notes |
| `qa-stress` | System capacity and scalability validation | QA | Testing Notes |
| `pm-sync` | Stakeholder update preparation | Product Ops | Rolling Summary |
| `research` | Market, competitive, or feasibility investigation | Any agent | Relevant Section |
| `context-compact` | Activity Log size management | Any agent | Activity Log/Archive |

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

### Activity Log Format
```
YYYY-MM-DDTHH:MM:SS+TZ:TZ - agent-name - Detailed description of work completed, decisions made, and outcomes achieved
```

### Rolling Summary Format
```
Context: Brief evolving context statement | Facts: Key established facts and completed work | Decisions: Important decisions made and their rationale | Risks: Current risks and mitigation approaches | Next: Immediate next steps and priorities
```

### Status Updates
- **Header Status**: Update task status (planning, in_progress, completed, blocked, on_hold)
- **Progress Indicators**: Use checkboxes and completion percentages
- **Blocking Issues**: Flag immediately with owners and resolution plans

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
- **Task Template**: `.spec/templates/task-template.md` - Enhanced with BMAD-inspired interactive guidance
- **Skill Template**: `.spec/templates/skill-template.md` - Improved with comprehensive creation guide
- **Agent Template**: `.spec/templates/agent-template.md` - Enhanced with workflow integration guidance
- **Best Practices**: `.spec/templates/task-best-practices.md` - Success patterns and anti-patterns

### 🆕 **Template Enhancements**
All templates have been enhanced with BMAD-inspired features while maintaining full backward compatibility:

#### **Task Template Improvements**
- **Quick Start Guide**: Step-by-step instructions for new users
- **Interactive Guidance**: Tips and examples in every section
- **Template Variables**: Dynamic content personalization
- **Pro Tips**: Expert guidance for common scenarios
- **Success Criteria**: Clear validation checklists
- **Template Usage Guide**: Comprehensive usage instructions

#### **Skill Template Improvements**
- **Skill Creation Guide**: Complete step-by-step process
- **Best Practices**: Detailed guidance for skill design
- **Template Variables**: Context-aware personalization
- **Quality Standards**: Measurable requirements
- **Validation Checklist**: Pre-launch validation criteria
- **Example Templates**: Real-world examples and patterns

#### **Agent Template Improvements**
- **Agent Creation Guide**: Specialization patterns and best practices
- **Workflow Integration**: Enhanced coordination guidance
- **Template Variables**: Role-specific personalization
- **Coordination Patterns**: Handoff and collaboration procedures
- **Quality Standards**: Implementation and communication standards
- **Agent Specializations**: Tech Lead, Product Ops, Architect, QA patterns

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