# AURA Templates Documentation

## Overview

This directory contains the official AURA framework templates for creating consistent, high-quality tasks, constitutions, and glossaries. These templates incorporate the latest organizational best practices including unified indexing, task-based organization, and comprehensive documentation standards.

## Template Files

### 1. Task Template (`task-template.md`)
**Purpose**: Standard template for creating new tasks with proper organizational structure
**Key Features**:
- Unified index integration
- Task-based folder organization
- Research and documentation separation
- Cross-reference management
- Lifecycle logging standards

**Usage**: Copy and modify for new tasks in `.aura/tasks/<task-name>/`

### 2. Constitution Template (`constitution.template.md`)
**Purpose**: Template for creating project or system constitutions with AURA framework integration
**Key Features**:
- State machine workflow definitions
- Agent role specifications
- Quality and compliance standards
- Documentation requirements
- Context management protocols

**Usage**: Customize for specific projects or system constitutions

### 3. Glossary Template (`glossary.template.md`)
**Purpose**: Comprehensive template for creating domain-specific glossaries
**Key Features**:
- Terminology definitions and usage examples
- Cross-reference systems
- Integration guidelines
- Quality standards
- Maintenance procedures

**Usage**: Adapt for specific domains or project glossaries

## New Organizational Structure

### Task Folder Structure
```
.aura/tasks/
├── <task_name>/
│   ├── <task_name>.md              # Main task file
│   ├── index.md                   # Unified index (NEW)
│   ├── research/                   # Research outputs (ENHANCED)
│   │   ├── YYYY-MM-DD-research-type.md
│   │   ├── evidence/              # Source materials (NEW)
│   │   └── assets/                # Research assets (NEW)
│   └── docs/                      # Technical writing outputs (ENHANCED)
│       ├── YYYY-MM-DD-document-type.md
│       └── assets/                # Document assets (NEW)
```

### Key Improvements

#### 1. Unified Index System
- **Single Navigation Point**: One `index.md` file per task provides access to all outputs
- **Comprehensive Cross-References**: Links between research findings and documentation
- **Status Tracking**: Real-time status of all documents and research outputs
- **Quick Discovery**: Easy navigation between related documents

#### 2. Enhanced File Organization
- **Separated Research and Docs**: Clear distinction between research and writing outputs
- **Evidence Management**: Organized storage of source materials and data
- **Asset Organization**: Structured approach to images, diagrams, and charts
- **Consistent Naming**: Date-stamped files with descriptive type identifiers

#### 3. Cross-Reference Integration
- **Document Relationships**: Clear links between related research and documentation
- **Evidence Traceability**: Direct links from findings to source evidence
- **Bidirectional References**: Cross-references maintained across all documents
- **Context Preservation**: Relationships preserved for future reference

## Template Usage Guidelines

### Creating New Tasks

1. **Copy Template**: Copy `task-template.md` to `.aura/tasks/<task-name>/<task-name>.md`
2. **Customize Header**: Update DOMAIN, STATUS, OWNER, and other metadata
3. **Define Product Brief**: Fill in problem statement, goals, and success metrics
4. **Set Up Folders**: Create `research/`, `docs/` folders and `index.md`
5. **Update References**: Add document references as they are created

### Using Research and Writing Skills

#### Research Skill Outputs
- **Storage**: All research outputs stored in `research/` folder
- **File Naming**: `YYYY-MM-DD-research-type.md` format
- **Evidence**: Source materials stored in `research/evidence/`
- **Index Updates**: Research documents added to unified index

#### Technical Writing Skill Outputs
- **Storage**: All documents stored in `docs/` folder
- **File Naming**: `YYYY-MM-DD-document-type.md` format
- **Assets**: Images and diagrams stored in `docs/assets/`
- **Index Updates**: Documents added to unified index

### Unified Index Management

