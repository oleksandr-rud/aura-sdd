/**
 * Get Session Use Case
 * Retrieves a chat session with its messages
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { ChatSessionRepository, MessageRepository } from '../../domain/repositories'
import { ChatConversation } from '../../domain/services'

export interface GetSessionRequest {
  sessionId: string
  userId: string
  includeMessages?: boolean
  page?: number
  limit?: number
}

export interface GetSessionResponse {
  session: {
    id: string
    userId: string
    title: string
    context?: string
    aiProvider: 'openai' | 'claude'
    aiModel: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }
  messages?: Array<{
    id: string
    sessionId: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tokens?: number
    model?: string
    createdAt: Date
  }>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class GetSessionUseCase extends UseCaseWithValidation<GetSessionRequest, GetSessionResponse> {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository,
    private readonly messageRepository: MessageRepository
  ) {
    super()
  }

  validate(input: GetSessionRequest): Result<GetSessionRequest, Error> {
    const validation = validateAndExtract(commonSchemas.uuid, input.sessionId)

    if (validation.isErr()) {
      return Result.err(new Error('Invalid session ID format'))
    }

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

  protected async executeValidated(input: GetSessionRequest): Promise<Result<GetSessionResponse, Error>> {
    try {
      // Get session
      const sessionResult = await this.chatSessionRepository.findById(input.sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error('Chat session not found'))
      }

      // Verify user has access
      if (session.userId !== input.userId) {
        return Result.err(new Error('Access denied: You do not have access to this chat session'))
      }

      const response: GetSessionResponse = {
        session: {
          id: session.id,
          userId: session.userId,
          title: session.title,
          context: session.context,
          aiProvider: session.aiProvider,
          aiModel: session.aiModel,
          isActive: session.isActive,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        }
      }

      // Get messages if requested
      if (input.includeMessages) {
        const page = input.page ?? 1
        const limit = input.limit ?? 20

        const messagesResult = await this.messageRepository.findBySessionIdOrdered(
          input.sessionId,
          { page, limit }
        )

        if (messagesResult.isErr()) {
          return Result.err(messagesResult.unwrapErr())
        }

        const messages = messagesResult.unwrap()

        response.messages = messages.map(message => ({
          id: message.id,
          sessionId: message.sessionId,
          role: message.role,
          content: message.content,
          tokens: message.tokens,
          model: message.model,
          createdAt: message.createdAt
        }))

        // Get pagination info
        const countResult = await this.messageRepository.countBySessionId(input.sessionId)
        if (countResult.isOk()) {
          const total = countResult.unwrap()
          response.pagination = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      }

      return Result.ok(response)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}