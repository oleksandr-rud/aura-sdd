# Glossary Template

## Overview
This template provides comprehensive terminology definitions for the AURA workflow system.

---

## Segment: Header

```markdown
# {{GLOSSARY_TITLE}}

- **Version**: {{VERSION}}
- **Last Updated**: {{CURRENT_DATE}}
- **Scope**: {{SCOPE_DESCRIPTION}}
- **Purpose**: {{PURPOSE_STATEMENT}}

## About This Glossary
This glossary defines core terminology, concepts, and specialized vocabulary used throughout the AURA State Machine workflow system. It serves as the authoritative reference for agents, developers, and stakeholders working within this ecosystem.
```

---

## Segment: Workflow Terms

```markdown
## Workflow Terminology

### Core Concepts

#### Workflow Transition System
- **Definition**: A structured workflow system that manages progress through predefined phases
- **Purpose**: Ensures orderly progression from problem identification through implementation and validation
- **Components**: Orient → Scope → Execute → Gate sequence with BLOCKED protocol
- **Usage**: "The workflow system ensures all prerequisites are satisfied before phase transitions"

#### Orient
- **Definition**: Initial state where agents assess context, verify prerequisites, and prepare for execution
- **Activities**: Context loading, orientation checks, prerequisite validation, blocker detection
- **Transition**: Must complete orientation checks before proceeding to scope
- **Usage**: "During Orient phase, the architect verifies architectural prerequisites"

#### Scope
- **Definition**: Planning phase where specific work is defined, bounded, and prepared for execution
- **Activities**: Task definition, work breakdown, resource allocation, timeline planning
- **Transition**: Must produce scoped work plan before proceeding to execute
- **Usage**: "The Scope phase resulted in a 3-sprint implementation plan"

#### Execute
- **Definition**: Implementation phase where scoped work is performed according to defined standards
- **Activities**: Code development, testing, documentation, quality assurance
- **Transition**: Must complete all work items before proceeding to gate
- **Usage**: "Execute phase included unit testing with 85% coverage"

#### Gate
- **Definition**: Validation point where work is reviewed, approved, and transitioned to next state
- **Activities**: Quality validation, stakeholder review, sign-off, transition logging
- **Transition**: Must pass gate criteria before proceeding to next orient
- **Usage**: "The code.implement gate was passed with minimal technical debt"

### Gate Sequence

#### product.discovery
- **Definition**: Gate for validating problem understanding and solution approach
- **Owner**: Product Ops
- **Inputs**: Problem statement, stakeholder requirements, market research
- **Outputs**: Validated problem, solution hypothesis, acceptance criteria
- **Success Criteria**: Problem validation complete, stakeholders aligned, approach approved

#### product.prd
- **Definition**: Gate for capturing detailed product requirements and specifications
- **Owner**: Product Ops
- **Inputs**: Validated problem, stakeholder inputs, business requirements
- **Outputs**: Product requirements document, user stories, acceptance criteria
- **Success Criteria**: PRD complete, requirements clear, acceptance criteria defined

#### agile.planning
- **Definition**: Gate for sprint planning and execution timeline definition
- **Owner**: Product Ops
- **Inputs**: PRD, team capacity, technical estimates, dependencies
- **Outputs**: Sprint plan, timeline, resource allocation, risk mitigation
- **Success Criteria**: Sprint plan approved, timeline realistic, resources allocated

#### code.implement
- **Definition**: Gate for feature development and initial implementation
- **Owner**: Tech Lead
- **Inputs**: Sprint plan, technical specifications, architecture guidelines
- **Outputs**: Feature code, unit tests, documentation, implementation notes
- **Success Criteria**: Code complete, tests passing, documentation updated

#### code.review
- **Definition**: Gate for code quality validation and architectural compliance
- **Owner**: Tech Lead
- **Inputs**: Feature code, unit tests, architecture specifications
- **Outputs**: Reviewed code, quality assessment, architectural validation
- **Success Criteria**: Code review passed, quality standards met, architecture compliance

#### qa.ready
- **Definition**: Gate for preparing comprehensive testing strategy
- **Owner**: QA
- **Inputs**: Reviewed code, acceptance criteria, quality standards
- **Outputs**: Test plan, test cases, automation strategy, acceptance criteria
- **Success Criteria**: Test plan complete, automation defined, resources prepared

#### qa.contract
- **Definition**: Gate for interface validation and contract compliance
- **Owner**: QA
- **Inputs**: Feature code, interface specifications, API contracts
- **Outputs**: Contract validation results, interface tests, compliance report
- **Success Criteria**: Contracts validated, interfaces tested, compliance confirmed

#### qa.e2e
- **Definition**: Gate for end-to-end system validation and user acceptance
- **Owner**: QA
- **Inputs**: Tested code, user stories, acceptance criteria, test environment
- **Outputs**: E2E test results, acceptance validation, performance metrics
- **Success Criteria**: E2E tests passing, acceptance criteria met, performance targets achieved

#### pm.sync
- **Definition**: Gate for stakeholder communication and delivery validation
- **Owner**: Product Ops
- **Inputs**: E2E test results, delivery artifacts, stakeholder requirements
- **Outputs**: Stakeholder update, delivery report, lessons learned, next steps
- **Success Criteria**: Stakeholders informed, delivery validated, learnings captured

### Transition Mechanics

#### BLOCKED Protocol
- **Definition**: Structured mechanism for handling missing prerequisites or blockers
- **Format**: `BLOCKED(missing_inputs=[prereq1, prereq2], unblock_steps=[step1, step2])`
- **Purpose**: Clearly communicate blockers and required resolution steps
- **Usage**: "BLOCKED(missing_inputs=[api_specs], unblock_steps=[schedule_architect_review])"

#### Transition Log
- **Definition**: Structured record of all state transitions within the system
- **Format**: `[TRANSITION|gate.tag] by agent_name` with detailed output
- **Purpose**: Complete audit trail of workflow progression and decisions
- **Usage**: "Transition logged in Lifecycle Log for audit trail maintenance"

#### Lifecycle Log
- **Definition**: Complete chronological record of task lifecycle events and transitions
- **Structure**: Rolling summary with Context | Facts | Decisions | Risks | Next sections
- **Purpose**: Maintain complete audit trail and enable context restoration
- **Usage**: "Lifecycle Log shows all transitions from discovery to delivery"

## Agent & Workflow Terms

### Agent Roles

#### Architect (architect)
- **Definition**: Technical leader responsible for architecture decisions and NFR compliance
- **Core Focus**: System architecture, technical standards, risk assessment, scalability
- **Primary Gates**: architect.plan, architecture validation
- **Key Skills**: architect-plan, analytics-research, research, context-compact
- **Usage**: "The architect reviewed the system architecture for scalability"

#### Product Ops (product-ops)
- **Definition**: Product owner responsible for requirements, planning, and stakeholder coordination
- **Core Focus**: Product lifecycle, requirements management, stakeholder communication
- **Primary Gates**: product.discovery, product.prd, agile.planning, pm.sync
- **Key Skills**: analytics-research, product-prd, agile-plan, pm-sync, context-compact
- **Usage**: "Product ops defined the user stories and acceptance criteria"

#### Tech Lead (tech-lead)
- **Definition**: Engineering leader responsible for code quality and technical execution
- **Core Focus**: Code implementation, technical coordination, quality standards
- **Primary Gates**: code.implement, code.review, qa.contract
- **Key Skills**: code-implement, code-review, qa-contract, architect-plan, research
- **Usage**: "The tech lead coordinated the code review process"

#### QA (qa)
- **Definition**: Quality assurance specialist responsible for testing and validation
- **Core Focus**: Test strategy, quality validation, user acceptance, performance
- **Primary Gates**: qa.ready, qa.contract, qa.e2e
- **Key Skills**: qa-ready, qa-contract, qa-e2e, code-review, analytics-research
- **Usage**: "QA prepared the comprehensive test strategy"

### Skill System

#### Skill
- **Definition**: Standard Operating Procedure (SOP) that can be executed by authorized agents
- **Structure**: Purpose, Target Agent, Trigger Scenarios, Required MCPs/Tools, Core Procedure
- **Execution**: Follows orient → scope → execute → gate pattern with transition logging
- **Usage**: "The analytics-research skill validated the market opportunity"

#### Skill Authorization
- **Definition**: Permission system controlling which agents can execute specific skills
- **Mechanism**: Registry-based mapping of agents to authorized skills
- **Purpose**: Ensure proper role-based access control for skill execution
- **Usage**: "The registry confirms tech-lead authorization for code-implement skill"

#### MCP Tools
- **Definition**: Model Context Protocol tools required for skill execution
- **Examples**: File operations, web access, code analysis, testing frameworks
- **Validation**: Tool availability verified during skill orientation
- **Usage**: "The skill requires MCP tools for code compilation and testing"

## Quality & Compliance Terms

### Quality Standards

#### CLI Readability
- **Definition**: Constraint ensuring all text entries fit within terminal display limits
- **Requirement**: ≤120 characters per line for all log entries and documentation
- **Purpose**: Maintain readability in command-line interfaces
- **Usage**: "All transition logs must respect CLI readability constraints"

#### Evidence Embedding
- **Definition**: Practice of including all evidence, metrics, and results directly in task files
- **Purpose**: Complete traceability without scattered artifacts
- **Implementation**: Use markdown code blocks, structured lists, and tables
- **Usage**: "Evidence embedding ensures complete audit trail in task files"

#### Risk Management
- **Definition**: Systematic approach to identifying, assessing, and mitigating project risks
- **Components**: Risk identification, impact assessment, mitigation planning, monitoring
- **Documentation**: Risks recorded with owners and mitigation strategies
- **Usage**: "Risk management identified technical debt as a high-priority concern"

### Validation Criteria

#### Acceptance Criteria
- **Definition**: Specific, measurable conditions that must be met for work to be considered complete
- **Format**: Clear, testable statements with measurable outcomes
- **Purpose**: Remove ambiguity in work completion requirements
- **Usage**: "Acceptance criteria include 95% test coverage and performance benchmarks"

#### Quality Gates
- **Definition**: Validation points that must be passed before proceeding to next workflow stage
- **Types**: Code quality gates, performance gates, security gates, documentation gates
- **Purpose**: Ensure quality standards are maintained throughout development
- **Usage**: "The quality gate requires all unit tests to pass with 80% coverage"

#### Success Metrics
- **Definition**: Quantitative measures used to determine if objectives have been achieved
- **Categories**: Performance metrics, quality metrics, business metrics, user metrics
- **Purpose**: Provide objective evidence of success or failure
- **Usage**: "Success metrics include response time <200ms and 99.9% uptime"

## Technical Infrastructure Terms

### System Components

#### Registry (register.json)
- **Definition**: Central configuration file tracking personas, skills, and State Machine configuration
- **Purpose**: Maintain authoritative mapping of agents to skills and workflow settings
- **Contents**: Skill definitions, agent authorizations, State Machine configuration
- **Usage**: "The registry confirms skill authorization and maintains workflow state"

#### MCP (Model Context Protocol)
- **Definition**: Protocol for AI model interaction with external tools and systems
- **Purpose**: Enable standardized access to development tools and resources
- **Examples**: File operations, web access, code analysis, testing tools
- **Usage**: "MCP tools enable agents to interact with the development environment"

#### Template System
- **Definition**: Standardized document formats for creating consistent artifacts
- **Types**: Task templates, skill templates, agent templates, constitution templates
- **Purpose**: Ensure consistency and quality across all documentation
- **Usage**: "Template system standardizes task creation and documentation"

### Development Practices

#### Single File Documentation
- **Definition**: Practice of keeping all related information within a single markdown file
- **Purpose**: Complete traceability without scattered artifacts
- **Benefits**: Easy handoffs, complete audit trail, simplified maintenance
- **Usage**: "Single file documentation keeps all task information in one place"

#### Rolling Summary
- **Definition**: Evolving context summary with structured sections
- **Format**: Context | Facts | Decisions | Risks | Next
- **Purpose**: Maintain current state information for context restoration
- **Usage**: "Rolling summary provides quick context overview for handoffs"

#### Activity Log
- **Definition**: Append-only chronological record of all actions and decisions
- **Format**: Timestamped entries with agent attribution and detailed descriptions
- **Purpose**: Complete audit trail of all work performed
- **Usage**: "Activity log maintains complete history of task progression"
```

