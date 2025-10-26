/**
 * Chat Application Service
 * Application layer - orchestrates use cases and provides high-level chat operations
 */

import { Result } from "@/libs/utils"
import type { ChatSessionRepository, MessageRepository } from "../../domain/repositories"
import type { AIService, ChatService } from "../../domain/services"
import {
  CreateSessionUseCase,
  DeleteSessionUseCase,
  GetSessionUseCase,
  ListSessionsUseCase,
  SendMessageUseCase,
} from "../use-cases"
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "../use-cases"

export class ChatApplicationService {
  private readonly createSessionUseCase: CreateSessionUseCase
  private readonly sendMessageUseCase: SendMessageUseCase
  private readonly getSessionUseCase: GetSessionUseCase
  private readonly deleteSessionUseCase: DeleteSessionUseCase
  private readonly listSessionsUseCase: ListSessionsUseCase

  constructor(
    chatSessionRepository: ChatSessionRepository,
    messageRepository: MessageRepository,
    chatService: ChatService,
    aiService: AIService
  ) {
    this.createSessionUseCase = new CreateSessionUseCase(chatSessionRepository)
    this.sendMessageUseCase = new SendMessageUseCase(
      chatSessionRepository,
      messageRepository,
      chatService,
      aiService
    )
    this.getSessionUseCase = new GetSessionUseCase(chatSessionRepository, messageRepository)
    this.deleteSessionUseCase = new DeleteSessionUseCase(chatSessionRepository, messageRepository)
    this.listSessionsUseCase = new ListSessionsUseCase(chatSessionRepository)
  }

  /**
   * Create a new chat session
   */
  async createSession(
    request: CreateSessionRequest
  ): Promise<Result<CreateSessionResponse, Error>> {
    return this.createSessionUseCase.execute(request)
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(request: SendMessageRequest): Promise<Result<SendMessageResponse, Error>> {
    return this.sendMessageUseCase.execute(request)
  }

  /**
   * Get a chat session with messages
   */
  async getSession(request: GetSessionRequest): Promise<Result<GetSessionResponse, Error>> {
    return this.getSessionUseCase.execute(request)
  }

  /**
   * Delete a chat session
   */
  async deleteSession(
    request: DeleteSessionRequest
  ): Promise<Result<DeleteSessionResponse, Error>> {
    return this.deleteSessionUseCase.execute(request)
  }

  /**
   * List user's chat sessions
   */
  async listSessions(request: ListSessionsRequest): Promise<Result<ListSessionsResponse, Error>> {
    return this.listSessionsUseCase.execute(request)
  }

  /**
   * Convenience method for creating a session with initial message
   */
  async createSessionWithMessage(
    userId: string,
    message: string,
    options?: {
      title?: string
      context?: string
      aiProvider?: "openai" | "claude"
      aiModel?: string
    }
  ): Promise<Result<CreateSessionResponse & { messageResponse?: SendMessageResponse }, Error>> {
    // Create session
    const sessionResult = await this.createSession({
      userId,
      title: options?.title,
      context: options?.context,
      aiProvider: options?.aiProvider,
      aiModel: options?.aiModel,
    })

    if (sessionResult.isErr()) {
      return Result.err(sessionResult.unwrapErr())
    }

    const sessionResponse = sessionResult.unwrap()

    // Send initial message
    const messageResult = await this.sendMessage({
      sessionId: sessionResponse.session.id,
      content: message,
      userId,
    })

    if (messageResult.isErr()) {
      return Result.err(messageResult.unwrapErr())
    }

    return Result.ok({
      ...sessionResponse,
      messageResponse: messageResult.unwrap(),
    })
  }

  /**
   * Get session statistics
   */
  async getSessionStats(
    sessionId: string,
    userId: string
  ): Promise<
    Result<
      {
        messageCount: number
        totalTokens: number
        firstMessageAt: Date | null
        lastMessageAt: Date | null
      },
      Error
    >
  > {
    const sessionResult = await this.getSession({
      sessionId,
      userId,
      includeMessages: true,
    })

    if (sessionResult.isErr()) {
      return Result.err(sessionResult.unwrapErr())
    }

    const { messages } = sessionResult.unwrap()

    if (!messages || messages.length === 0) {
      return Result.ok({
        messageCount: 0,
        totalTokens: 0,
        firstMessageAt: null,
        lastMessageAt: null,
      })
    }

    const messageCount = messages.length
    const totalTokens = messages.reduce((sum, msg) => sum + (msg.tokens || 0), 0)
    const firstMessageAt = messages[0].createdAt
    const lastMessageAt = messages[messages.length - 1].createdAt

    return Result.ok({
      messageCount,
      totalTokens,
      firstMessageAt,
      lastMessageAt,
    })
  }
}
