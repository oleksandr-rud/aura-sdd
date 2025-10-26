/**
 * Chat Service Implementation
 * Infrastructure layer - concrete implementation of chat business logic
 */

import { Result } from "@/libs/utils"
import { ChatSession, Message } from "../../domain/entities"
import type { ChatSessionRepository, MessageRepository } from "../../domain/repositories"
import type { ChatContext, ChatConversation, ChatService } from "../../domain/services"
import type { AIServiceRegistry } from "./ai-service-registry"

export class ChatServiceImpl implements ChatService {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly aiServiceRegistry: AIServiceRegistry
  ) {}

  async createSession(
    userId: string,
    title?: string,
    aiProvider?: "openai" | "claude",
    aiModel?: string,
    context?: string
  ): Promise<Result<ChatSession, Error>> {
    try {
      // Determine AI provider and model
      const provider = aiProvider ?? "openai"
      const model = aiModel ?? this.getDefaultModel(provider)

      // Validate provider is available
      if (!this.aiServiceRegistry.isProviderAvailable(provider)) {
        return Result.err(new Error(`AI provider '${provider}' is not available`))
      }

      // Create session
      const session = ChatSession.create({
        userId,
        title,
        context,
        aiProvider: provider,
        aiModel: model,
      })

      // Save session
      const result = await this.chatSessionRepository.save(session)
      return result
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async sendMessage(
    sessionId: string,
    content: string,
    role: "user" | "system"
  ): Promise<Result<{ userMessage: Message; aiMessage?: Message }, Error>> {
    try {
      // Get session
      const sessionResult = await this.chatSessionRepository.findById(sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error("Chat session not found"))
      }

      // Create and save user message
      const userMessage =
        role === "user"
          ? Message.createUserMessage(sessionId, content)
          : Message.createSystemMessage(sessionId, content)

      const savedUserMessage = await this.messageRepository.save(userMessage)
      if (savedUserMessage.isErr()) {
        return Result.err(savedUserMessage.unwrapErr())
      }

      // Get AI service
      const aiServiceResult = this.aiServiceRegistry.getService(session.aiProvider)
      if (aiServiceResult.isErr()) {
        return Result.ok({
          userMessage: savedUserMessage.unwrap(),
        })
      }

      const aiService = aiServiceResult.unwrap()

      // Get conversation context
      const contextResult = await this.getConversationContext(sessionId)
      if (contextResult.isErr()) {
        return Result.ok({
          userMessage: savedUserMessage.unwrap(),
        })
      }

      const context = contextResult.unwrap()

      // Generate AI response
      const aiResponseResult = await aiService.generateResponse(
        context.messages,
        context.sessionContext,
        {
          model: session.aiModel,
          temperature: 0.7,
          maxTokens: 2000,
        }
      )

      let aiMessage: Message | undefined

      if (aiResponseResult.isOk()) {
        const aiResponse = aiResponseResult.unwrap()

        // Create AI message
        aiMessage = Message.createAssistantMessage(
          sessionId,
          aiResponse.content,
          aiResponse.model,
          aiResponse.tokens?.total
        )

        // Save AI message
        const savedAiMessage = await this.messageRepository.save(aiMessage)
        if (savedAiMessage.isOk()) {
          aiMessage = savedAiMessage.unwrap()
        }
      }

      return Result.ok({
        userMessage: savedUserMessage.unwrap(),
        aiMessage,
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getSession(sessionId: string): Promise<Result<ChatConversation, Error>> {
    try {
      // Get session
      const sessionResult = await this.chatSessionRepository.findById(sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error("Chat session not found"))
      }

      // Get messages
      const messagesResult = await this.messageRepository.findBySessionIdOrdered(sessionId)
      if (messagesResult.isErr()) {
        return Result.err(messagesResult.unwrapErr())
      }

      const messages = messagesResult.unwrap()

      // Get context
      const contextResult = await this.getConversationContext(sessionId)
      if (contextResult.isErr()) {
        return Result.err(contextResult.unwrapErr())
      }

      const context = contextResult.unwrap()

      return Result.ok({
        session,
        messages,
        context,
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getUserSessions(
    userId: string,
    options?: { page: number; limit: number }
  ): Promise<Result<ChatSession[], Error>> {
    try {
      const sessions = await this.chatSessionRepository.findByUserId(userId, options)
      return Result.ok(sessions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async deleteSession(sessionId: string): Promise<Result<void, Error>> {
    try {
      // Delete all messages
      await this.messageRepository.deleteBySessionId(sessionId)

      // Delete session
      const result = await this.chatSessionRepository.delete(sessionId)
      return result
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async updateSession(
    sessionId: string,
    updates: {
      title?: string
      context?: string
      aiProvider?: "openai" | "claude"
      aiModel?: string
    }
  ): Promise<Result<ChatSession, Error>> {
    try {
      // Get session
      const sessionResult = await this.chatSessionRepository.findById(sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error("Chat session not found"))
      }

      let updatedSession = session

      // Update title
      if (updates.title !== undefined) {
        const result = updatedSession.updateTitle(updates.title)
        if (result.isErr()) {
          return Result.err(result.unwrapErr())
        }
        updatedSession = result.unwrap()
      }

      // Update context
      if (updates.context !== undefined) {
        const result = updatedSession.updateContext(updates.context)
        if (result.isErr()) {
          return Result.err(result.unwrapErr())
        }
        updatedSession = result.unwrap()
      }

      // Update AI provider and model
      if (updates.aiProvider !== undefined || updates.aiModel !== undefined) {
        const provider = updates.aiProvider ?? session.aiProvider
        const model = updates.aiModel ?? session.aiModel

        const result = updatedSession.updateAIProvider(provider, model)
        if (result.isErr()) {
          return Result.err(result.unwrapErr())
        }
        updatedSession = result.unwrap()
      }

      // Save updated session
      const saveResult = await this.chatSessionRepository.save(updatedSession)
      return saveResult
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getConversationContext(sessionId: string): Promise<Result<ChatContext, Error>> {
    try {
      // Get session
      const sessionResult = await this.chatSessionRepository.findById(sessionId)
      if (sessionResult.isErr()) {
        return Result.err(sessionResult.unwrapErr())
      }

      const session = sessionResult.unwrap()
      if (!session) {
        return Result.err(new Error("Chat session not found"))
      }

      // Get recent messages
      const messages = await this.messageRepository.findLatestBySessionId(sessionId, 50)

      // Sort by creation date
      messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      return Result.ok({
        messages,
        systemPrompt: undefined, // Can be added later if needed
        sessionContext: session.context,
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  manageContextWindow(messages: Message[], maxTokens: number): Result<Message[], Error> {
    try {
      // Simple context management: keep recent messages within token limit
      let totalTokens = 0
      const managedMessages: Message[] = []

      // Start from the end (most recent messages)
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        const messageTokens = message.tokens ?? this.estimateTokens(message.content)

        if (totalTokens + messageTokens <= maxTokens) {
          managedMessages.unshift(message)
          totalTokens += messageTokens
        } else {
          break
        }
      }

      return Result.ok(managedMessages)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  private getDefaultModel(provider: "openai" | "claude"): string {
    switch (provider) {
      case "openai":
        return "gpt-3.5-turbo"
      case "claude":
        return "claude-3-sonnet-20241022"
      default:
        return "gpt-3.5-turbo"
    }
  }

  private estimateTokens(text: string): number {
    // Simple token estimation
    return Math.ceil(text.length / 4)
  }
}
