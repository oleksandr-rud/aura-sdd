/**
 * Contact Repository Implementation
 * Infrastructure layer - concrete implementation of ContactRepository interface
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { ContactRepository, ContactSearchParams } from '../../../domain/repositories/contact-repository'
import { Contact } from '../../../domain/entities/contact'
import { Result, PaginatedResult } from '@/libs/utils'

export class ContactRepositoryImpl extends MemoryPaginatedRepository<Contact> implements ContactRepository {

  async findByEmail(email: string, userId: string): Promise<Result<Contact | null, Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      const contact = allContactsResult.unwrap().find(c =>
        c.email?.toLowerCase() === email.toLowerCase() &&
        c.userId === userId
      )

      return Result.ok(contact || null)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByPhone(phone: string, userId: string): Promise<Result<Contact | null, Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      const contact = allContactsResult.unwrap().find(c =>
        c.phone === phone &&
        c.userId === userId
      )

      return Result.ok(contact || null)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByCompany(companyId: string, userId: string): Promise<Result<Contact[], Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      const contacts = allContactsResult.unwrap().filter(c =>
        c.companyId === companyId &&
        c.userId === userId
      )

      return Result.ok(contacts)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByTags(tags: string[], userId: string): Promise<Result<Contact[], Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      const normalizedTags = tags.map(tag => tag.toLowerCase())
      const contacts = allContactsResult.unwrap().filter(c =>
        c.userId === userId &&
        normalizedTags.some(tag => c.tags.includes(tag))
      )

      return Result.ok(contacts)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async searchContacts(
    params: ContactSearchParams,
    options: { page: number; limit: number }
  ): Promise<Result<PaginatedResult<Contact>, Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      let filteredContacts = allContactsResult.unwrap().filter(c => c.userId === params.userId)

      // Apply filters
      if (params.query) {
        const query = params.query.toLowerCase()
        filteredContacts = filteredContacts.filter(c => c.matchesSearch(query))
      }

      if (params.tags && params.tags.length > 0) {
        const normalizedTags = params.tags.map(tag => tag.toLowerCase())
        filteredContacts = filteredContacts.filter(c =>
          normalizedTags.some(tag => c.tags.includes(tag))
        )
      }

      if (params.companyId) {
        filteredContacts = filteredContacts.filter(c => c.companyId === params.companyId)
      }

      if (params.hasEmail !== undefined) {
        filteredContacts = filteredContacts.filter(c => !!c.email === params.hasEmail)
      }

      if (params.hasPhone !== undefined) {
        filteredContacts = filteredContacts.filter(c => !!c.phone === params.hasPhone)
      }

      if (params.dateRange) {
        filteredContacts = filteredContacts.filter(c =>
          c.createdAt >= params.dateRange!.from &&
          c.createdAt <= params.dateRange!.to
        )
      }

      // Sort by creation date (newest first)
      filteredContacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      // Apply pagination
      const startIndex = (options.page - 1) * options.limit
      const endIndex = startIndex + options.limit
      const paginatedContacts = filteredContacts.slice(startIndex, endIndex)

      const paginatedResult: PaginatedResult<Contact> = {
        items: paginatedContacts,
        total: filteredContacts.length,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(filteredContacts.length / options.limit)
      }

      return Result.ok(paginatedResult)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByUser(userId: string): Promise<Result<number, Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      const count = allContactsResult.unwrap().filter(c => c.userId === userId).length
      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByCompany(companyId: string, userId: string): Promise<Result<number, Error>> {
    try {
      const allContactsResult = await this.findAll()
      if (allContactsResult.isErr()) {
        return Result.err(allContactsResult.unwrapErr())
      }

      const count = allContactsResult.unwrap().filter(c =>
        c.companyId === companyId &&
        c.userId === userId
      ).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async emailExists(email: string, userId: string, excludeId?: string): Promise<boolean> {
    try {
      const result = await this.findByEmail(email, userId)
      if (result.isErr()) {
        return false
      }

      const contact = result.unwrap()
      return contact !== null && contact.id !== excludeId
    } catch {
      return false
    }
  }

  async bulkUpdateTags(contactIds: string[], tags: string[], userId: string): Promise<Result<void, Error>> {
    try {
      const normalizedTags = tags.map(tag => tag.toLowerCase())

      for (const contactId of contactIds) {
        const contactResult = await this.findById(contactId)
        if (contactResult.isErr()) {
          return Result.err(contactResult.unwrapErr())
        }

        const contact = contactResult.unwrap()
        if (!contact || contact.userId !== userId) {
          continue // Skip if not found or access denied
        }

        // Clear existing tags and add new ones
        let updatedContact = contact
        const existingTags = [...contact.tags]
        for (const tag of existingTags) {
          const removeResult = updatedContact.removeTag(tag)
          if (removeResult.isOk()) {
            updatedContact = removeResult.unwrap()
          }
        }

        for (const tag of normalizedTags) {
          const addResult = updatedContact.addTag(tag)
          if (addResult.isOk()) {
            updatedContact = addResult.unwrap()
          }
        }

        await this.save(updatedContact)
      }

      return Result.ok(undefined)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async bulkAssignToCompany(contactIds: string[], companyId: string, userId: string): Promise<Result<void, Error>> {
    try {
      for (const contactId of contactIds) {
        const contactResult = await this.findById(contactId)
        if (contactResult.isErr()) {
          return Result.err(contactResult.unwrapErr())
        }

        const contact = contactResult.unwrap()
        if (!contact || contact.userId !== userId) {
          continue // Skip if not found or access denied
        }

        const assignResult = contact.assignToCompany(companyId)
        if (assignResult.isErr()) {
          return Result.err(assignResult.unwrapErr())
        }

        await this.save(assignResult.unwrap())
      }

      return Result.ok(undefined)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Enhanced save method to handle contact-specific validation
  async save(entity: Contact): Promise<Result<Contact, Error>> {
    try {
      // Check for email uniqueness on create
      if (entity.email) {
        const emailExists = await this.emailExists(entity.email, entity.userId, entity.id)
        if (emailExists) {
          return Result.err(new Error('Email already exists'))
        }
      }

      // Use parent save method
      return await super.save(entity)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}