---
name: aura-technical-writing
description: Create professional-grade technical documentation across all types (PRDs, API docs, tutorials, reports, guides). Use when you need to produce structured, audience-focused documentation with industry best practices. Supports Diátaxis framework, 7-stage writing process, and quality measurement.
---

# AURA Technical Writing Skill

## Segment: Identity

- **Skill ID**: technical-writing
- **Version**: 2.0
- **Last Updated**: 2025-10-27
- **Target Agent**: {{actor}} (any agent)

## Segment: Purpose

### Core Purpose
Create professional-grade technical documentation using systematic methodologies, industry best practices, and measurable quality standards. Transform technical information into clear, accessible, and actionable documentation for diverse audiences.

### Success Criteria
- Documentation meets audience needs and achieves stated objectives
- Content structured using appropriate information architecture principles
- Quality metrics meet or exceed industry standards (readability, completeness, accuracy)
- Documentation passes all validation checks (technical accuracy, accessibility, compliance)
- Stakeholder approval obtained and sign-off documented
- Maintenance schedule established with version control

### Trigger Scenarios
- **Product Requirements**: PRDs and specification documents needed
- **API Documentation**: API references, guides, and examples required
- **User Guides**: Tutorials, how-to guides, and documentation needed
- **Technical Reports**: Analysis reports, research findings, status updates
- **Process Documentation**: Standard operating procedures, workflows, guides
- **Knowledge Transfer**: Onboarding materials, training documentation needed

## Segment: Required MCPs/Tools

### MCP Dependencies
- **FileSystem**: Access to templates, examples, and documentation resources
- **Read**: Analysis of source materials, existing documentation, style guides
- **Write**: Creation and editing of documentation files
- **WebSearch**: Research of best practices, industry standards, reference materials

### Tool Requirements
- **Document Management**: Create, organize, and maintain documentation files
- **Template Processing**: Apply appropriate templates for different documentation types
- **Quality Analysis**: Check readability, completeness, and accessibility compliance
- **Review Workflow**: Coordinate multi-stage review processes with stakeholders
- **Version Control**: Track changes and maintain documentation history
- **Task-Based Organization**: Store writings in task-specific folders under .aura/tasks/<task_name>/docs/
- **Reference Management**: Add references to created documents in the corresponding task file
- **Unified Index**: Maintain single index.md in task root folder pointing to research and docs

### Prerequisites
- **Clear Objectives**: Documentation purpose and audience clearly defined
- **Source Materials**: All necessary information, specifications, and references available
- **Stakeholder Access**: Subject matter experts and reviewers available for consultation
- **Style Guide**: Applicable style guide and standards identified

## Segment: Orientation

### Orientation Checks
- **Documentation Type**: Determine appropriate framework (Diátaxis type)
- **Audience Analysis**: Identify target audience and technical proficiency levels
- **Style Guide Selection**: Confirm applicable style guide and standards
- **Template Selection**: Load appropriate template for documentation type

### Pre-execution Validation
- **Agent Authorization**: Verify agent has technical writing skill authorization
- **Tool Availability**: Confirm FileSystem, Read, Write tools accessible
- **Context Loading**: Load documentation requirements and source materials
- **Prerequisite Check**: Validate all required inputs and resources available

## Segment: Execution Algorithm

### 7-Stage Technical Writing Process

#### Stage 1: Audience & Purpose Analysis
1. **Define Target Audience**
   - Create detailed user personas with technical proficiency levels
   - Identify user goals, expectations, and success criteria
   - Analyze diversity among user groups requiring specialized content
   - Determine documentation purpose (educate, support, enable, inform)

2. **Purpose Definition**
   - Clarify primary objectives and desired outcomes
   - Define success metrics and measurement methods
   - Identify scope boundaries and intentional exclusions
   - Establish timeline and stakeholder requirements

#### Stage 2: Research & Information Gathering
1. **Source Material Collection**
   - Collaborate with Subject Matter Experts (SMEs) for accuracy
   - Review existing documentation and identify gaps
   - Collect product specifications, feature lists, user feedback
   - Research domain knowledge and industry best practices