---

## Segment: Template Variables Guide

```markdown
## Template Variables

### Required Variables

#### Glossary Information
- **{{GLOSSARY_TITLE}}**: Title for the glossary document
- **{{VERSION}}**: Version number (e.g., "3.0")
- **{{CURRENT_DATE}}**: Current date in ISO format (YYYY-MM-DD)
- **{{SCOPE_DESCRIPTION}}**: Description of glossary scope and coverage
- **{{PURPOSE_STATEMENT}}**: Clear statement of glossary purpose and audience

### Optional Variables

#### Customization
- **{{ORGANIZATION_NAME}}**: Organization name for customization
- **{{PROJECT_NAME}}**: Specific project name
- **{{DOMAIN_PREFIX}}**: Custom prefix for domain-specific terms
- **{{AUDIENCE_TYPE}}**: Target audience (technical, business, mixed)

### Formatting Guidelines
- Use consistent terminology throughout definitions
- Include usage examples for each term
- Provide clear distinctions between similar concepts
- Use cross-references where terms are related
- Maintain alphabetical ordering within sections
```

---

## Segment: Usage Examples

```markdown
## Glossary Examples

### Example Usage

#### Technical Terms
```
## API Gateway
- **Definition**: API management service that handles request routing, composition, and protocol translation
- **Purpose**: Provide unified entry point for client applications to access backend services
- **Components**: Load balancing, authentication, rate limiting, request transformation
- **Usage**: "The API Gateway routes client requests to appropriate microservices"
```

#### Process Terms
```
## Code Review
- **Definition**: Systematic examination of code by peers to identify defects and improve quality
- **Purpose**: Ensure code quality, knowledge sharing, and architectural compliance
- **Process**: Review request → Peer examination → Feedback → Resolution → Approval
- **Usage**: "Code review identified potential security vulnerabilities in the authentication module"
```

#### Role Terms
```
## Technical Lead
- **Definition**: Senior engineer responsible for technical leadership and code quality
- **Responsibilities**: Architecture guidance, code standards, technical decisions, mentorship
- **Skills**: System design, code review, problem-solving, team leadership
- **Usage**: "The technical lead reviewed the system architecture for scalability concerns"
```

### Integration Examples

#### Cross-Reference Usage
```
## Sprint Planning
- **Definition**: Process of defining work scope for upcoming sprint based on priorities and capacity
- **Related Terms**: {{link:Agile Planning}}, {{link:Velocity}}, {{link:Story Points}}
- **Process**: Backlog grooming → Priority setting → Capacity planning → Sprint commitment
- **Usage**: "Sprint planning resulted in commitment to 5 user stories totaling 25 story points"
```

#### Workflow Integration
```
## Quality Assurance
- **Definition**: Systematic process of ensuring product meets specified quality requirements
- **Workflow Position**: Occurs after {{link:Code Implementation}} and before {{link:Release}}
- **Activities**: Test planning, test execution, defect tracking, quality reporting
- **Usage**: "Quality assurance validates that all acceptance criteria are met before release"
```
```

