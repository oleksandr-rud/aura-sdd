/**
 * Company Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { BaseEntity } from '@/shared/base-entity'
import { Result } from '@/libs/utils'

export interface CompanyAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

export interface CompanyProps {
  name: string
  website?: string
  phone?: string
  address?: CompanyAddress
  industry?: string
  description?: string
  size?: string // e.g., "1-10", "11-50", "51-200", etc.
  revenue?: string
  customFields?: Record<string, any>
  userId: string // Owner user
}

export class Company extends BaseEntity {
  constructor(
    public readonly props: CompanyProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id ?? BaseEntity.generateId(),
      createdAt ?? new Date(),
      updatedAt ?? new Date()
    )
  }

  get name(): string {
    return this.props.name
  }

  get website(): string | undefined {
    return this.props.website
  }

  get phone(): string | undefined {
    return this.props.phone
  }

  get address(): CompanyAddress | undefined {
    return this.props.address ? { ...this.props.address } : undefined
  }

  get industry(): string | undefined {
    return this.props.industry
  }

  get description(): string | undefined {
    return this.props.description
  }

  get size(): string | undefined {
    return this.props.size
  }

  get revenue(): string | undefined {
    return this.props.revenue
  }

  get customFields(): Record<string, any> | undefined {
    return this.props.customFields ? { ...this.props.customFields } : undefined
  }

  get userId(): string {
    return this.props.userId
  }

  // Domain behaviors
  updateName(name: string): Result<Company, Error> {
    if (!name || name.trim().length < 2) {
      return Result.err(new Error('Company name must be at least 2 characters long'))
    }

    const updatedCompany = new Company(
      {
        ...this.props,
        name: name.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedCompany)
  }

  updateWebsite(website: string): Result<Company, Error> {
    if (website && !this.isValidUrl(website)) {
      return Result.err(new Error('Invalid website URL format'))
    }

    const updatedCompany = new Company(
      {
        ...this.props,
        website: website?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedCompany)
  }

  updatePhone(phone: string): Result<Company, Error> {
    if (phone && !this.isValidPhone(phone)) {
      return Result.err(new Error('Invalid phone number format'))
    }

    const updatedCompany = new Company(
      {
        ...this.props,
        phone: phone?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedCompany)
  }

  updateAddress(address: CompanyAddress): Company {
    return new Company(
      {
        ...this.props,
        address: { ...address }
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateIndustry(industry: string): Company {
    return new Company(
      {
        ...this.props,
        industry: industry?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateDescription(description: string): Company {
    return new Company(
      {
        ...this.props,
        description: description?.trim() || undefined
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateSize(size: string): Company {
    return new Company(
      {
        ...this.props,
        size: size?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateRevenue(revenue: string): Company {
    return new Company(
      {
        ...this.props,
        revenue: revenue?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateCustomFields(fields: Record<string, any>): Company {
    return new Company(
      {
        ...this.props,
        customFields: { ...this.props.customFields, ...fields }
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  getFullAddress(): string {
    if (!this.props.address) return ''

    const parts = [
      this.props.address.street,
      this.props.address.city,
      this.props.address.state,
      this.props.address.zip,
      this.props.address.country
    ].filter(Boolean)

    return parts.join(', ')
  }

  hasLocation(): boolean {
    return !!(this.props.address?.city || this.props.address?.country)
  }

  matchesSearch(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return true

    return (
      this.props.name.toLowerCase().includes(normalizedQuery) ||
      (this.props.website?.toLowerCase().includes(normalizedQuery) ?? false) ||
      (this.props.phone?.includes(normalizedQuery) ?? false) ||
      (this.props.industry?.toLowerCase().includes(normalizedQuery) ?? false) ||
      (this.props.description?.toLowerCase().includes(normalizedQuery) ?? false) ||
      this.getFullAddress().toLowerCase().includes(normalizedQuery)
    )
  }

  // Private validation methods
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]+$/
    return phoneRegex.test(phone)
  }

  // Factory method
  static create(props: CompanyProps): Company {
    return new Company(props)
  }

  // Static method for creating from existing data
  static fromExisting(
    props: CompanyProps,
    id: string,
    createdAt: Date,
    updatedAt: Date
  ): Company {
    return new Company(props, id, createdAt, updatedAt)
  }
}