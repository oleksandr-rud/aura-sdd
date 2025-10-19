/**
 * CRM Application Service
 * Main orchestrator for all CRM operations
 */

import { Result } from '@/libs/utils'
import { ContactRepository } from '../../domain/repositories/contact-repository'
import { CompanyRepository } from '../../domain/repositories/company-repository'
import { InteractionRepository } from '../../domain/repositories/interaction-repository'
import { CRMService } from '../../domain/services/crm-service'

// Import all use cases
import {
  CreateContactUseCase,
  CreateContactRequest,
  CreateContactResponse
} from '../use-cases/create-contact.use-case'
import {
  UpdateContactUseCase,
  UpdateContactRequest,
  UpdateContactResponse
} from '../use-cases/update-contact.use-case'
import {
  GetContactsUseCase,
  GetContactsRequest,
  GetContactsResponse
} from '../use-cases/get-contacts.use-case'
import {
  CreateCompanyUseCase,
  CreateCompanyRequest,
  CreateCompanyResponse
} from '../use-cases/create-company.use-case'
import {
  GetCompaniesUseCase,
  GetCompaniesRequest,
  GetCompaniesResponse
} from '../use-cases/get-companies.use-case'
import {
  CreateInteractionUseCase,
  CreateInteractionRequest,
  CreateInteractionResponse
} from '../use-cases/create-interaction.use-case'

export class CRMApplicationService {
  private createContactUseCase: CreateContactUseCase
  private updateContactUseCase: UpdateContactUseCase
  private getContactsUseCase: GetContactsUseCase
  private createCompanyUseCase: CreateCompanyUseCase
  private getCompaniesUseCase: GetCompaniesUseCase
  private createInteractionUseCase: CreateInteractionUseCase

  constructor(
    private contactRepository: ContactRepository,
    private companyRepository: CompanyRepository,
    private interactionRepository: InteractionRepository,
    private crmService: CRMService
  ) {
    // Initialize all use cases with their dependencies
    this.createContactUseCase = new CreateContactUseCase(
      contactRepository,
      companyRepository,
      crmService
    )
    this.updateContactUseCase = new UpdateContactUseCase(
      contactRepository,
      companyRepository,
      crmService
    )
    this.getContactsUseCase = new GetContactsUseCase(contactRepository)
    this.createCompanyUseCase = new CreateCompanyUseCase(companyRepository)
    this.getCompaniesUseCase = new GetCompaniesUseCase(companyRepository)
    this.createInteractionUseCase = new CreateInteractionUseCase(
      interactionRepository,
      contactRepository,
      companyRepository
    )
  }

  /**
   * Create a new contact with duplicate detection
   */
  async createContact(request: CreateContactRequest): Promise<Result<CreateContactResponse, Error>> {
    return this.createContactUseCase.execute(request)
  }

  /**
   * Update an existing contact
   */
  async updateContact(request: UpdateContactRequest): Promise<Result<UpdateContactResponse, Error>> {
    return this.updateContactUseCase.execute(request)
  }

  /**
   * Get contacts with pagination and filtering
   */
  async getContacts(request: GetContactsRequest): Promise<Result<GetContactsResponse, Error>> {
    return this.getContactsUseCase.execute(request)
  }

  /**
   * Create a new company
   */
  async createCompany(request: CreateCompanyRequest): Promise<Result<CreateCompanyResponse, Error>> {
    return this.createCompanyUseCase.execute(request)
  }

  /**
   * Get companies with pagination and filtering
   */
  async getCompanies(request: GetCompaniesRequest): Promise<Result<GetCompaniesResponse, Error>> {
    return this.getCompaniesUseCase.execute(request)
  }

  /**
   * Create a new interaction
   */
  async createInteraction(request: CreateInteractionRequest): Promise<Result<CreateInteractionResponse, Error>> {
    return this.createInteractionUseCase.execute(request)
  }