---

## Segment: Quality Standards

```markdown
## Glossary Quality Standards

### Content Requirements

#### Definition Quality
- **Clarity**: Definitions must be clear, concise, and unambiguous
- **Accuracy**: Technical definitions must be accurate and current
- **Completeness**: All essential aspects of the concept must be covered
- **Examples**: Include practical usage examples for context

#### Organization Standards
- **Alphabetical Ordering**: Terms should be alphabetically ordered within sections
- **Cross-References**: Related terms should be cross-referenced
- **Consistent Formatting**: All definitions should follow consistent structure
- **Logical Grouping**: Terms should be grouped in logical categories

### Validation Criteria

#### Completeness Check
- [ ] All core State Machine terms defined
- [ ] All agent roles and responsibilities documented
- [ ] All skill types and procedures explained
- [ ] All quality standards and compliance terms included
- [ ] Cross-references between related terms established

#### Quality Check
- [ ] Definitions are clear and unambiguous
- [ ] Usage examples are practical and relevant
- [ ] Technical accuracy verified
- [ ] Consistent terminology used throughout
- [ ] Template variables properly formatted

### Maintenance Guidelines

#### Update Process
1. **Regular Review**: Quarterly review of all definitions
2. **Community Feedback**: Collect feedback from users and stakeholders
3. **Version Control**: Maintain version history and change tracking
4. **Validation**: Validate updates against current system behavior
5. **Communication**: Communicate significant changes to stakeholders

#### Evolution Management
- **New Terms**: Add new terms as system capabilities expand
- **Updated Definitions**: Revise definitions as concepts evolve
- **Deprecated Terms**: Mark deprecated terms with migration guidance
- **Consistency**: Maintain consistency with evolving system architecture
```

