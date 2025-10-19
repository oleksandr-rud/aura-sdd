/**
 * Auth Module Exports
 * Centralized exports for all auth components
 */

// Domain layer
export { User } from './domain/entities/user'
export { type UserRepository } from './domain/repositories/user-repository'
export { AuthenticationService } from './domain/services/auth-service'

// Application layer
export { AuthApplicationService } from './application/services/auth-application-service'
export {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  VerifyEmailUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type LogoutRequest,
  type LogoutResponse,
  type VerifyEmailRequest,
  type VerifyEmailResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse
} from './application'

// Infrastructure layer
export { UserRepositoryImpl } from './infrastructure/repositories/user-repository.impl'
export { PasswordHasherService } from './infrastructure/services/password-hasher.service'
export { JwtTokenService } from './infrastructure/services/jwt-token.service'
export { EmailProviderService } from './infrastructure/external/email-provider.service'
export { CacheProviderService } from './infrastructure/external/cache-provider.service'
export { setupAuthInfrastructure } from './infrastructure/setup'

// Presentation layer
export {
  AuthController,
  AuthMiddleware,
  RateLimiters,
  authRoutes,
  registerAuthRoutes,
  AuthDTOs,
  ResponseBuilders,
  ErrorCodes,
  type LoginRequestDTO,
  type LoginResponseDTO,
  type RegisterRequestDTO,
  type RegisterResponseDTO,
  type LogoutRequestDTO,
  type LogoutResponseDTO,
  type VerifyEmailRequestDTO,
  type VerifyEmailResponseDTO,
  type ForgotPasswordRequestDTO,
  type ForgotPasswordResponseDTO,
  type ResetPasswordRequestDTO,
  type ResetPasswordResponseDTO,
  type GetUserResponseDTO,
  type UpdateProfileRequestDTO,
  type UpdateProfileResponseDTO,
  type RefreshTokenRequestDTO,
  type RefreshTokenResponseDTO,
  type SuccessResponse,
  type ErrorResponse,
  type ApiResponse
} from './presentation'