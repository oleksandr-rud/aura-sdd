/**
 * Chat Controller
 * HTTP request/response handlers for chat operations
 */

import { FastifyRequest, FastifyReply } from 'fastify'
import { ChatApplicationService } from '../../application'
import {
  ResponseBuilders,
  ChatErrorCodes,
  type CreateSessionRequestDTO,
  type CreateSessionResponseDTO,
  type SendMessageRequestDTO,
  type SendMessageResponseDTO,
  type GetSessionResponseDTO,
  type ListSessionsResponseDTO,
  type DeleteSessionResponseDTO,
  type UpdateSessionRequestDTO,
  type UpdateSessionResponseDTO,
  type SessionStatsResponseDTO
} from '../dto/chat.dto'

export class ChatController {
  constructor(private readonly chatApplicationService: ChatApplicationService) {}

  /**
   * List user's chat sessions
   * GET /chat/sessions
   */
  listSessions = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const { page = 1, limit = 20, activeOnly = false } = request.query as {
        page?: number
        limit?: number
        activeOnly?: boolean
      }

      const result = await this.chatApplicationService.listSessions({
        userId: request.user.id,
        page,
        limit,
        activeOnly
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to list chat sessions',
            error.message
          )
        )
      }

      const response = result.unwrap()
      const responseData: ListSessionsResponseDTO = {
        sessions: response.sessions.map(session => ({
          id: session.id,
          userId: session.userId,
          title: session.title,
          aiProvider: session.aiProvider,
          aiModel: session.aiModel,
          isActive: session.isActive,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString()
        })),
        pagination: response.pagination
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Chat sessions retrieved successfully')
      )

    } catch (error) {
      console.error('List sessions error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to retrieve chat sessions'
        )
      )
    }
  }

  /**
   * Create a new chat session
   * POST /chat/sessions
   */
  createSession = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const createData = request.body as CreateSessionRequestDTO

      const result = await this.chatApplicationService.createSession({
        userId: request.user.id,
        title: createData.title,
        context: createData.context,
        aiProvider: createData.aiProvider,
        aiModel: createData.aiModel
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('validation')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ChatErrorCodes.VALIDATION_ERROR,
              error.message
            )
          )
        }

        if (error.message.includes('not available')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ChatErrorCodes.AI_SERVICE_ERROR,
              error.message
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to create chat session'
          )
        )
      }

      const response = result.unwrap()
      const responseData: CreateSessionResponseDTO = {
        session: {
          id: response.session.id,
          userId: response.session.userId,
          title: response.session.title,
          context: response.session.context,
          aiProvider: response.session.aiProvider,
          aiModel: response.session.aiModel,
          isActive: response.session.isActive,
          createdAt: response.session.createdAt.toISOString(),
          updatedAt: response.session.createdAt.toISOString()
        }
      }

      return reply.status(201).send(
        ResponseBuilders.success(responseData, 'Chat session created successfully')
      )

    } catch (error) {
      console.error('Create session error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to create chat session'
        )
      )
    }
  }

  /**
   * Get a specific chat session
   * GET /chat/sessions/:sessionId
   */
  getSession = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const { sessionId } = request.params as { sessionId: string }
      const { includeMessages = false, page = 1, limit = 20 } = request.query as {
        includeMessages?: boolean
        page?: number
        limit?: number
      }

      const result = await this.chatApplicationService.getSession({
        sessionId,
        userId: request.user.id,
        includeMessages,
        page,
        limit
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ChatErrorCodes.SESSION_NOT_FOUND,
              'Chat session not found'
            )
          )
        }

        if (error.message.includes('Access denied')) {
          return reply.status(403).send(
            ResponseBuilders.error(
              ChatErrorCodes.ACCESS_DENIED,
              'You do not have access to this chat session'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to retrieve chat session'
          )
        )
      }

      const response = result.unwrap()
      const responseData: GetSessionResponseDTO = {
        session: {
          id: response.session.id,
          userId: response.session.userId,
          title: response.session.title,
          context: response.session.context,
          aiProvider: response.session.aiProvider,
          aiModel: response.session.aiModel,
          isActive: response.session.isActive,
          createdAt: response.session.createdAt.toISOString(),
          updatedAt: response.session.updatedAt.toISOString()
        }
      }

      if (response.messages) {
        responseData.messages = response.messages.map(message => ({
          id: message.id,
          sessionId: message.sessionId,
          role: message.role,
          content: message.content,
          tokens: message.tokens,
          model: message.model,
          createdAt: message.createdAt.toISOString()
        }))
      }

      if (response.pagination) {
        responseData.pagination = response.pagination
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Chat session retrieved successfully')
      )

    } catch (error) {
      console.error('Get session error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to retrieve chat session'
        )
      )
    }
  }

  /**
   * Send a message in a chat session
   * POST /chat/sessions/:sessionId/messages
   */
  sendMessage = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const { sessionId } = request.params as { sessionId: string }
      const messageData = request.body as SendMessageRequestDTO

      const result = await this.chatApplicationService.sendMessage({
        sessionId,
        content: messageData.content,
        userId: request.user.id,
        role: messageData.role ?? 'user'
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ChatErrorCodes.SESSION_NOT_FOUND,
              'Chat session not found'
            )
          )
        }

        if (error.message.includes('Access denied')) {
          return reply.status(403).send(
            ResponseBuilders.error(
              ChatErrorCodes.ACCESS_DENIED,
              'You do not have access to this chat session'
            )
          )
        }

        if (error.message.includes('not active')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ChatErrorCodes.VALIDATION_ERROR,
              'Chat session is not active'
            )
          )
        }

        if (error.message.includes('validation')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ChatErrorCodes.VALIDATION_ERROR,
              error.message
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to send message'
          )
        )
      }

      const response = result.unwrap()
      const responseData: SendMessageResponseDTO = {
        userMessage: {
          id: response.userMessage.id,
          sessionId: response.userMessage.sessionId,
          role: response.userMessage.role,
          content: response.userMessage.content,
          createdAt: response.userMessage.createdAt.toISOString()
        }
      }

      if (response.aiMessage) {
        responseData.aiMessage = {
          id: response.aiMessage.id,
          sessionId: response.aiMessage.sessionId,
          role: response.aiMessage.role,
          content: response.aiMessage.content,
          model: response.aiMessage.model,
          tokens: response.aiMessage.tokens,
          createdAt: response.aiMessage.createdAt.toISOString()
        }
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Message sent successfully')
      )

    } catch (error) {
      console.error('Send message error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to send message'
        )
      )
    }
  }

  /**
   * Delete a chat session
   * DELETE /chat/sessions/:sessionId
   */
  deleteSession = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const { sessionId } = request.params as { sessionId: string }

      const result = await this.chatApplicationService.deleteSession({
        sessionId,
        userId: request.user.id
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ChatErrorCodes.SESSION_NOT_FOUND,
              'Chat session not found'
            )
          )
        }

        if (error.message.includes('Access denied')) {
          return reply.status(403).send(
            ResponseBuilders.error(
              ChatErrorCodes.ACCESS_DENIED,
              'You do not have access to this chat session'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to delete chat session'
          )
        )
      }

      const response = result.unwrap()
      const responseData: DeleteSessionResponseDTO = {
        success: response.success,
        message: response.message
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Chat session deleted successfully')
      )

    } catch (error) {
      console.error('Delete session error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to delete chat session'
        )
      )
    }
  }

  /**
   * Update a chat session
   * PATCH /chat/sessions/:sessionId
   */
  updateSession = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const { sessionId } = request.params as { sessionId: string }
      const updateData = request.body as UpdateSessionRequestDTO

      const result = await this.chatApplicationService.updateSession({
        sessionId,
        userId: request.user.id,
        updates: updateData
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ChatErrorCodes.SESSION_NOT_FOUND,
              'Chat session not found'
            )
          )
        }

        if (error.message.includes('Access denied')) {
          return reply.status(403).send(
            ResponseBuilders.error(
              ChatErrorCodes.ACCESS_DENIED,
              'You do not have access to this chat session'
            )
          )
        }

        if (error.message.includes('validation')) {
          return reply.status(400).send(
            ResponseBuilders.error(
              ChatErrorCodes.VALIDATION_ERROR,
              error.message
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to update chat session'
          )
        )
      }

      const response = result.unwrap()
      const responseData: UpdateSessionResponseDTO = {
        session: {
          id: response.id,
          userId: response.userId,
          title: response.title,
          context: response.context,
          aiProvider: response.aiProvider,
          aiModel: response.aiModel,
          isActive: response.isActive,
          createdAt: response.createdAt.toISOString(),
          updatedAt: response.updatedAt.toISOString()
        }
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Chat session updated successfully')
      )

    } catch (error) {
      console.error('Update session error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to update chat session'
        )
      )
    }
  }

  /**
   * Get session statistics
   * GET /chat/sessions/:sessionId/stats
   */
  getSessionStats = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send(
          ResponseBuilders.error(
            ChatErrorCodes.ACCESS_DENIED,
            'Authentication required'
          )
        )
      }

      const { sessionId } = request.params as { sessionId: string }

      const result = await this.chatApplicationService.getSessionStats(sessionId, request.user.id)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(
            ResponseBuilders.error(
              ChatErrorCodes.SESSION_NOT_FOUND,
              'Chat session not found'
            )
          )
        }

        if (error.message.includes('Access denied')) {
          return reply.status(403).send(
            ResponseBuilders.error(
              ChatErrorCodes.ACCESS_DENIED,
              'You do not have access to this chat session'
            )
          )
        }

        return reply.status(500).send(
          ResponseBuilders.error(
            ChatErrorCodes.INTERNAL_SERVER_ERROR,
            'Failed to retrieve session statistics'
          )
        )
      }

      const stats = result.unwrap()
      const responseData: SessionStatsResponseDTO = {
        messageCount: stats.messageCount,
        totalTokens: stats.totalTokens,
        firstMessageAt: stats.firstMessageAt?.toISOString(),
        lastMessageAt: stats.lastMessageAt?.toISOString()
      }

      return reply.send(
        ResponseBuilders.success(responseData, 'Session statistics retrieved successfully')
      )

    } catch (error) {
      console.error('Get session stats error:', error)
      return reply.status(500).send(
        ResponseBuilders.error(
          ChatErrorCodes.INTERNAL_SERVER_ERROR,
          'Failed to retrieve session statistics'
        )
      )
    }
  }
}