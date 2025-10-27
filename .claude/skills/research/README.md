# AURA Research Skill

## Overview

The AURA Research skill provides systematic investigation and analysis capabilities across multiple domains. It supports 5 research templates: product-discovery, analytics, technical, market, and competitive research.

## Quick Start

### Basic Usage
```bash
# Research with automatic template detection
exec story=PROJECT-001 skill=research research_questions="What are the main user pain points?"

# Specific research template
exec story=PROJECT-001 skill=research research_type=analytics
```

### Supported Research Types

1. **Product Discovery** - Problem validation and market need confirmation
2. **Analytics** - Quantitative analysis and hypothesis validation
3. **Technical** - Feasibility studies and best practices investigation
4. **Market** - Market analysis and opportunity sizing
5. **Competitive** - Competitive analysis and positioning

## Directory Structure

```
research-skill-example/
├── SKILL.md              # Main skill file with all instructions
├── README.md             # This overview file
├── examples/             # Usage examples
│   ├── product-discovery.md
│   ├── analytics.md
│   ├── technical.md
│   ├── market.md
│   └── competitive.md
└── docs/                 # Additional documentation
    ├── methodology.md
    └── best-practices.md
```

## Integration

### AURA System Integration
- Works with AURA State Machine workflow
- Supports transition logging and BLOCKED protocol
- Integrates with agent specialization patterns

### Claude Code Skills Integration
- Progressive disclosure architecture
- Filesystem-based resource loading
- Tool execution through available MCP tools

## Usage Examples

See the [examples/](examples/) directory for detailed usage examples for each research type.

## Requirements

- AURA system with agent access
- WebSearch and WebFetch MCP tools
- FileSystem access for research documentation
- Current task context with research questions

## Troubleshooting

Common issues and solutions are documented in [docs/troubleshooting.md](docs/troubleshooting.md).