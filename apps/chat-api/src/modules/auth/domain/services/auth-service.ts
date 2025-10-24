/**
 * Authentication Domain Service
 * Domain layer - core authentication business logic
 */

import { User } from '../entities/user'
import { Result } from '@/libs/utils'

export interface PasswordHasher {
  hash(password: string): Promise<string>
  verify(password: string, hash: string): Promise<boolean>
}

export interface TokenService {
  generateAccessToken(user: User): Promise<string>
  generateRefreshToken(user: User): Promise<string>
  verifyAccessToken(token: string): Promise<{ userId: string } | null>
  verifyRefreshToken(token: string): Promise<{ userId: string } | null>
}

export class AuthenticationService {
  constructor(
    private passwordHasher: PasswordHasher,
    private tokenService: TokenService
  ) {}

  async authenticateUser(user: User, password: string): Promise<Result<User, Error>> {
    if (!user.isActive) {
      return Result.err(new Error('User account is inactive'))
    }

    const isValidPassword = await this.passwordHasher.verify(password, user.props.passwordHash)
    if (!isValidPassword) {
      return Result.err(new Error('Invalid credentials'))
    }

    return Result.ok(user.recordLogin())
  }

  async createTokens(user: User): Promise<Result<{ accessToken: string; refreshToken: string }, Error>> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.tokenService.generateAccessToken(user),
        this.tokenService.generateRefreshToken(user)
      ])

      return Result.ok({ accessToken, refreshToken })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async hashPassword(password: string): Promise<Result<string, Error>> {
    try {
      const hash = await this.passwordHasher.hash(password)
      return Result.ok(hash)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async verifyToken(token: string): Promise<Result<{ userId: string }, Error>> {
    try {
      const payload = await this.tokenService.verifyAccessToken(token)
      if (!payload) {
        return Result.err(new Error('Invalid token'))
      }
      return Result.ok(payload)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}