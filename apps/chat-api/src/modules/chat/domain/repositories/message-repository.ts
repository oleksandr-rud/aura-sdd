/**
 * Message Repository Interface
 * Domain layer - defines contract for message persistence
 */

import { Repository, PaginatedRepository } from '@/shared/base-repository'
import { Message } from '../entities/message'

export interface MessageRepository extends Repository<Message>, PaginatedRepository<Message> {
  findBySessionId(sessionId: string, options?: { page: number; limit: number }): Promise<Message[]>
  findBySessionIdOrdered(sessionId: string, options?: { page: number; limit: number }): Promise<Message[]>
  findLatestBySessionId(sessionId: string, limit: number): Promise<Message[]>
  countBySessionId(sessionId: string): Promise<number>
  deleteBySessionId(sessionId: string): Promise<void>
}