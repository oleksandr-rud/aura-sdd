/**
 * Auth Controller
 * HTTP request/response handlers for authentication operations
 */

import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthApplicationService, type LoginRequest, type RegisterRequest, type LogoutRequest, type VerifyEmailRequest, type ForgotPasswordRequest, type ResetPasswordRequest } from '../../application'
import { ResponseBuilders, ErrorCodes, type LoginResponseDTO, type RegisterResponseDTO, type LogoutResponseDTO, type VerifyEmailResponseDTO, type ForgotPasswordResponseDTO, type ResetPasswordResponseDTO, type GetUserResponseDTO, type UpdateProfileResponseDTO, type RefreshTokenResponseDTO } from '../dto/auth.dto'
import { AuthDTOs } from '../dto/auth.dto'

export class AuthController {
  constructor(private authApplicationService: AuthApplicationService) {}

  /**
   * User registration
   * POST /auth/register
   */
  register = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const registerData = request.body as RegisterRequest

      // Call application service
      const result = await this.authApplicationService.register(registerData)

      if (result.isErr()) {
        const error = result.unwrapErr()

        // Handle specific error cases
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          return reply.status(409).send(
            ResponseBuilders.error(
              ErrorCodes.USER_ALREADY_EXISTS,
              'User with this email already exists'
            )
          )
        }

        if (error.message.includes('validation')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ErrorCodes.VALIDATION_ERROR,
              error.message
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Registration failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: RegisterResponseDTO = {
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          companyName: response.user.companyName,
          isVerified: response.user.isVerified,
          createdAt: response.user.createdAt
        },
        message: response.message
      }

