/**
 * Auth Application Service
 * Main orchestrator for all authentication operations
 */

import { Result } from '@/libs/utils'
import { UserRepository } from '../../domain/repositories/user-repository'
import { AuthenticationService } from '../../domain/services/auth-service'
import { EmailService } from '@/libs/email'
import { CacheService } from '@/libs/cache'

// Import all use cases
import { LoginUseCase, LoginRequest, LoginResponse } from '../use-cases/login.use-case'
import { RegisterUseCase, RegisterRequest, RegisterResponse } from '../use-cases/register.use-case'
import { LogoutUseCase, LogoutRequest, LogoutResponse } from '../use-cases/logout.use-case'
import { VerifyEmailUseCase, VerifyEmailRequest, VerifyEmailResponse } from '../use-cases/verify-email.use-case'
import { ForgotPasswordUseCase, ForgotPasswordRequest, ForgotPasswordResponse } from '../use-cases/forgot-password.use-case'
import { ResetPasswordUseCase, ResetPasswordRequest, ResetPasswordResponse } from '../use-cases/reset-password.use-case'

export class AuthApplicationService {
  private loginUseCase: LoginUseCase
  private registerUseCase: RegisterUseCase
  private logoutUseCase: LogoutUseCase
  private verifyEmailUseCase: VerifyEmailUseCase
  private forgotPasswordUseCase: ForgotPasswordUseCase
  private resetPasswordUseCase: ResetPasswordUseCase

  constructor(
    private userRepository: UserRepository,
    private authService: AuthenticationService,
    private emailService: EmailService,
    private cacheService: CacheService
  ) {
    // Initialize all use cases with their dependencies
    this.loginUseCase = new LoginUseCase(userRepository, authService, cacheService)
    this.registerUseCase = new RegisterUseCase(userRepository, authService, emailService)
    this.logoutUseCase = new LogoutUseCase(cacheService)
    this.verifyEmailUseCase = new VerifyEmailUseCase(userRepository, emailService)
    this.forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService, cacheService)
    this.resetPasswordUseCase = new ResetPasswordUseCase(userRepository, authService, cacheService, emailService)
  }

  /**
   * Authenticate user with email and password
   */
  async login(request: LoginRequest): Promise<Result<LoginResponse, Error>> {
    return this.loginUseCase.execute(request)
  }

  /**
   * Register a new user with email verification
   */
  async register(request: RegisterRequest): Promise<Result<RegisterResponse, Error>> {
    return this.registerUseCase.execute(request)
  }

  /**
   * Logout user and invalidate sessions
   */
  async logout(request: LogoutRequest): Promise<Result<LogoutResponse, Error>> {
    return this.logoutUseCase.execute(request)
  }

  /**
   * Verify user email with token
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<Result<VerifyEmailResponse, Error>> {
    return this.verifyEmailUseCase.execute(request)
  }

  /**
   * Request password reset
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<Result<ForgotPasswordResponse, Error>> {
    return this.forgotPasswordUseCase.execute(request)
  }

  /**
   * Reset password with token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<Result<ResetPasswordResponse, Error>> {
    return this.resetPasswordUseCase.execute(request)
  }

  /**
   * Verify access token and get user session
   */
  async verifyToken(token: string): Promise<Result<{ userId: string }, Error>> {
    return this.authService.verifyToken(token)
  }

  /**
   * Refresh access token with refresh token
   */
  async refreshToken(refreshToken: string): Promise<Result<{ accessToken: string }, Error>> {
    // In a real implementation, you would:
    // 1. Verify the refresh token
    // 2. Get user from token payload
    // 3. Generate new access token
    // 4. Return new access token

    // For now, this is a placeholder implementation
    return Result.err(new Error('Refresh token functionality not implemented yet'))
  }

  /**
   * Check if user session exists and is valid
   */
  async getUserSession(userId: string): Promise<any> {
    const session = await this.cacheService.getUserSession(userId)
    return session.isSome() ? session.unwrap() : null
  }

  /**
   * Get user by ID (for authenticated requests)
   */
  async getUserById(userId: string) {
    return this.userRepository.findById(userId)
  }
}