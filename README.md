# Spec Gen Workflow System

A comprehensive agent coordination and task management framework designed for structured development workflows. This system provides standardized templates, skills, and coordination protocols for managing complex software projects from conception to delivery.

## 🎯 Quick Start

### For Claude AI Assistants
1. **Load Context**: Familiarize yourself with the `.spec/` directory structure
2. **Agent Activation**: Use activation phrases to assume specific agent roles:
   - `As architect orchestrator, scope task SPEC-001`
   - `As product ops orchestrator, run product cycle for SPEC-002`
   - `As tech lead orchestrator, execute implementation for SPEC-003`
   - `As qa orchestrator, validate quality for SPEC-004`
3. **Task Management**: Record task IDs and maintain Rolling Summaries
4. **Context Reset**: Archive conclusions in Activity Log when switching tasks

## 📁 Project Structure

```
.spec/                          # Spec Workflow System
├── agents/                     # Agent specifications and workflows
│   ├── architect.agent.md      # Technical guidance and system design
│   ├── product-ops.agent.md    # Product lifecycle and requirements
│   ├── tech-lead.agent.md      # Engineering execution and quality
│   └── qa.agent.md             # Quality assurance and testing
├── skills/                     # Unified Skills with Multiple Templates
│   ├── planning.skill.md       # 4 planning templates (agile, architect, testing, implementation)
│   ├── research.skill.md       # 5 research templates (product-discovery, analytics, technical, market, competitive)
│   └── [other specialized skills...]
├── templates/                  # Consolidated templates (5 main files)
│   ├── constitution.template.md
│   ├── agent.template.md
│   ├── skill.template.md
│   ├── glossary.template.md
│   └── task-template.md
├── glossary.md                 # Domain vocabulary and terminology
├── register.json               # Skill and concept registry (v3.1)
└── constitution.md              # Spec Workflow Gateway Protocol (v3.1)

CLAUDE.md                      # Claude AI Assistant Guide
AGENTS.md                      # Agent coordination and activation guide
README.md                      # This file
```

## 🔄 Spec Workflow System

### Unified Skills System
The spec system uses **unified skills with multiple templates** for flexible execution:

#### Planning Skill (`.spec/skills/planning.skill.md`)
```bash
# Planning Templates
exec story=<ID> skill=planning planning_type=agile        # Product Ops: backlog sequencing
exec story=<ID> skill=planning planning_type=architect     # Architect: system architecture
exec story=<ID> skill=planning planning_type=testing       # QA: test strategy
exec story=<ID> skill=planning planning_type=implementation # Tech Lead: implementation coordination
```

#### Research Skill (`.spec/skills/research.skill.md`)
```bash
# Research Templates
exec story=<ID> skill=research research_type=product-discovery # Product Ops: problem validation
exec story=<ID> skill=research research_type=analytics         # Any agent: quantitative analysis
exec story=<ID> skill=research research_type=technical         # Architect/Tech Lead: feasibility studies
exec story=<ID> skill=research research_type=market            # Product Ops: market analysis
exec story=<ID> skill=research research_type=competitive       # Product Ops/Architect: competitive analysis
```

### 9-Gate Workflow
1. **product.discovery** → Validate problem and market need (via `research research_type=product-discovery`)
2. **product.prd** → Capture requirements and acceptance criteria
3. **agile.planning** → Sequence backlog and allocate capacity (via `planning planning_type=agile`)
4. **code.implement** → Build feature with automated tests
5. **code.review** → Verify code quality and architecture compliance
6. **qa.ready** → Prepare test environment and fixtures
7. **qa.contract** → Validate API/event contracts
8. **qa.e2e** → Verify end-to-end user journeys
9. **pm.sync** → Update stakeholders and close story

### Agent Activation
```bash
# Agent activation phrases
As architect, design technical architecture with measurable NFR targets and risk assessment.
As product ops, manage task lifecycle with problem validation and stakeholder coordination.
As tech lead, coordinate engineering execution with quality gates and architecture compliance.
As qa, execute comprehensive testing strategy with Go/No-Go decisions.
```

## 📚 Documentation

### Core Documentation (v3.1)
- **[CLAUDE.md](./CLAUDE.md)** - Claude AI Assistant Guide with unified skills system
- **[AGENTS.md](./AGENTS.md)** - Agent coordination and activation guide
- **[Constitution](./.spec/constitution.md)** - Spec Workflow Gateway Protocol
- **[Glossary](./.spec/glossary.md)** - Domain vocabulary and terminology

### Specification System
- **[Register](./.spec/register.json)** - Skill and concept registry (v3.1)
- **[Templates](./.spec/templates/)** - Standardized templates for agents, skills, and tasks

### Development Guides
- **Agent Skills**: See individual agent files in `.spec/agents/`
- **Skill Documentation**: See `.spec/skills/` for unified skill templates
- **Task Management**: Follow task template structure for new projects

## 🔧 System Integration

### Version Information
- **Spec Gen System**: v3.1 (2025-10-24)
- **Constitution**: Spec Workflow Gateway Protocol
- **Registry**: Unified Skills and Agent coordination
- **Templates**: Template-driven execution system

### Key Features
- **Template Selection**: Automatic intent interpretation or direct parameter specification
- **Cross-Agent Skills**: Any agent can use any template with appropriate parameters
- **Multi-Mode Research**: Combined research types for complex investigations
- **Spec Workflow Gateway**: Prescribed 9-gate workflow with evidence-based progression

## 🤝 Contributing

### Spec Development
1. **Read Constitution**: Understand the Spec Workflow Gateway Protocol
2. **Agent Activation**: Use proper activation phrases for coordination
3. **Template Usage**: Follow unified skill templates with appropriate parameters
4. **Lifecycle Logging**: Maintain proper transition logs in task files

### Quality Standards
- **Documentation Quality**: All sections filled with accurate, relevant information
- **Technical Quality**: Follow established best practices and guidelines
- **Process Quality**: Complete audit trail of all decisions and actions
- **Communication**: Timely, accurate, and relevant updates

---

*Spec Gen Workflow System v3.1 - Complete agent coordination and task management framework*