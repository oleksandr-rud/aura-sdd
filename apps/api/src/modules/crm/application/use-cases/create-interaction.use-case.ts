/**
 * Create Interaction Use Case
 * Handles interaction creation with validation and business rules
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { crmSchemas, validateAndExtract } from '@/libs/validation'
import { InteractionRepository } from '../../domain/repositories/interaction-repository'
import { ContactRepository } from '../../domain/repositories/contact-repository'
import { CompanyRepository } from '../../domain/repositories/company-repository'
import { Interaction } from '../../domain/entities/interaction'

export interface CreateInteractionRequest {
  contactId: string
  companyId?: string
  type: 'call' | 'email' | 'meeting' | 'note'
  subject: string
  content: string
  date?: string
  duration?: number
  outcome?: string
  followUpDate?: string
  userId: string
}

export interface CreateInteractionResponse {
  interaction: {
    id: string
    contactId: string
    companyId?: string
    type: string
    subject: string
    content: string
    date: Date
    duration?: number
    outcome?: string
    followUpDate?: Date
    createdAt: Date
  }
}

export class CreateInteractionUseCase extends UseCaseWithValidation<CreateInteractionRequest, CreateInteractionResponse> {
  constructor(
    private interactionRepository: InteractionRepository,
    private contactRepository: ContactRepository,
    private companyRepository: CompanyRepository
  ) {
    super()
  }

  validate(input: CreateInteractionRequest): Result<CreateInteractionRequest, Error> {
    // Validate against schema
    const schemaValidation = validateAndExtract(crmSchemas.createInteraction, {
      contactId: input.contactId,
      type: input.type,
      subject: input.subject,
      content: input.content,
      date: input.date
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

    // Validate interaction type
    if (!Interaction.isValidType(input.type)) {
      return Result.err(new Error('Invalid interaction type'))
    }

    // Validate duration if provided
    if (input.duration !== undefined && (input.duration < 0 || input.duration > 24 * 60)) {
      return Result.err(new Error('Duration must be between 0 and 1440 minutes'))
    }

    // Validate follow-up date if provided
    if (input.followUpDate) {
      const followUpDate = new Date(input.followUpDate)
      if (isNaN(followUpDate.getTime())) {
        return Result.err(new Error('Invalid follow-up date format'))
      }
      if (followUpDate <= new Date()) {
        return Result.err(new Error('Follow-up date must be in the future'))
      }
    }

    return Result.ok(input)
  }

  protected async executeValidated(input: CreateInteractionRequest): Promise<Result<CreateInteractionResponse, Error>> {
    try {
      // Validate contact exists and user has access
      const contactResult = await this.contactRepository.findById(input.contactId)
      if (contactResult.isErr()) {
        return Result.err(contactResult.unwrapErr())
      }

      const contact = contactResult.unwrap()
      if (!contact) {
        return Result.err(new Error('Contact not found'))
      }

      if (contact.userId !== input.userId) {
        return Result.err(new Error('Access denied to contact'))
      }

      // Validate company if provided
      let companyId: string | undefined
      if (input.companyId) {
        const companyResult = await this.companyRepository.findById(input.companyId)
        if (companyResult.isErr()) {
          return Result.err(companyResult.unwrapErr())
        }
        const company = companyResult.unwrap()
        if (!company || company.userId !== input.userId) {
          return Result.err(new Error('Company not found or access denied'))
        }
        companyId = company.id
      }

      // Parse dates
      const interactionDate = input.date ? new Date(input.date) : new Date()
      if (isNaN(interactionDate.getTime())) {
        return Result.err(new Error('Invalid interaction date format'))
      }

      const followUpDate = input.followUpDate ? new Date(input.followUpDate) : undefined

      // Create interaction
      const newInteraction = Interaction.create({
        contactId: input.contactId,
        companyId,
        type: input.type,
        subject: input.subject.trim(),
        content: input.content.trim(),
        date: interactionDate,
        duration: input.duration,
        outcome: input.outcome?.trim(),
        followUpDate,
        userId: input.userId
      })

      // Save interaction
      const saveResult = await this.interactionRepository.save(newInteraction)
      if (saveResult.isErr()) {
        return Result.err(saveResult.unwrapErr())
      }

      const savedInteraction = saveResult.unwrap()

      return Result.ok({
        interaction: {
          id: savedInteraction.id,
          contactId: savedInteraction.contactId,
          companyId: savedInteraction.companyId,
          type: savedInteraction.type,
          subject: savedInteraction.subject,
          content: savedInteraction.content,
          date: savedInteraction.date,
          duration: savedInteraction.duration,
          outcome: savedInteraction.outcome,
          followUpDate: savedInteraction.followUpDate,
          createdAt: savedInteraction.createdAt
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}