#### Index Structure
```markdown
# Task: <task_name>

## Overview
<Brief description of task purpose and current status>

## Research Documents
- [Market Analysis](./research/YYYY-MM-DD-market-analysis.md) - Market research
- [Technical Feasibility](./research/YYYY-MM-DD-technical-feasibility.md) - Technical validation

## Technical Documents
- [PRD](./docs/YYYY-MM-DD-PRD.md) - Product Requirements Document
- [Architecture Spec](./docs/YYYY-MM-DD-architecture-spec.md) - System architecture

## Quick Navigation
| Document | Type | Status | Created |
|----------|------|--------|---------|
| Market Analysis | Research | Completed | YYYY-MM-DD |
| PRD | Documentation | Completed | YYYY-MM-DD |
```

#### Index Maintenance
- **Automatic Updates**: Skills should update index when creating documents
- **Status Tracking**: Keep current status of all documents
- **Cross-References**: Maintain links between related documents
- **Version Control**: Track changes and updates to documents

## Best Practices

### File Organization
- **Consistent Naming**: Use established naming conventions for all files
- **Date Stamping**: Include dates in file names for chronological ordering
- **Descriptive Names**: Use clear, descriptive names for document types
- **Relative Paths**: Use relative paths for cross-references

### Documentation Quality
- **Single Source of Truth**: Keep all related information together
- **Evidence Embedding**: Include all evidence and sources directly
- **Cross-References**: Maintain links between related documents
- **Version Control**: Track changes and maintain history

### Workflow Integration
- **Skill Integration**: Research and writing skills should use organizational structure
- **Task Updates**: Update task files with document references
- **Index Maintenance**: Keep unified index current with all outputs
- **Quality Standards**: Follow established documentation quality standards

## Template Customization

### Customizing for Projects
- **Domain-Specific Terms**: Adapt terminology for specific domains
- **Workflow Adjustments**: Modify gate sequences for specific workflows
- **Quality Standards**: Adjust quality criteria for project requirements
- **Integration Points**: Customize integration with existing tools

### Extending Templates
- **New Sections**: Add project-specific sections as needed
- **Additional Templates**: Create specialized templates for specific needs
- **Custom Fields**: Add custom metadata fields for specific requirements
- **Integration Enhancements**: Add integration with additional tools

## Maintenance and Updates

### Regular Reviews
- **Quarterly Reviews**: Review and update templates regularly
- **Community Feedback**: Collect feedback from users and stakeholders
- **Version Control**: Maintain version history and change tracking
- **Best Practices**: Update with latest best practices and lessons learned

### Template Evolution
- **Continuous Improvement**: Regularly improve based on usage patterns
- **New Features**: Add new features and capabilities as needed
- **Integration Updates**: Update with new tool integrations
- **Standards Compliance**: Ensure compliance with evolving standards

## Support and Resources

### Documentation
- **Template Examples**: Review existing tasks for template usage examples
- **Best Practices**: Follow established best practices for template usage
- **Integration Guides**: Consult integration guides for tool-specific usage
- **Quality Standards**: Refer to quality standards for document requirements

### Community
- **Feedback Channels**: Provide feedback through established channels
- **Knowledge Sharing**: Share experiences and lessons learned
- **Template Contributions**: Contribute improvements and enhancements
- **Best Practice Sharing**: Share successful template customizations

---

## Template Version History

### Version 3.0 (Current)
- **Added**: Unified index system for comprehensive navigation
- **Enhanced**: Task-based organization with research/docs separation
- **Improved**: Cross-reference management and evidence organization
- **Updated**: Documentation standards and best practices

### Version 2.0
- **Added**: State machine workflow integration
- **Enhanced**: Agent role specifications and skill definitions
- **Improved**: Quality standards and compliance requirements

### Version 1.0
- **Initial**: Basic template structure and documentation standards

---

*This template system provides the foundation for consistent, high-quality task creation and management within the AURA framework. Regular updates and improvements ensure the templates remain current with evolving best practices and organizational needs.*