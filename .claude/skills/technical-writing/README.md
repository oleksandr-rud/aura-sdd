# AURA Technical Writing Skill

## Overview

The AURA Technical Writing skill provides comprehensive capabilities for creating professional-grade technical documentation across all types. It implements the Diátaxis framework, follows the 7-stage writing process, and includes quality measurement tools to ensure industry-standard documentation.

## Quick Start

### Basic Usage
```bash
# Automatic document type detection
exec story=DOC-001 skill=technical-writing document_type=PRD audience=product-team

# Specific documentation type
exec story=DOC-002 skill=technical-writing document_type=api-doc audience=developers
```

### Supported Documentation Types

1. **Product Requirements Documents (PRD)** - Specification documents with stakeholder requirements
2. **API Documentation** - Comprehensive API references and guides
3. **Tutorials** - Learning-oriented content for beginners
4. **How-To Guides** - Task-oriented instructions for specific goals
5. **Technical Reference** - Information-oriented comprehensive coverage
6. **Explanations** - Understanding-oriented concept clarification
7. **Technical Reports** - Analysis reports and research findings

## Directory Structure

```
technical-writing-skill-example/
├── SKILL.md                    # Main skill file with complete methodology
├── README.md                   # This overview file
├── templates/                  # Document type templates
│   ├── prd-template.md
│   ├── api-doc-template.md
│   ├── tutorial-template.md
│   ├── how-to-guide-template.md
│   ├── technical-reference-template.md
│   ├── explanation-template.md
│   └── technical-report-template.md
├── examples/                   # Usage examples for each document type
│   ├── prd-example.md
│   ├── api-doc-example.md
│   ├── tutorial-example.md
│   └── quality-metrics-example.md
├── tools/                      # Quality measurement and validation tools
│   ├── readability-analyzer.py
│   ├── quality-checker.py
│   ├── accessibility-validator.py
│   └── style-guide-validator.py
├── style-guides/              # Industry style guide references
│   ├── google-style-guide.md
│   ├── microsoft-style-guide.md
│   └── digitalocean-style-guide.md
└── docs/                      # Additional documentation
    ├── diataxis-framework.md
    ├── writing-process.md
    ├── quality-measurement.md
    └── best-practices.md
```

## Key Features

### Diátaxis Framework Integration
The skill implements the industry-leading Diátaxis framework, distinguishing four fundamental documentation types:

- **Tutorials** (learning-oriented): Step-by-step learning for beginners
- **How-to guides** (task-oriented): Precise directions for specific goals
- **Technical reference** (information-oriented): Comprehensive feature coverage
- **Explanation** (understanding-oriented): Concept clarification and context

### 7-Stage Writing Process
Systematic approach following industry best practices:

1. **Audience & Purpose Analysis** - Define users and objectives
2. **Research & Information Gathering** - Collect and validate information
3. **Structuring & Outlining** - Design information architecture
4. **Drafting** - Create content within outline constraints
5. **Revising & Editing** - Organize and refine content
6. **Fine-tuning & Polishing** - Optimize language and quality
7. **Testing, Publishing & Maintenance** - Validate and maintain content

### Quality Measurement Framework
Built-in quality metrics and validation:

- **Readability Scores**: Flesch-Kincaid and similar tests
- **Completeness Rates**: Thoroughness of topic coverage
- **Error Rate Analysis**: Typos, grammatical mistakes, technical errors
- **Accessibility Compliance**: WCAG standards validation
- **User Satisfaction**: Feedback integration and measurement

### Progressive Disclosure Architecture

#### Level 1: Metadata (always loaded)
- Skill discovery and document type identification
- Writing process overview and quality standards
- Tool capabilities and resource mapping

#### Level 2: Instructions (loaded when triggered)
- Detailed writing procedures and methodologies
- Template selection logic and application
- Quality assurance processes and validation criteria

#### Level 3: Resources (loaded as needed)
- Specific document type templates
- Style guide references and examples
- Quality measurement tools and validators