2. **Information Validation**
   - Verify technical accuracy with SMEs
   - Cross-reference multiple sources for consistency
   - Document assumptions and limitations
   - Identify areas requiring additional research

#### Stage 3: Structuring & Outlining
1. **Information Architecture Design**
   - Create skeleton structure before writing content
   - Apply 8 principles of information architecture
   - Design navigation paths and content taxonomy
   - Plan for multiple entry points and scalable growth

2. **Content Organization**
   - Design hierarchical structure with logical flow
   - Define sections, subsections, and content relationships
   - Plan cross-references and linking strategies
   - Create outline with detailed section descriptions

#### Stage 4: Drafting
1. **Content Creation**
   - Write within outline constraints without optimization
   - Focus on clarity and accuracy over style initially
   - Mark sections requiring additional research as TODO
   - Apply minimalist writing principles

2. **Template Application**
   - Use appropriate documentation templates
   - Maintain consistency with style guide requirements
   - Include all required sections and elements
   - Apply formatting and structure standards

#### Stage 5: Revising & Editing
1. **Structural Review**
   - Organize ideas into coherent, logical format
   - Arrange paragraphs for optimal flow
   - Position key ideas first in each section
   - Remove information that doesn't support main points

2. **Content Refinement**
   - Write strong introductions and conclusions
   - Verify no gaps exist for users to achieve goals
   - Ensure smooth transitions between sections
   - Validate completeness of coverage

#### Stage 6: Fine-Tuning & Polishing
1. **Language Optimization**
   - Break sentences over 25 words into shorter ones
   - Limit paragraphs to maximum 6 lines
   - Use active voice and concrete language
   - Apply parallel structure and consistent terminology

2. **Quality Assurance**
   - Run grammar and plagiarism checks
   - Verify all links function correctly
   - Apply readability tests and target scores
   - Check accessibility compliance

#### Stage 7: Testing, Publishing & Maintenance
1. **Validation and Review**
   - Conduct user testing to validate effectiveness
   - Gather feedback from stakeholders and SMEs
   - Perform technical accuracy verification
   - Complete multi-stage review process

2. **Publication and Maintenance**
   - Store documents in task-specific folder: `.aura/tasks/<task_name>/`
   - Add document references to the corresponding task file
   - Implement maintenance schedule and update procedures
   - Establish changelog and version tracking
   - Plan for regular reviews (minimum every 8-12 months)

3. **Document Organization**
   - Create dedicated folder for each task: `.aura/tasks/<task_name>/docs/`
   - Use descriptive filenames with date stamps: `YYYY-MM-DD-document-type.md`
   - Update task file with references to all created documents
   - Update unified index.md in task root folder with document references

### Quality Gates
- **Audience Alignment**: Documentation meets defined audience needs
- **Information Architecture**: Content organized for optimal navigation
- **Writing Quality**: Language clear, concise, and error-free
- **Technical Accuracy**: All information verified with SMEs
- **Accessibility Compliance**: WCAG standards met for all content types
- **Stakeholder Approval**: All required reviews and sign-offs completed

### Error Handling
- **Missing Information**: Schedule SME consultations and mark for follow-up
- **Audience Mismatch**: Refine audience analysis and adjust content approach
- **Quality Issues**: Apply targeted revisions and additional review cycles
- **Timeline Constraints**: Prioritize essential content and plan phased releases

## Segment: Artifact Output

### Primary Outputs
- **Professional Documentation**: Complete document meeting all quality standards, stored in `.aura/tasks/<task_name>/docs/`
- **Quality Metrics Report**: Readability scores, completeness rates, accuracy validation
- **Review Documentation**: Stakeholder feedback, approval records, change history
- **Maintenance Plan**: Update schedule, version control procedures, changelog
- **Task File Updates**: References to all created documents added to corresponding task file
- **Unified Index Update**: Single index.md in task root folder updated with all research and docs

### Evidence Requirements
- **Quality Metrics**: Readability scores (Flesch-Kincaid), completeness rates, error counts
- **Stakeholder Validation**: Review records, approval signatures, feedback integration
- **Accessibility Compliance**: WCAG validation results, accessibility test reports
- **Version Control**: Change logs, version history, maintenance schedules

