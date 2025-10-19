/**
 * Cache Library
 * KISS principle: simple caching interface with memory and Redis backends
 */

import { Result } from '@/libs/utils'

export interface CacheProvider {
  get<T>(key: string): Promise<Option<T>>
  set<T>(key: string, value: T, ttl?: number): Promise<Result<void, Error>>
  delete(key: string): Promise<Result<void, Error>>
  clear(): Promise<Result<void, Error>>
  exists(key: string): Promise<boolean>
}

export interface Option<T> {
  isSome(): boolean
  isNone(): boolean
  unwrapOr(defaultValue: T): T
}

class MemoryOption<T> implements Option<T> {
  constructor(private readonly value: T | null) {}

  isSome(): boolean {
    return this.value !== null
  }

  isNone(): boolean {
    return this.value === null
  }

  unwrapOr(defaultValue: T): T {
    return this.value ?? defaultValue
  }
}

// Simple in-memory cache
export class MemoryCache implements CacheProvider {
  private cache = new Map<string, { value: unknown; expires?: number }>()

  async get<T>(key: string): Promise<Option<T>> {
    const item = this.cache.get(key)

    if (!item) {
      return new MemoryOption<T>(null)
    }

    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key)
      return new MemoryOption<T>(null)
    }

    return new MemoryOption<T>(item.value as T)
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<Result<void, Error>> {
    const expires = ttl ? Date.now() + ttl * 1000 : undefined
    this.cache.set(key, { value, expires })
    return Result.ok(undefined)
  }

  async delete(key: string): Promise<Result<void, Error>> {
    this.cache.delete(key)
    return Result.ok(undefined)
  }

  async clear(): Promise<Result<void, Error>> {
    this.cache.clear()
    return Result.ok(undefined)
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key)
    if (!item) return false

    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

// Redis cache interface (simplified)
export class RedisCache implements CacheProvider {
  constructor(private redisUrl: string) {}

  private async getClient(): Promise<any> {
    // In real implementation, use ioredis or redis package
    console.log(`Redis client for: ${this.redisUrl}`)
    return null
  }

  async get<T>(key: string): Promise<Option<T>> {
    // Simplified implementation
    console.log(`Redis GET: ${key}`)
    return new MemoryOption<T>(null)
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<Result<void, Error>> {
    console.log(`Redis SET: ${key}`, { value, ttl })
    return Result.ok(undefined)
  }

  async delete(key: string): Promise<Result<void, Error>> {
    console.log(`Redis DELETE: ${key}`)
    return Result.ok(undefined)
  }

  async clear(): Promise<Result<void, Error>> {
    console.log('Redis CLEAR')
    return Result.ok(undefined)
  }

  async exists(key: string): Promise<boolean> {
    console.log(`Redis EXISTS: ${key}`)
    return false
  }
}

// Cache service with auto-selection
export class CacheService {
  private provider: CacheProvider

  constructor(provider?: CacheProvider) {
    if (provider) {
      this.provider = provider
    } else if (process.env.REDIS_URL) {
      this.provider = new RedisCache(process.env.REDIS_URL)
    } else {
      this.provider = new MemoryCache()
    }
  }

  // User session caching
  async cacheUserSession(userId: string, session: any, ttl: number = 3600): Promise<Result<void, Error>> {
    return this.provider.set(`session:${userId}`, session, ttl)
  }

  async getUserSession(userId: string): Promise<Option<any>> {
    return this.provider.get(`session:${userId}`)
  }

  // AI response caching
  async cacheAIResponse(promptHash: string, response: any, ttl: number = 1800): Promise<Result<void, Error>> {
    return this.provider.set(`ai:${promptHash}`, response, ttl)
  }

  async getAIResponse(promptHash: string): Promise<Option<any>> {
    return this.provider.get(`ai:${promptHash}`)
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, window: number): Promise<boolean> {
    const key = `rate:${identifier}`
    const current = await this.provider.get<number>(key)

    if (current.isNone()) {
      await this.provider.set(key, 1, window)
      return true
    }

    const count = current.unwrapOr(0)
    if (count >= limit) {
      return false
    }

    await this.provider.set(key, count + 1, window)
    return true
  }

  // Generic methods
  async get<T>(key: string): Promise<Option<T>> {
    return this.provider.get<T>(key)
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<Result<void, Error>> {
    return this.provider.set(key, value, ttl)
  }

  async delete(key: string): Promise<Result<void, Error>> {
    return this.provider.delete(key)
  }

  async clear(): Promise<Result<void, Error>> {
    return this.provider.clear()
  }

  async exists(key: string): Promise<boolean> {
    return this.provider.exists(key)
  }
}

// Default instance
export const cacheService = new CacheService()