/**
 * Update Contact Use Case
 * Handles contact updates with validation and business rules
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { crmSchemas, validateAndExtract } from '@/libs/validation'
import { ContactRepository } from '../../domain/repositories/contact-repository'
import { CompanyRepository } from '../../domain/repositories/company-repository'
import { CRMService } from '../../domain/services/crm-service'

export interface UpdateContactRequest {
  id: string
  name?: string
  email?: string
  phone?: string
  company?: string
  tags?: string[]
  notes?: string
  userId: string
}

export interface UpdateContactResponse {
  contact: {
    id: string
    name: string
    email?: string
    phone?: string
    company?: string
    tags: string[]
    notes?: string
    updatedAt: Date
  }
}

export class UpdateContactUseCase extends UseCaseWithValidation<UpdateContactRequest, UpdateContactResponse> {
  constructor(
    private contactRepository: ContactRepository,
    private companyRepository: CompanyRepository,
    private crmService: CRMService
  ) {
    super()
  }

  validate(input: UpdateContactRequest): Result<UpdateContactRequest, Error> {
    // Validate against schema (all fields optional except id)
    const schemaValidation = validateAndExtract(crmSchemas.updateContact, {
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      tags: input.tags,
      notes: input.notes
    })

    if (schemaValidation.isErr()) {
      const errors = schemaValidation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return Result.err(new Error(errorMessage))
    }

    // Validate required fields
    if (!input.id || input.id.trim().length === 0) {
      return Result.err(new Error('Contact ID is required'))
    }

    if (!input.userId || input.userId.trim().length === 0) {
      return Result.err(new Error('User ID is required'))
    }

    return Result.ok(input)
  }

  protected async executeValidated(input: UpdateContactRequest): Promise<Result<UpdateContactResponse, Error>> {
    try {
      // Find existing contact
      const contactResult = await this.contactRepository.findById(input.id)
      if (contactResult.isErr()) {
        return Result.err(contactResult.unwrapErr())
      }

      const existingContact = contactResult.unwrap()
      if (!existingContact) {
        return Result.err(new Error('Contact not found'))
      }

      // Verify ownership
      if (existingContact.userId !== input.userId) {
        return Result.err(new Error('Access denied'))
      }

      let updatedContact = existingContact

      // Update name if provided
      if (input.name !== undefined) {
        const nameResult = updatedContact.updateName(input.name)
        if (nameResult.isErr()) {
          return Result.err(nameResult.unwrapErr())
        }
        updatedContact = nameResult.unwrap()
      }

      // Update email if provided
      if (input.email !== undefined) {
        // Check email uniqueness if changing email
        if (input.email && input.email !== existingContact.email) {
          const emailExists = await this.contactRepository.emailExists(
            input.email,
            input.userId,
            input.id
          )
          if (emailExists) {
            return Result.err(new Error('A contact with this email already exists'))
          }
        }

        const emailResult = updatedContact.updateEmail(input.email)
        if (emailResult.isErr()) {
          return Result.err(emailResult.unwrapErr())
        }
        updatedContact = emailResult.unwrap()
      }

      // Update phone if provided
      if (input.phone !== undefined) {
        const phoneResult = updatedContact.updatePhone(input.phone)
        if (phoneResult.isErr()) {
          return Result.err(phoneResult.unwrapErr())
        }
        updatedContact = phoneResult.unwrap()
      }

      // Handle company assignment
      if (input.company !== undefined) {
        if (input.company) {
          // Validate company exists and user has access
          const companyResult = await this.companyRepository.findById(input.company)
          if (companyResult.isErr()) {
            return Result.err(companyResult.unwrapErr())
          }
          const company = companyResult.unwrap()
          if (!company || company.userId !== input.userId) {
            return Result.err(new Error('Company not found or access denied'))
          }

          const assignResult = updatedContact.assignToCompany(company.id)
          if (assignResult.isErr()) {
            return Result.err(assignResult.unwrapErr())
          }
          updatedContact = assignResult.unwrap()
        } else {
          // Unassign from company
          updatedContact = updatedContact.unassignFromCompany()
        }
      }

      // Update notes if provided
      if (input.notes !== undefined) {
        updatedContact = updatedContact.updateNotes(input.notes)
      }

      // Handle tags (complete replacement)
      if (input.tags !== undefined) {
        // Clear existing tags
        const existingTags = [...updatedContact.tags]
        for (const tag of existingTags) {
          const removeResult = updatedContact.removeTag(tag)
          if (removeResult.isOk()) {
            updatedContact = removeResult.unwrap()
          }
        }

        // Add new tags
        for (const tag of input.tags) {
          const addResult = updatedContact.addTag(tag)
          if (addResult.isErr()) {
            return Result.err(addResult.unwrapErr())
          }
          updatedContact = addResult.unwrap()
        }
      }

      // Save updated contact
      const saveResult = await this.contactRepository.save(updatedContact)
      if (saveResult.isErr()) {
        return Result.err(saveResult.unwrapErr())
      }

      const savedContact = saveResult.unwrap()

      return Result.ok({
        contact: {
          id: savedContact.id,
          name: savedContact.name,
          email: savedContact.email,
          phone: savedContact.phone,
          company: savedContact.companyId,
          tags: savedContact.tags,
          notes: savedContact.notes,
          updatedAt: savedContact.updatedAt
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}