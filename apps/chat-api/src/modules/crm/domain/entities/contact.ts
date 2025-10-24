/**
 * Contact Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { BaseEntity } from '@/shared/base-entity'
import { Result } from '@/libs/utils'

export interface ContactProps {
  name: string
  email?: string
  phone?: string
  companyId?: string
  tags: string[]
  notes?: string
  customFields?: Record<string, any>
  userId: string // Owner user
}

export class Contact extends BaseEntity {
  constructor(
    public readonly props: ContactProps,
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

  get email(): string | undefined {
    return this.props.email
  }

  get phone(): string | undefined {
    return this.props.phone
  }

  get companyId(): string | undefined {
    return this.props.companyId
  }

  get tags(): string[] {
    return [...this.props.tags]
  }

  get notes(): string | undefined {
    return this.props.notes
  }

  get customFields(): Record<string, any> | undefined {
    return this.props.customFields ? { ...this.props.customFields } : undefined
  }

  get userId(): string {
    return this.props.userId
  }

  // Domain behaviors
  updateName(name: string): Result<Contact, Error> {
    if (!name || name.trim().length < 2) {
      return Result.err(new Error('Name must be at least 2 characters long'))
    }

    const updatedContact = new Contact(
      {
        ...this.props,
        name: name.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedContact)
  }

  updateEmail(email: string): Result<Contact, Error> {
    if (email && !this.isValidEmail(email)) {
      return Result.err(new Error('Invalid email format'))
    }

    const updatedContact = new Contact(
      {
        ...this.props,
        email: email?.toLowerCase().trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedContact)
  }

  updatePhone(phone: string): Result<Contact, Error> {
    if (phone && !this.isValidPhone(phone)) {
      return Result.err(new Error('Invalid phone number format'))
    }

    const updatedContact = new Contact(
      {
        ...this.props,
        phone: phone?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedContact)
  }

  assignToCompany(companyId: string): Result<Contact, Error> {
    if (!companyId || companyId.trim().length === 0) {
      return Result.err(new Error('Company ID is required'))
    }

    const updatedContact = new Contact(
      {
        ...this.props,
        companyId: companyId.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedContact)
  }

  unassignFromCompany(): Contact {
    return new Contact(
      {
        ...this.props,
        companyId: undefined
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  addTag(tag: string): Result<Contact, Error> {
    if (!tag || tag.trim().length === 0) {
      return Result.err(new Error('Tag cannot be empty'))
    }

    const normalizedTag = tag.trim().toLowerCase()
    if (this.props.tags.includes(normalizedTag)) {
      return Result.err(new Error('Tag already exists'))
    }

    const updatedContact = new Contact(
      {
        ...this.props,
        tags: [...this.props.tags, normalizedTag]
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedContact)
  }

  removeTag(tag: string): Result<Contact, Error> {
    const normalizedTag = tag.trim().toLowerCase()
    if (!this.props.tags.includes(normalizedTag)) {
      return Result.err(new Error('Tag does not exist'))
    }

    const updatedContact = new Contact(
      {
        ...this.props,
        tags: this.props.tags.filter(t => t !== normalizedTag)
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedContact)
  }

  updateNotes(notes: string): Contact {
    return new Contact(
      {
        ...this.props,
        notes: notes?.trim() || undefined
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateCustomFields(fields: Record<string, any>): Contact {
    return new Contact(
      {
        ...this.props,
        customFields: { ...this.props.customFields, ...fields }
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  hasTag(tag: string): boolean {
    return this.props.tags.includes(tag.trim().toLowerCase())
  }

  matchesSearch(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return true

    return (
      this.props.name.toLowerCase().includes(normalizedQuery) ||
      (this.props.email?.toLowerCase().includes(normalizedQuery) ?? false) ||
      (this.props.phone?.includes(normalizedQuery) ?? false) ||
      (this.props.notes?.toLowerCase().includes(normalizedQuery) ?? false) ||
      this.props.tags.some(tag => tag.includes(normalizedQuery))
    )
  }

  // Private validation methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]+$/
    return phoneRegex.test(phone)
  }

  // Factory method
  static create(props: Omit<ContactProps, 'tags'> & { tags?: string[] }): Contact {
    return new Contact({
      ...props,
      tags: props.tags?.map(tag => tag.trim().toLowerCase()) || []
    })
  }

  // Static method for creating from existing data
  static fromExisting(
    props: ContactProps,
    id: string,
    createdAt: Date,
    updatedAt: Date
  ): Contact {
    return new Contact(props, id, createdAt, updatedAt)
  }
}