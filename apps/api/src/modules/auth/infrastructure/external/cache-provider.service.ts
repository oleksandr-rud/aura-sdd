/**
 * Cache Provider Service
 * Infrastructure layer - adapter for external cache service in auth module
 */

import { CacheService } from '@/libs/cache'
import { Result } from '@/libs/utils'

export interface AuthCachePort {
  // Session management
  cacheUserSession(userId: string, sessionData: UserSessionData, ttl?: number): Promise<Result<void, Error>>
  getUserSession(userId: string): Promise<UserSessionData | null>
  deleteUserSession(userId: string): Promise<Result<void, Error>>

  // Token management
  cacheRefreshToken(userId: string, refreshToken: string, ttl?: number): Promise<Result<void, Error>>
  getRefreshToken(userId: string): Promise<string | null>
  revokeRefreshToken(userId: string): Promise<Result<void, Error>>

  // Rate limiting for auth operations
  checkLoginRateLimit(email: string): Promise<boolean>
  checkPasswordResetRateLimit(email: string): Promise<boolean>
  checkEmailVerificationRateLimit(email: string): Promise<boolean>

  // Email verification caching
  cacheEmailVerificationToken(token: string, email: string, ttl?: number): Promise<Result<void, Error>>
  getEmailByVerificationToken(token: string): Promise<string | null>
  deleteEmailVerificationToken(token: string): Promise<Result<void, Error>>
}

export interface UserSessionData {
  userId: string
  email: string
  loginAt: Date
  lastActivity: Date
  userAgent?: string
  ipAddress?: string
}

/**
 * Adapter for the external cache service
 * Provides auth-specific caching functionality
 */
export class CacheProviderService implements AuthCachePort {
  private cacheService: CacheService

  constructor(cacheService?: CacheService) {
    this.cacheService = cacheService || new CacheService()
  }

  // Session management
  async cacheUserSession(userId: string, sessionData: UserSessionData, ttl: number = 3600): Promise<Result<void, Error>> {
    const key = `auth:session:${userId}`
    return this.cacheService.set(key, sessionData, ttl)
  }

  async getUserSession(userId: string): Promise<UserSessionData | null> {
    const key = `auth:session:${userId}`
    const result = await this.cacheService.get<UserSessionData>(key)
    return result.isSome() ? result.unwrap() : null
  }

  async deleteUserSession(userId: string): Promise<Result<void, Error>> {
    const key = `auth:session:${userId}`
    return this.cacheService.delete(key)
  }

  // Token management
  async cacheRefreshToken(userId: string, refreshToken: string, ttl: number = 604800): Promise<Result<void, Error>> {
    // 7 days default TTL for refresh tokens
    const key = `auth:refresh:${userId}`
    return this.cacheService.set(key, refreshToken, ttl)
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `auth:refresh:${userId}`
    const result = await this.cacheService.get<string>(key)
    return result.isSome() ? result.unwrap() : null
  }

  async revokeRefreshToken(userId: string): Promise<Result<void, Error>> {
    const key = `auth:refresh:${userId}`
    return this.cacheService.delete(key)
  }

  // Rate limiting for auth operations
  async checkLoginRateLimit(email: string): Promise<boolean> {
    const key = `auth:rate:login:${email}`
    return this.cacheService.checkRateLimit(key, 5, 900) // 5 attempts per 15 minutes
  }

  async checkPasswordResetRateLimit(email: string): Promise<boolean> {
    const key = `auth:rate:reset:${email}`
    return this.cacheService.checkRateLimit(key, 3, 3600) // 3 requests per hour
  }

  async checkEmailVerificationRateLimit(email: string): Promise<boolean> {
    const key = `auth:rate:verify:${email}`
    return this.cacheService.checkRateLimit(key, 5, 86400) // 5 requests per day
  }

  // Email verification caching
  async cacheEmailVerificationToken(token: string, email: string, ttl: number = 86400): Promise<Result<void, Error>> {
    // 24 hours default TTL for verification tokens
    const key = `auth:verify:${token}`
    return this.cacheService.set(key, email, ttl)
  }

  async getEmailByVerificationToken(token: string): Promise<string | null> {
    const key = `auth:verify:${token}`
    const result = await this.cacheService.get<string>(key)
    return result.isSome() ? result.unwrap() : null
  }

  async deleteEmailVerificationToken(token: string): Promise<Result<void, Error>> {
    const key = `auth:verify:${token}`
    return this.cacheService.delete(key)
  }

  // Additional helper methods for auth-specific caching

  /**
   * Cache password reset tokens
   */
  async cachePasswordResetToken(token: string, email: string, ttl: number = 3600): Promise<Result<void, Error>> {
    // 1 hour default TTL for password reset tokens
    const key = `auth:reset:${token}`
    return this.cacheService.set(key, email, ttl)
  }

  /**
   * Get email by password reset token
   */
  async getEmailByPasswordResetToken(token: string): Promise<string | null> {
    const key = `auth:reset:${token}`
    const result = await this.cacheService.get<string>(key)
    return result.isSome() ? result.unwrap() : null
  }

  /**
   * Delete password reset token
   */
  async deletePasswordResetToken(token: string): Promise<Result<void, Error>> {
    const key = `auth:reset:${token}`
    return this.cacheService.delete(key)
  }

  /**
   * Cache failed login attempts for monitoring
   */
  async recordFailedLogin(email: string, ipAddress: string): Promise<Result<void, Error>> {
    const key = `auth:failed:${email}:${ipAddress}`
    return this.cacheService.set(key, Date.now(), 86400) // Keep for 24 hours
  }

  /**
   * Get failed login attempts count
   */
  async getFailedLoginAttempts(email: string, ipAddress: string): Promise<number> {
    const key = `auth:failed:${email}:${ipAddress}`
    const result = await this.cacheService.get<number>(key)
    return result.isSome() ? result.unwrap() : 0
  }

  /**
   * Clear all user-related cache entries
   */
  async clearUserCache(userId: string): Promise<Result<void, Error>> {
    const promises = [
      this.deleteUserSession(userId),
      this.revokeRefreshToken(userId)
    ]

    const results = await Promise.allSettled(promises)
    const errors = results.filter(result => result.status === 'rejected').map(result => result.reason)

    if (errors.length > 0) {
      return Result.err(new Error(`Failed to clear user cache: ${errors.join(', ')}`))
    }

    return Result.ok(undefined)
  }
}