## Segment: Transition Log Template

### Standard Format
```
[TRANSITION|technical-writing] by {{actor}}
MODE: {{transition_mode}}
FROM_STATE: {{from_state}}
TO_STATE: {{to_state}}
WHY:
- {{writing_reason_1}}
- {{writing_reason_2}}
OUTPUT:
=== Technical Documentation ===
summary: Created {{document_type}} with professional quality standards and stakeholder approval.
inputs: document_type={{document_type}} audience={{audience}} source_materials={{source_ref}}
evidence: quality_metrics|result=readability_score={{score}} completeness={{completeness}}|ref=.aura/tasks/{{task_name}}/docs/{{document_file}}
risks: [ ]{{writing_risk}}|owner={{actor}}|mitigation={{writing_mitigation}}
next_steps: Execute maintenance schedule and monitor user feedback.
=== END Technical Documentation ===
DOCUMENTS_CREATED:
- [{{document_title}}](.aura/tasks/{{task_name}}/docs/{{document_file}}) - {{document_type}}
FOLLOW-UP:
- Schedule first review - owner={{actor}} - due={{review_date}}
- Update task file with document references
```

### BLOCKED Protocol
```
BLOCKED(missing_inputs=[source_materials, stakeholder_access], unblock_steps=[gather_materials, schedule_sme_consultation])
```

## Diátaxis Framework Integration

### Documentation Type Templates

#### 1. Tutorials (Learning-Oriented)
**Purpose**: Help beginners acquire competencies through step-by-step instructions
**Best Practices**:
- Assume no prior knowledge
- Provide immediate results and reinforcement
- Include prerequisites and expected outcomes
- Use conversational, encouraging tone
- Include troubleshooting sections

#### 2. How-To Guides (Task-Oriented)
**Purpose**: Provide precise directions to achieve specific goals
**Best Practices**:
- Assume some background knowledge
- Focus on specific, practical outcomes
- Include prerequisites and time estimates
- Provide step-by-step procedures
- Show expected results and variations

#### 3. Technical Reference (Information-Oriented)
**Purpose**: Comprehensive coverage of features and functionality
**Best Practices**:
- Assume comprehensive understanding
- Provide complete, accurate information
- Use consistent, formal structure
- Include all parameters, options, and examples
- Maintain strict accuracy and currency

#### 4. Explanation (Understanding-Oriented)
**Purpose**: Clarify concepts and provide context
**Best Practices**:
- Bridge knowledge gaps
- Provide background and context
- Use analogies and examples
- Connect concepts to practical applications
- Address common misconceptions

## Documentation Type Specifications

### Product Requirements Documents (PRD)
**Required Sections**: Project Overview, Objectives & Success Metrics, Stakeholders, User Personas, Functional Requirements, Non-Functional Requirements, Assumptions & Dependencies, Design Resources, Timeline & Milestones, Out-of-Scope Items

### API Documentation
**Required Components**: Authentication instructions, Endpoint references, Data models, Code examples, Error codes, Rate limits & Terms of Use, Interactive documentation

### Technical Reports
**Standard Structure**: Title Page, Table of Contents, Summary/Abstract, Body (organized sections), Diagrams/Tables/Graphs, References, Appendices

### User Guides
**Essential Elements**: Audience definition, Prerequisites, Step-by-step procedures, Visual aids, Troubleshooting, Additional resources

## Quality Measurement Framework

### 7 Key Quality Metrics
1. **Error Rate**: Typos, grammatical mistakes, factual inaccuracies
2. **Completeness Rate**: Thoroughness of topic coverage
3. **Readability Score**: Flesch-Kincaid and similar tests
4. **Accessibility**: WCAG compliance and usability
5. **Accuracy**: Correctness and currency of information
6. **Usability**: Task completion time and user satisfaction
7. **User Satisfaction**: Survey feedback and adoption rates

