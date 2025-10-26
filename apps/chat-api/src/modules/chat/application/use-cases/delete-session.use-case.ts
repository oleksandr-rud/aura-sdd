/**
 * Delete Session Use Case
 * Deletes a chat session and all its messages
 */

import { Result } from "@/libs/utils"
import { commonSchemas, validateAndExtract } from "@/libs/validation"
import { UseCaseWithValidation } from "@/shared/use-case"
import type { ChatSessionRepository, MessageRepository } from "../../domain/repositories"

export interface DeleteSessionRequest {
  sessionId: string
  userId: string
}

export interface DeleteSessionResponse {
  success: boolean
  message: string
}

export class DeleteSessionUseCase extends UseCaseWithValidation<
  DeleteSessionRequest,
  DeleteSessionResponse
> {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository,
    private readonly messageRepository: MessageRepository
  ) {
    super()
  }

  validate(input: DeleteSessionRequest): Result<DeleteSessionRequest, Error> {
    const validation = validateAndExtract(commonSchemas.uuid, input.sessionId)

    if (validation.isErr()) {
      return Result.err(new Error("Invalid session ID format"))
    }

    return Result.ok(input)
  }

  protected async executeValidated(
    input: DeleteSessionRequest
  ): Promise<Result<DeleteSessionResponse, Error>> {
    try {
      // Get session
      const sessionResult = await this.chatSessionRepository.findById(input.sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error("Chat session not found"))
      }

      // Verify user has access
      if (session.userId !== input.userId) {
        return Result.err(new Error("Access denied: You do not have access to this chat session"))
      }

      // Delete all messages for the session
      await this.messageRepository.deleteBySessionId(input.sessionId)

      // Delete the session
      const deleteResult = await this.chatSessionRepository.delete(input.sessionId)
      if (deleteResult.isErr()) {
        return Result.err(deleteResult.unwrapErr())
      }

      return Result.ok({
        success: true,
        message: "Chat session deleted successfully",
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}
