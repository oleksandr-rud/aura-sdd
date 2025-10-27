# AURA Agents Documentation

## Overview

This document provides essential information about the AURA (Agent Unified Response Architecture) agents implemented in Claude Code. Each agent provides specialized capabilities within the AURA framework governance.

## Agent Architecture

### Dual Implementation System

AURA agents operate through:

1. **AURA Framework** (`.aura/`) - Provides constitution, glossary, and governance
2. **Claude Code Implementation** (`.claude/agents/`) - Provides actual agent execution

## Core Agents

### 1. Architect Agent

**File**: [`.claude/agents/architect.md`](.claude/agents/architect.md)
**Model**: Sonnet | **Color**: Purple

**Purpose**: Provide architectural guidance, system design decisions, and technical direction.

**Key Capabilities**:
- System architecture analysis and design
- NFR definition and validation
- Technology evaluation and risk assessment
- Architecture documentation and governance
- Technical feasibility assessment

**Available Skills**: Planning, Research, Context Management, Technical Writing

**Activation**: `As architect, [technical architecture task]`

---

### 2. Product Ops Agent

**File**: [`.claude/agents/product-ops.md`](.claude/agents/product-ops.md)
**Model**: Sonnet | **Color**: Green

**Purpose**: Own task file lifecycle, product framing, and stakeholder communication.

**Key Capabilities**:
- Problem validation and market analysis
- Requirements capture and PRD creation
- Stakeholder communication and coordination
- KPI definition and success tracking
- Product lifecycle management

**Available Skills**: Research, Planning, Technical Writing, Context Management

**Activation**: `As product ops, [product management task]`

---

### 3. Tech Lead Agent

**File**: [`.claude/agents/tech-lead.md`](.claude/agents/tech-lead.md)
**Model**: Sonnet | **Color**: Orange

**Purpose**: Coordinate engineering execution, code quality, and technical implementation.

**Key Capabilities**:
- Implementation planning and coordination
- Code quality management and review
- Technical coordination and team leadership
- Architecture compliance validation
- Quality assurance integration

**Available Skills**: Planning, Research, Context Management, Code, Technical Writing

**Activation**: `As tech lead, [technical implementation task]`

---

### 4. QA Agent

**File**: [`.claude/agents/qa.md`](.claude/agents/qa.md)
**Model**: Sonnet | **Color**: Red

**Purpose**: Validate quality standards, execute testing strategies, and provide Go/No-Go decisions.

**Key Capabilities**:
- Testing strategy design and execution
- Quality validation and assurance
- Test environment setup and maintenance
- Go/No-Go decision making
- End-to-end testing coordination

**Available Skills**: Planning, Research, Context Management, QA, Code, Technical Writing

**Activation**: `As qa, [quality assurance task]`

## Common Agent Features

### AURA Framework Integration
All agents reference:
- **Constitution**: [`.aura/constitution.md`](.aura/constitution.md) - Workflow Gateway Protocol
- **Glossary**: [`.aura/glossary.md`](.aura/glossary.md) - Domain terminology

### Available Tools
All agents have access to:
- **File Management**: Read, Write, Edit, Glob, Grep
- **System Tools**: Bash, Task Management
- **Research**: WebSearch, WebFetch, Context7
- **Project Management**: TodoWrite, ExitPlanMode

### Context Management
- **Context Preservation**: Maintain state across agent transitions
- **Lifecycle Logging**: Store decisions and progress in task files
- **Handoff Coordination**: Structured transfer between agents

## Agent Coordination

### Workflow Integration
Agents follow the AURA prescribed workflow sequence:
1. **product.discovery** → Validate problem and market need
2. **product.prd** → Capture requirements and acceptance criteria
3. **agile.planning** → Sequence backlog and allocate capacity
4. **code.implement** → Build feature with automated tests
5. **code.review** → Verify code quality and architecture compliance
6. **qa.ready** → Prepare test environment and fixtures
7. **qa.contract** → Validate API/event contracts
8. **qa.e2e** → Verify end-to-end user journeys
9. **pm.sync** → Update stakeholders and close story

### Handoff Patterns
- **Context Preservation**: Complete state transfer between agents
- **Transition Logging**: Auditable handoff records in task files
- **Responsibility Transfer**: Clear ownership changes with next steps

## Usage Examples

### Architecture Design
```bash
As architect, design the system architecture for our new feature with measurable NFR targets.
```

### Product Management
```bash
As product ops, validate this product idea and capture comprehensive requirements.
```

### Technical Implementation
```bash
As tech lead, coordinate the implementation of this feature and ensure code quality standards.
```

### Quality Assurance
```bash
As qa, design a comprehensive testing strategy and validate quality standards for delivery.
```

## File Structure

```
.claude/
├── agents/
│   ├── architect.md      # Architect agent implementation
│   ├── product-ops.md    # Product Ops agent implementation
│   ├── tech-lead.md      # Tech Lead agent implementation
│   └── qa.md             # QA agent implementation
└── skills/
    ├── planning/          # Planning skill for all agents
    ├── research/          # Research skill for all agents
    ├── qa/                # QA skill for quality validation
    ├── code/              # Code skill for implementation
    ├── context-management/ # Context management for handoffs
    └── technical-writing/  # Technical writing for documentation
```

## Quality Standards

- All agents follow AURA framework governance
- Skills are executed with proper validation and evidence
- Context is preserved across agent transitions
- Quality gates are enforced before workflow progression
- All decisions are documented in task lifecycle logs

---

*For detailed implementation information, see individual agent files in `.claude/agents/`.*