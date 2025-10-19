/**
 * Authentication Middleware
 * JWT token verification and user injection
 */

import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthApplicationService } from '../../application/services/auth-application-service'
import { ResponseBuilders, ErrorCodes } from '../dto/auth.dto'

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      name: string
      isVerified: boolean
    }
  }
}

export class AuthMiddleware {
  constructor(private authApplicationService: AuthApplicationService) {}

  /**
   * Authentication middleware for protected routes
   * Verifies JWT token and injects user into request context
   */
  authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send(
          ResponseBuilders.error(
            ErrorCodes.UNAUTHORIZED,
            'Missing or invalid authorization header'
          )
        )
        return
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix

      // Verify token and get user ID
      const tokenResult = await this.authApplicationService.verifyToken(token)

      if (tokenResult.isErr()) {
        const error = tokenResult.unwrapErr()

        // Handle specific token errors
        if (error.message.includes('expired')) {
          reply.status(401).send(
            ResponseBuilders.error(
              ErrorCodes.TOKEN_EXPIRED,
              'Token has expired'
            )
          )
          return
        }

        reply.status(401).send(
          ResponseBuilders.error(
            ErrorCodes.TOKEN_INVALID,
            'Invalid token'
          )
        )
        return
      }

      const { userId } = tokenResult.unwrap()

      // Get user details
      const user = await this.authApplicationService.getUserById(userId)

      if (!user) {
        reply.status(401).send(
          ResponseBuilders.error(
            ErrorCodes.USER_NOT_FOUND,
            'User not found'
          )
        )
        return
      }

      // Inject user into request context
      request.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }

    } catch (error) {
      console.error('Authentication error:', error)
      reply.status(500).send(
        ResponseBuilders.error(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Authentication service error'
        )
      )
    }
  }

  /**
   * Optional authentication middleware
   * Attaches user to request if token is valid, but doesn't block if not
   */
  optionalAuth = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No token provided, continue without user
        return
      }

      const token = authHeader.substring(7)
      const tokenResult = await this.authApplicationService.verifyToken(token)

      if (tokenResult.isOk()) {
        const { userId } = tokenResult.unwrap()
        const user = await this.authApplicationService.getUserById(userId)

        if (user) {
          request.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified
          }
        }
      }

      // If token is invalid, continue without user (optional auth)

    } catch (error) {
      console.error('Optional authentication error:', error)
      // Continue without user for optional auth
    }
  }

  /**
   * Require email verification middleware
   * Ensures user has verified their email address
   */
  requireVerifiedEmail = (request: FastifyRequest, reply: FastifyReply): void => {
    if (!request.user) {
      reply.status(401).send(
        ResponseBuilders.error(
          ErrorCodes.UNAUTHORIZED,
          'Authentication required'
        )
      )
      return
    }

    if (!request.user.isVerified) {
      reply.status(403).send(
        ResponseBuilders.error(
          ErrorCodes.USER_NOT_VERIFIED,
          'Email verification required'
        )
      )
    }
  }
}

/**
 * Rate limiting middleware for sensitive auth endpoints
 * Simple in-memory rate limiting
 */
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const clientIp = request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown'
    const now = Date.now()

    // Clean up expired entries
    for (const [ip, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(ip)
      }
    }

    // Get or create client data
    let clientData = requests.get(clientIp)

    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 1,
        resetTime: now + windowMs
      }
      requests.set(clientIp, clientData)
    } else {
      clientData.count++
    }

    // Check if rate limit exceeded
    if (clientData.count > maxRequests) {
      reply.status(429).send(
        ResponseBuilders.error(
          ErrorCodes.RATE_LIMIT_EXCEEDED,
          `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds.`,
          {
            resetTime: clientData.resetTime,
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
          }
        )
      )
      return
    }

    // Set rate limit headers
    reply.header('X-RateLimit-Limit', maxRequests)
    reply.header('X-RateLimit-Remaining', Math.max(0, maxRequests - clientData.count))
    reply.header('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString())
  }
}

// Pre-configured rate limiters for different auth endpoints
export const RateLimiters = {
  login: createRateLimiter(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  register: createRateLimiter(3, 60 * 60 * 1000), // 3 attempts per hour
  forgotPassword: createRateLimiter(3, 60 * 60 * 1000), // 3 attempts per hour
  resetPassword: createRateLimiter(3, 60 * 60 * 1000), // 3 attempts per hour
  verifyEmail: createRateLimiter(10, 60 * 60 * 1000), // 10 attempts per hour
  default: createRateLimiter(100, 60 * 1000) // 100 requests per minute
}