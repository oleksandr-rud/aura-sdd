/**
 * Send Message Use Case
 * Sends a message and generates AI response
 */

import { Result } from "@/libs/utils"
import { chatSchemas, validateAndExtract } from "@/libs/validation"
import { UseCaseWithValidation } from "@/shared/use-case"
import { Message } from "../../domain/entities"
import type { ChatSessionRepository, MessageRepository } from "../../domain/repositories"
import type { AIService, ChatService } from "../../domain/services"

export interface SendMessageRequest {
  sessionId: string
  content: string
  userId: string
  role?: "user" | "system"
}

export interface SendMessageResponse {
  userMessage: {
    id: string
    sessionId: string
    role: "user" | "system"
    content: string
    createdAt: Date
  }
  aiMessage?: {
    id: string
    sessionId: string
    role: "assistant"
    content: string
    model: string
    tokens?: number
    createdAt: Date
  }
}

export class SendMessageUseCase extends UseCaseWithValidation<
  SendMessageRequest,
  SendMessageResponse
> {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly chatService: ChatService,
    private readonly aiService: AIService
  ) {
    super()
  }

  validate(input: SendMessageRequest): Result<SendMessageRequest, Error> {
    const validation = validateAndExtract(chatSchemas.sendMessage, {
      content: input.content,
      sessionId: input.sessionId,
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
    input: SendMessageRequest
  ): Promise<Result<SendMessageResponse, Error>> {
    try {
      // Verify session exists and user has access
      const sessionResult = await this.chatSessionRepository.findById(input.sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error("Chat session not found"))
      }

      if (session.userId !== input.userId) {
        return Result.err(new Error("Access denied: You do not have access to this chat session"))
      }

      if (!session.isActive) {
        return Result.err(new Error("Chat session is not active"))
      }

      // Create user message
      const userMessage = Message.createUserMessage(input.sessionId, input.content)

      // Save user message
      const savedUserMessage = await this.messageRepository.save(userMessage)
      if (savedUserMessage.isErr()) {
        return Result.err(savedUserMessage.unwrapErr())
      }

      const userMessageEntity = savedUserMessage.unwrap()

      // Get conversation context
      const contextResult = await this.chatService.getConversationContext(input.sessionId)
      if (contextResult.isErr()) {
        return Result.err(contextResult.unwrapErr())
      }

      const context = contextResult.unwrap()

      // Generate AI response
      const aiResponseResult = await this.aiService.generateResponse(
        context.messages,
        context.sessionContext,
        {
          model: session.aiModel,
          temperature: 0.7,
          maxTokens: 2000,
        }
      )

      let aiMessageEntity: Message | undefined

      if (aiResponseResult.isOk()) {
        const aiResponse = aiResponseResult.unwrap()

        // Create AI message
        const aiMessage = Message.createAssistantMessage(
          input.sessionId,
          aiResponse.content,
          aiResponse.model,
          aiResponse.tokens?.total
        )

        // Save AI message
        const savedAiMessage = await this.messageRepository.save(aiMessage)
        if (savedAiMessage.isOk()) {
          aiMessageEntity = savedAiMessage.unwrap()
        }
      }

      // Return response
      const response: SendMessageResponse = {
        userMessage: {
          id: userMessageEntity.id,
          sessionId: userMessageEntity.sessionId,
          role: userMessageEntity.role,
          content: userMessageEntity.content,
          createdAt: userMessageEntity.createdAt,
        },
      }

      if (aiMessageEntity) {
        response.aiMessage = {
          id: aiMessageEntity.id,
          sessionId: aiMessageEntity.sessionId,
          role: aiMessageEntity.role,
          content: aiMessageEntity.content,
          model: aiMessageEntity.model ?? session.aiModel,
          tokens: aiMessageEntity.tokens,
          createdAt: aiMessageEntity.createdAt,
        }
      }

      return Result.ok(response)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}
