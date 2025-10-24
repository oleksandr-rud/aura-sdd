/**
 * List Sessions Use Case
 * Retrieves all chat sessions for a user
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { ChatSessionRepository } from '../../domain/repositories'

export interface ListSessionsRequest {
  userId: string
  page?: number
  limit?: number
  activeOnly?: boolean
}

export interface ListSessionsResponse {
  sessions: Array<{
    id: string
    userId: string
    title: string
    aiProvider: 'openai' | 'claude'
    aiModel: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    messageCount?: number
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ListSessionsUseCase extends UseCaseWithValidation<ListSessionsRequest, ListSessionsResponse> {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository
  ) {
    super()
  }

  validate(input: ListSessionsRequest): Result<ListSessionsRequest, Error> {
    // Validate pagination if provided
    if (input.page !== undefined || input.limit !== undefined) {
      const paginationValidation = validateAndExtract(commonSchemas.pagination, {
        page: input.page ?? 1,
        limit: input.limit ?? 20
      })

      if (paginationValidation.isErr()) {
        const errors = paginationValidation.unwrapErr()
        const errorMessage = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ')
        return Result.err(new Error(errorMessage))
      }
    }

    return Result.ok(input)
  }

  protected async executeValidated(input: ListSessionsRequest): Promise<Result<ListSessionsResponse, Error>> {
    try {
      const page = input.page ?? 1
      const limit = input.limit ?? 20

      // Get sessions based on filter
      let sessions
      if (input.activeOnly) {
        sessions = await this.chatSessionRepository.findByUserId(input.userId, { page, limit })
      } else {
        const paginatedResult = await this.chatSessionRepository.findManyBy(
          { userId: input.userId },
          { page, limit }
        )

        if (paginatedResult.isErr()) {
          return Result.err(paginatedResult.unwrapErr())
        }

        const paginatedSessions = paginatedResult.unwrap()
        sessions = paginatedSessions.items
      }

      // Get total count
      const totalResult = await this.chatSessionRepository.countByUserId(input.userId)
      const total = totalResult.isOk() ? totalResult.unwrap() : 0

      // Map sessions to response format
      const sessionResponses = sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        title: session.title,
        aiProvider: session.aiProvider,
        aiModel: session.aiModel,
        isActive: session.isActive,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }))

      return Result.ok({
        sessions: sessionResponses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}