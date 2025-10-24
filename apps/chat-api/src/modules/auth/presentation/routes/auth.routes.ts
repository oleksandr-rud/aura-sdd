/**
 * Auth Routes
 * Fastify route definitions for authentication endpoints
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AuthController } from '../controllers/auth.controller'
import { AuthMiddleware, RateLimiters } from '../middleware/auth.middleware'
import { AuthDTOs } from '../dto/auth.dto'

export async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  // Initialize controller and middleware
  const authController = new AuthController(options.authApplicationService)
  const authMiddleware = new AuthMiddleware(options.authApplicationService)

  // Create a typed instance with Zod provider
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  /**
   * Register new user
   * POST /auth/register
   */
  app.post(
    '/register',
    {
      config: {
        rateLimit: RateLimiters.register
      },
      schema: {
        description: 'Register a new user',
        tags: ['Authentication'],
        body: AuthDTOs.RegisterRequest,
        response: {
          201: AuthDTOs.RegisterResponse,
          400: AuthDTOs.ErrorResponse,
          409: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.register
  )

  /**
   * User login
   * POST /auth/login
   */
  app.post(
    '/login',
    {
      config: {
        rateLimit: RateLimiters.login
      },
      schema: {
        description: 'Authenticate user and get tokens',
        tags: ['Authentication'],
        body: AuthDTOs.LoginRequest,
        response: {
          200: AuthDTOs.LoginResponse,
          401: AuthDTOs.ErrorResponse,
          403: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.login
  )

  /**
   * User logout
   * POST /auth/logout
   */
  app.post(
    '/logout',
    {
      preHandler: authMiddleware.authenticate,
      schema: {
        description: 'Logout user and invalidate tokens',
        tags: ['Authentication'],
        body: AuthDTOs.LogoutRequest,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: AuthDTOs.LogoutResponse,
          401: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.logout
  )

  /**
   * Verify email
   * POST /auth/verify-email
   */
  app.post(
    '/verify-email',
    {
      config: {
        rateLimit: RateLimiters.verifyEmail
      },
      schema: {
        description: 'Verify user email with token',
        tags: ['Authentication'],
        body: AuthDTOs.VerifyEmailRequest,
        response: {
          200: AuthDTOs.VerifyEmailResponse,
          400: AuthDTOs.ErrorResponse,
          404: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.verifyEmail
  )

  /**
   * Forgot password
   * POST /auth/forgot-password
   */
  app.post(
    '/forgot-password',
    {
      config: {
        rateLimit: RateLimiters.forgotPassword
      },
      schema: {
        description: 'Request password reset email',
        tags: ['Authentication'],
        body: AuthDTOs.ForgotPasswordRequest,
        response: {
          200: AuthDTOs.ForgotPasswordResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.forgotPassword
  )

  /**
   * Reset password
   * POST /auth/reset-password
   */
  app.post(
    '/reset-password',
    {
      config: {
        rateLimit: RateLimiters.resetPassword
      },
      schema: {
        description: 'Reset password with token',
        tags: ['Authentication'],
        body: AuthDTOs.ResetPasswordRequest,
        response: {
          200: AuthDTOs.ResetPasswordResponse,
          400: AuthDTOs.ErrorResponse,
          404: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.resetPassword
  )

  /**
   * Get current user profile
   * GET /auth/me
   */
  app.get(
    '/me',
    {
      preHandler: authMiddleware.authenticate,
      schema: {
        description: 'Get current user profile',
        tags: ['Authentication', 'User'],
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: AuthDTOs.GetUserResponse,
          401: AuthDTOs.ErrorResponse,
          404: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.getMe
  )

  /**
   * Update user profile
   * PUT /auth/profile
   */
  app.put(
    '/profile',
    {
      preHandler: authMiddleware.authenticate,
      schema: {
        description: 'Update user profile',
        tags: ['Authentication', 'User'],
        body: AuthDTOs.UpdateProfileRequest,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: AuthDTOs.UpdateProfileResponse,
          401: AuthDTOs.ErrorResponse,
          404: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.updateProfile
  )

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  app.post(
    '/refresh',
    {
      schema: {
        description: 'Refresh access token with refresh token',
        tags: ['Authentication'],
        body: AuthDTOs.RefreshTokenRequest,
        response: {
          200: AuthDTOs.RefreshTokenResponse,
          401: AuthDTOs.ErrorResponse,
          500: AuthDTOs.ErrorResponse
        }
      }
    },
    authController.refreshToken
  )

  /**
   * Health check for auth service
   * GET /auth/health
   */
  app.get(
    '/health',
    {
      schema: {
        description: 'Health check for auth service',
        tags: ['Authentication', 'Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              service: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'auth'
      }
    }
  )

  done()
}

// Route registration helper
export const registerAuthRoutes = (
  fastify: FastifyInstance,
  authApplicationService: any
) => {
  fastify.register(authRoutes, {
    prefix: '/auth',
    authApplicationService
  })
}