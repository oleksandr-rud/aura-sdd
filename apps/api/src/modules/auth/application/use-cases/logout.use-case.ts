/**
 * Logout Use Case
 * Handles user logout and token invalidation
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { CacheService } from '@/libs/cache'

export interface LogoutRequest {
  userId: string
  sessionId?: string
}

export interface LogoutResponse {
  message: string
}

export class LogoutUseCase extends UseCaseWithValidation<LogoutRequest, LogoutResponse> {
  constructor(
    private cacheService: CacheService
  ) {
    super()
  }

  validate(input: LogoutRequest): Result<LogoutRequest, Error> {
    const schema = commonSchemas.uuid.extend({
      sessionId: commonSchemas.uuid.optional()
    })

    const validation = validateAndExtract(schema, input)

    if (validation.isErr()) {
      const errors = validation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return Result.err(new Error(errorMessage))
    }

    return Result.ok(validation.unwrap())
  }

  protected async executeValidated(input: LogoutRequest): Promise<Result<LogoutResponse, Error>> {
    try {
      // Remove user session from cache
      const sessionDeleteResult = await this.cacheService.delete(`session:${input.userId}`)
      if (sessionDeleteResult.isErr()) {
        console.error('Failed to delete user session:', sessionDeleteResult.unwrapErr())
      }

      // If specific session ID provided, also remove it
      if (input.sessionId) {
        const specificSessionDeleteResult = await this.cacheService.delete(`session:${input.sessionId}`)
        if (specificSessionDeleteResult.isErr()) {
          console.error('Failed to delete specific session:', specificSessionDeleteResult.unwrapErr())
        }
      }

      // Note: In a real implementation, you would also:
      // 1. Add the token to a blacklist/revocation list
      // 2. Clear any other user-specific cache data
      // 3. Log the logout event for security auditing

      return Result.ok({
        message: 'Logout successful'
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}