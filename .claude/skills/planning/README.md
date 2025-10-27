# AURA Planning Skill

## Overview

The AURA Planning skill provides comprehensive planning capabilities across multiple domains. It supports 4 planning templates: agile, architect, testing, and implementation planning. The skill uses progressive disclosure to load relevant content based on planning context and agent role.

## Quick Start

### Basic Usage
```bash
# Automatic template selection based on agent role
exec story=PROJECT-001 skill=planning

# Specific planning template
exec story=PROJECT-001 skill=planning planning_type=agile
```

### Supported Planning Types

1. **Agile Planning** (product-ops) - Backlog sequencing and capacity allocation
2. **Architect Planning** (architect) - System architecture and technical approach
3. **Testing Planning** (qa) - Test strategy and quality planning
4. **Implementation Planning** (tech-lead) - Technical implementation coordination

## Directory Structure

```
planning-skill-example/
├── SKILL.md              # Main skill file with all planning instructions
├── README.md             # This overview file
├── examples/             # Usage examples for each planning type
│   ├── agile-planning.md
│   ├── architect-planning.md
│   ├── testing-planning.md
│   └── implementation-planning.md
├── templates/            # Planning document templates
│   ├── agile-plan-template.md
│   ├── architect-plan-template.md
│   ├── test-strategy-template.md
│   └── implementation-plan-template.md
├── scripts/              # Utility scripts
│   ├── resource-calculator.py
│   ├── timeline-validator.py
│   └── dependency-analyzer.py
└── docs/                 # Additional documentation
    ├── best-practices.md
    ├── risk-management.md
    └── quality-gates.md
```

## Progressive Disclosure Architecture

### Level 1: Metadata (always loaded)
- Skill name and description for discovery
- Planning types and trigger scenarios
- Agent role mapping

### Level 2: Instructions (loaded when triggered)
- Planning procedures and methodologies
- Template selection logic
- Quality gates and validation criteria

### Level 3: Resources (loaded as needed)
- Specific planning templates
- Calculation scripts and tools
- Detailed examples and best practices

## Integration Features

### AURA System Integration
- Works with AURA State Machine workflow
- Supports transition logging and BLOCKED protocol
- Integrates with agent specialization patterns
- Maintains task file compatibility

### Claude Code Skills Integration
- Progressive disclosure for context optimization
- Filesystem-based resource loading
- Tool execution through available MCP tools
- Modular template system

## Usage Examples

See the [examples/](examples/) directory for detailed usage examples:
- **Agile Planning**: Sprint planning and backlog management
- **Architect Planning**: System architecture and technology decisions
- **Testing Planning**: Test strategy and quality assurance
- **Implementation Planning**: Technical execution and coordination

## Templates and Scripts

### Planning Templates
Ready-to-use templates in [templates/](templates/) for each planning type:
- Standardized document formats
- Pre-defined sections and structures
- Quality gate definitions
- Validation criteria

### Utility Scripts
Helper scripts in [scripts/](scripts/) for planning automation:
- **resource-calculator.py**: Calculate team capacity and allocation
- **timeline-validator.py**: Validate timeline feasibility and dependencies
- **dependency-analyzer.py**: Analyze and map task dependencies

## Requirements

- AURA system with agent access
- FileSystem, Read, Write MCP tools
- Current task context with clear objectives
- Resource information and constraints documentation

## Best Practices

### Planning Principles
- Use SMART goals for all objectives
- Include appropriate buffers for uncertainty
- Identify and manage all dependencies
- Define clear quality gates and validation criteria

### Resource Management
- Match tasks to appropriate skills
- Consider individual capacity and availability
- Plan for skill development and growth
- Balance workload across team members

### Risk Management
- Systematically identify potential risks
- Assess probability and impact
- Develop specific mitigation strategies
- Plan contingency approaches

## Troubleshooting

Common planning challenges and solutions:
- **Resource Conflicts**: Re-allocate tasks or adjust timelines
- **Dependency Issues**: Clarify relationships or adjust sequence
- **Timeline Constraints**: Reduce scope or acquire additional resources
- **Unclear Requirements**: Gather additional information before planning

## Additional Resources

- [AURA Planning Best Practices](docs/best-practices.md)
- [Risk Management Guide](docs/risk-management.md)
- [Quality Gates Documentation](docs/quality-gates.md)
- [Template Usage Guide](templates/README.md)