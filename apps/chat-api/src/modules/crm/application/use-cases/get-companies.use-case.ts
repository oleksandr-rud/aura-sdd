/**
 * Get Companies Use Case
 * Handles company retrieval with pagination, filtering, and search
 */

import { UseCase } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { CompanyRepository, CompanySearchParams } from '../../domain/repositories/company-repository'
import { PaginationOptions } from '@/shared/base-repository'

export interface GetCompaniesRequest {
  userId: string
  page?: number
  limit?: number
  query?: string
  industry?: string
  size?: string
  hasLocation?: boolean
  hasWebsite?: boolean
  dateRange?: {
    from: string
    to: string
  }
}

export interface GetCompaniesResponse {
  companies: Array<{
    id: string
    name: string
    website?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zip?: string
      country?: string
    }
    industry?: string
    description?: string
    size?: string
    revenue?: string
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

export class GetCompaniesUseCase extends UseCase<GetCompaniesRequest, GetCompaniesResponse> {
  constructor(
    private companyRepository: CompanyRepository
  ) {
    super()
  }

  async execute(input: GetCompaniesRequest): Promise<Result<GetCompaniesResponse, Error>> {
    try {
      // Validate required fields
      if (!input.userId || input.userId.trim().length === 0) {
        return Result.err(new Error('User ID is required'))
      }

      // Build search parameters
      const searchParams: CompanySearchParams = {
        userId: input.userId
      }

      if (input.query) {
        searchParams.query = input.query.trim()
      }

      if (input.industry) {
        searchParams.industry = input.industry.trim()
      }

      if (input.size) {
        searchParams.size = input.size.trim()
      }

      if (input.hasLocation !== undefined) {
        searchParams.hasLocation = input.hasLocation
      }

      if (input.hasWebsite !== undefined) {
        searchParams.hasWebsite = input.hasWebsite
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

      // Search companies
      const searchResult = await this.companyRepository.searchCompanies(
        searchParams,
        paginationOptions
      )

      if (searchResult.isErr()) {
        return Result.err(searchResult.unwrapErr())
      }

      const paginatedCompanies = searchResult.unwrap()

      // Transform companies to response format
      const companies = paginatedCompanies.items.map(company => ({
        id: company.id,
        name: company.name,
        website: company.website,
        phone: company.phone,
        address: company.address,
        industry: company.industry,
        description: company.description,
        size: company.size,
        revenue: company.revenue,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }))

      return Result.ok({
        companies,
        pagination: {
          page: paginatedCompanies.page,
          limit: paginatedCompanies.limit,
          total: paginatedCompanies.total,
          totalPages: paginatedCompanies.totalPages
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}