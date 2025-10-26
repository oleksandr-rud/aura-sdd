/**
 * Message Repository Implementation
 * Infrastructure layer - concrete implementation of message persistence
 */

import { Result } from "@/libs/utils"
import { MemoryPaginatedRepository } from "@/shared/base-repository"
import type { Message } from "../../domain/entities"
import type { MessageRepository } from "../../domain/repositories/message-repository"

export class MessageRepositoryImpl
  extends MemoryPaginatedRepository<Message>
  implements MessageRepository
{
  async findBySessionId(
    sessionId: string,
    options?: { page: number; limit: number }
  ): Promise<Message[]> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 20

    const result = await this.findManyBy({ sessionId: sessionId as any }, { page, limit })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    return result.unwrap().items
  }

  async findBySessionIdOrdered(
    sessionId: string,
    options?: { page: number; limit: number }
  ): Promise<Message[]> {
    const messages = await this.findBySessionId(sessionId, options)

    // Sort by creation date (oldest first)
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  async findLatestBySessionId(sessionId: string, limit: number): Promise<Message[]> {
    const allMessagesResult = await this.findBy({ sessionId: sessionId as any })
    if (allMessagesResult.isErr()) {
      throw allMessagesResult.unwrapErr()
    }

    const allMessages = allMessagesResult.unwrap()

    // Sort by creation date (newest first) and take latest
    return allMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
  }

  async countBySessionId(sessionId: string): Promise<number> {
    const result = await this.findBy({ sessionId: sessionId as any })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    return result.unwrap().length
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    const result = await this.findBy({ sessionId: sessionId as any })
    if (result.isErr()) {
      throw result.unwrapErr()
    }

    const messages = result.unwrap()

    // Delete all messages for the session
    for (const message of messages) {
      await this.delete(message.id)
    }
  }
}
