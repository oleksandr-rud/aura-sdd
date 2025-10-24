/**
 * Company Repository Interface
 * Domain layer - defines contract for company persistence
 */

import { Company } from '../entities/company'
import { PaginatedRepository, PaginationOptions, PaginatedResult } from '@/shared/base-repository'
import { Result } from '@/libs/utils'

export interface CompanySearchParams {
  userId: string
  query?: string
  industry?: string
  size?: string
  hasLocation?: boolean
  hasWebsite?: boolean
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface CompanyRepository extends PaginatedRepository<Company> {
  // Find operations
  findByName(name: string, userId: string): Promise<Result<Company | null, Error>>
  findByWebsite(website: string, userId: string): Promise<Result<Company | null, Error>>
  findByIndustry(industry: string, userId: string): Promise<Result<Company[], Error>>

  // Search operations
  searchCompanies(params: CompanySearchParams, options: PaginationOptions): Promise<Result<PaginatedResult<Company>, Error>>

  // Count operations
  countByUser(userId: string): Promise<Result<number, Error>>
  countByIndustry(industry: string, userId: string): Promise<Result<number, Error>>

  // Website uniqueness check
  websiteExists(website: string, userId: string, excludeId?: string): Promise<boolean>

  // Statistics operations
  getIndustryDistribution(userId: string): Promise<Result<Record<string, number>, Error>>
  getSizeDistribution(userId: string): Promise<Result<Record<string, number>, Error>>
}