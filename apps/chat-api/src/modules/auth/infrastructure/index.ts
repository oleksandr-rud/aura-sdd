/**
 * Auth Module Infrastructure Exports
 * Infrastructure layer - all infrastructure implementations for auth module
 */

// Repository Implementations
export { UserRepositoryImpl } from './repositories/user-repository.impl'

// Service Implementations
export { PasswordHasherService } from './services/password-hasher.service'
export { JWTTokenService } from './services/jwt-token.service'

// External Service Adapters
export { EmailProviderService, type EmailProviderPort } from './external/email-provider.service'
export { CacheProviderService, type AuthCachePort, type UserSessionData } from './external/cache-provider.service'

// Dependencies for container/setup
export type {
  PasswordHasher,
  TokenService
} from '../domain/services/auth-service'

export type {
  UserRepository
} from '../domain/repositories/user-repository'

// Setup and DI helpers
export { AuthInfrastructureContainer, createAuthInfrastructure, validateAuthEnvironment } from './setup'