/**
 * Auth Module Infrastructure Setup
 * Infrastructure layer - dependency injection and configuration setup
 */

import { AuthenticationService } from "../domain/services/auth-service"
import { CacheProviderService } from "./external/cache-provider.service"
import { EmailProviderService } from "./external/email-provider.service"
import { UserRepositoryImpl } from "./repositories/user-repository.impl"
import { JWTTokenService } from "./services/jwt-token.service"
import { PasswordHasherService } from "./services/password-hasher.service"

/**
 * Container for auth infrastructure dependencies
 * This can be integrated with your DI container of choice
 */
export class AuthInfrastructureContainer {
  private static instance: AuthInfrastructureContainer | null = null

  // Repository instances
  public readonly userRepository: UserRepositoryImpl

  // Service instances
  public readonly passwordHasher: PasswordHasherService
  public readonly tokenService: JWTTokenService
  public readonly authenticationService: AuthenticationService

  // External service adapters
  public readonly emailProvider: EmailProviderService
  public readonly cacheProvider: CacheProviderService

  private constructor() {
    // Initialize repository
    this.userRepository = new UserRepositoryImpl()

    // Initialize services
    this.passwordHasher = new PasswordHasherService()
    this.tokenService = new JWTTokenService()
    this.authenticationService = new AuthenticationService(this.passwordHasher, this.tokenService)

    // Initialize external service adapters
    this.emailProvider = new EmailProviderService()
    this.cacheProvider = new CacheProviderService()
  }

  public static getInstance(): AuthInfrastructureContainer {
    if (!AuthInfrastructureContainer.instance) {
      AuthInfrastructureContainer.instance = new AuthInfrastructureContainer()
    }
    return AuthInfrastructureContainer.instance
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  public static resetInstance(): void {
    AuthInfrastructureContainer.instance = null
  }

  /**
   * Get all domain services for easy injection
   */
  public getDomainServices() {
    return {
      userRepository: this.userRepository,
      passwordHasher: this.passwordHasher,
      tokenService: this.tokenService,
      authenticationService: this.authenticationService,
    }
  }

  /**
   * Get all external service adapters
   */
  public getExternalServices() {
    return {
      emailProvider: this.emailProvider,
      cacheProvider: this.cacheProvider,
    }
  }
}

/**
 * Factory function for creating auth infrastructure
 * Alternative to singleton pattern if preferred
 */
export function createAuthInfrastructure() {
  const userRepository = new UserRepositoryImpl()
  const passwordHasher = new PasswordHasherService()
  const tokenService = new JWTTokenService()
  const authenticationService = new AuthenticationService(passwordHasher, tokenService)
  const emailProvider = new EmailProviderService()
  const cacheProvider = new CacheProviderService()

  return {
    userRepository,
    passwordHasher,
    tokenService,
    authenticationService,
    emailProvider,
    cacheProvider,
  }
}

/**
 * Environment validation helper
 */
export function validateAuthEnvironment(): { isValid: boolean; missing: string[] } {
  const required = ["JWT_SECRET", "JWT_REFRESH_SECRET"]

  const _optional = [
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
    "FRONTEND_URL",
    "RESEND_API_KEY",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
    "REDIS_URL",
  ]

  const missing = required.filter(key => !process.env[key])

  return {
    isValid: missing.length === 0,
    missing,
  }
}

// Alias for backward compatibility
export const setupAuthInfrastructure = createAuthInfrastructure
