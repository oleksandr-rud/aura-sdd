/**
 * Create Session Use Case
 * Creates a new chat session for a user
 */

import { Result } from "@/libs/utils"
import { chatSchemas, validateAndExtract } from "@/libs/validation"
import { UseCaseWithValidation } from "@/shared/use-case"
import { ChatSession } from "../../domain/entities"
import type { ChatSessionRepository } from "../../domain/repositories/chat-session-repository"

export interface CreateSessionRequest {
  userId: string
  title?: string
  context?: string
  aiProvider?: "openai" | "claude"
  aiModel?: string
}

export interface CreateSessionResponse {
  session: {
    id: string
    userId: string
    title: string
    context?: string
    aiProvider: "openai" | "claude"
    aiModel: string
    isActive: boolean
    createdAt: Date
  }
}

export class CreateSessionUseCase extends UseCaseWithValidation<
  CreateSessionRequest,
  CreateSessionResponse
> {
  constructor(private readonly chatSessionRepository: ChatSessionRepository) {
    super()
  }

  validate(input: CreateSessionRequest): Result<CreateSessionRequest, Error> {
    const validation = validateAndExtract(chatSchemas.createSession, {
      title: input.title,
      context: input.context,
    })

    if (validation.isErr()) {
      const errors = validation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ")
      return Result.err(new Error(errorMessage))
    }

    return Result.ok({
      ...input,
      ...validation.unwrap(),
    })
  }

  protected async executeValidated(
    input: CreateSessionRequest
  ): Promise<Result<CreateSessionResponse, Error>> {
    try {
      // Set default values
      const aiProvider = input.aiProvider ?? "openai"
      const aiModel =
        input.aiModel ?? (aiProvider === "openai" ? "gpt-3.5-turbo" : "claude-3-sonnet-20241022")

      // Create chat session entity
      const session = ChatSession.create({
        userId: input.userId,
        title: input.title,
        context: input.context,
        aiProvider,
        aiModel,
      })

      // Save session
      const savedSession = await this.chatSessionRepository.save(session)
      if (savedSession.isErr()) {
        return Result.err(savedSession.unwrapErr())
      }

      const sessionEntity = savedSession.unwrap()

      // Return response
      return Result.ok({
        session: {
          id: sessionEntity.id,
          userId: sessionEntity.userId,
          title: sessionEntity.title,
          context: sessionEntity.context,
          aiProvider: sessionEntity.aiProvider,
          aiModel: sessionEntity.aiModel,
          isActive: sessionEntity.isActive,
          createdAt: sessionEntity.createdAt,
        },
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}