  /**
   * Get contact by ID with interactions
   */
  async getContactWithInteractions(contactId: string, userId: string): Promise<Result<any, Error>> {
    try {
      // Get contact
      const contactResult = await this.contactRepository.findById(contactId)
      if (contactResult.isErr()) {
        return Result.err(contactResult.unwrapErr())
      }

      const contact = contactResult.unwrap()
      if (!contact) {
        return Result.err(new Error('Contact not found'))
      }

      if (contact.userId !== userId) {
        return Result.err(new Error('Access denied'))
      }

      // Get interactions for this contact
      const interactionsResult = await this.interactionRepository.findByContact(contactId, userId)
      if (interactionsResult.isErr()) {
        return Result.err(interactionsResult.unwrapErr())
      }

      const interactions = interactionsResult.unwrap()

      return Result.ok({
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          companyId: contact.companyId,
          tags: contact.tags,
          notes: contact.notes,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt
        },
        interactions: interactions.map(interaction => ({
          id: interaction.id,
          type: interaction.type,
          subject: interaction.subject,
          content: interaction.content,
          date: interaction.date,
          duration: interaction.duration,
          outcome: interaction.outcome,
          followUpDate: interaction.followUpDate,
          createdAt: interaction.createdAt
        }))
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  /**
   * Get company by ID with contacts
   */
  async getCompanyWithContacts(companyId: string, userId: string): Promise<Result<any, Error>> {
    try {
      // Get company
      const companyResult = await this.companyRepository.findById(companyId)
      if (companyResult.isErr()) {
        return Result.err(companyResult.unwrapErr())
      }

      const company = companyResult.unwrap()
      if (!company) {
        return Result.err(new Error('Company not found'))
      }

      if (company.userId !== userId) {
        return Result.err(new Error('Access denied'))
      }

      // Get contacts for this company
      const contactsResult = await this.contactRepository.findByCompany(companyId, userId)
      if (contactsResult.isErr()) {
        return Result.err(contactsResult.unwrapErr())
      }

      const contacts = contactsResult.unwrap()

      return Result.ok({
        company: {
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
        },
        contacts: contacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          tags: contact.tags,
          createdAt: contact.createdAt
        }))
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  /**
   * Delete a contact
   */
  async deleteContact(contactId: string, userId: string): Promise<Result<void, Error>> {
    try {
      // Verify contact exists and user has access
      const contactResult = await this.contactRepository.findById(contactId)
      if (contactResult.isErr()) {
        return Result.err(contactResult.unwrapErr())
      }

      const contact = contactResult.unwrap()
      if (!contact) {
        return Result.err(new Error('Contact not found'))
      }

      if (contact.userId !== userId) {
        return Result.err(new Error('Access denied'))
      }

      // Delete contact (cascade delete should handle interactions)
      return this.contactRepository.delete(contactId)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  /**
   * Delete a company
   */
  async deleteCompany(companyId: string, userId: string): Promise<Result<void, Error>> {
    try {
      // Verify company exists and user has access
      const companyResult = await this.companyRepository.findById(companyId)
      if (companyResult.isErr()) {
        return Result.err(companyResult.unwrapErr())
      }

      const company = companyResult.unwrap()
      if (!company) {
        return Result.err(new Error('Company not found'))
      }

      if (company.userId !== userId) {
        return Result.err(new Error('Access denied'))
      }

      // Unassign all contacts from this company
      const contactsResult = await this.contactRepository.findByCompany(companyId, userId)
      if (contactsResult.isOk()) {
        const contacts = contactsResult.unwrap()
        for (const contact of contacts) {
          const unassignedContact = contact.unassignFromCompany()
          await this.contactRepository.save(unassignedContact)
        }
      }

      // Delete company
      return this.companyRepository.delete(companyId)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  /**
   * Get contact suggestions based on interactions and activity
   */
  async getContactSuggestions(userId: string, limit: number = 5): Promise<Result<any, Error>> {
    try {
      // Get all contacts for user
      const contactsResult = await this.contactRepository.findBy({ userId })
      if (contactsResult.isErr()) {
        return Result.err(contactsResult.unwrapErr())
      }

      const contacts = contactsResult.unwrap()

      // Get recent interactions
      const interactionsResult = await this.interactionRepository.getRecentInteractions(userId, 100)
      if (interactionsResult.isErr()) {
        return Result.err(interactionsResult.unwrapErr())
      }

      const interactions = interactionsResult.unwrap()

      // Generate suggestions using CRM service
      const suggestedContacts = this.crmService.generateContactSuggestions(contacts, interactions, limit)

      return Result.ok({
        suggestions: suggestedContacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          companyId: contact.companyId,
          tags: contact.tags,
          lastInteraction: interactions
            .filter(i => i.contactId === contact.id)
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.date
        }))
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  /**
   * Get CRM statistics for dashboard
   */
  async getCRMStatistics(userId: string): Promise<Result<any, Error>> {
    try {
      const [contactsCount, companiesCount, interactionsCountByType] = await Promise.all([
        this.contactRepository.countByUser(userId),
        this.companyRepository.countByUser(userId),
        this.interactionRepository.countByType(userId)
      ])

      if (contactsCount.isErr()) return Result.err(contactsCount.unwrapErr())
      if (companiesCount.isErr()) return Result.err(companiesCount.unwrapErr())
      if (interactionsCountByType.isErr()) return Result.err(interactionsCountByType.unwrapErr())

      // Get recent interactions
      const recentInteractionsResult = await this.interactionRepository.getRecentInteractions(userId, 10)
      const recentInteractions = recentInteractionsResult.isOk() ? recentInteractionsResult.unwrap() : []

      return Result.ok({
        totalContacts: contactsCount.unwrap(),
        totalCompanies: companiesCount.unwrap(),
        interactionTypes: interactionsCountByType.unwrap(),
        recentInteractions: recentInteractions.map(interaction => ({
          id: interaction.id,
          contactId: interaction.contactId,
          type: interaction.type,
          subject: interaction.subject,
          date: interaction.date
        }))
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}