      return reply.status(201).send(
        ResponseBuilders.success(responseData, 'User registered successfully')
      )

    } catch (error) {
      console.error('Register error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Registration service error'
        )
      )
    }
  }

  /**
   * User login
   * POST /auth/login
   */
  login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const loginData = request.body as LoginRequest

      const result = await this.authApplicationService.login(loginData)

      if (result.isErr()) {
        const error = result.unwrapErr()

        // Handle specific error cases
        if (error.message.includes('invalid') || error.message.includes('credentials')) {
          return reply.status(401).send(
            ResponseBuilders.error(
              ErrorCodes.INVALID_CREDENTIALS,
              'Invalid email or password'
            )
          )
        }

        if (error.message.includes('not verified')) {
          return reply.status(403).send(
            ResponseBuilders.error(
              ErrorCodes.USER_NOT_VERIFIED,
              'Please verify your email before logging in'
            )
          )
        }

        if (error.message.includes('not found')) {
          return reply.status(401).send(
            ResponseBuilders.error(
              ErrorCodes.INVALID_CREDENTIALS,
              'Invalid email or password'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Login failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: LoginResponseDTO = {
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          isVerified: response.user.isVerified,
          createdAt: response.user.createdAt
        },
        tokens: {
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
          expiresIn: response.tokens.expiresIn
        }
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Login successful')
      )

    } catch (error) {
      console.error('Login error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Login service error'
        )
      )
    }
  }

  /**
   * User logout
   * POST /auth/logout
   */
  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const logoutData = request.body as LogoutRequest

      const result = await this.authApplicationService.logout(logoutData)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found') || error.message.includes('invalid')) {
          // Don't expose specific token errors, just acknowledge logout
          return reply.send(
            ResponseBuilders.success({ message: 'Logged out successfully' })
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Logout failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: LogoutResponseDTO = {
        message: response.message
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Logged out successfully')
      )

    } catch (error) {
      console.error('Logout error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Logout service error'
        )
      )
    }
  }

  /**
   * Email verification
   * POST /auth/verify-email
   */
  verifyEmail = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const verifyData = request.body as VerifyEmailRequest

      const result = await this.authApplicationService.verifyEmail(verifyData)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('invalid') || error.message.includes('expired')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ErrorCodes.TOKEN_EXPIRED_OR_INVALID,
              'Invalid or expired verification token'
            )
          )
        }

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ErrorCodes.USER_NOT_FOUND,
              'User not found'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Email verification failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: VerifyEmailResponseDTO = {
        message: response.message,
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          isVerified: response.user.isVerified
        }
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Email verified successfully')
      )

    } catch (error) {
      console.error('Verify email error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Email verification service error'
        )
      )
    }
  }

  /**
   * Forgot password
   * POST /auth/forgot-password
   */
  forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const forgotData = request.body as ForgotPasswordRequest

      const result = await this.authApplicationService.forgotPassword(forgotData)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          // Don't reveal if user exists or not for security
          return reply.send(
            ResponseBuilders.success({ message: 'Password reset email sent if account exists' })
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Password reset request failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: ForgotPasswordResponseDTO = {
        message: response.message
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Password reset email sent')
      )

    } catch (error) {
      console.error('Forgot password error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Password reset service error'
        )
      )
    }
  }

  /**
   * Reset password
   * POST /auth/reset-password
   */
  resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const resetData = request.body as ResetPasswordRequest

      const result = await this.authApplicationService.resetPassword(resetData)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('invalid') || error.message.includes('expired')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ErrorCodes.TOKEN_EXPIRED_OR_INVALID,
              'Invalid or expired reset token'
            )
          )
        }

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ErrorCodes.USER_NOT_FOUND,
              'User not found'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Password reset failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: ResetPasswordResponseDTO = {
        message: response.message
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Password reset successfully')
      )

    } catch (error) {
      console.error('Reset password error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Password reset service error'
        )
      )
    }
  }

  /**
   * Get current user profile
   * GET /auth/me
   */
  getMe = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ErrorCodes.UNAUTHORIZED,
            'Authentication required'
          )
        )
      }

      const user = await this.authApplicationService.getUserById(request.user.id)

      if (!user) {
        return reply.status(404).send(
          ResponseBuilders.error(
            ErrorCodes.USER_NOT_FOUND,
            'User not found'
          )
        )
      }

      const responseData: GetUserResponseDTO = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          companyName: user.companyName,
          avatar: user.avatar,
          phone: user.phone,
          timezone: user.timezone,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }

      return reply.send(
        ResponseBuilders.success(responseData)
      )

    } catch (error) {
      console.error('Get me error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to get user profile'
        )
      )
    }
  }

  /**
   * Update user profile
   * PUT /auth/profile
   */
  updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ErrorCodes.UNAUTHORIZED,
            'Authentication required'
          )
        )
      }

      const updateData = request.body

      // Get current user
      const user = await this.authApplicationService.getUserById(request.user.id)
      if (!user) {
        return reply.status(404).send(
          ResponseBuilders.error(
            ErrorCodes.USER_NOT_FOUND,
            'User not found'
          )
        )
      }

      // Update user profile (this would be implemented in the application layer)
      // For now, returning a placeholder response
      const responseData: UpdateProfileResponseDTO = {
        user: {
          id: user.id,
          email: user.email,
          name: updateData.name || user.name,
          companyName: user.companyName,
          avatar: updateData.avatar || user.avatar,
          phone: updateData.phone || user.phone,
          timezone: updateData.timezone || user.timezone,
          isVerified: user.isVerified,
          updatedAt: new Date().toISOString()
        }
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Profile updated successfully')
      )

    } catch (error) {
      console.error('Update profile error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to update profile'
        )
      )
    }
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string }

      const result = await this.authApplicationService.refreshToken(refreshToken)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('expired') || error.message.includes('invalid')) {
          return reply.status(401).send(
            ResponseBuilders.error(
              ErrorCodes.TOKEN_EXPIRED_OR_INVALID,
              'Invalid or expired refresh token'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Token refresh failed'
          )
        )
      }

      const response = result.unwrap()
      const responseData: RefreshTokenResponseDTO = {
        accessToken: response.accessToken,
        expiresIn: 3600 // 1 hour
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Token refreshed successfully')
      )

    } catch (error) {
      console.error('Refresh token error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Token refresh service error'
        )
      )
    }
  }
}