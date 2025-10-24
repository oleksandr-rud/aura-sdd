/**
 * Chat Session Repository Implementation
 * Infrastructure layer - concrete implementation of chat session persistence
 */

import { Result } from '@/libs/utils'
import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { ChatSessionRepository } from '../../domain/repositories/chat-session-repository'
import { ChatSession } from '../../domain/entities'

export class ChatSessionRepositoryImpl extends MemoryPaginatedRepository<ChatSession> implements ChatSessionRepository {
  async findByUserId(userId: string, options?: { page: number; limit: number }): Promise<ChatSession[]> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 20

    const result = await this.findManyBy({ userId: userId as any }, { page, limit })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    return result.unwrap().items
  }

  async findActiveByUserId(userId: string): Promise<ChatSession[]> {
    const result = await this.findBy({ userId: userId as any, isActive: true })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    return result.unwrap()
  }

  async findByUserIdAndTitle(userId: string, title: string): Promise<ChatSession | null> {
    const result = await this.findBy({ userId: userId as any, title: title as any })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    const sessions = result.unwrap()
    return sessions.length > 0 ? sessions[0] : null
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await this.findBy({ userId: userId as any })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    return result.unwrap().length
  }
}