---

## Segment: Integration Guidelines

```markdown
## Integration with State Machine System

### Registry Integration

#### Term Registration
- **Registry Entries**: All terms should be referenced in register.json
- **Skill Mapping**: Terms should map to relevant skills and procedures
- **Agent References**: Terms should reference relevant agent roles and responsibilities
- **Workflow Position**: Terms should indicate position in State Machine workflow

#### Cross-Reference System
- **Internal Links**: Use markdown links for cross-references
- **External References**: Link to external documentation where appropriate
- **Skill References**: Reference specific skills that use the terminology
- **Agent References**: Reference agents responsible for term application

### Template System Integration

#### Template Variables
- **Consistent Naming**: Use consistent variable naming across templates
- **Cross-Template References**: Reference terms used in other templates
- **Validation**: Ensure template variables match glossary definitions
- **Documentation**: Document template variable usage in templates

#### Content Synchronization
- **Terminology Consistency**: Ensure consistent terminology across all templates
- **Definition Alignment**: Align definitions across different document types
- **Update Coordination**: Coordinate updates across related documents
- **Version Synchronization**: Maintain version alignment across system

### Usage Guidelines

#### For Agents
- **Reference**: Use glossary as primary reference for terminology questions
- **Validation**: Validate term usage against glossary definitions
- **Feedback**: Provide feedback on missing or unclear definitions
- **Consistency**: Maintain consistent terminology in all communications

#### For Developers
- **Documentation**: Use glossary terms consistently in code documentation
- **Comments**: Use standard terminology in code comments and commit messages
- **API Design**: Use glossary terms in API naming and documentation
- **Testing**: Use standard terminology in test cases and documentation

#### For Product Managers
- **Requirements**: Use standard terminology in requirements documentation
- **User Stories**: Apply consistent terminology in user story descriptions
- **Acceptance Criteria**: Use glossary terms in acceptance criteria definitions
- **Stakeholder Communication**: Maintain consistency in stakeholder communications
```

---

*This glossary template provides comprehensive terminology definitions for the AURA State Machine system, ensuring consistent communication and understanding across all agents and stakeholders.*