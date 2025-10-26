# [PROJECT_NAME] - AURA Implementation

[PROJECT_DESCRIPTION: Brief 1-2 sentence description of what this project does] This project implements the **AURA (Agent Unified Response Architecture)** system to provide structured development workflows through intelligent AI agent orchestration.

## 🎯 Project Overview

**Project Name**: [PROJECT_NAME: e.g., "TaskMaster Pro", "DataFlow Analytics", "CloudSync Platform"]
**Domain**: [PROJECT_DOMAIN: e.g., "Project Management", "Data Analytics", "Cloud Infrastructure"]
**Primary Functionality**: [PROJECT_FUNCTIONALITY: e.g., "Automated task tracking and team collaboration", "Real-time data processing and visualization", "Multi-cloud resource management"]
**Tech Stack**: [PROJECT_STACK: e.g., "React + Node.js + PostgreSQL + Docker", "Python + FastAPI + MongoDB + Kubernetes", "Vue.js + .NET Core + SQL Server"]
**AURA Version**: [AURA_VERSION: e.g., "0.1.0"]

### Core Capabilities
[PROJECT_CAPABILITIES: Bullet list of main features, e.g.,
• Real-time collaboration and messaging
• Advanced analytics and reporting
• Automated workflow orchestration
• Multi-tenant architecture
• RESTful API with GraphQL support]

## 🚀 Quick Start

### Environment Setup
```bash
# Clone and setup
git clone [REPOSITORY_URL: Your Git repository URL]
cd [PROJECT_NAME]

# Configure environment
cp .env.example .env
# Edit .env with your [PROJECT_DOMAIN] specific configuration

# Initialize AURA workspace
node scripts/setup.js
```

### For Claude AI Assistants
1. **Load Context**: Familiarize yourself with `.spec/` directory structure
2. **Agent Activation**: Use activation phrases to assume specific agent roles:
   - `As architect orchestrator, scope task [PROJECT_PREFIX: e.g., "TM", "DF", "CS"]-001`
   - `As product ops orchestrator, run product cycle for [PROJECT_PREFIX]-002`
   - `As tech lead orchestrator, execute implementation for [PROJECT_PREFIX]-003`
   - `As qa orchestrator, validate quality for [PROJECT_PREFIX]-004`
3. **Task Management**: Record task IDs and maintain Rolling Summaries
4. **Context Reset**: Archive conclusions in Activity Log when switching tasks

## 📁 Project Structure

```
[PROJECT_NAME]/
├── .spec/                          # AURA Workflow System
│   ├── agents/                     # Agent specifications and workflows
│   ├── skills/                     # Unified Skills with Multiple Templates
│   ├── templates/                  # Consolidated templates (5 main files)
│   ├── glossary.md                 # Domain vocabulary and terminology
│   ├── register.json               # Skill and concept registry (v[AURA_VERSION])
│   └── constitution.md              # AURA Workflow Gateway Protocol (v[AURA_VERSION])
├── [PROJECT_CODE_DIRS: e.g., "src/", "app/", "backend/"]          # [PROJECT_STACK] application code
├── [PROJECT_CONFIG_DIRS: e.g., "config/", "settings/", ".configs/"]         # Configuration and environment files
├── docs/                         # Project documentation
├── scripts/                       # Build and automation scripts
├── CLAUDE.md                      # Claude AI Assistant Guide
├── AGENTS.md                      # Agent coordination and activation guide
├── README.md                      # This file
├── LICENSE                        # MIT License
└── package.json                    # Project dependencies and scripts
```

## 🔄 [PROJECT_NAME] Implementation

### AURA Integration
[PROJECT_AURA_INTEGRATION: How AURA is integrated, e.g.,
• Custom agents for domain-specific workflows
• Extended skill templates for [PROJECT_DOMAIN]
• Integration with existing [PROJECT_STACK] architecture
• Custom transitions for [PROJECT_FUNCTIONALITY]]

### Technology Stack
[PROJECT_STACK_DESCRIPTION: Detailed tech stack info, e.g.,
• **Frontend**: React 18 + TypeScript + Tailwind CSS
• **Backend**: Node.js + Express + GraphQL
• **Database**: PostgreSQL + Redis for caching
• **Infrastructure**: Docker + Kubernetes + AWS
• **Testing**: Jest + Cypress + Playwright]

### Domain-Specific Features
[PROJECT_DOMAIN_FEATURES: Features specific to your domain, e.g.,
• **Project Management**: Gantt charts, resource allocation, milestone tracking
• **Data Analytics**: Real-time dashboards, custom reports, ML insights
• **Cloud Infrastructure**: Resource monitoring, auto-scaling, cost optimization]

## 🔄 AURA Workflow System

### Unified Skills System
[PROJECT_NAME] uses AURA's **unified skills with multiple templates** for flexible execution:

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

## 🛠 Development Workflow

