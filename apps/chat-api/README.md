# AI Workspace API

AI-powered workspace API with CRM, chat, and content generation capabilities built with hexagonal architecture and KISS principles.

## Tech Stack Requirements

Per the [root constitution](../../../.spec/constitution.md#tech-stack-requirements), this application follows the standardized tech stack:

- **Code Linting and Formatting**: **Biome** is the required tool for all code linting, formatting, and quality checks
- **TypeScript**: Strict TypeScript configuration is mandatory
- **Testing Framework**: Jest for unit tests, Vitest for modern testing scenarios
- **Build Tools**: NestJS CLI for development and production builds
- **Package Manager**: pnpm is the preferred package manager for the monorepo
- **Framework**: NestJS with Fastify as the underlying server
- **Real-time**: Socket.io for WebSocket connections
- **Database**: TypeORM for database interactions
- **Authentication**: JWT-based authentication with Passport

## 🚀 Features

### Core Modules
- **Authentication**: User registration, login, email verification, password reset
- **AI Chat**: Conversational AI with OpenAI and Claude integration
- **CRM**: Contact and company management with interaction tracking
- **Content Generation**: AI-powered presentations, reports, and data analysis
- **Workspace Management**: Multi-tenant workspaces with role-based access control

### Technical Features
- **Hexagonal Architecture**: Clean separation of concerns with ports and adapters
- **TypeScript**: Full type safety with strict mode
- **Fastify**: High-performance HTTP server with automatic OpenAPI documentation
- **Zod Validation**: Type-safe request/response validation
- **In-Memory Storage**: Simple storage ready for database swap
- **KISS Principles**: Simple, maintainable codebase

## 📁 Project Structure

```
src/
├── libs/                    # Shared utilities and services
│   ├── utils/              # Result, Option, async utilities
│   ├── http-client/        # HTTP client with AI service integrations
│   ├── email/              # Email service with multiple providers
│   ├── cache/              # Cache abstraction (memory/Redis)
│   └── validation/         # Zod schemas and validation utilities
├── shared/                 # Base classes and shared infrastructure
│   ├── base-entity.ts      # Base entity with ID and timestamps
│   ├── base-repository.ts  # Repository interface and memory implementation
│   └── use-case.ts         # Use case base classes
├── modules/                # Business modules with hexagonal architecture
│   ├── auth/               # Authentication and user management
│   ├── chat/               # AI chat conversations
│   ├── crm/                # Customer relationship management
│   ├── content/            # Content generation and analysis
│   └── workspace/          # Workspace and team management
├── plugins/                # Fastify plugins
├── routes/                 # Global routes
├── app.ts                  # Fastify app builder
└── server.ts               # Server entry point
```

## 🏗️ Architecture

### Hexagonal Architecture Pattern

Each module follows hexagonal architecture with clear separation of concerns:

```
modules/example/
├── domain/                 # Business logic (inner hexagon)
│   ├── entities/           # Domain entities with business rules
│   ├── repositories/       # Repository interfaces
│   └── services/           # Domain services
├── application/            # Application orchestration
│   ├── use-cases/          # Business use cases
│   └── services/           # Application services
├── infrastructure/         # External concerns (outer hexagon)
│   ├── repositories/       # Repository implementations
│   └── services/           # External service integrations
└── presentation/           # HTTP layer
    ├── controllers/        # Request handlers
    ├── routes/             # Route definitions
    └── dto/                # Request/response schemas
```

### KISS Philosophy
- **Simple Implementations**: Each class has a single responsibility
- **Clear Interfaces**: Minimal, focused interfaces
- **No Over-Engineering**: Direct solutions without unnecessary abstractions
- **Type Safety**: Leverage TypeScript for compile-time guarantees

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Update environment variables with your API keys
```

### Environment Variables

```bash
# Server Configuration
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-access-token-key
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-token-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key
CLAUDE_API_KEY=your-claude-api-key

# Email Configuration
RESEND_API_KEY=your-resend-api-key
```

### Running the Server

```bash
# Development mode with hot reload
pnpm dev

# Production build
pnpm build
pnpm start

# Run tests
pnpm test

# Lint and format code with Biome
pnpm lint
```

## Code Quality

All code must comply with Biome linting rules. Run `pnpm lint` before committing to ensure code quality standards are met.

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:4000/docs
- **Health Check**: http://localhost:4000/health
- **API Root**: http://localhost:4000/

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile

### Chat (`/chat`)
- `GET /chat/sessions` - List user's chat sessions
- `POST /chat/sessions` - Create new chat session
- `GET /chat/sessions/:id` - Get specific chat session
- `POST /chat/sessions/:id/messages` - Send message and get AI response
- `DELETE /chat/sessions/:id` - Delete chat session

### CRM (`/crm`)
- `GET /crm/contacts` - List contacts with pagination
- `POST /crm/contacts` - Create new contact
- `GET /crm/contacts/:id` - Get specific contact
- `PUT /crm/contacts/:id` - Update contact
- `DELETE /crm/contacts/:id` - Delete contact
- `GET /crm/companies` - List companies
- `POST /crm/companies` - Create new company
- `POST /crm/interactions` - Create interaction
- `GET /crm/search` - Search contacts and companies

### Content Generation (`/content`)
- `POST /content/generate/presentation` - Generate AI presentation
- `POST /content/generate/report` - Generate AI report
- `POST /content/analyze/data` - Analyze data sources
- `GET /content/history` - Get content generation history
- `GET /content/projects/:id` - Get specific project

### Workspace (`/workspace`)
- `GET /workspace/workspaces` - List user's workspaces
- `POST /workspace/workspaces` - Create new workspace
- `GET /workspace/workspaces/:id` - Get specific workspace
- `POST /workspace/workspaces/:id/invite` - Invite member
- `GET /workspace/workspaces/:id/members` - List workspace members

## 🚀 Implementation Status

### ✅ Completed Modules
- **Authentication**: Complete auth flow with JWT tokens and email verification
- **Chat**: AI chat with OpenAI and Claude integration, session management
- **CRM**: Full CRM with contacts, companies, and interaction tracking
- **Content Generation**: AI-powered presentations, reports, and data analysis
- **Workspace Management**: Multi-tenant workspaces with role-based access

### ✅ Architecture Features
- **Hexagonal Architecture**: Clean separation of concerns in all modules
- **Type Safety**: Full TypeScript implementation with strict mode
- **Error Handling**: Comprehensive error handling with Result types
- **Validation**: Type-safe input validation with Zod schemas
- **Documentation**: Auto-generated OpenAPI documentation

## 📊 Monitoring & Observability

### Health Checks
- `/health` - Basic health check with uptime and version
- Module-specific health checks for dependencies

### Logging
- Structured JSON logging in production
- Pretty-printed logs in development
- Request/response logging with correlation IDs

### Error Handling
- Centralized error handling with consistent response format
- Error logging with context and stack traces
- User-friendly error messages

## Spec Ops
- Constitution: `.spec/constitution.md`
- Agents: `.spec/Agents.md`
- Glossary: `.spec/glossary.md`
