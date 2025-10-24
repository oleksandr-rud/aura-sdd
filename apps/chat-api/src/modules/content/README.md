# Content Module

AI-powered content creation and analysis module following hexagonal architecture patterns.

## Overview

This module provides comprehensive content generation and analysis capabilities including:
- AI-powered presentation generation
- Automated report creation
- Data analysis and insights
- Content template management
- Content history tracking

## Architecture

The module follows hexagonal architecture with clear separation of concerns:

```
content/
├── domain/           # Business logic and entities
├── application/      # Use cases and application services
├── infrastructure/   # External integrations and data persistence
└── presentation/     # HTTP controllers and DTOs
```

## Core Features

### 1. Content Generation
- **Presentations**: Generate slide decks with structured content
- **Reports**: Create comprehensive reports with data analysis
- **Analysis**: Analyze data sources for insights and patterns

### 2. Content Management
- **Templates**: Reusable templates for different content types
- **History**: Track and retrieve previously generated content
- **Projects**: Organize content generation by project

### 3. Data Sources
- Chat history and conversations
- CRM contacts and interactions
- Previously generated content
- Uploaded files (CSV, JSON, text)
- External APIs

## API Endpoints

### Content Generation
- `POST /content/generate/presentation` - Generate AI-powered presentations
- `POST /content/generate/report` - Generate comprehensive reports
- `POST /content/analyze/data` - Analyze data for insights

### Content Management
- `GET /content/history` - Get content generation history
- `GET /content/projects/:id` - Get specific content project
- `GET /content/projects/:id/content` - Get project content
- `DELETE /content/projects/:id` - Delete content project

### Templates
- `POST /content/templates` - Create content templates
- `GET /content/templates` - List available templates

### Metrics
- `GET /content/metrics` - Get project metrics and statistics
- `GET /content/health` - Health check endpoint

## Usage Examples

### Generate a Presentation

```typescript
const response = await fetch('/content/generate/presentation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-workspace-id': 'workspace-id'
  },
  body: JSON.stringify({
    userId: 'user-id',
    workspaceId: 'workspace-id',
    topic: 'Digital Transformation Strategy',
    audience: 'Executive Leadership',
    length: 'medium',
    style: 'professional',
    dataSources: ['crm-data', 'chat-history']
  })
})
```

### Analyze Data

```typescript
const response = await fetch('/content/analyze/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-workspace-id': 'workspace-id'
  },
  body: JSON.stringify({
    userId: 'user-id',
    workspaceId: 'workspace-id',
    dataType: 'crm',
    analysisType: 'insights',
    dateRange: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-01-31T23:59:59Z'
    },
    dataSources: ['crm-contacts', 'interactions']
  })
})
```

## Dependencies

- Shared libraries: `@/libs/utils`, `@/libs/validation`, `@/libs/http-client`, `@/libs/storage`
- Base classes: `@/shared/base-entity`, `@/shared/base-repository`, `@/shared/use-case`
- Auth module: User authentication and workspace authorization

## Data Models

### ContentProject
- Title, description, type (presentation/report/analysis)
- Status tracking (draft/in_progress/completed/failed)
- User and workspace association
- Data sources and parameters

### GeneratedContent
- Content type and format
- Generated content and metadata
- Quality metrics and processing time
- Project association

### ContentTemplate
- Template structure and variables
- AI prompts for generation
- Category and status management
- User and workspace ownership

## Implementation Notes

### KISS Philosophy
- Simple, focused implementations
- Clear separation of concerns
- Reusable patterns across content types
- Minimal complexity for maximum maintainability

### Error Handling
- Consistent error responses across all endpoints
- Graceful degradation for AI service failures
- Comprehensive validation and input sanitization

### Performance
- In-memory repository implementations for development
- Async processing for long-running generation tasks
- Caching strategies for template and content retrieval

## Future Enhancements

- Real-time generation progress tracking
- Content versioning and rollback
- Advanced template inheritance
- Integration with external AI providers
- Content export in multiple formats
- Collaborative content editing

## Testing

Run tests with:
```bash
npm test -- content
```

The module includes comprehensive test coverage for:
- Domain entities and business logic
- Use cases and application services
- Repository implementations
- API endpoints and DTO validation
- Error handling scenarios