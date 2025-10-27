# AURA Agents Guide

## Overview

This guide provides comprehensive information about the AURA (Agent Unified Response Architecture) agents - specialized AI assistants that coordinate within the framework to deliver structured workflows and quality outcomes.

## Agent Framework

### Architecture Overview
AURA agents operate through a dual-layer system:
- **Framework Layer** (`.aura/`) - Constitution, glossary, and governance structures
- **Implementation Layer** (`.claude/agents/`) - Agent execution and skill coordination

### Core Principles
- **Specialization**: Each agent has defined domains of expertise
- **Coordination**: Structured handoffs preserve context and maintain workflow integrity
- **Quality**: Framework compliance and evidence-based decision making
- **Auditability**: Complete lifecycle logging for transparency and accountability

## Agent Capabilities

### Architect Agent
- **Domain**: System architecture and technical design
- **Expertise**: Technical guidance, system design decisions, NFR definition
- **Key Skills**: Planning, Research, Context Management, Technical Writing
- **Activation**: `As architect, [technical architecture task]`

### Product Ops Agent
- **Domain**: Product lifecycle and requirements management
- **Expertise**: Problem validation, requirements capture, stakeholder coordination
- **Key Skills**: Research, Planning, Technical Writing, Context Management
- **Activation**: `As product ops, [product management task]`

### Tech Lead Agent
- **Domain**: Engineering execution and code quality
- **Expertise**: Implementation coordination, architecture compliance, quality management
- **Key Skills**: Planning, Research, Context Management, Code, Technical Writing
- **Activation**: `As tech lead, [technical implementation task]`

### QA Agent
- **Domain**: Quality assurance and testing strategy
- **Expertise**: Testing design, quality validation, Go/No-Go decisions
- **Key Skills**: Planning, Research, Context Management, QA, Code, Technical Writing
- **Activation**: `As qa, [quality assurance task]`

## Framework Integration

### Governance Structure
All agents operate under AURA framework governance:
- **Constitution**: Workflow rules and quality standards
- **Glossary**: Domain terminology and consistent definitions
- **Task Management**: Lifecycle logging and context preservation

### Coordination Patterns
- **State-Based Workflows**: Flexible transitions based on project needs
- **Parallel Execution**: Multiple agents can work simultaneously
- **Context Preservation**: Complete state transfer between agents
- **Evidence-Based Decisions**: All choices supported by data and documentation

### Memory Architecture
- **Working Memory**: Current conversation context
- **Persistent Memory**: Framework files and task history
- **Context Snapshots**: Structured state preservation
- **Lifecycle Logs**: Auditable transition history

## Workflow System

### State Clusters
AURA uses flexible state-based workflows organized into clusters:

**INITIALIZATION CLUSTER**
- Product discovery and market validation
- Requirements gathering and analysis
- Technical assessment and feasibility

**PLANNING CLUSTER**
- Architecture design and technical approach
- Backlog sequencing and capacity planning
- Resource allocation and dependency management

**EXECUTION CLUSTER**
- Feature development and testing
- Quality validation and compliance
- Stakeholder coordination and feedback

**COMPLETION CLUSTER**
- Delivery validation and success verification
- Knowledge transfer and documentation

### Agent Handoffs
- **Context Preservation**: Complete state transfer between agents
- **Transition Logging**: Auditable handoff records
- **Responsibility Transfer**: Clear ownership changes with defined next steps

## Available Resources

### Framework Files
- **Constitution**: Workflow rules and governance protocols
- **Glossary**: Domain terminology and definitions
- **Tasks**: Active task files with lifecycle logs

### Implementation Files
- **Agents**: Specialized agent implementations
- **Skills**: Shared skill capabilities across agents

### Documentation
- **CLAUDE.md**: AI assistant implementation guide
- **CONTRIBUTING.md**: Contribution guidelines and standards

## Usage Examples

### Architecture Activation
```bash
As architect, design system architecture with measurable NFR targets and risk assessment.
```

### Product Management Activation
```bash
As product ops, validate product idea and capture comprehensive requirements.
```

### Technical Leadership Activation
```bash
As tech lead, coordinate implementation and ensure code quality standards.
```

### Quality Assurance Activation
```bash
As qa, design testing strategy and validate quality standards for Go/No-Go decisions.
```

## Quality Standards

- **Framework Compliance**: All agents follow AURA constitution and standards
- **Context Preservation**: Maintain state across agent transitions
- **Evidence-Based**: Decisions supported by data and documentation
- **Audit Trail**: Complete lifecycle logging for accountability
- **Quality Gates**: Validation before workflow progression

---

*For detailed implementation information, see individual agent files in `.claude/agents/` and framework documentation in `.aura/`.*