### [PROJECT_NAME] Specific Commands
[PROJECT_COMMANDS: Custom npm scripts, e.g.,
```bash
# Development
npm run dev          # Start development servers
npm run build        # Build for production
npm run test          # Run all tests
npm run lint          # Code quality checks
npm run deploy        # Deploy to staging

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed test data

# [PROJECT_DOMAIN] specific
npm run analytics     # Run data analytics jobs
npm run reports       # Generate monthly reports
```

### Testing Strategy
[PROJECT_TESTING: Testing approach, e.g.,
• **Unit Tests**: Jest with 80%+ coverage requirement
• **Integration Tests**: API endpoints with supertest
• **E2E Tests**: Cypress for critical user journeys
• **Performance Tests**: Artillery for load testing
• **Security Tests**: OWASP ZAP for vulnerability scanning]

### Deployment Process
[PROJECT_DEPLOYMENT: CI/CD pipeline, e.g.,
1. **CI Pipeline**: GitHub Actions for automated testing and building
2. **Staging**: Deploy to staging environment for QA validation
3. **Production**: Blue-green deployment with rollback capability
4. **Monitoring**: Grafana + Prometheus for health monitoring
5. **Alerts**: PagerDuty integration for critical issues]

## 📚 Documentation

### Core Documentation (v[AURA_VERSION])
- **[CLAUDE.md](./CLAUDE.md)** - Claude AI Assistant Guide with unified skills system
- **[AGENTS.md](./AGENTS.md)** - Agent coordination and activation guide
- **[Constitution](./.spec/constitution.md)** - AURA Workflow Gateway Protocol
- **[Glossary](./.spec/glossary.md)** - Domain vocabulary and terminology

### [PROJECT_NAME] System Components
- **[Register](./.spec/register.json)** - Skill and concept registry (v[AURA_VERSION])
- **[Templates](./.spec/templates/)** - Standardized templates for agents, skills, and tasks
- **[API Documentation](./docs/api/)** - [PROJECT_API_DOCS: e.g., "RESTful API endpoints", "GraphQL schema documentation"]
- **[User Guide](./docs/user-guide.md)** - [PROJECT_USER_GUIDE: e.g., "Getting started guide", "Feature walkthrough"]

### Development Guides
- **Agent Skills**: See individual agent files in `.spec/agents/`
- **Skill Documentation**: See `.spec/skills/` for unified skill templates
- **Task Management**: Follow task template structure for new projects
- **[PROJECT_DEVELOPMENT_GUIDES: e.g., "Contributing guidelines", "Code review checklist"]**

## 🔧 System Integration

### Version Information
- **[PROJECT_NAME]**: [PROJECT_VERSION: e.g., "1.2.3"] ([PROJECT_RELEASE_DATE: e.g., "2024-01-15"])
- **AURA System**: v[AURA_VERSION] ([AURA_RELEASE_DATE: e.g., "2025-10-24"])
- **Constitution**: AURA Workflow Gateway Protocol
- **Registry**: Unified Skills and Agent coordination
- **Templates**: Template-driven execution system

### Key Features
- **Template Selection**: Automatic intent interpretation or direct parameter specification
- **Cross-Agent Skills**: Any agent can use any template with appropriate parameters
- **Multi-Mode Research**: Combined research types for complex investigations
- **AURA Workflow Gateway**: Prescribed 9-gate workflow with evidence-based progression
- **[PROJECT_KEY_FEATURES: e.g., "Real-time collaboration", "Advanced analytics", "Auto-scaling infrastructure"]**

### Environment Variables
[PROJECT_ENVIRONMENT: Key environment variables, e.g.,
```bash
# Application
PORT=3000
NODE_ENV=development
API_BASE_URL=https://api.[PROJECT_DOMAIN].com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=[PROJECT_NAME]_dev
DB_USER=admin

# External Services
REDIS_URL=redis://localhost:6379
AWS_REGION=us-east-1
STRIPE_SECRET_KEY=sk_test_...

# [PROJECT_DOMAIN] specific
ANALYTICS_API_KEY=your_key_here
WEBHOOK_SECRET=your_webhook_secret
```

## 🤝 Contributing

### [PROJECT_NAME] Development
1. **Read Constitution**: Understand the AURA Workflow Gateway Protocol
2. **Agent Activation**: Use proper activation phrases for coordination
3. **Template Usage**: Follow unified skill templates with appropriate parameters
4. **Lifecycle Logging**: Maintain proper transition logs in task files
5. **[PROJECT_CONTRIBUTION_GUIDELINES: e.g., "Code style requirements", "Pull request process"]**

### Quality Standards
- **Documentation Quality**: All sections filled with accurate, relevant information
- **Technical Quality**: Follow established best practices and guidelines
- **Process Quality**: Complete audit trail of all decisions and actions
- **Communication**: Timely, accurate, and relevant updates
- **[PROJECT_QUALITY_STANDARDS: e.g., "Performance benchmarks", "Security requirements"]**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [[PROJECT_DOCS_URL: e.g., "https://docs.[PROJECT_DOMAIN].com"]](https://docs.[PROJECT_DOMAIN].com)
- **Issues**: [[PROJECT_ISSUES_URL: e.g., "https://github.com/your-org/[PROJECT_NAME]/issues"](https://github.com/your-org/[PROJECT_NAME]/issues)
- **Discussions**: [[PROJECT_DISCUSSIONS_URL: e.g., "https://github.com/your-org/[PROJECT_NAME]/discussions"](https://github.com/your-org/[PROJECT_NAME]/discussions)]

---

*[PROJECT_NAME] - [PROJECT_TAGLINE: e.g., "Intelligent project management for modern teams", "Data-driven insights for business growth"]*
*AURA Implementation v[AURA_VERSION] - Complete agent coordination and task management framework*