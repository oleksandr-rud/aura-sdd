/**
 * Interaction Repository Interface
 * Domain layer - defines contract for interaction persistence
 */

import { Interaction } from '../entities/interaction'
import { PaginatedRepository, PaginationOptions, PaginatedResult } from '@/shared/base-repository'
import { Result } from '@/libs/utils'

export interface InteractionSearchParams {
  userId: string
  contactId?: string
  companyId?: string
  type?: string
  dateRange?: {
    from: Date
    to: Date
  }
  hasFollowUp?: boolean
  overdueFollowUp?: boolean
  query?: string
}

export interface InteractionTimeline {
  interaction: Interaction
  contactName?: string
  companyName?: string
}

export interface InteractionRepository extends PaginatedRepository<Interaction> {
  // Find operations
  findByContact(contactId: string, userId: string): Promise<Result<Interaction[], Error>>
  findByCompany(companyId: string, userId: string): Promise<Result<Interaction[], Error>>
  findByType(type: string, userId: string): Promise<Result<Interaction[], Error>>
  findByDateRange(from: Date, to: Date, userId: string): Promise<Result<Interaction[], Error>>
  findWithFollowUp(userId: string): Promise<Result<Interaction[], Error>>
  findOverdueFollowUp(userId: string): Promise<Result<Interaction[], Error>>

  // Search operations
  searchInteractions(params: InteractionSearchParams, options: PaginationOptions): Promise<Result<PaginatedResult<Interaction>, Error>>

  // Timeline operations
  getContactTimeline(contactId: string, userId: string, options?: PaginationOptions): Promise<Result<PaginatedResult<InteractionTimeline>, Error>>
  getCompanyTimeline(companyId: string, userId: string, options?: PaginationOptions): Promise<Result<PaginatedResult<InteractionTimeline>, Error>>
  getRecentInteractions(userId: string, limit?: number): Promise<Result<Interaction[], Error>>

  // Statistics operations
  countByType(userId: string): Promise<Result<Record<string, number>, Error>>
  countByContact(contactId: string, userId: string): Promise<Result<number, Error>>
  countByCompany(companyId: string, userId: string): Promise<Result<number, Error>>

  // Bulk operations
  bulkUpdateOutcome(interactionIds: string[], outcome: string, userId: string): Promise<Result<void, Error>>
  bulkSetFollowUp(interactionIds: string[], followUpDate: Date, userId: string): Promise<Result<void, Error>>
}