### Quality Targets
- **Readability**: Flesch-Kincaid grade level 8-10 for most technical content
- **Completeness**: 95%+ coverage of defined scope
- **Error Rate**: Less than 1 error per 1000 words
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **User Satisfaction**: 4+ out of 5 rating

## Style Guide Integration

### Industry Standards Reference
- **Google Developer Documentation**: Most comprehensive, strong accessibility focus
- **Microsoft Writing Style Guide**: Industry standard for technical content
- **DigitalOcean Guidelines**: Excellent tutorial framework
- **GitLab Documentation**: Living document approach with automated testing

### Style Requirements
- **Voice and Tone**: Consistent with audience and document type
- **Formatting**: Standardized headings, lists, and emphasis
- **Terminology**: Consistent use of technical terms
- **Examples**: Real-world, relevant, and tested examples

## Collaboration and Review Processes

### Multi-Level Review System
1. **Technical Review**: SMEs verify accuracy and completeness
2. **Peer Review**: Other writers check structure and clarity
3. **Editorial Review**: Style guide compliance and quality standards
4. **User Testing**: Validation with actual users
5. **Stakeholder Approval**: Final sign-off before publishing

### SME Engagement
- Build network of domain experts
- Schedule regular consultations
- Conduct structured interviews
- Validate technical accuracy
- Obtain sign-off on specialized content

## Modern Tools and Automation

### Essential Tool Categories
- **Content Management**: Centralized storage, version control, templates
- **Documentation Generation**: Automated creation from source materials
- **Quality Assurance**: Grammar checkers, readability analyzers, link validators
- **Collaboration**: Cloud-based editing, review workflows, commenting systems
- **Publishing**: Multi-format export, responsive design, search optimization

### Automation Opportunities
- Auto-generate documentation from specifications
- Extract inline code documentation
- Validate links and accessibility automatically
- Check readability scores during editing
- Trigger documentation updates on changes

## Additional Resources

- [AURA Constitution](../../../.aura/constitution.md) - System architecture and workflow
- [AURA Glossary](../../../.aura/glossary.md) - Technical writing terminology
- [Documentation Templates](templates/) - Document type templates
- [Style Guides](style-guides/) - Industry style guide references
- [Quality Tools](tools/) - Quality measurement and validation tools

## File Organization & Naming Conventions

### Directory Structure
```
.aura/tasks/
├── <task_name>/
│   ├── <task_name>.md              # Main task file
│   ├── index.md                   # Unified index pointing to research and writings
│   ├── docs/                   # All technical writing outputs
│   │   ├── YYYY-MM-DD-doc-type.md  # Individual documents
│   │   └── assets/                # Images, diagrams, etc.
│   └── research/                  # Research materials and notes
```

### Naming Conventions
- **Document Files**: `YYYY-MM-DD-document-type.md` (e.g., `2025-10-27-PRD.md`)
- **Unified Index**: Always named `index.md` in task root folder
- **Asset Files**: Descriptive names with date stamps (e.g., `2025-10-27-architecture-diagram.png`)
- **Task References**: Use relative paths from task file (e.g., `./docs/2025-10-27-PRD.md`)

### Task File Integration
- Add `## Created Documents` section to task files
- Include document references with clickable markdown links
- Update document status in task lifecycle logs
- Maintain document metadata in task file for tracking

### Unified Index Template
The task's `index.md` should include:
- Overview of task purpose and current status
- **Research Documents** section with links to all research outputs
- **Technical Documents** section with links to all docs
- **Quick Navigation** with status indicators and creation dates
- **Document Summary** with brief descriptions of each document's purpose
- Cross-references between related research and writing documents

## Guardrails

- Keep entries <=120 characters per line for CLI readability
- All documentation must be audience-focused and purpose-driven
- Quality metrics must meet or exceed defined targets
- SME review required for all technical content
- Accessibility compliance mandatory for all published content
- Documentation treated as living product requiring regular maintenance
- Style guide consistency enforced across all content types
- Always store writings in task-specific folders with proper references
- Document naming must follow established conventions for consistency

---

*AURA Technical Writing skill supporting systematic documentation creation with industry best practices, quality measurement, and continuous improvement processes.*