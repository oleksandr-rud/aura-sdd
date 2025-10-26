/**
 * Authentication Middleware
 * KISS principle: simple JWT authentication middleware
 */

import type { FastifyReply, FastifyRequest } from "fastify"
import { jwtVerify } from "jose"

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    name: string
  }
}

export const authenticate = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or invalid authorization header",
        },
      })
    }

    const token = authHeader.substring(7)
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

    const { payload } = await jwtVerify(token, jwtSecret)

    // Attach user info to request
    request.user = {
      id: (payload as any).userId,
      email: (payload as any).email,
      name: (payload as any).name,
    }
  } catch (_error) {
    return reply.status(401).send({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      },
    })
  }
}

export const requireEmailVerification = async (
  request: AuthenticatedRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.status(401).send({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    })
  }

  // In a real implementation, you would check if the user's email is verified
  // For demo purposes, we'll skip this check
}
