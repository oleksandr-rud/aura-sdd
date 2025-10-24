/**
 * Company Repository Implementation
 * Infrastructure layer - concrete implementation of CompanyRepository interface
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { CompanyRepository, CompanySearchParams } from '../../../domain/repositories/company-repository'
import { Company } from '../../../domain/entities/company'
import { Result, PaginatedResult } from '@/libs/utils'

export class CompanyRepositoryImpl extends MemoryPaginatedRepository<Company> implements CompanyRepository {

  async findByName(name: string, userId: string): Promise<Result<Company | null, Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const company = allCompaniesResult.unwrap().find(c =>
        c.name.toLowerCase() === name.toLowerCase() &&
        c.userId === userId
      )

      return Result.ok(company || null)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByWebsite(website: string, userId: string): Promise<Result<Company | null, Error>> {
    try {
      const normalizedWebsite = website.toLowerCase().replace(/^https?:\/\//, '')
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const company = allCompaniesResult.unwrap().find(c => {
        if (!c.website) return false
        const companyWebsite = c.website.toLowerCase().replace(/^https?:\/\//, '')
        return companyWebsite === normalizedWebsite && c.userId === userId
      })

      return Result.ok(company || null)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByIndustry(industry: string, userId: string): Promise<Result<Company[], Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const companies = allCompaniesResult.unwrap().filter(c =>
        c.industry?.toLowerCase() === industry.toLowerCase() &&
        c.userId === userId
      )

      return Result.ok(companies)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async searchCompanies(
    params: CompanySearchParams,
    options: { page: number; limit: number }
  ): Promise<Result<PaginatedResult<Company>, Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      let filteredCompanies = allCompaniesResult.unwrap().filter(c => c.userId === params.userId)

      // Apply filters
      if (params.query) {
        const query = params.query.toLowerCase()
        filteredCompanies = filteredCompanies.filter(c => c.matchesSearch(query))
      }

      if (params.industry) {
        const industry = params.industry.toLowerCase()
        filteredCompanies = filteredCompanies.filter(c =>
          c.industry?.toLowerCase() === industry
        )
      }

      if (params.size) {
        const size = params.size.toLowerCase()
        filteredCompanies = filteredCompanies.filter(c =>
          c.size?.toLowerCase() === size
        )
      }

      if (params.hasLocation !== undefined) {
        filteredCompanies = filteredCompanies.filter(c => c.hasLocation() === params.hasLocation)
      }

      if (params.hasWebsite !== undefined) {
        filteredCompanies = filteredCompanies.filter(c => !!c.website === params.hasWebsite)
      }

      if (params.dateRange) {
        filteredCompanies = filteredCompanies.filter(c =>
          c.createdAt >= params.dateRange!.from &&
          c.createdAt <= params.dateRange!.to
        )
      }

      // Sort by creation date (newest first)
      filteredCompanies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      // Apply pagination
      const startIndex = (options.page - 1) * options.limit
      const endIndex = startIndex + options.limit
      const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

      const paginatedResult: PaginatedResult<Company> = {
        items: paginatedCompanies,
        total: filteredCompanies.length,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(filteredCompanies.length / options.limit)
      }

      return Result.ok(paginatedResult)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByUser(userId: string): Promise<Result<number, Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const count = allCompaniesResult.unwrap().filter(c => c.userId === userId).length
      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByIndustry(industry: string, userId: string): Promise<Result<number, Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const count = allCompaniesResult.unwrap().filter(c =>
        c.industry?.toLowerCase() === industry.toLowerCase() &&
        c.userId === userId
      ).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async websiteExists(website: string, userId: string, excludeId?: string): Promise<boolean> {
    try {
      if (!website) return false

      const result = await this.findByWebsite(website, userId)
      if (result.isErr()) {
        return false
      }

      const company = result.unwrap()
      return company !== null && company.id !== excludeId
    } catch {
      return false
    }
  }

  async getIndustryDistribution(userId: string): Promise<Result<Record<string, number>, Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const companies = allCompaniesResult.unwrap().filter(c => c.userId === userId)
      const distribution: Record<string, number> = {}

      companies.forEach(company => {
        const industry = company.industry || 'Unknown'
        distribution[industry] = (distribution[industry] || 0) + 1
      })

      return Result.ok(distribution)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getSizeDistribution(userId: string): Promise<Result<Record<string, number>, Error>> {
    try {
      const allCompaniesResult = await this.findAll()
      if (allCompaniesResult.isErr()) {
        return Result.err(allCompaniesResult.unwrapErr())
      }

      const companies = allCompaniesResult.unwrap().filter(c => c.userId === userId)
      const distribution: Record<string, number> = {}

      companies.forEach(company => {
        const size = company.size || 'Unknown'
        distribution[size] = (distribution[size] || 0) + 1
      })

      return Result.ok(distribution)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Enhanced save method to handle company-specific validation
  async save(entity: Company): Promise<Result<Company, Error>> {
    try {
      // Check for website uniqueness on create
      if (entity.website) {
        const websiteExists = await this.websiteExists(entity.website, entity.userId, entity.id)
        if (websiteExists) {
          return Result.err(new Error('Website already exists'))
        }
      }

      // Use parent save method
      return await super.save(entity)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}