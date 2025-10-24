/**
 * Login Use Case
 * Handles user authentication with email and password
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { authSchemas, validateAndExtract } from '@/libs/validation'
import { UserRepository } from '../../domain/repositories/user-repository'
import { AuthenticationService } from '../../domain/services/auth-service'
import { CacheService } from '@/libs/cache'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    isEmailVerified: boolean
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export class LoginUseCase extends UseCaseWithValidation<LoginRequest, LoginResponse> {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthenticationService,
    private cacheService: CacheService
  ) {
    super()
  }

  validate(input: LoginRequest): Result<LoginRequest, Error> {
    const validation = validateAndExtract(authSchemas.login, input)

    if (validation.isErr()) {
      const errors = validation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return Result.err(new Error(errorMessage))
    }

    return Result.ok(validation.unwrap())
  }

  protected async executeValidated(input: LoginRequest): Promise<Result<LoginResponse, Error>> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(input.email.toLowerCase().trim())
      if (!user) {
        return Result.err(new Error('Invalid credentials'))
      }

      // Authenticate user with domain service
      const authResult = await this.authService.authenticateUser(user, input.password)
      if (authResult.isErr()) {
        return Result.err(authResult.unwrapErr())
      }

      const authenticatedUser = authResult.unwrap()

      // Generate tokens
      const tokensResult = await this.authService.createTokens(authenticatedUser)
      if (tokensResult.isErr()) {
        return Result.err(tokensResult.unwrapErr())
      }

      const tokens = tokensResult.unwrap()

      // Cache user session for faster token validation
      await this.cacheService.cacheUserSession(
        authenticatedUser.id,
        {
          userId: authenticatedUser.id,
          email: authenticatedUser.email,
          lastLogin: authenticatedUser.props.lastLoginAt
        },
        3600 // 1 hour
      )

      // Update user with last login
      await this.userRepository.save(authenticatedUser)

      // Return response
      return Result.ok({
        user: {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          name: authenticatedUser.name,
          isEmailVerified: authenticatedUser.isEmailVerified
        },
        tokens
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}