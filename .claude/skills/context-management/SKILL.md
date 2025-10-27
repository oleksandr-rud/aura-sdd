---
name: aura-context-management
description: Advanced context management for complex workflows. Capture, analyze, preserve, and transfer comprehensive project context across agents and phases. Use when handing off work, creating checkpoints, managing log growth, or preserving critical decisions. Supports intelligent context analysis, artifact organization, and seamless agent transitions.
---

# AURA Context Management Skill

## Segment: Identity

- **Skill ID**: context-management
- **Version**: 3.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (any agent)

## Segment: Purpose

### Core Purpose
Provide intelligent context management capabilities that capture, analyze, preserve, and transfer comprehensive project state information. Enable seamless agent transitions, maintain audit trails, and ensure workflow continuity through sophisticated context analysis and organization.

### Success Criteria
- Context captured with 100% completeness and accuracy
- Critical decisions and blockers clearly identified and documented
- Agent handoffs executed with zero information loss
- Log organization maintained with full audit trail preservation
- Context packages enable independent work continuation
- Artifacts organized and accessible for future reference

### Trigger Scenarios
- **Agent Handoffs**: Transferring work between different agent specializations
- **Work Stalls**: Documenting interruptions and creating resume plans
- **Status Checkpoints**: Creating progress markers for complex workflows
- **Log Management**: Organizing and compacting lifecycle logs for usability
- **Context Preservation**: Saving critical state before major transitions
- **Decision Documentation**: Capturing important decisions and rationale
- **Risk Assessment**: Documenting blockers and mitigation strategies

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: Access to task files, artifacts, and archive storage
- **Read**: Analysis of current task state, logs, and documentation
- **Write**: Creation of context packages, log organization, and documentation
- **Bash**: Execution of context analysis scripts and file operations

### Tool Requirements
- **Context Analysis**: Intelligent parsing of task files and lifecycle logs
- **Pattern Recognition**: Identification of critical transitions and decisions
- **Document Generation**: Creation of comprehensive context packages
- **Archive Management**: Organization and retrieval of historical context
- **Quality Validation**: Verification of context completeness and accuracy

### Prerequisites
- **Task Accessibility**: Current task file must be accessible and readable
- **Agent Authorization**: Agent must have context management authorization
- **Operation Clarity**: Specific operation type and parameters clearly defined
- **Artifact Access**: All referenced artifacts and documentation accessible

## Segment: Orientation

### Orientation Checks
- **System Architecture**: Confirm ../../../.aura/constitution.md for context management standards
- **Terminology Alignment**: Review ../../../.aura/glossary.md for context management terms
- **Agent Context**: Load {{actor}} persona for appropriate communication style
- **Operation Planning**: Validate operation type and specific requirements

### Pre-execution Validation
- **Agent Authorization**: Verify agent has context management privileges
- **Tool Availability**: Confirm FileSystem, Read, Write, Bash tools accessible
- **Task State Analysis**: Load and analyze current task file structure
- **Operation Feasibility**: Validate all required inputs and resources available

## Segment: Execution Algorithm

### Advanced Context Analysis Framework

#### Phase 1: Comprehensive State Assessment
1. **Task File Analysis**
   - Parse current task structure and content organization
   - Identify all sections, headers, and content blocks
   - Extract key information: status, assignments, deadlines
   - Analyze Rolling Summary for current progress indicators

2. **Lifecycle Log Analysis**
   - Parse complete lifecycle log for transition patterns
   - Identify critical transitions, decisions, and blockers
   - Analyze agent participation and handoff patterns
   - Extract timeline and progression metrics

3. **Artifact Assessment**
   - Inventory all referenced artifacts and documentation
   - Validate artifact accessibility and completeness
   - Analyze artifact relationships and dependencies
   - Identify missing or inaccessible resources

4. **Stakeholder Analysis**
   - Map current agent assignments and responsibilities
   - Identify active participants and their roles
   - Analyze communication patterns and decision flows
   - Document stakeholder availability and constraints

#### Phase 2: Intelligent Context Synthesis

1. **Critical Information Extraction**
   - Identify and prioritize critical decisions and outcomes
   - Extract active blockers and risk mitigation strategies
   - Capture unresolved questions and decision points
   - Document interdependencies and external constraints

2. **Progress State Analysis**
   - Calculate completion percentages for major workstreams
   - Identify bottlenecks and critical path dependencies
   - Assess quality metrics and validation status
   - Evaluate timeline adherence and schedule impacts

3. **Context Package Design**
   - Structure context information for optimal comprehension
   - Create logical information hierarchy and navigation
   - Design artifact organization and reference system
   - Plan for context reconstruction and verification

4. **Quality Assurance Validation**
   - Verify context completeness against task requirements
   - Validate information accuracy and consistency
   - Check for contradictions or gaps in documentation
   - Ensure accessibility of all referenced resources

