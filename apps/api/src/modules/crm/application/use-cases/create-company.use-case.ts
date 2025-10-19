/**
 * Create Company Use Case
 * Handles company creation with validation
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { crmSchemas, validateAndExtract } from '@/libs/validation'
import { CompanyRepository } from '../../domain/repositories/company-repository'
import { Company } from '../../domain/entities/company'

export interface CreateCompanyRequest {
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
  userId: string
}

export interface CreateCompanyResponse {
  company: {
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
  }
}

export class CreateCompanyUseCase extends UseCaseWithValidation<CreateCompanyRequest, CreateCompanyResponse> {
  constructor(
    private companyRepository: CompanyRepository
  ) {
    super()
  }

  validate(input: CreateCompanyRequest): Result<CreateCompanyRequest, Error> {
    // Validate against schema
    const schemaValidation = validateAndExtract(crmSchemas.createCompany, {
      name: input.name,
      website: input.website,
      phone: input.phone,
      address: input.address ? JSON.stringify(input.address) : undefined,
      industry: input.industry
    })

    if (schemaValidation.isErr()) {
      const errors = schemaValidation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return Result.err(new Error(errorMessage))
    }

    // Validate userId
    if (!input.userId || input.userId.trim().length === 0) {
      return Result.err(new Error('User ID is required'))
    }

    // Additional validation for address fields if provided
    if (input.address) {
      const { street, city, state, zip, country } = input.address
      if (!street && !city && !state && !zip && !country) {
        return Result.err(new Error('At least one address field must be provided'))
      }
    }

    return Result.ok(input)
  }

  protected async executeValidated(input: CreateCompanyRequest): Promise<Result<CreateCompanyResponse, Error>> {
    try {
      // Normalize website URL if provided
      let normalizedWebsite = input.website?.trim()
      if (normalizedWebsite && !normalizedWebsite.startsWith('http')) {
        normalizedWebsite = `https://${normalizedWebsite}`
      }

      // Check website uniqueness if provided
      if (normalizedWebsite) {
        const websiteExists = await this.companyRepository.websiteExists(
          normalizedWebsite,
          input.userId
        )
        if (websiteExists) {
          return Result.err(new Error('A company with this website already exists'))
        }
      }

      // Create company
      const newCompany = Company.create({
        name: input.name.trim(),
        website: normalizedWebsite,
        phone: input.phone?.trim(),
        address: input.address,
        industry: input.industry?.trim(),
        description: input.description?.trim(),
        size: input.size?.trim(),
        revenue: input.revenue?.trim(),
        userId: input.userId
      })

      // Save company
      const saveResult = await this.companyRepository.save(newCompany)
      if (saveResult.isErr()) {
        return Result.err(saveResult.unwrapErr())
      }

      const savedCompany = saveResult.unwrap()

      return Result.ok({
        company: {
          id: savedCompany.id,
          name: savedCompany.name,
          website: savedCompany.website,
          phone: savedCompany.phone,
          address: savedCompany.address,
          industry: savedCompany.industry,
          description: savedCompany.description,
          size: savedCompany.size,
          revenue: savedCompany.revenue,
          createdAt: savedCompany.createdAt
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}