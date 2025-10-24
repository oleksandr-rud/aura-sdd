/**
 * Chat Service Interface
 * Domain layer - defines contract for chat business logic
 */

import { Result } from '@/libs/utils'
import { ChatSession, Message } from '../entities'

export interface ChatContext {
  messages: Message[]
  systemPrompt?: string
  sessionContext?: string
}

export interface ChatConversation {
  session: ChatSession
  messages: Message[]
  context: ChatContext
}

export interface ChatService {
  /**
   * Create a new chat session
   */
  createSession(
    userId: string,
    title?: string,
    aiProvider?: 'openai' | 'claude',
    aiModel?: string,
    context?: string
  ): Promise<Result<ChatSession, Error>>

  /**
   * Add a message to a session and generate AI response
   */
  sendMessage(
    sessionId: string,
    content: string,
    role: 'user' | 'system'
  ): Promise<Result<{ userMessage: Message; aiMessage?: Message }, Error>>

  /**
   * Get session with all messages
   */
  getSession(sessionId: string): Promise<Result<ChatConversation, Error>>

  /**
   * Get all sessions for a user
   */
  getUserSessions(
    userId: string,
    options?: { page: number; limit: number }
  ): Promise<Result<ChatSession[], Error>>

  /**
   * Delete a session and all its messages
   */
  deleteSession(sessionId: string): Promise<Result<void, Error>>

  /**
   * Update session properties
   */
  updateSession(
    sessionId: string,
    updates: {
      title?: string
      context?: string
      aiProvider?: 'openai' | 'claude'
      aiModel?: string
    }
  ): Promise<Result<ChatSession, Error>>

  /**
   * Get conversation context for AI generation
   */
  getConversationContext(sessionId: string): Promise<Result<ChatContext, Error>>

  /**
   * Manage context window (trim old messages if needed)
   */
  manageContextWindow(
    messages: Message[],
    maxTokens: number
  ): Result<Message[], Error>
}