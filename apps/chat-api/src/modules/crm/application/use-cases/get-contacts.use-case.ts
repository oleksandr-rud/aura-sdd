/**
 * Get Contacts Use Case
 * Handles contact retrieval with pagination, filtering, and search
 */

import { UseCase } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { ContactRepository, ContactSearchParams } from '../../domain/repositories/contact-repository'
import { PaginationOptions } from '@/shared/base-repository'

export interface GetContactsRequest {
  userId: string
  page?: number
  limit?: number
  query?: string
  tags?: string[]
  companyId?: string
  hasEmail?: boolean
  hasPhone?: boolean
  dateRange?: {
    from: string
    to: string
  }
}

export interface GetContactsResponse {
  contacts: Array<{
    id: string
    name: string
    email?: string
    phone?: string
    companyId?: string
    tags: string[]
    notes?: string
    createdAt: Date
    updatedAt: Date
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class GetContactsUseCase extends UseCase<GetContactsRequest, GetContactsResponse> {
  constructor(
    private contactRepository: ContactRepository
  ) {
    super()
  }

  async execute(input: GetContactsRequest): Promise<Result<GetContactsResponse, Error>> {
    try {
      // Validate required fields
      if (!input.userId || input.userId.trim().length === 0) {
        return Result.err(new Error('User ID is required'))
      }

      // Build search parameters
      const searchParams: ContactSearchParams = {
        userId: input.userId
      }

      if (input.query) {
        searchParams.query = input.query.trim()
      }

      if (input.tags && input.tags.length > 0) {
        searchParams.tags = input.tags.map(tag => tag.trim().toLowerCase())
      }

      if (input.companyId) {
        searchParams.companyId = input.companyId.trim()
      }

      if (input.hasEmail !== undefined) {
        searchParams.hasEmail = input.hasEmail
      }

      if (input.hasPhone !== undefined) {
        searchParams.hasPhone = input.hasPhone
      }

      if (input.dateRange) {
        const fromDate = new Date(input.dateRange.from)
        const toDate = new Date(input.dateRange.to)

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return Result.err(new Error('Invalid date range format'))
        }

        if (fromDate > toDate) {
          return Result.err(new Error('Start date must be before end date'))
        }

        searchParams.dateRange = {
          from: fromDate,
          to: toDate
        }
      }

      // Build pagination options
      const paginationOptions: PaginationOptions = {
        page: Math.max(1, input.page || 1),
        limit: Math.min(100, Math.max(1, input.limit || 20))
      }

      // Search contacts
      const searchResult = await this.contactRepository.searchContacts(
        searchParams,
        paginationOptions
      )

      if (searchResult.isErr()) {
        return Result.err(searchResult.unwrapErr())
      }

      const paginatedContacts = searchResult.unwrap()

      // Transform contacts to response format
      const contacts = paginatedContacts.items.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        companyId: contact.companyId,
        tags: contact.tags,
        notes: contact.notes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }))

      return Result.ok({
        contacts,
        pagination: {
          page: paginatedContacts.page,
          limit: paginatedContacts.limit,
          total: paginatedContacts.total,
          totalPages: paginatedContacts.totalPages
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}