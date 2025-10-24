# Auth Application Layer

This directory contains the application layer for the authentication module, implementing the use cases and services that orchestrate domain operations.

## Architecture

The application layer follows hexagonal architecture principles:

- **Use Cases**: Each use case handles a specific authentication operation
- **Application Service**: Main orchestrator that coordinates all use cases
- **Dependency Injection**: Clean separation of concerns with injected dependencies

## Files Structure

```
application/
├── use-cases/
│   ├── login.use-case.ts           # User authentication
│   ├── register.use-case.ts        # User registration
│   ├── logout.use-case.ts          # User logout
│   ├── verify-email.use-case.ts    # Email verification
│   ├── forgot-password.use-case.ts # Password reset request
│   └── reset-password.use-case.ts  # Password reset confirmation
├── services/
│   └── auth-application-service.ts # Main auth orchestrator
├── index.ts                        # Centralized exports
└── README.md                       # This file
```

## Usage Example

```typescript
import { AuthApplicationService } from './application'
import { UserRepository } from './domain/repositories/user-repository'
import { AuthenticationService } from './domain/services/auth-service'
import { EmailService } from '@/libs/email'
import { CacheService } from '@/libs/cache'

// Initialize dependencies (these would be injected in real implementation)
const userRepository = new UserRepository() // Implementation from infrastructure
const authService = new AuthenticationService(passwordHasher, tokenService)
const emailService = new EmailService()
const cacheService = new CacheService()

// Create auth application service
const authApp = new AuthApplicationService(
  userRepository,
  authService,
  emailService,
  cacheService
)

// Use the service
const loginResult = await authApp.login({
  email: 'user@example.com',
  password: 'securepassword'
})

if (loginResult.isOk()) {
  const { user, tokens } = loginResult.unwrap()
  console.log('Login successful:', user.email)
} else {
  console.error('Login failed:', loginResult.unwrapErr().message)
}
```

## Features

### Authentication Operations

1. **Login**: Authenticate users with email/password
2. **Registration**: Create new accounts with email verification
3. **Logout**: Invalidate user sessions
4. **Email Verification**: Verify user email addresses
5. **Password Reset**: Handle forgotten passwords securely

### Security Features

- **Input Validation**: All inputs validated with Zod schemas
- **Rate Limiting**: Prevent brute force attacks
- **Session Management**: Secure token handling and caching
- **Email Protection**: Prevent email enumeration attacks
- **Password Security**: Secure password hashing and reset flows

### Error Handling

- **Result Type**: Consistent error handling using Result pattern
- **Validation Errors**: Clear, structured error messages
- **Domain Errors**: Business logic validation
- **Infrastructure Errors**: Graceful handling of external failures

## Dependencies

- **Domain Layer**: User entity, repository interface, auth service
- **Shared Libraries**: Validation, utilities, HTTP client
- **External Services**: Email service, cache service
- **Infrastructure**: Repository implementations (not in this layer)

## KISS Principles

- **Single Responsibility**: Each use case handles one operation
- **Clear Interfaces**: Well-defined input/output contracts
- **Minimal Dependencies**: Only necessary dependencies injected
- **Simple Error Handling**: Consistent Result pattern throughout
- **Focused Implementation**: No unnecessary complexity