#### Phase 3: Context Operations Execution

Based on operation_type, execute specialized workflows:

##### SNAPSHOT Operation (Handoff & Checkpoint)
1. **Context Package Creation**
   - Generate comprehensive context summary with current state
   - Document all active work items and their status
   - Capture decision rationale and next step requirements
   - Create artifact inventory with access instructions

2. **Handoff Protocol Execution**
   - Format context for target agent consumption
   - Create clear handoff instructions and expectations
   - Document transition timeline and coordination requirements
   - Establish communication protocols for follow-up

3. **Verification and Validation**
   - Validate context package completeness
   - Test handoff instructions for clarity
   - Verify artifact accessibility and functionality
   - Create context restoration verification checklist

##### COMPACT Operation (Log Management)
1. **Log Analysis and Classification**
   - Analyze lifecycle log for entry patterns and importance
   - Classify entries by criticality: essential, important, reference
   - Identify historical entries suitable for archival
   - Map decision chains and cause-effect relationships

2. **Archive Strategy Design**
   - Design archive structure for optimal retrieval
   - Create detailed indexing and cross-reference system
   - Preserve audit trail with clear navigation paths
   - Maintain decision chain integrity across compaction

3. **Compaction Execution**
   - Create archival sections with detailed historical entries
   - Generate summarized main log with critical information
   - Implement cross-references between main log and archives
   - Validate compaction accuracy and completeness

##### STALL Operation (Interruption Management)
1. **Stall Documentation**
   - Document precise work interruption point and context
   - Capture in-progress work items and their state
   - Identify immediate blockers and resolution requirements
   - Create detailed resume plan with prioritized actions

2. **Recovery Planning**
   - Design step-by-step work resumption procedure
   - Identify prerequisite conditions for work continuation
   - Create context verification checklist for restart
   - Establish timeline and resource requirements for restart

##### ANALYSIS Operation (Context Intelligence)
1. **Deep Context Analysis**
   - Analyze progression patterns and velocity metrics
   - Identify recurring issues and optimization opportunities
   - Evaluate agent effectiveness and collaboration patterns
   - Assess risk exposure and mitigation effectiveness

2. **Intelligence Reporting**
   - Generate comprehensive context analysis report
   - Provide actionable insights for workflow optimization
   - Identify improvement opportunities and best practices
   - Create recommendations for process enhancement

### Quality Gates
- **Context Completeness**: 100% of critical information captured
- **Information Accuracy**: All facts validated against source materials
- **Artifact Accessibility**: All referenced resources accessible and functional
- **Handoff Clarity**: Context packages enable independent continuation
- **Audit Integrity**: Complete audit trail preservation in all operations
- **Navigation Usability**: Compacted logs maintain effective information retrieval

### Error Handling
- **Missing Context**: Implement progressive context reconstruction strategies
- **Inaccessible Artifacts**: Create artifact recovery and replacement protocols
- **Information Conflicts**: Develop conflict resolution and clarification procedures
- **Operation Failures**: Implement rollback and recovery mechanisms

## Segment: Artifact Output

### Primary Outputs
- **Context Package**: Comprehensive context document for handoffs and checkpoints
- **Organized Logs**: Streamlined lifecycle logs with archival sections
- **Analysis Reports**: Deep insights into workflow patterns and optimization opportunities
- **Recovery Plans**: Detailed procedures for work resumption after interruptions

### Evidence Requirements
- **Completeness Metrics**: 100% coverage of critical context elements
- **Accuracy Validation**: Cross-referenced validation against source materials
- **Accessibility Testing**: Verification of all artifact and resource access
- **Quality Scores**: Measurable context quality and effectiveness metrics

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|context-management] by {{actor}}
MODE: {{transition_mode}}
FROM_STATE: {{from_state}}
TO_STATE: {{to_state}}
WHY:
- {{context_reason_1}}
- {{context_reason_2}}
OUTPUT:
=== Context Management ===
summary: Executed {{operation_type}} operation with {{result_summary}}.
inputs: operation_type={{operation_type}} target_agent={{target_agent}} scope={{scope}}
evidence: {{validation_type}}|result={{validation_result}}|ref={{context_package_path}}
risks: [ ]{{context_risk}}|owner={{owner}}|mitigation={{mitigation_strategy}}
next_steps: {{next_action_requirements}}
=== END Context Management ===
FOLLOW-UP:
- {{follow_up_action}} - owner={{responsible_agent}} - due={{timeline}}
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[{{critical_inputs}}], unblock_steps=[{{resolution_steps}}])
```

## Advanced Context Operations

### Context Intelligence Prompts

#### Context Analysis Framework
```
You are a Context Intelligence Analyst tasked with comprehensive context analysis.

