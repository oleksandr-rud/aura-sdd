# Skill Template

## Overview
This template provides a standardized format for creating skill specifications with clear execution procedures and validation criteria.

---

## Segment: Identity

```markdown
# {{SKILL_NAME}} Skill

## Segment: Identity

- **Skill ID**: {{SKILL_ID}}
- **Version**: {{VERSION}}
- **Last Updated**: {{CURRENT_DATE}}
- **Target Agent**: {{TARGET_AGENT}}

## Segment: Purpose

### Core Purpose
{{CORE_PURPOSE}}

### Success Criteria
{{#each SUCCESS_CRITERIA}}
- {{criterion}}
{{/each}}

### Trigger Scenarios
{{#each TRIGGER_SCENARIOS}}
- **{{scenario_name}}**: {{scenario_description}}
{{/each}}

## Segment: Required MCPs/Tools

### MCP Dependencies
{{#each MCP_DEPS}}
- **{{mcp_name}}**: {{mcp_purpose}} - {{mcp_status}}
{{/each}}

### Tool Requirements
{{#each TOOLS}}
- **{{tool_name}}**: {{tool_purpose}} - {{tool_requirement}}
{{/each}}

### Prerequisites
{{#each PREREQUISITES}}
- {{prerequisite_name}}: {{prerequisite_description}}
{{/each}}

## Segment: Orientation

### Orientation Checks
{{#each ORIENTATION_CHECKS}}
- **{{check_name}}**: {{check_description}}
{{/each}}

### Pre-execution Validation
- **Agent Authorization**: Verify agent has skill authorization
- **Tool Availability**: Confirm required tools are accessible
- **Context Loading**: Load current task state and history
- **Prerequisite Check**: Validate all prerequisites are satisfied

### Context Assessment
- **Current Phase**: Identify current project phase
- **Previous Work**: Review recent work history
- **Blocker Detection**: Check for blocking issues
- **Readiness Assessment**: Confirm readiness for execution

## Segment: Execution Planning

### Execution Mode
- **strict**: All prerequisites must be satisfied
- **tolerant**: Continue with missing inputs but flag gaps
- **branch**: Create parallel work streams for complexity

### Work Progression
```
FROM: {{FROM_STATE}}
TO: {{TO_STATE}}
TYPE: {{TRANSITION_TYPE}}
```

### Compliance Requirements
- **Sequence Order**: Must follow prescribed sequence
- **Progress Logging**: Must log all progress changes
- **Evidence Generation**: Must produce auditable outputs

## Segment: Execution Algorithm

### Step-by-Step Procedure
{{#each EXECUTION_STEPS}}
{{@index}}. **{{step_name}}**
   - **Purpose**: {{step_purpose}}
   - **Tools**: {{step_tools}}
   - **Output**: {{step_output}}
   - **Validation**: {{step_validation}}
{{/each}}

### Quality Gates
{{#each QUALITY_GATES}}
- **{{gate_name}}**: {{gate_criteria}}
{{/each}}

### Error Handling
{{#each ERROR_HANDLING}}
- **{{error_type}}**: {{error_resolution}}
{{/each}}

## Segment: Artifact Output

### Primary Outputs
{{#each PRIMARY_OUTPUTS}}
- **{{output_name}}**: {{output_description}} ({{output_location}})
{{/each}}

### Secondary Outputs
{{#each SECONDARY_OUTPUTS}}
- **{{output_name}}**: {{output_description}} ({{output_location}})
{{/each}}

### Evidence Requirements
- **Quantitative Metrics**: {{METRICS_REQUIREMENT}}
- **Qualitative Evidence**: {{EVIDENCE_REQUIREMENT}}
- **Validation Criteria**: {{VALIDATION_CRITERIA}}

## Segment: Progress Log Template

### Standard Format
```
[PROGRESS|{{SKILL_ID}}] by {{TARGET_AGENT}}
MODE: {{TRANSITION_MODE}}
FROM: {{FROM_STATE}}
TO: {{TO_STATE}}
WHY:
- {{reason_1}}
- {{reason_2}}
OUTPUT:
=== {{SKILL_NAME}} ===
summary: {{execution_summary}}
inputs: {{input_references}}
evidence: |result={{result}}|ref={{evidence_reference}}
risks: {{risk_assessment}}
next_steps: {{next_actions}}
=== END {{SKILL_NAME}} ===
FOLLOW-UP:
- {{follow_up_owner}} - due={{follow_up_date}}
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs={{missing_inputs}}, unblock_steps={{unblock_steps}})
```

## Segment: Skill Specialization

### {{SKILL_TYPE}} Pattern

#### Core Algorithm
{{CORE_ALGORITHM}}

#### Specialized Tools
{{#each SPECIALIZED_TOOLS}}
- **{{tool_name}}**: {{tool_usage}}
{{/each}}

#### Integration Points
{{#each INTEGRATION_POINTS}}
- **{{point_name}}**: {{point_description}}
{{/each}}

#### Validation Requirements
{{#each VALIDATION_REQUIREMENTS}}
- {{requirement}}
{{/each}}
```

