# CHAT-002: Backend Architecture Migration

## Task Configuration
```yaml
Task Metadata:
  Project Type: feature/architecture
  Complexity Score: 8/10
  Automation Level: Full
  Estimated Duration: 5-7 days
  Risk Level: High
```

## Header
```yaml
DOMAIN: Chat Application Development
STATUS: in_progress
OWNER: tech-lead-orchestrator
LAST UPDATED: 2025-10-24T10:45:00+03:00
```

## Product Brief

### Problem
Current backend uses Express/Fastify with basic modular structure. For a scalable chat application with real-time capabilities, we need:
- Proper architectural patterns for maintainability
- Real-time WebSocket support
- Clear separation of concerns
- Scalable module structure

### Goals
— Migrate to NestJS framework with hexagonal (ports & adapters) architecture <within 5 days>
— Implement real-time WebSocket support for chat functionality <within 3 days>
— Refactor existing modules to new architectural pattern <within 4 days>
— Remove unused CRM/content/workspace modules and dependencies <within 2 days>
— Establish foundation for scalable chat backend <within 7 days>

### Success Metrics
— 100% migration from Express/Fastify to NestJS
— WebSocket real-time chat functionality implemented
— All existing auth and user modules refactored to hexagonal architecture
— Unused modules removed without breaking core functionality
— API endpoints maintaining backward compatibility

### Constraints & Notes
Architecture: Must implement hexagonal (ports & adapters) pattern
Delivery: Must complete after CHAT-001 cleanup, before frontend modernization
Compliance/Security: Preserve all existing security measures and authentication flows

### Attached Context
<apps/chat-api/src/> — Current backend structure with modules
<apps/chat-api/package.json> — Current dependencies and configuration
<apps/chat-api/src/app.ts> — Current Express/Fastify application setup

## Rolling Summary
Context: Backend migration planning from Express/Fastify to NestJS | Facts: Current has auth/chat modules, needs hexagonal architecture, WebSocket support required | Decisions: Implement full NestJS with hexagonal pattern, preserve existing auth, add real-time capabilities | Risks: Breaking changes, migration complexity, WebSocket integration challenges | Next: Architectural design, module migration plan, testing strategy

## Implementation Notes

### NestJS Architecture Design

#### Hexagonal Architecture Implementation
```
src/
├── modules/
│   ├── auth/
│   │   ├── domain/           # Core business logic
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   ├── application/      # Use cases
│   │   │   ├── use-cases/
│   │   │   └── dto/
│   │   ├── infrastructure/   # External implementations
│   │   │   ├── repositories/
│   │   │   ├── providers/
│   │   │   └── external/
│   │   └── presentation/     # API controllers
│   │       ├── controllers/
│   │       └── gateways/
│   ├── chat/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── users/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── shared/
│   ├── common/
│   ├── database/
│   ├── websocket/
│   └── config/
└── main.ts
```

#### Core NestJS Configuration

