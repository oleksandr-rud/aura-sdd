/**
 * Contact Repository Interface
 * Domain layer - defines contract for contact persistence
 */

import { Contact } from '../entities/contact'
import { PaginatedRepository, PaginationOptions, PaginatedResult } from '@/shared/base-repository'
import { Result } from '@/libs/utils'

export interface ContactSearchParams {
  userId: string
  query?: string
  tags?: string[]
  companyId?: string
  hasEmail?: boolean
  hasPhone?: boolean
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface ContactRepository extends PaginatedRepository<Contact> {
  // Find operations
  findByEmail(email: string, userId: string): Promise<Result<Contact | null, Error>>
  findByPhone(phone: string, userId: string): Promise<Result<Contact | null, Error>>
  findByCompany(companyId: string, userId: string): Promise<Result<Contact[], Error>>
  findByTags(tags: string[], userId: string): Promise<Result<Contact[], Error>>

  // Search operations
  searchContacts(params: ContactSearchParams, options: PaginationOptions): Promise<Result<PaginatedResult<Contact>, Error>>

  // Count operations
  countByUser(userId: string): Promise<Result<number, Error>>
  countByCompany(companyId: string, userId: string): Promise<Result<number, Error>>

  // Email uniqueness check
  emailExists(email: string, userId: string, excludeId?: string): Promise<boolean>

  // Bulk operations
  bulkUpdateTags(contactIds: string[], tags: string[], userId: string): Promise<Result<void, Error>>
  bulkAssignToCompany(contactIds: string[], companyId: string, userId: string): Promise<Result<void, Error>>
}