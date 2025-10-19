/**
 * Create Contact Use Case
 * Handles contact creation with validation and duplicate detection
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { crmSchemas, validateAndExtract } from '@/libs/validation'
import { ContactRepository } from '../../domain/repositories/contact-repository'
import { CompanyRepository } from '../../domain/repositories/company-repository'
import { CRMService } from '../../domain/services/crm-service'
import { Contact } from '../../domain/entities/contact'

export interface CreateContactRequest {
  name: string
  email?: string
  phone?: string
  company?: string
  tags?: string[]
  notes?: string
  userId: string
}

export interface CreateContactResponse {
  contact: {
    id: string
    name: string
    email?: string
    phone?: string
    company?: string
    tags: string[]
    notes?: string
    createdAt: Date
  }
  duplicates?: {
    exactMatches: Array<{
      id: string
      name: string
      email?: string
      phone?: string
    }>
    potentialMatches: Array<{
      id: string
      name: string
      email?: string
      phone?: string
      matchScore: number
      matchFields: string[]
    }>
  }
}

export class CreateContactUseCase extends UseCaseWithValidation<CreateContactRequest, CreateContactResponse> {
  constructor(
    private contactRepository: ContactRepository,
    private companyRepository: CompanyRepository,
    private crmService: CRMService
  ) {
    super()
  }

  validate(input: CreateContactRequest): Result<CreateContactRequest, Error> {
    // Validate against schema
    const schemaValidation = validateAndExtract(crmSchemas.createContact, {
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

    // Validate userId
    if (!input.userId || input.userId.trim().length === 0) {
      return Result.err(new Error('User ID is required'))
    }

    return Result.ok(input)
  }

  protected async executeValidated(input: CreateContactRequest): Promise<Result<CreateContactResponse, Error>> {
    try {
      const normalizedEmail = input.email?.toLowerCase().trim()
      const normalizedPhone = input.phone?.trim()

      // Check email uniqueness if provided
      if (normalizedEmail) {
        const emailExists = await this.contactRepository.emailExists(
          normalizedEmail,
          input.userId
        )
        if (emailExists) {
          return Result.err(new Error('A contact with this email already exists'))
        }
      }

      // Validate company exists if provided
      let companyId: string | undefined
      if (input.company) {
        const companyResult = await this.companyRepository.findById(input.company)
        if (companyResult.isErr()) {
          return Result.err(companyResult.unwrapErr())
        }
        const company = companyResult.unwrap()
        if (!company || company.userId !== input.userId) {
          return Result.err(new Error('Company not found or access denied'))
        }
        companyId = company.id
      }

      // Create contact
      const newContact = Contact.create({
        name: input.name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        companyId,
        tags: input.tags?.map(tag => tag.trim().toLowerCase()) || [],
        notes: input.notes?.trim(),
        userId: input.userId
      })

      // Check for duplicates before saving
      const existingContacts = await this.contactRepository.findBy({ userId: input.userId })
      if (existingContacts.isErr()) {
        return Result.err(existingContacts.unwrapErr())
      }

      const duplicateResult = await this.crmService.detectDuplicates(
        newContact,
        existingContacts.unwrap()
      )

      let duplicates: CreateContactResponse['duplicates'] | undefined

      if (duplicateResult.isOk() && duplicateResult.unwrap().isDuplicate) {
        const duplicateData = duplicateResult.unwrap()

        // Don't save if we found exact duplicates
        if (duplicateData.duplicateMatches.length > 0) {
          return Result.ok({
            contact: {
              id: newContact.id,
              name: newContact.name,
              email: newContact.email,
              phone: newContact.phone,
              company: input.company,
              tags: newContact.tags,
              notes: newContact.notes,
              createdAt: newContact.createdAt
            },
            duplicates: {
              exactMatches: duplicateData.duplicateMatches.map(match => ({
                id: match.contact.id,
                name: match.contact.name,
                email: match.contact.email,
                phone: match.contact.phone
              })),
              potentialMatches: duplicateData.potentialDuplicates.map(match => ({
                id: match.contact.id,
                name: match.contact.name,
                email: match.contact.email,
                phone: match.contact.phone,
                matchScore: match.matchScore,
                matchFields: match.matchFields
              }))
            }
          })
        }

        // If only potential duplicates, show them but still save
        duplicates = {
          exactMatches: [],
          potentialMatches: duplicateData.potentialDuplicates.map(match => ({
            id: match.contact.id,
            name: match.contact.name,
            email: match.contact.email,
            phone: match.contact.phone,
            matchScore: match.matchScore,
            matchFields: match.matchFields
          }))
        }
      }

      // Save contact
      const saveResult = await this.contactRepository.save(newContact)
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
          company: input.company,
          tags: savedContact.tags,
          notes: savedContact.notes,
          createdAt: savedContact.createdAt
        },
        duplicates
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}