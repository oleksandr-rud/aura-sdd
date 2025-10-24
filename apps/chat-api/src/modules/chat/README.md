# Chat Module

A complete hexagonal architecture implementation for AI chat functionality with support for OpenAI and Claude models.

## Architecture

This module follows the hexagonal (ports and adapters) architecture pattern:

```
chat/
├── domain/           # Business logic and entities
│   ├── entities/     # Core domain entities (ChatSession, Message)
│   ├── repositories/ # Repository interfaces (ports)
│   └── services/     # Domain service interfaces
├── application/      # Use cases and orchestration
│   ├── use-cases/    # Business use cases
│   └── services/     # Application services
├── infrastructure/   # External concerns (adapters)
│   ├── repositories/ # Repository implementations
│   └── services/     # AI service implementations
└── presentation/     # HTTP layer
    ├── controllers/  # Request handlers
    ├── routes/       # Route definitions
    └── dto/          # Data transfer objects
```

## Features

- **Chat Sessions**: Create, retrieve, update, and delete chat sessions
- **Message Handling**: Send messages and receive AI responses
- **Multi-Provider AI**: Support for OpenAI GPT and Claude models
- **Context Management**: Maintain conversation history and context windows
- **Session Persistence**: Store and retrieve chat history
- **Authentication**: User-based session access control
- **Streaming Responses**: Support for real-time AI responses (planned)
- **Token Management**: Track and manage AI token usage

## Quick Start

### Installation

```typescript
import { createChatModule, registerChatRoutes } from '@/modules/chat'
import { FastifyInstance } from 'fastify'

// Create chat module
const chatModule = createChatModule()

// Register routes
registerChatRoutes(fastify, chatModule.chatApplicationService)
```

### Basic Usage

```typescript
// Create a new chat session
const sessionResult = await chatModule.chatApplicationService.createSession({
  userId: 'user-123',
  title: 'My Chat Session',
  aiProvider: 'openai',
  aiModel: 'gpt-3.5-turbo',
  context: 'You are a helpful assistant.'
})

// Send a message
const messageResult = await chatModule.chatApplicationService.sendMessage({
  sessionId: sessionResult.unwrap().session.id,
  content: 'Hello, how are you?',
  userId: 'user-123'
})

// Get session with messages
const sessionWithMessages = await chatModule.chatApplicationService.getSession({
  sessionId: sessionResult.unwrap().session.id,
  userId: 'user-123',
  includeMessages: true
})
```

## API Endpoints

### Sessions
- `GET /chat/sessions` - List user's chat sessions
- `POST /chat/sessions` - Create new chat session
- `GET /chat/sessions/:id` - Get specific chat session
- `PATCH /chat/sessions/:id` - Update chat session
- `DELETE /chat/sessions/:id` - Delete chat session
- `GET /chat/sessions/:id/stats` - Get session statistics

### Messages
- `POST /chat/sessions/:id/messages` - Send message and get AI response

### Health
- `GET /chat/health` - Health check

## Environment Variables

Required for AI service functionality:

```env
# OpenAI (optional, but required for OpenAI models)
OPENAI_API_KEY=your_openai_api_key

# Claude (optional, but required for Claude models)
CLAUDE_API_KEY=your_claude_api_key
```

## Domain Entities

### ChatSession
```typescript
interface ChatSessionProps {
  userId: string
  title: string
  context?: string
  aiProvider: 'openai' | 'claude'
  aiModel: string
  metadata?: Record<string, any>
  isActive: boolean
}
```

### Message
```typescript
interface MessageProps {
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: Record<string, any>
  tokens?: number
  model?: string
}
```

## Use Cases

### Core Operations

1. **CreateSession**: Create a new chat session with specified AI provider and model
2. **SendMessage**: Send a message and generate AI response
3. **GetSession**: Retrieve session with optional message history
4. **DeleteSession**: Remove session and all associated messages
5. **ListSessions**: Get paginated list of user's sessions

### Advanced Features

- **Context Window Management**: Automatically trims conversation history to stay within token limits
- **Multi-Provider Support**: Seamlessly switch between OpenAI and Claude
- **Token Tracking**: Monitor AI usage costs
- **Session Statistics**: Get insights into chat usage patterns

## Error Handling

The module uses a Result type for error handling:

```typescript
const result = await chatApplicationService.createSession(data)

if (result.isErr()) {
  const error = result.unwrapErr()
  console.error('Failed to create session:', error.message)
} else {
  const session = result.unwrap()
  console.log('Session created:', session.id)
}
```

## Testing

```typescript
import { ChatSessionRepositoryImpl } from '@/modules/chat/infrastructure/repositories'

// Create mock repositories for testing
const mockChatRepository = new ChatSessionRepositoryImpl()
const mockMessageRepository = new MessageRepositoryImpl()

// Create module with test dependencies
const testModule = createChatModule()
```

## Development Notes

### Adding New AI Providers

1. Create new service in `infrastructure/services/`
2. Implement the `AIService` interface
3. Register in `AIServiceRegistry`
4. Update domain types as needed

### Extending Domain Logic

1. Modify entities in `domain/entities/`
2. Update repository interfaces if needed
3. Implement changes in infrastructure layer
4. Update use cases and presentation layer

### Database Integration

Replace `MemoryRepository` implementations with database-specific adapters:

```typescript
export class PostgresChatSessionRepository implements ChatSessionRepository {
  // PostgreSQL implementation
}

export class MongoMessageRepository implements MessageRepository {
  // MongoDB implementation
}
```

## Performance Considerations

- **Context Window Management**: Automatically manages conversation history to prevent token limit exceeded errors
- **Caching**: Session data can be cached for frequently accessed conversations
- **Streaming**: Future implementation will support streaming responses for better UX
- **Batching**: Multiple messages can be processed in batches for efficiency

## Security

- **User Isolation**: Users can only access their own sessions
- **API Key Management**: AI provider keys are managed securely through environment variables
- **Input Validation**: All inputs are validated using Zod schemas
- **Rate Limiting**: Can be implemented at the route level for API protection

## Contributing

When adding new features:

1. Follow the hexagonal architecture pattern
2. Add domain entities first, then implement use cases
3. Update both interfaces and implementations
4. Add comprehensive error handling
5. Include validation schemas for all inputs
6. Update documentation and examples