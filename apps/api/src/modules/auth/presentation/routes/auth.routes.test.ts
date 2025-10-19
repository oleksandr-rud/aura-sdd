/**
 * Auth Routes Tests
 * Basic integration tests for auth endpoints
 */

import { FastifyInstance } from 'fastify'
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { buildApp } from '../../../../../test/helpers/test-app'
import { AuthApplicationService } from '../../application/services/auth-application-service'

describe('Auth Routes', () => {
  let app: FastifyInstance
  let authApplicationService: any

  beforeAll(async () => {
    // Mock auth application service
    authApplicationService = {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      verifyEmail: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      verifyToken: vi.fn(),
      refreshToken: vi.fn(),
      getUserSession: vi.fn(),
      getUserById: vi.fn()
    }

    app = await buildApp()

    // Register auth routes with mocked service
    await app.register(async (fastify) => {
      fastify.register(async (fastify) => {
        const { authRoutes } = await import('./auth.routes')
        fastify.register(authRoutes, {
          authApplicationService
        })
      }, { prefix: '/auth' })
    })
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        companyName: null,
        isVerified: false,
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      authApplicationService.register.mockResolvedValue({
        isOk: () => true,
        unwrap: () => ({
          user: mockUser,
          message: 'Registration successful'
        })
      } as any)

      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('test@example.com')
      expect(body.data.user.name).toBe('Test User')
    })

    it('should return validation error for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'invalid-email',
          password: '123', // too short
          name: 'A' // too short
        }
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      authApplicationService.login.mockResolvedValue({
        isOk: () => true,
        unwrap: () => ({
          user: mockUser,
          tokens: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            expiresIn: 3600
          }
        })
      } as any)

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'password123'
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('test@example.com')
      expect(body.data.tokens.accessToken).toBe('access-token')
    })

    it('should return error for invalid credentials', async () => {
      authApplicationService.login.mockResolvedValue({
        isOk: () => false,
        isErr: () => true,
        unwrapErr: () => new Error('Invalid credentials')
      } as any)

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'wrong-password'
        }
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('INVALID_CREDENTIALS')
    })
  })

  describe('GET /auth/health', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/health'
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.status).toBe('healthy')
      expect(body.service).toBe('auth')
    })
  })

  describe('GET /auth/me', () => {
    it('should return current user profile when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        companyName: null,
        avatar: null,
        phone: null,
        timezone: null,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }

      authApplicationService.verifyToken.mockResolvedValue({
        isOk: () => true,
        unwrap: () => ({ userId: 'user-123' })
      } as any)

      authApplicationService.getUserById.mockResolvedValue(mockUser)

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: 'Bearer valid-token'
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('test@example.com')
    })

    it('should return 401 when not authenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me'
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('UNAUTHORIZED')
    })
  })
})