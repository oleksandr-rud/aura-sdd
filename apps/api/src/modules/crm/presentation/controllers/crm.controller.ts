/**
 * CRM Controller
 * HTTP request/response handlers for CRM operations
 */

import { FastifyRequest, FastifyReply } from 'fastify'
import { CRMApplicationService } from '../../application'
import {
  createContactDto,
  updateContactDto,
  getContactsDto,
  createCompanyDto,
  getCompaniesDto,
  createInteractionDto,
  getInteractionsDto,
  searchDto,
  getStatisticsDto,
  bulkUpdateTagsDto,
  bulkAssignToCompanyDto,
  bulkUpdateInteractionsDto,
  idParamSchema,
  type ContactResponse,
  type CompanyResponse,
  type InteractionResponse,
  type PaginatedResponse,
  type SuccessResponse,
  type ErrorResponse
} from '../dto/crm.dto'

export class CRMController {
  constructor(private crmApplicationService: CRMApplicationService) {}

  // Helper method to get user ID from request
  private getUserId(request: FastifyRequest): string {
    return (request.user as any)?.id || ''
  }

  // Helper method to build success response
  private success<T>(data: T, message?: string): SuccessResponse<T> {
    return {
      success: true,
      data,
      message
    }
  }

  // Helper method to build error response
  private error(code: string, message: string, details?: any): ErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details
      }
    }
  }

  // Helper method to build paginated response
  private paginated<T>(
    items: T[],
    page: number,
    limit: number,
    total: number
  ): SuccessResponse<PaginatedResponse<T>> {
    return this.success({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  }

  /**
   * Create a new contact
   * POST /crm/contacts
   */
  createContact = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = createContactDto.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid request data', validationResult.error.errors)
        )
      }

      const contactData = validationResult.data
      const result = await this.crmApplicationService.createContact({
        ...contactData,
        userId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('already exists')) {
          return reply.status(409).send(this.error('DUPLICATE_CONTACT', error.message))
        }

        if (error.message.includes('not found') || error.message.includes('access denied')) {
          return reply.status(404).send(this.error('NOT_FOUND', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to create contact'))
      }

      const response = result.unwrap()
      const contact: ContactResponse = {
        id: response.contact.id,
        name: response.contact.name,
        email: response.contact.email,
        phone: response.contact.phone,
        companyId: response.contact.company,
        tags: response.contact.tags,
        notes: response.contact.notes,
        createdAt: response.contact.createdAt,
        updatedAt: response.contact.createdAt
      }

      const responseData = this.success(contact, 'Contact created successfully')
      if (response.duplicates) {
        responseData.data = { ...contact, duplicates: response.duplicates }
      }

      return reply.status(201).send(responseData)
    } catch (error) {
      console.error('Create contact error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Update a contact
   * PUT /crm/contacts/:id
   */
  updateContact = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const { id } = idParamSchema.parse(request.params)
      const validationResult = updateContactDto.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid request data', validationResult.error.errors)
        )
      }

      const updateData = validationResult.data
      const result = await this.crmApplicationService.updateContact({
        id,
        ...updateData,
        userId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(this.error('NOT_FOUND', error.message))
        }

        if (error.message.includes('access denied')) {
          return reply.status(403).send(this.error('FORBIDDEN', error.message))
        }

        if (error.message.includes('already exists')) {
          return reply.status(409).send(this.error('DUPLICATE_EMAIL', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to update contact'))
      }

      const response = result.unwrap()
      const contact: ContactResponse = {
        id: response.contact.id,
        name: response.contact.name,
        email: response.contact.email,
        phone: response.contact.phone,
        companyId: response.contact.company,
        tags: response.contact.tags,
        notes: response.contact.notes,
        createdAt: response.contact.updatedAt, // Using updatedAt as we don't have createdAt
        updatedAt: response.contact.updatedAt
      }

      return reply.send(this.success(contact, 'Contact updated successfully'))
    } catch (error) {
      console.error('Update contact error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Get contacts with pagination and filtering
   * GET /crm/contacts
   */
  getContacts = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = getContactsDto.safeParse(request.query)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid query parameters', validationResult.error.errors)
        )
      }

      const queryParams = validationResult.data
      const result = await this.crmApplicationService.getContacts({
        userId,
        page: queryParams.page,
        limit: queryParams.limit,
        query: queryParams.query,
        tags: queryParams.tags,
        companyId: queryParams.companyId,
        hasEmail: queryParams.hasEmail,
        hasPhone: queryParams.hasPhone,
        dateRange: queryParams.dateFrom && queryParams.dateTo ? {
          from: queryParams.dateFrom,
          to: queryParams.dateTo
        } : undefined
      })

      if (result.isErr()) {
        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to get contacts'))
      }

      const response = result.unwrap()
      const contacts: ContactResponse[] = response.contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        companyId: contact.companyId,
        tags: contact.tags,
        notes: contact.notes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }))

      return reply.send(this.paginated(
        contacts,
        response.pagination.page,
        response.pagination.limit,
        response.pagination.total
      ))
    } catch (error) {
      console.error('Get contacts error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Get a specific contact with interactions
   * GET /crm/contacts/:id
   */
  getContact = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const { id } = idParamSchema.parse(request.params)
      const result = await this.crmApplicationService.getContactWithInteractions(id, userId)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(this.error('NOT_FOUND', error.message))
        }

        if (error.message.includes('access denied')) {
          return reply.status(403).send(this.error('FORBIDDEN', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to get contact'))
      }

      const response = result.unwrap()
      const contact: ContactResponse = {
        id: response.contact.id,
        name: response.contact.name,
        email: response.contact.email,
        phone: response.contact.phone,
        companyId: response.contact.companyId,
        tags: response.contact.tags,
        notes: response.contact.notes,
        createdAt: response.contact.createdAt,
        updatedAt: response.contact.updatedAt
      }

      const interactions: InteractionResponse[] = response.interactions.map(interaction => ({
        id: interaction.id,
        contactId: interaction.contactId,
        companyId: interaction.companyId,
        type: interaction.type,
        subject: interaction.subject,
        content: interaction.content,
        date: interaction.date,
        duration: interaction.duration,
        outcome: interaction.outcome,
        followUpDate: interaction.followUpDate,
        createdAt: interaction.createdAt
      }))

      return reply.send(this.success({
        contact,
        interactions,
        totalInteractions: interactions.length
      }))
    } catch (error) {
      console.error('Get contact error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Delete a contact
   * DELETE /crm/contacts/:id
   */
  deleteContact = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const { id } = idParamSchema.parse(request.params)
      const result = await this.crmApplicationService.deleteContact(id, userId)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(this.error('NOT_FOUND', error.message))
        }

        if (error.message.includes('access denied')) {
          return reply.status(403).send(this.error('FORBIDDEN', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to delete contact'))
      }

      return reply.send(this.success(null, 'Contact deleted successfully'))
    } catch (error) {
      console.error('Delete contact error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Create a new company
   * POST /crm/companies
   */
  createCompany = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = createCompanyDto.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid request data', validationResult.error.errors)
        )
      }

      const companyData = validationResult.data
      const result = await this.crmApplicationService.createCompany({
        ...companyData,
        userId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('already exists')) {
          return reply.status(409).send(this.error('DUPLICATE_COMPANY', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to create company'))
      }

      const response = result.unwrap()
      const company: CompanyResponse = {
        id: response.company.id,
        name: response.company.name,
        website: response.company.website,
        phone: response.company.phone,
        address: response.company.address,
        industry: response.company.industry,
        description: response.company.description,
        size: response.company.size,
        revenue: response.company.revenue,
        createdAt: response.company.createdAt,
        updatedAt: response.company.createdAt
      }

      return reply.status(201).send(this.success(company, 'Company created successfully'))
    } catch (error) {
      console.error('Create company error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Get companies with pagination and filtering
   * GET /crm/companies
   */
  getCompanies = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = getCompaniesDto.safeParse(request.query)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid query parameters', validationResult.error.errors)
        )
      }

      const queryParams = validationResult.data
      const result = await this.crmApplicationService.getCompanies({
        userId,
        page: queryParams.page,
        limit: queryParams.limit,
        query: queryParams.query,
        industry: queryParams.industry,
        size: queryParams.size,
        hasLocation: queryParams.hasLocation,
        hasWebsite: queryParams.hasWebsite,
        dateRange: queryParams.dateFrom && queryParams.dateTo ? {
          from: queryParams.dateFrom,
          to: queryParams.dateTo
        } : undefined
      })

      if (result.isErr()) {
        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to get companies'))
      }

      const response = result.unwrap()
      const companies: CompanyResponse[] = response.companies.map(company => ({
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
      }))

      return reply.send(this.paginated(
        companies,
        response.pagination.page,
        response.pagination.limit,
        response.pagination.total
      ))
    } catch (error) {
      console.error('Get companies error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Get a specific company with contacts
   * GET /crm/companies/:id
   */
  getCompany = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const { id } = idParamSchema.parse(request.params)
      const result = await this.crmApplicationService.getCompanyWithContacts(id, userId)

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found')) {
          return reply.status(404).send(this.error('NOT_FOUND', error.message))
        }

        if (error.message.includes('access denied')) {
          return reply.status(403).send(this.error('FORBIDDEN', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to get company'))
      }

      const response = result.unwrap()
      const company: CompanyResponse = {
        id: response.company.id,
        name: response.company.name,
        website: response.company.website,
        phone: response.company.phone,
        address: response.company.address,
        industry: response.company.industry,
        description: response.company.description,
        size: response.company.size,
        revenue: response.company.revenue,
        createdAt: response.company.createdAt,
        updatedAt: response.company.updatedAt
      }

      return reply.send(this.success({
        company,
        contacts: response.contacts,
        totalContacts: response.contacts.length
      }))
    } catch (error) {
      console.error('Get company error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Create a new interaction
   * POST /crm/interactions
   */
  createInteraction = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = createInteractionDto.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid request data', validationResult.error.errors)
        )
      }

      const interactionData = validationResult.data
      const result = await this.crmApplicationService.createInteraction({
        ...interactionData,
        userId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()

        if (error.message.includes('not found') || error.message.includes('access denied')) {
          return reply.status(404).send(this.error('NOT_FOUND', error.message))
        }

        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to create interaction'))
      }

      const response = result.unwrap()
      const interaction: InteractionResponse = {
        id: response.interaction.id,
        contactId: response.interaction.contactId,
        companyId: response.interaction.companyId,
        type: response.interaction.type,
        subject: response.interaction.subject,
        content: response.interaction.content,
        date: response.interaction.date,
        duration: response.interaction.duration,
        outcome: response.interaction.outcome,
        followUpDate: response.interaction.followUpDate,
        createdAt: response.interaction.createdAt
      }

      return reply.status(201).send(this.success(interaction, 'Interaction created successfully'))
    } catch (error) {
      console.error('Create interaction error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Search contacts and companies
   * GET /crm/search
   */
  search = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = searchDto.safeParse(request.query)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid query parameters', validationResult.error.errors)
        )
      }

      const queryParams = validationResult.data
      const query = queryParams.query

      // Search contacts
      const contactsResult = await this.crmApplicationService.getContacts({
        userId,
        page: queryParams.page,
        limit: queryParams.limit,
        query: queryParams.type === 'companies' ? undefined : query
      })

      // Search companies
      const companiesResult = await this.crmApplicationService.getCompanies({
        userId,
        page: queryParams.page,
        limit: queryParams.limit,
        query: queryParams.type === 'contacts' ? undefined : query
      })

      if (contactsResult.isErr() || companiesResult.isErr()) {
        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Search failed'))
      }

      const contacts = contactsResult.unwrap()
      const companies = companiesResult.unwrap()

      const searchResponse = {
        contacts: contacts.contacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          companyId: contact.companyId,
          tags: contact.tags,
          createdAt: contact.createdAt
        })),
        companies: companies.companies.map(company => ({
          id: company.id,
          name: company.name,
          website: company.website,
          industry: company.industry,
          size: company.size,
          createdAt: company.createdAt
        })),
        total: {
          contacts: contacts.pagination.total,
          companies: companies.pagination.total
        }
      }

      return reply.send(this.success(searchResponse))
    } catch (error) {
      console.error('Search error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Get CRM statistics
   * GET /crm/statistics
   */
  getStatistics = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const validationResult = getStatisticsDto.safeParse(request.query)
      if (!validationResult.success) {
        return reply.status(400).send(
          this.error('VALIDATION_ERROR', 'Invalid query parameters', validationResult.error.errors)
        )
      }

      const result = await this.crmApplicationService.getCRMStatistics(userId)
      if (result.isErr()) {
        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to get statistics'))
      }

      const statistics = result.unwrap()
      return reply.send(this.success(statistics))
    } catch (error) {
      console.error('Get statistics error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }

  /**
   * Get contact suggestions
   * GET /crm/suggestions
   */
  getSuggestions = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = this.getUserId(request)
      if (!userId) {
        return reply.status(401).send(this.error('UNAUTHORIZED', 'Authentication required'))
      }

      const { limit = 5 } = request.query as { limit?: string }
      const limitNumber = Math.min(10, Math.max(1, parseInt(limit) || 5))

      const result = await this.crmApplicationService.getContactSuggestions(userId, limitNumber)
      if (result.isErr()) {
        return reply.status(500).send(this.error('INTERNAL_ERROR', 'Failed to get suggestions'))
      }

      return reply.send(this.success(result.unwrap()))
    } catch (error) {
      console.error('Get suggestions error:', error)
      return reply.status(500).send(this.error('INTERNAL_ERROR', 'Service error'))
    }
  }
}