## Usage Examples

### PRD Creation
```bash
exec story=PRD-001 skill=technical-writing document_type=PRD audience=product-team stakeholder_requirements=docs/requirements.md success_metrics=docs/metrics.md
```

### API Documentation
```bash
exec story=API-001 skill=technical-writing document_type=api-doc audience=developers openapi_spec=specs/api.yaml examples=examples/
```

### Tutorial Creation
```bash
exec story=TUT-001 skill=technical-writing document_type=tutorial audience=beginners prerequisite_level=none learning_objectives=docs/objectives.md
```

## Templates and Tools

### Document Templates
Ready-to-use templates in [templates/](templates/) for each documentation type:
- Standardized structures with required sections
- Style guide compliance built-in
- Quality checklists and validation criteria
- Example content and guidance

### Quality Tools
Automated tools in [tools/](tools/) for quality assurance:
- **Readability Analyzer**: Language complexity and accessibility scoring
- **Quality Checker**: Comprehensive quality metrics and error detection
- **Accessibility Validator**: WCAG compliance checking
- **Style Guide Validator**: Consistency and style compliance checking

## Quality Standards

### Quality Targets
- **Readability**: Flesch-Kincaid grade level 8-10 (adjustable by audience)
- **Completeness**: 95%+ coverage of defined scope
- **Error Rate**: Less than 1 error per 1000 words
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **User Satisfaction**: 4+ out of 5 rating target

### Validation Process
1. **Automated Checks**: Readability, accessibility, and style compliance
2. **SME Review**: Technical accuracy validation
3. **Peer Review**: Structure and clarity assessment
4. **User Testing**: Real-world validation with target audience
5. **Stakeholder Approval**: Final sign-off before publication

## Integration Benefits

### AURA System Integration
- Works with AURA State Machine workflow
- Supports transition logging and BLOCKED protocol
- Integrates with agent specialization patterns
- Maintains documentation as living products

### Claude Code Skills Integration
- Progressive disclosure for optimal context usage
- Filesystem-based resource management
- Tool execution through MCP tools
- Modular, reusable documentation capabilities

### Industry Best Practices
- Diátaxis framework implementation
- 7-stage systematic writing process
- Quality measurement and continuous improvement
- Accessibility and compliance standards

## Requirements

- AURA system with agent access
- FileSystem, Read, Write, WebSearch MCP tools
- Source materials and subject matter expert access
- Clear documentation objectives and audience definition
- Applicable style guide identification

## Best Practices

### Writing Process
- Follow the 7-stage systematic process
- Use audience analysis to guide content approach
- Apply minimalist writing principles
- Include examples and visual aids
- Plan for maintenance and updates

### Quality Assurance
- Set measurable quality targets
- Use automated tools for consistency
- Conduct multi-level reviews
- Test with actual users
- Monitor and iterate based on feedback

### Collaboration
- Engage SMEs early and often
- Build network of subject matter experts
- Use structured review processes
- Gather and integrate stakeholder feedback
- Maintain clear communication throughout process

## Troubleshooting

Common documentation challenges and solutions:
- **Audience Mismatch**: Refine audience analysis and adjust content approach
- **Quality Issues**: Apply targeted revisions and additional review cycles
- **Timeline Constraints**: Prioritize essential content and plan phased releases
- **Resource Limitations**: Use templates and automation to improve efficiency
- **Stakeholder Alignment**: Establish clear objectives and approval processes

## Additional Resources

- [Diátaxis Framework Guide](docs/diataxis-framework.md)
- [Writing Process Documentation](docs/writing-process.md)
- [Quality Measurement Framework](docs/quality-measurement.md)
- [Best Practices Guide](docs/best-practices.md)
- [Style Guide References](style-guides/)

This technical writing skill transforms documentation creation from an ad-hoc process into a systematic, professional discipline that produces consistent, high-quality results across all documentation types.