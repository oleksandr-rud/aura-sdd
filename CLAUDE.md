# Claude AI Assistant Guide for AURA

## Overview

This guide provides the essential information for Claude AI assistants working with AURA (Agent Unified Response Architecture) - a framework for intelligent AI agent coordination.

## Quick Start

### Load Context
From the project root, familiarize yourself with the `.aura/` directory structure and `.claude/` implementation.

### Agent Activation
Use activation phrases to assume specific agent roles:
- `As architect, [technical architecture task]`
- `As product ops, [product management task]`
- `As tech lead, [technical implementation task]`
- `As qa, [quality assurance task]`

### Task Management
- Store results in `.aura/tasks/` with lifecycle logging
- Use context management for handoffs between agents

## AURA Framework Structure

```
.aura/
├── constitution.md         # Framework governance and workflow rules
├── glossary.md            # Domain terminology and definitions
├── tasks/                 # Active task files with lifecycle logs
└── templates/             # Standardized templates
```

## Claude Code Implementation

### Agents (`.claude/agents/`)
- **architect.md** - System architecture and technical guidance
- **product-ops.md** - Product lifecycle and requirements management
- **tech-lead.md** - Engineering execution and quality coordination
- **qa.md** - Quality assurance and testing strategy

### Skills (`.claude/skills/`)
- **planning/** - Structured planning across domains
- **research/** - Investigation and analysis capabilities
- **qa/** - Quality validation and testing
- **code/** - Code implementation and review
- **context-management/** - State preservation and handoffs
- **technical-writing/** - Documentation creation

## Agent Capabilities

### Architect Agent
- **Purpose**: Technical guidance and system design
- **Key Skills**: Planning, Research, Context Management, Technical Writing
- **Activation**: `As architect, design system architecture with measurable NFR targets`

### Product Ops Agent
- **Purpose**: Product lifecycle and requirements management
- **Key Skills**: Research, Planning, Context Management, Technical Writing
- **Activation**: `As product ops, validate product idea and capture requirements`

### Tech Lead Agent
- **Purpose**: Engineering execution and code quality
- **Key Skills**: Planning, Research, Context Management, Code, Technical Writing
- **Activation**: `As tech lead, coordinate implementation and ensure code quality`

### QA Agent
- **Purpose**: Quality assurance and testing strategy
- **Key Skills**: Planning, Research, Context Management, QA, Code, Technical Writing
- **Activation**: `As qa, design testing strategy and validate quality standards`

## Memory Architecture

### Core Components
- **Working Memory**: Current conversation context
- **Persistent Memory**: Files in `.aura/` directory
- **Context Snapshots**: Structured state preservation
- **Lifecycle Logs**: Auditable transition history

### Memory Flow
```
User Request → Context Loading → Constitution/Glossary → Agent/Skill Execution → Context Storage
```

### Context Management
- **Context Loading**: Load constitution and glossary
- **State Recovery**: Load relevant task files
- **Context Assembly**: Combine all sources into working memory
- **Context Storage**: Record state changes in lifecycle logs

## Workflow Integration

### AURA State-Transition System
AURA uses flexible state-based workflows rather than rigid linear sequences. The system supports parallel execution, context-aware routing, and iterative refinement based on project needs and validation results.

#### Core State Clusters
**INITIALIZATION CLUSTER**
- `product.discovery` - Problem validation and market analysis
- `requirements.gathering` - User needs and acceptance criteria
- `technical.assessment` - Feasibility and architecture evaluation

**PLANNING CLUSTER**
- `architecture.design` - System design and technical approach
- `backlog.sequencing` - Work prioritization and capacity planning
- `resource.allocation` - Team coordination and dependency management

**EXECUTION CLUSTER**
- `development.implementation` - Feature development and testing
- `quality.validation` - Quality assurance and compliance verification
- `stakeholder.coordination` - Progress updates and feedback integration

**COMPLETION CLUSTER**
- `delivery.validation` - Delivery readiness and success criteria verification
- `knowledge.transfer` - Documentation and stakeholder handoff

#### Transition Patterns
- **State-based routing**: Current state determines valid transitions
- **Parallel execution**: Multiple clusters can operate simultaneously
- **Iterative refinement**: Return to previous states based on validation
- **Context-aware paths**: Project type and complexity influence routing

### Agent Handoffs
- **Context Preservation**: Complete state transfer between agents
- **Transition Logging**: Auditable handoff records in task files
- **Responsibility Transfer**: Clear ownership changes with next steps

## Available Tools

### File Management
- **Read**, **Write**, **Edit** - Access and modify files
- **Glob**, **Grep** - Search and analyze code patterns

### System Tools
- **Bash** - Execute system commands and processes
- **Task Management** - Coordinate with specialized agents

### Research Tools
- **WebSearch**, **WebFetch** - Research patterns and documentation
- **Context7** - Access up-to-date library documentation

### Testing Tools
- **Playwright** - Automated web testing
- **Chrome DevTools** - Web application analysis and debugging

### Quality Tools
- **Biome** - Code linting and formatting (when available)
- **TodoWrite** - Track tasks and decisions

## Quality Standards

- **Framework Compliance**: Follow AURA constitution and quality standards
- **Context Preservation**: Maintain state across agent transitions
- **Evidence-Based**: All decisions supported by data and documentation
- **Audit Trail**: Complete lifecycle logging for accountability

## Usage Examples

### Architecture Design
```bash
As architect, design the system architecture for our new feature with measurable NFR targets and risk assessment.
```

### Product Management
```bash
As product ops, validate this product idea through market research and capture comprehensive requirements.
```

### Technical Implementation
```bash
As tech lead, coordinate the implementation of this feature ensuring code quality standards and architecture compliance.
```

### Quality Assurance
```bash
As qa, design a comprehensive testing strategy and validate quality standards for Go/No-Go decisions.
```

## File References

### Framework Files
- **Constitution**: `.aura/constitution.md` - Workflow Gateway Protocol
- **Glossary**: `.aura/glossary.md` - Domain terminology and definitions

### Implementation Files
- **Agents**: `.claude/agents/` - Agent implementations
- **Skills**: `.claude/skills/` - Skill implementations
- **Tasks**: `.aura/tasks/` - Active task files

### Documentation
- **AGENTS.md** - Comprehensive agent documentation
- **CONTRIBUTING.md** - Contribution guidelines

---

*For detailed implementation information, see individual agent and skill files in `.claude/agents/` and `.claude/skills/`.*