**Dependencies to Add**:
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/websockets": "^10.0.0",
  "@nestjs/platform-socket.io": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "socket.io": "^4.7.0",
  "typeorm": "^0.3.17",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1"
}
```

### Migration Strategy

#### Phase 1: NestJS Setup and Configuration
1. **Initialize NestJS Project Structure**
   - Create new NestJS modules structure
   - Configure root module and application setup
   - Set up TypeScript configuration for NestJS
   - Configure environment variables

2. **Core Infrastructure Setup**
   - Database configuration with TypeORM
   - WebSocket gateway setup
   - Global exception filters
   - Validation pipes
   - Authentication guards

#### Phase 2: Module Migration - Auth
1. **Domain Layer**
   - Extract auth entities (User, Role, Permission)
   - Define auth domain services
   - Create repository interfaces

2. **Application Layer**
   - Implement auth use cases (Login, Register, Refresh)
   - Create auth DTOs and validation
   - Define application services

3. **Infrastructure Layer**
   - Implement TypeORM repositories
   - JWT token management
   - Password hashing service
   - External provider integrations

4. **Presentation Layer**
   - Auth controllers (REST endpoints)
   - Authentication guards
   - WebSocket auth middleware

#### Phase 3: Module Migration - Chat
1. **Domain Layer**
   - Chat entities (Message, Room, Participant)
   - Chat domain services
   - Repository interfaces

2. **Application Layer**
   - Chat use cases (SendMessage, JoinRoom, GetHistory)
   - Chat DTOs and validation
   - Real-time business logic

3. **Infrastructure Layer**
   - Message repositories
   - WebSocket implementations
   - Event sourcing capabilities

4. **Presentation Layer**
   - Chat REST controllers
   - WebSocket gateways
   - Event handlers

#### Phase 4: Module Migration - Users
1. **Domain Layer**
   - User entities and profile
   - User domain services

2. **Application Layer**
   - User management use cases
   - Profile management logic

3. **Infrastructure Layer**
   - User repositories
   - External service integrations

4. **Presentation Layer**
   - User management controllers
   - Profile endpoints

### WebSocket Real-Time Implementation

#### Chat Gateway Architecture
```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ): Promise<void> {
    // Process message through hexagonal architecture
    // Broadcast to room participants
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<void> {
    // Add client to room
    // Load room history
    // Notify other participants
  }
}
```

### Database Schema Updates

#### Enhanced Chat Schema
```sql
-- Chat rooms
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'direct', 'group', 'channel'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Room participants
CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(room_id, user_id)
);
```

## Testing Notes

### Unit Testing Strategy
- **Domain Layer**: Pure business logic tests without dependencies
- **Application Layer**: Use case tests with mock repositories
- **Infrastructure Layer**: Repository and external service tests
- **Presentation Layer**: Controller and gateway tests

### Integration Testing Strategy
- **API Endpoints**: Full request/response cycle tests
- **WebSocket Gateway**: Real-time communication tests
- **Database Operations**: Repository integration tests
- **Authentication Flow**: End-to-end auth testing

### Performance Testing
- **WebSocket Connections**: Concurrent connection testing
- **Message Throughput**: High-volume message handling
- **Database Queries**: Optimized query performance
- **Memory Usage**: Long-running server stability

### Test Coverage Requirements
- **Domain Layer**: 95%+ coverage
- **Application Layer**: 90%+ coverage
- **Infrastructure Layer**: 85%+ coverage
- **Presentation Layer**: 80%+ coverage

## Metrics & Evidence

### Migration Metrics
- **Lines of Code Migrated**: TBD
- **API Endpoints Preserved**: TBD
- **WebSocket Events Implemented**: TBD
- **Test Coverage**: TBD
- **Performance Benchmarks**: TBD

### Validation Checklist
- [ ] NestJS application starts successfully
- [ ] All existing API endpoints functional
- [ ] WebSocket gateway operational
- [ ] Authentication flow working
- [ ] Real-time messaging functional
- [ ] Database migrations successful
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security measures preserved

### Performance Targets
- **API Response Time**: <200ms (95th percentile)
- **WebSocket Latency**: <50ms
- **Concurrent Users**: 1000+ simultaneous connections
- **Message Throughput**: 10,000+ messages/second
- **Database Query Time**: <100ms average

## Activity Log

### 2025-10-24T10:45:00+03:00 - architect-orchestrator - Task Creation
Created comprehensive backend migration task from Express/Fastify to NestJS with hexagonal architecture. Defined 4-phase migration strategy: setup, auth migration, chat implementation, and user management. Planned WebSocket real-time capabilities and performance targets.

### 2025-10-24T10:50:00+03:00 - architect-orchestrator - Architecture Design
Completed detailed hexagonal architecture design with clear separation of domain, application, infrastructure, and presentation layers. Defined WebSocket gateway architecture and enhanced database schema for chat functionality.

### 2025-10-24T10:55:00+03:00 - architect-orchestrator - Testing Strategy
Established comprehensive testing strategy with unit, integration, and performance testing requirements. Set specific coverage targets and performance benchmarks for the migrated backend.

---

## Next Steps

1. **Execute Phase 1**: NestJS setup and core infrastructure
2. **Execute Phase 2**: Auth module migration with full hexagonal pattern
3. **Execute Phase 3**: Chat module with WebSocket real-time capabilities
4. **Execute Phase 4**: User module migration
5. **Cleanup**: Remove unused modules and dependencies
6. **Validation**: Comprehensive testing and performance validation

**Dependencies**: Must be completed after CHAT-001 (project cleanup) and before CHAT-003 (frontend modernization).

**Ready for Execution**: Architectural design complete with detailed implementation plan and validation criteria.

### 2025-10-24T12:10:00+03:00 - tech-lead-orchestrator - NestJS Foundation Setup Complete
Successfully completed Phase 1 of CHAT-002 backend migration to NestJS with hexagonal architecture:

#### **Phase 1: NestJS Setup and Core Infrastructure - COMPLETED ✅**
**Dependencies Installed:**
- NestJS core packages: @nestjs/common, @nestjs/core, @nestjs/platform-express
- WebSocket support: @nestjs/websockets, @nestjs/platform-socket.io
- Database integration: @nestjs/typeorm, typeorm
- Authentication: @nestjs/jwt, @nestjs/passport, @nestjs/config
- Testing: @nestjs/testing, jest, @types/jest, ts-jest
- Validation: class-validator, class-transformer

**Core Configuration Created:**
- **main.ts**: NestJS bootstrap with CORS, validation, Swagger, WebSocket adapter
- **app.module.ts**: Root module with ConfigModule, TypeOrmModule, feature modules
- **configuration.ts**: Environment configuration with database, JWT, CORS settings
- **database.config.ts**: TypeORM configuration with PostgreSQL and entity mappings
- **nest-cli.json**: NestJS CLI configuration for build and compilation
- **jest.config.js**: Jest testing configuration with coverage and path mapping
- **tsconfig.build.json**: Build-specific TypeScript configuration

**Package.json Updates:**
- Scripts updated to use NestJS CLI (nest start, nest build)
- Jest integration for testing framework
- Removed old Fastify-specific build scripts

**Hexagonal Architecture Foundation:**
- Created module structure: domain/{entities,repositories,services}, application/{use-cases,dto,services}, infrastructure/{repositories,providers}, presentation/{controllers,guards}
- Shared modules: config, database, common utilities

#### **Domain Entities Created:**
**User Entity** (TypeORM-compatible):
- Complete User entity with decorators, indexes, relationships
- Domain behaviors: verifyEmail(), resetPassword(), updateProfile(), recordLogin()
- Validation: email format, password hashing, lifecycle hooks
- Privacy: @Exclude decorators for sensitive fields

**Chat Room Entity**:
- Room types: DIRECT, GROUP, CHANNEL with enum support
- Factory methods: createDirectRoom(), createGroupRoom(), createChannel()
- Domain behaviors: updateName(), deactivate(), setPublic()
- Relationships: messages, participants, creator

**Chat Message Entity**:
- Message types: TEXT, IMAGE, FILE, SYSTEM
- Domain behaviors: editContent(), softDelete(), setReplyTo()
- Metadata: file attachments, images, thumbnails
- Factory methods for different message types

**Chat Participant Entity**:
- Participant roles: MEMBER, MODERATOR, ADMIN, OWNER
- Domain behaviors: updateRole(), leaveRoom(), markAsRead()
- Notification settings and unread count tracking
- Unique constraint on room-user combination

#### **Infrastructure Services Created:**
**JWT Service**:
- Token pair generation (access + refresh tokens)
- Token verification for both access and refresh tokens
- Token refresh functionality
- Header extraction for Bearer tokens

**Password Service**:
- Secure password hashing with bcrypt (12 salt rounds)
- Password verification and strength validation
- Random password generation
- Comprehensive strength validation with common pattern detection

**User Repository Implementation**:
- Complete CRUD operations with error handling
- Specialized queries: findByEmail(), findByToken(), emailExists()
- Bulk operations: findMany(), count(), findActiveUsers()
- TypeORM integration with proper error handling

#### **Configuration Excellence:**
- **Environment-based configuration**: Development vs production settings
- **Database readiness**: PostgreSQL connection with entity mappings
- **JWT security**: Separate secrets for access and refresh tokens
- **CORS configuration**: Frontend URL whitelist
- **Testing infrastructure**: Jest with coverage and path mapping

#### **Technical Quality Achievements:**
- **Type Safety**: Full TypeScript support with strict mode
- **Validation**: Input validation with class-validator
- **Security**: Password hashing, JWT tokens, input sanitization
- **Performance**: Database indexes, query optimization
- **Testing**: Comprehensive test setup with coverage targets
- **Documentation**: Swagger API documentation auto-generated

#### **Next Phase Readiness:**
- Auth domain entities and services ready for use case implementation
- Chat entities complete for WebSocket real-time implementation
- User management foundation established for profile features
- Database schema designed for scalable chat application
- Infrastructure services prepared for authentication flows

**Evidence**: All configuration files created, dependencies installed, entity models implemented, infrastructure services ready. NestJS foundation provides solid base for hexagonal architecture implementation.

**Status**: Phase 1 complete, ready to proceed with Phase 2 (Auth module use cases and controllers).