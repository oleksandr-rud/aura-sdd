# Auth Presentation Layer

The presentation layer handles HTTP requests, responses, and API contracts for the authentication module. It follows hexagonal architecture principles, keeping the HTTP layer thin and focused on orchestration.

## Architecture

```
presentation/
├── controllers/          # HTTP request/response handlers
│   └── auth.controller.ts
├── middleware/           # Authentication and rate limiting middleware
│   └── auth.middleware.ts
├── routes/              # Fastify route definitions
│   └── auth.routes.ts
├── dto/                 # Data Transfer Objects (API contracts)
│   └── auth.dto.ts
├── examples/            # Usage examples
│   └── server-setup.example.ts
└── index.ts            # Public exports
```

## Key Components

### Controllers
- **AuthController**: Handles all HTTP requests and orchestrates application layer services
- Thin controllers focused only on HTTP concerns (status codes, response format)
- Business logic remains in the application layer

### Middleware
- **AuthMiddleware**: JWT token verification and user injection
- **RateLimiters**: Rate limiting for sensitive endpoints
- Supports both required and optional authentication

### Routes
- **authRoutes**: Fastify route definitions with Zod validation
- Automatic OpenAPI documentation generation
- Type-safe request/response handling

### DTOs
- **AuthDTOs**: Complete API contracts with Zod schemas
- Standardized response format (success/error)
- Type-safe request/response validation

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation
- `POST /auth/refresh` - Refresh access token

### User Profile
- `GET /auth/me` - Get current user profile (protected)
- `PUT /auth/profile` - Update user profile (protected)

### System
- `GET /auth/health` - Health check endpoint

## Usage

### Basic Setup

```typescript
import Fastify from 'fastify'
import { registerAuthRoutes, AuthApplicationService } from './modules/auth'

const app = Fastify()
const authService = new AuthApplicationService(/* dependencies */)

// Register auth routes with prefix /auth
registerAuthRoutes(app, authService)
```

### Custom Middleware Usage

```typescript
import { AuthMiddleware } from './modules/auth/presentation'

const authMiddleware = new AuthMiddleware(authService)

// Protect routes
app.addHook('preHandler', authMiddleware.authenticate)
```

### Response Format

All endpoints follow a consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `INVALID_CREDENTIALS` - Invalid email/password
- `UNAUTHORIZED` - Authentication required
- `TOKEN_EXPIRED` - JWT token has expired
- `TOKEN_INVALID` - Invalid JWT token
- `USER_NOT_FOUND` - User does not exist
- `USER_ALREADY_EXISTS` - User already registered
- `USER_NOT_VERIFIED` - Email not verified
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limiting

Sensitive endpoints have built-in rate limiting:

- **Login**: 5 attempts per 15 minutes
- **Register**: 3 attempts per hour
- **Forgot Password**: 3 attempts per hour
- **Reset Password**: 3 attempts per hour
- **Verify Email**: 10 attempts per hour

## Security Features

- JWT token verification with automatic expiration handling
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- CORS support
- Input validation with Zod schemas
- Secure error handling (no information leakage)

## Testing

The presentation layer includes comprehensive tests:

```bash
# Run auth route tests
npm test -- auth.routes.test.ts
```

Tests cover:
- Happy path scenarios
- Error handling
- Validation
- Authentication middleware
- Rate limiting

## Integration

The presentation layer integrates seamlessly with:

- **Application Layer**: AuthApplicationService for business logic
- **Infrastructure Layer**: JWT, caching, and email services
- **Validation Library**: Zod schemas from @/libs/validation
- **HTTP Framework**: Fastify with Zod type provider

## Best Practices

1. **Thin Controllers**: Keep HTTP logic minimal, delegate to application layer
2. **Consistent Responses**: Use standardized response format
3. **Proper Error Handling**: Map domain errors to appropriate HTTP status codes
4. **Input Validation**: Always validate input with Zod schemas
5. **Security First**: Implement rate limiting and authentication
6. **Type Safety**: Use TypeScript throughout for better reliability