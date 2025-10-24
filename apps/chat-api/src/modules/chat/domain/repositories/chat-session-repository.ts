/**
 * Chat Session Repository Interface
 * Domain layer - defines contract for chat session persistence
 */

import { Repository, PaginatedRepository } from '@/shared/base-repository'
import { ChatSession } from '../entities/chat-session'

export interface ChatSessionRepository extends Repository<ChatSession>, PaginatedRepository<ChatSession> {
  findByUserId(userId: string, options?: { page: number; limit: number }): Promise<ChatSession[]>
  findActiveByUserId(userId: string): Promise<ChatSession[]>
  findByUserIdAndTitle(userId: string, title: string): Promise<ChatSession | null>
  countByUserId(userId: string): Promise<number>
}