---

## Segment: Template Variables Guide

### Required Variables

#### Skill Information
- **{{SKILL_NAME}}**: Display name for the skill
- **{{SKILL_ID}}**: Unique identifier (kebab-case)
- **{{VERSION}}**: Template version number
- **{{CURRENT_DATE}}**: Current date in ISO format
- **{{TARGET_AGENT}}**: Agent that can execute this skill
- **{{CORE_PURPOSE**}: Primary purpose statement

#### Purpose & Success
- **{{SUCCESS_CRITERIA}}**: Array of success criterion objects
- **{{TRIGGER_SCENARIOS}}**: Array of trigger scenario objects
- **{{PREREQUISITES}}**: Array of prerequisite objects

#### Execution
- **{{EXECUTION_STEPS}}**: Array of step objects with detailed properties
- **{{QUALITY_GATES}}**: Array of quality gate objects
- **{{ERROR_HANDLING}}**: Array of error handling objects

### Optional Variables

#### Transition & State
- **{{FROM_STATE}}**: Expected starting state
- **{{TO_STATE}}**: Target ending state
- **{{TRANSITION_MODE}}**: Default transition mode (strict/tolerant/branch)
- **{{TRANSITION_TYPE}}**: Type of transition being performed

#### Specialization
- **{{SKILL_TYPE}}**: Type of skill specialization
- **{{CORE_ALGORITHM}}**: Core algorithm description
- **{{SPECIALIZED_TOOLS}}**: Array of specialized tool objects
- **{{INTEGRATION_POINTS}}**: Array of integration point objects

#### Tools & MCPs
- **{{MCP_DEPS}}**: Array of MCP dependency objects
- **{{TOOLS}}**: Array of tool requirement objects
- **{{ORIENTATION_CHECKS}}**: Array of orientation check objects

### Formatting Guidelines
- Use kebab-case for all ID variables
- Provide clear descriptions in templates
- Include example values where helpful
- Use Handlebars syntax for array iteration
- Maintain consistent variable naming

---

## Segment: Skill Specialization Patterns

### Gate Transition Skills

```markdown
### product.discovery Skill Pattern

#### Core Algorithm
1. **Problem Validation**: Validate problem understanding and stakeholder alignment
2. **Solution Hypothesis**: Develop and validate solution approach
3. **Market Research**: Validate market opportunity and competitive landscape
4. **Risk Assessment**: Identify and assess implementation risks
5. **Acceptance Criteria**: Define clear success criteria and measurements

#### Specialized Tools
- **Market Research Tools**: Competitive analysis, market sizing
- **Stakeholder Management**: Communication, feedback collection
- **Risk Assessment**: Risk matrix, mitigation planning
- **Metrics Framework**: Success metrics definition and tracking

#### Integration Points
- **Product Requirements**: Feeds into product.prd skill
- **Architecture Planning**: Provides input for architect.plan skill
- **Stakeholder Communication**: Establishes communication patterns

#### Validation Requirements
- Problem validation complete with stakeholder sign-off
- Solution hypothesis tested and validated
- Market opportunity assessed and quantified
- Risk mitigation plan defined and approved
```

```markdown
### code.implement Skill Pattern

#### Core Algorithm
1. **Code Development**: Write feature code following architectural specifications
2. **Unit Testing**: Implement comprehensive unit tests with target coverage
3. **Documentation**: Create clear code documentation and usage examples
4. **Integration Testing**: Implement integration tests for component interactions
5. **Performance Validation**: Validate against performance requirements

#### Specialized Tools
- **IDE/Editor**: Code development environment
- **Testing Framework**: Unit and integration testing tools
- **Version Control**: Git for code management
- **CI/CD Pipeline**: Automated testing and validation
- **Code Quality Tools**: Linters, formatters, static analysis

#### Integration Points
- **Code Review**: Feeds into code.review skill
- **Architecture Compliance**: Validates against architect.plan output
- **Quality Assurance**: Provides artifacts for qa-ready skill

#### Validation Requirements
- Code meets architectural specifications
- Unit test coverage ≥ 80% achieved
- Integration tests passing
- Documentation complete and clear
- Performance requirements met
```

```markdown
### qa.e2e Skill Pattern

#### Core Algorithm
1. **Test Environment Setup**: Prepare comprehensive test environment
2. **End-to-End Test Execution**: Execute complete user journey tests
3. **Performance Testing**: Validate system performance under load
4. **User Acceptance Testing**: Validate user experience and acceptance criteria
5. **Risk Assessment**: Identify production deployment risks

#### Specialized Tools
- **Test Automation Framework**: E2E test execution
- **Performance Testing Tools**: Load testing, monitoring
- **User Testing Platforms**: User acceptance testing
- **Monitoring Tools**: System performance and error tracking
- **Bug Tracking**: Issue management and resolution tracking

#### Integration Points
- **Code Implementation**: Tests artifacts from code.implement
- **User Stories**: Validates against product.prd requirements
- **Production Readiness**: Assesses deployment readiness

#### Validation Requirements
- All E2E test scenarios passing
- Performance targets achieved
- User acceptance criteria met
- Production deployment risks identified and mitigated
```

### Supporting Skills

```markdown
### architect.plan Skill Pattern

#### Core Algorithm
1. **Requirements Analysis**: Analyze functional and non-functional requirements
2. **Architecture Design**: Design system architecture and components
3. **Technology Selection**: Select appropriate technologies and patterns
4. **Risk Assessment**: Identify architectural risks and mitigation strategies
5. **Documentation**: Create comprehensive architecture documentation

#### Specialized Tools
- **Architecture Modeling Tools**: System design visualization
- **Documentation Platforms**: Architecture documentation
- **Performance Analysis Tools**: Architecture performance validation
- **Security Assessment Tools**: Architecture security analysis

#### Integration Points
- **Product Requirements**: Informed by product.prd output
- **Code Implementation**: Guides code.implement skill
- **Quality Standards**: Influences qa-* skills

#### Validation Requirements
- Architecture addresses all requirements
- Technology choices justified and validated
- Risks identified with mitigation plans
- Documentation complete and clear
```

```markdown
### analytics-research Skill Pattern

#### Core Algorithm
1. **Hypothesis Definition**: Define clear research hypotheses and questions
2. **Data Collection**: Gather relevant data from multiple sources
3. **Analysis Execution**: Perform statistical and qualitative analysis
4. **Insight Generation**: Extract actionable insights from analysis
5. **Recommendation Development**: Develop data-driven recommendations

#### Specialized Tools
- **Data Analysis Tools**: Statistical analysis, data visualization
- **Research Platforms**: Market research, user research
- **Survey Tools**: User feedback and opinion collection
- **Analytics Platforms**: Web analytics, user behavior analysis

#### Integration Points
- **Product Discovery**: Informs product.discovery decisions
- **Validation**: Supports validation across multiple gates
- **Metrics Definition**: Defines success metrics for projects

#### Validation Requirements
- Research questions clearly defined
- Data sources reliable and comprehensive
- Analysis methods appropriate and valid
- Insights actionable and well-supported
- Recommendations evidence-based
```

---

## Segment: Usage Examples

### Complete Skill Example

```markdown
# Code Implementation Skill

## Segment: Identity

- **Skill ID**: code-implement
- **Version**: 3.0
- **Last Updated**: 2025-10-23
- **Target Agent**: tech-lead

## Segment: Purpose

### Core Purpose
Build features with automated tests following architectural specifications and quality standards.

### Success Criteria
- All acceptance criteria implemented and tested
- Unit test coverage ≥ 80% achieved
- Code review passed with no critical issues
- Integration tests passing
- Documentation complete and clear

### Trigger Scenarios
- **Sprint Planning**: Sprint backlog items ready for implementation
- **Bug Fixes**: Critical bugs requiring immediate implementation
- **Technical Debt**: Refactoring tasks for code quality improvement
- **Feature Development**: New features based on approved specifications

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: File operations and code file management
- **Git**: Version control and code repository management
- **Testing**: Unit and integration test execution
- **Build**: Code compilation and build process

### Tool Requirements
- **IDE/Code Editor**: Code development environment with syntax highlighting
- **Testing Framework**: Jest or equivalent for unit testing
- **Linting Tools**: Biome for code quality, linting, and formatting
- **Documentation Generator**: JSDoc or equivalent for API documentation

### Prerequisites
- **Architecture Approval**: architect.plan must be completed and approved
- **Sprint Planning**: agile.planning must allocate story to current sprint
- **Environment Setup**: Development environment must be configured and accessible
- **Technical Specifications**: Detailed technical specifications must be available

## Segment: Orientation

### Orientation Checks
- **Authorization**: Verify tech-lead authorization for code-implement skill
- **Architecture Access**: Confirm architect.plan output is accessible
- **Environment Status**: Validate development environment is ready
- **Prerequisite Check**: Verify all prerequisites are satisfied

### Pre-execution Validation
- **Agent Authorization**: Verify agent has skill authorization
- **Tool Availability**: Confirm required tools are accessible
- **Context Loading**: Load current task state and history
- **Prerequisite Check**: Validate all prerequisites are satisfied

### Context Assessment
- **Current Phase**: Identify current project phase
- **Previous Work**: Review recent work history
- **Blocker Detection**: Check for blocking issues
- **Readiness Assessment**: Confirm readiness for execution

## Segment: Lifecycle Transition

### Transition Mode
- **strict**: All prerequisites must be satisfied

### State Progression
```
FROM_STATE: agile.planning
TO_STATE: code.implement
TRANSITION_TYPE: implementation
```

### Gate Compliance
- **Gate Order**: Must respect prescribed sequence
- **Transition Logging**: Must log all state changes
- **Evidence Generation**: Must produce auditable outputs

## Segment: Execution Algorithm

### Step-by-Step Procedure
1. **Code Development**
   - **Purpose**: Write feature code following architectural specifications
   - **Tools**: IDE, FileSystem, Git
   - **Output**: Feature source code
   - **Validation**: Code follows architectural patterns

2. **Unit Testing**
   - **Purpose**: Implement comprehensive unit tests
   - **Tools**: Testing Framework, Code Coverage Tools
   - **Output**: Unit test suite with coverage report
   - **Validation**: Coverage ≥ 80%, tests passing

3. **Documentation**
   - **Purpose**: Create clear code documentation
   - **Tools**: Documentation Generator, IDE
   - **Output**: API documentation and code comments
   - **Validation**: Documentation complete and accurate

4. **Integration Testing**
   - **Purpose**: Test component interactions
   - **Tools**: Testing Framework, Mock Services
   - **Output**: Integration test suite
   - **Validation**: All integration tests passing

5. **Performance Validation**
   - **Purpose**: Validate performance requirements
   - **Tools**: Performance Testing Tools
   - **Output**: Performance test report
   - **Validation**: Performance targets met

### Quality Gates
- **Code Quality**: Code follows style guidelines and best practices
- **Test Coverage**: Unit test coverage ≥ 80%
- **Documentation**: All public APIs documented
- **Integration**: Components integrate correctly
- **Performance**: Performance requirements met

### Error Handling
- **Build Failures**: Rollback changes and fix build issues
- **Test Failures**: Debug and fix failing tests
- **Performance Issues**: Optimize code for performance
- **Integration Errors**: Fix component interaction issues

## Segment: Artifact Output

### Primary Outputs
- **Source Code**: Feature implementation in appropriate language
- **Unit Tests**: Comprehensive test suite with coverage
- **Documentation**: API documentation and code comments
- **Integration Tests**: Component interaction tests

### Secondary Outputs
- **Performance Report**: Performance validation results
- **Code Review Package**: Code prepared for review process
- **Deployment Artifacts**: Build artifacts ready for deployment

### Evidence Requirements
- **Quantitative Metrics**: Test coverage, performance benchmarks
- **Qualitative Evidence**: Code quality assessment, documentation review
- **Validation Criteria**: All acceptance criteria implemented and tested

## Segment: Transition Log Template

### Standard Format
```
[PROGRESS|code-implement] by tech-lead
MODE: strict
FROM: agile.planning
TO: code.implement
WHY:
- Sprint planning completed with story allocation
- Architecture approved and technical specifications ready
- Development environment prepared and accessible
OUTPUT:
=== CODE IMPLEMENTATION ===
summary: Implemented user authentication with JWT tokens
inputs: agile.planning#L45-67, architect.plan#L12-30
evidence: |result=pass|ref=src/auth/jwt-auth.js
risks: [ ]|owner=architect|mitigation=Review security patterns
next_steps: Schedule code review with peer
=== END CODE IMPLEMENTATION ===
FOLLOW-UP:
- owner=tech-lead - due=2025-10-25
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[architecture_approval], unblock_steps=[schedule_architect_review])
```

## Segment: Skill Specialization

### Implementation Skill Pattern

#### Core Algorithm
1. **Code Development**: Write feature code following specifications
2. **Testing**: Implement comprehensive unit and integration tests
3. **Documentation**: Create clear and complete documentation
4. **Validation**: Validate against all quality and performance requirements

#### Specialized Tools
- **Development Environment**: IDE with appropriate extensions
- **Testing Framework**: Language-specific testing tools
- **Code Quality Tools**: Linters, formatters, static analysis
- **Documentation Tools**: API documentation generators

#### Integration Points
- **Architecture**: Follows architect.plan specifications
- **Quality**: Prepares artifacts for code.review and qa-* skills
- **Deployment**: Creates artifacts ready for deployment

#### Validation Requirements
- Code meets all functional requirements
- Non-functional requirements satisfied
- Quality standards met
- Documentation complete and accurate
```

---

## Segment: Quality Assurance

### Validation Checklist

- [ ] Template structure follows "## Segment:" format
- [ ] All required variables defined with Handlebars syntax
- [ ] Core purpose clear and success criteria measurable
- [ ] Execution algorithms step-by-step and actionable
- [ ] Quality gates specific and verifiable
- [ ] Transition format matches system standards
- [ ] BLOCKED protocol correctly implemented
- [ ] Registry integration requirements met
- [ ] MCP tools specified and available

---

*This skill template provides a standardized format for creating skill specifications with clear execution procedures while maintaining flexibility for different specializations.*