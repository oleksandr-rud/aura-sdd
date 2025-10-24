# Spec Gen Monorepo

This repository hosts multiple applications managed under a single workspace with a unified Spec Workflow system. Each app follows the same Spec Gen constitution and agent coordination framework while maintaining domain-specific requirements.

## 🚀 Quick Start

### Development Environment
```bash
# Start all services (API + Client)
npm run dev:full
# or: ./dev-startup.sh start

# Stop all services
npm run dev:stop
# or: ./dev-startup.sh stop

# Check service status
npm run dev:status

# Install dependencies and setup environment
npm run dev:install

# Show help
npm run dev:help
```

**Services Started**:
- **API Server**: http://localhost:4000 (with demo endpoints)
- **Client App**: http://localhost:5173 (React application)
- **Demo Endpoints**: Auth, CRM, Chat, Content Generation with realistic AI responses

## 📁 Project Structure

```
.spec/                          # 🆕 Spec Workflow System
├── agents/                     # Agent specifications and workflows
│   ├── architect.agent.md      # Technical guidance and system design
│   ├── product-ops.agent.md    # Product lifecycle and requirements
│   ├── tech-lead.agent.md      # Engineering execution and quality
│   └── qa.agent.md             # Quality assurance and testing
├── skills/                     # 🆕 Unified Skills with Multiple Templates
│   ├── planning.skill.md       # 4 planning templates (agile, architect, testing, implementation)
│   ├── research.skill.md       # 5 research templates (product-discovery, analytics, technical, market, competitive)
│   └── [other specialized skills...]
├── tasks/                      # Single-file task packages (PROJECT-XXX.md)
├── templates/                  # Consolidated templates (5 main files)
├── glossary.md                 # Domain vocabulary and terminology
├── register.json               # 🆕 Skill and concept registry (v3.1)
└── constitution.md              # 🆕 Spec Workflow Gateway Protocol (v3.1)

apps/                          # Application sources
├── api/                       # Fastify API server with demo endpoints
├── client/                    # React application (Vite)
├── landing/                   # Landing page
├── crm/                       # CRM application
└── android/                   # Android application

shared/                        # Cross-cutting libraries or configuration
tooling/                       # DevOps, CI/CD, and infrastructure assets

CLAUDE.md                      # 🆕 Claude AI Assistant Guide
AGENTS.md                      # 🆕 Agent coordination and activation guide
README.md                      # This file
```

## 🎯 Spec Workflow System

### 🆕 Unified Skills System
The spec system uses **unified skills with multiple templates** for flexible execution:

#### **Planning Skill** (`.spec/skills/planning.skill.md`)
```bash
# Planning Templates
exec story=<ID> skill=planning planning_type=agile        # Product Ops: backlog sequencing
exec story=<ID> skill=planning planning_type=architect     # Architect: system architecture
exec story=<ID> skill=planning planning_type=testing       # QA: test strategy
exec story=<ID> skill=planning planning_type=implementation # Tech Lead: implementation coordination
```

#### **Research Skill** (`.spec/skills/research.skill.md`)
```bash
# Research Templates
exec story=<ID> skill=research research_type=product-discovery # Product Ops: problem validation
exec story=<ID> skill=research research_type=analytics         # Any agent: quantitative analysis
exec story=<ID> skill=research research_type=technical         # Architect/Tech Lead: feasibility studies
exec story=<ID> skill=research research_type=market            # Product Ops: market analysis
exec story=<ID> skill=research research_type=competitive       # Product Ops/Architect: competitive analysis
```

### **9-Gate Workflow**
1. **product.discovery** → Validate problem and market need (via `research research_type=product-discovery`)
2. **product.prd** → Capture requirements and acceptance criteria
3. **agile.planning** → Sequence backlog and allocate capacity (via `planning planning_type=agile`)
4. **code.implement** → Build feature with automated tests
5. **code.review** → Verify code quality and architecture compliance
6. **qa.ready** → Prepare test environment and fixtures
7. **qa.contract** → Validate API/event contracts
8. **qa.e2e** → Verify end-to-end user journeys
9. **pm.sync** → Update stakeholders and close story

### **Agent Activation**
```bash
# Agent activation phrases
As architect, design technical architecture with measurable NFR targets and risk assessment.
As product ops, manage task lifecycle with problem validation and stakeholder coordination.
As tech lead, coordinate engineering execution with quality gates and architecture compliance.
As qa, execute comprehensive testing strategy with Go/No-Go decisions.
```

## 🛠 Development Setup

### Package Management
1. Install [pnpm](https://pnpm.io/) (`corepack enable` on Node 20+)
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the dev servers:
   ```bash
   pnpm dev
   ```
   The command runs the client (Vite) and API (Fastify) servers concurrently.

### Build Commands
```bash
pnpm build      # Build all packages
pnpm lint       # Lint all packages
pnpm test       # Test all packages
```

## 🐳 Docker & On-Prem Orchestration

### Local Development
```bash
docker compose up --build
```

### Tesseract Deployment
Use `docker-compose.yml` to run the stack locally or push the same manifest to a Tesseract-managed cluster. Each app also exposes its own `Dockerfile` for independent deployments.

For Tesseract, create an overlay under `tooling/tesseract/overlays/<env>/stack.yaml` and apply it with `tesseract stack apply`.

## 📚 Documentation

### **Core Documentation** (🆕 Updated v3.1)
- **[CLAUDE.md](./CLAUDE.md)** - Claude AI Assistant Guide with unified skills system
- **[AGENTS.md](./AGENTS.md)** - Agent coordination and activation guide
- **[Constitution](./.spec/constitution.md)** - Spec Workflow Gateway Protocol
- **[Glossary](./.spec/glossary.md)** - Domain vocabulary and terminology

### **Specification System**
- **[Register](./.spec/register.json)** - Skill and concept registry (v3.1)
- **[Templates](./.spec/templates/)** - Standardized templates for agents, skills, and tasks
- **[Tasks](./.spec/tasks/)** - Example task packages and workflows

### **Development Guides**
- **Quick Start**: Use `./dev-startup.sh help` for development commands
- **Agent Skills**: See individual agent files in `.spec/agents/`
- **Skill Documentation**: See `.spec/skills/` for unified skill templates

## 🔧 System Integration

### **Version Information**
- **Spec Gen System**: v3.1 (2025-10-24)
- **Constitution**: Spec Workflow Gateway Protocol
- **Registry**: Unified Skills and Agent coordination
- **Templates**: Template-driven execution system

### **Key Features** (🆕)
- **Template Selection**: Automatic intent interpretation or direct parameter specification
- **Cross-Agent Skills**: Any agent can use any template with appropriate parameters
- **Multi-Mode Research**: Combined research types for complex investigations
- **Spec Workflow Gateway**: Prescribed 9-gate workflow with evidence-based progression

## 🤝 Contributing

### **Spec Development**
1. **Read Constitution**: Understand the Spec Workflow Gateway Protocol
2. **Agent Activation**: Use proper activation phrases for coordination
3. **Template Usage**: Follow unified skill templates with appropriate parameters
4. **Lifecycle Logging**: Maintain proper transition logs in task files

### **Code Development**
- Follow the established gate sequence in your development workflow
- Use the agent system for coordination and handoffs
- Maintain proper documentation and evidence collection
- Align work with the respective constitution before committing changes

---

*Spec Gen Monorepo - Unified Spec Workflow System v3.1*
