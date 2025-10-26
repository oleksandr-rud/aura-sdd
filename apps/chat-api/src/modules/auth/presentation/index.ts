/**
 * Auth Presentation Layer Exports
 * Centralized exports for all auth presentation components
 */

// Controllers
export { AuthController } from "./controllers/auth.controller"

// Middleware
export { AuthMiddleware, createRateLimiter, RateLimiters } from "./middleware/auth.middleware"

// Routes
export { authRoutes, registerAuthRoutes } from "./routes/auth.routes"

// DTOs
export {
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
  type ApiResponse,
} from "./dto/auth.dto"