ANALYSIS DIMENSIONS:
1. STATE ASSESSMENT: Current project state, completion status, active blockers
2. PROGRESSION ANALYSIS: Workflow patterns, velocity metrics, bottleneck identification
3. DECISION DOCUMENTATION: Critical decisions, rationale, outcome tracking
4. RISK ASSESSMENT: Active risks, mitigation strategies, exposure analysis
5. STAKEHOLDER DYNAMICS: Agent collaboration, communication patterns, handoff effectiveness
6. ARTIFACT INTEGRITY: Documentation completeness, accessibility, quality validation

EXECUTION REQUIREMENTS:
- Parse all task file sections and extract key information
- Analyze lifecycle log for transition patterns and critical events
- Validate artifact accessibility and completeness
- Identify knowledge gaps and information inconsistencies
- Generate actionable insights for workflow optimization

OUTPUT REQUIREMENTS:
- Comprehensive context state assessment
- Critical blocker identification with resolution strategies
- Progress analysis with timeline and quality metrics
- Recommendations for process improvement and risk mitigation
```

#### Handoff Protocol Prompt
```
You are executing a sophisticated agent handoff with zero information loss tolerance.

HANDOFF REQUIREMENTS:
1. CONTEXT COMPLETENESS: Capture all work-in-progress, decisions, and pending items
2. DECISION CHAIN PRESERVATION: Document complete rationale for all critical decisions
3. BLOCKER DOCUMENTATION: Clear identification of active blockers and resolution paths
4. ARTIFACT COORDINATION: Ensure all referenced materials are accessible and organized
5. EXPECTATION ALIGNMENT: Clear definition of next steps and success criteria

HANDOFF PACKAGE STRUCTURE:
- Executive Summary: Current state, immediate priorities, critical decisions
- Work Progress: Detailed status of all active work items and deliverables
- Decision Log: Complete rationale for all major decisions with outcomes
- Blocker Registry: Active blockers with owners, timelines, and mitigation strategies
- Artifact Inventory: Complete list of referenced materials with access instructions
- Next Steps: Clear, actionable next steps with success criteria and timelines

QUALITY VALIDATION:
- Context package enables independent work continuation
- All critical information is captured and easily accessible
- Handoff instructions are clear and unambiguous
- Transition risks are identified and mitigated
```

#### Log Management Prompt
```
You are executing intelligent log compaction while preserving complete audit integrity.

COMPACTION PRINCIPLES:
1. AUDIT PRESERVATION: Maintain complete decision chain and outcome tracking
2. NAVIGATION OPTIMIZATION: Improve log readability while preserving essential information
3. REFERENCE INTEGRITY: Maintain cross-references between main log and archived content
4. RETRIEVAL EFFICIENCY: Ensure historical context remains accessible when needed

COMPACTION STRATEGY:
- Identify critical transitions and decisions for main log preservation
- Create archival sections with detailed historical context
- Generate summaries that capture essential information from archived entries
- Implement intelligent cross-referencing between main log and archives
- Maintain complete timeline integrity and decision chain visibility

QUALITY ASSURANCE:
- No loss of critical decision information
- Clear navigation paths to archived historical context
- Complete audit trail preservation with reference integrity
- Improved log usability without information sacrifice
```

## Context Quality Measurement

### Quality Metrics Framework
1. **Completeness Score**: Percentage of critical context elements captured
2. **Accuracy Validation**: Cross-referenced validation against source materials
3. **Accessibility Index**: Percentage of referenced artifacts accessible
4. **Clarity Rating**: Context package clarity and comprehensibility assessment
5. **Handoff Success Rate**: Successful agent transitions with zero information loss

### Validation Procedures
- Automated completeness checking against task requirements
- Cross-reference validation with source materials and artifacts
- Accessibility testing of all referenced resources
- Handoff simulation and validation testing
- Quality score calculation and reporting

## Integration Features

### AURA System Integration
- Seamless integration with State Machine workflow transitions
- Support for multi-agent collaboration patterns
- Preservation of complete audit trails and decision chains
- Compatibility with existing task file structures and formats

### Claude Code Skills Benefits
- Progressive disclosure for optimal context loading
- Intelligent analysis of complex project structures
- Automated quality validation and assessment
- Efficient resource management and organization

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - System architecture and workflow standards
- [AURA Glossary](../../../.aura/glossary.md) - Context management terminology
- [Context Templates](templates/) - Context package and handoff templates
- [Analysis Tools](tools/) - Context analysis and validation utilities
- [Best Practices](docs/) - Context management guidelines and procedures

## Guardrails

- Maintain 100% context integrity across all operations
- Never delete critical information, only reorganize and archive
- Ensure all context packages enable independent work continuation
- Preserve complete audit trails with clear navigation paths
- Validate artifact accessibility before context package finalization
- Follow established communication protocols for agent handoffs
- Update documentation and glossary for new context management patterns

---

*Advanced Context Management skill providing intelligent context capture, analysis, preservation, and transfer capabilities for complex multi-agent workflows with comprehensive quality assurance and audit integrity preservation.*