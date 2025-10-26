/**
 * JWT Token Service Implementation
 * Infrastructure layer - JWT implementation of TokenService interface
 */

import jwt from "jsonwebtoken"
import type { User } from "../../../domain/entities/user"
import type { TokenService } from "../../../domain/services/auth-service"

interface JWTPayload {
  userId: string
  email: string
  type: "access" | "refresh"
}

export class JWTTokenService implements TokenService {
  private readonly accessSecret: string
  private readonly refreshSecret: string
  private readonly accessTokenExpiry: string
  private readonly refreshTokenExpiry: string

  constructor() {
    // Environment variables with defaults
    this.accessSecret = process.env.JWT_SECRET || "default-access-secret-change-in-production"
    this.refreshSecret =
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-in-production"
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || "15m"
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || "7d"

    // Validate secrets in development
    if (process.env.NODE_ENV !== "production") {
      if (this.accessSecret.includes("default")) {
        console.warn(
          "⚠️  Using default JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET environment variables in production."
        )
      }
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.generateToken(user, "access", this.accessSecret, this.accessTokenExpiry)
  }

  async generateRefreshToken(user: User): Promise<string> {
    return this.generateToken(user, "refresh", this.refreshSecret, this.refreshTokenExpiry)
  }

  async verifyAccessToken(token: string): Promise<{ userId: string } | null> {
    return this.verifyToken(token, "access", this.accessSecret)
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
    return this.verifyToken(token, "refresh", this.refreshSecret)
  }

  private async generateToken(
    user: User,
    type: "access" | "refresh",
    secret: string,
    expiresIn: string
  ): Promise<string> {
    try {
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        type,
      }

      return jwt.sign(payload, secret, {
        expiresIn,
        issuer: "auth-service",
        audience: "api-users",
      })
    } catch (error) {
      throw new Error(
        `Failed to generate ${type} token: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  private async verifyToken(
    token: string,
    expectedType: "access" | "refresh",
    secret: string
  ): Promise<{ userId: string } | null> {
    try {
      const decoded = jwt.verify(token, secret, {
        issuer: "auth-service",
        audience: "api-users",
      }) as JWTPayload

      // Verify token type matches
      if (decoded.type !== expectedType) {
        return null
      }

      return {
        userId: decoded.userId,
      }
    } catch (_error) {
      // Token is invalid or expired
      return null
    }
  }

  // Utility method to decode token without verification (for debugging)
  async decodeToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.decode(token) as JWTPayload
      return decoded
    } catch (_error) {
      return null
    }
  }
}

// Alias for backward compatibility
export { JWTTokenService as JwtTokenService }
