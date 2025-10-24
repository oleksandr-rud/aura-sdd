/**
 * CRM Routes
 * Fastify route definitions for CRM endpoints
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CRMController } from '../controllers/crm.controller'
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
  idParamSchema,
  type SuccessResponse,
  type ErrorResponse,
  type PaginatedResponse
} from '../dto/crm.dto'

// Define response schemas for Swagger documentation
const SuccessResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: { type: 'object' },
    message: { type: 'string', example: 'Operation successful' }
  }
}

const ErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'VALIDATION_ERROR' },
        message: { type: 'string', example: 'Invalid request data' },
        details: { type: 'object' }
      }
    }
  }
}

const PaginatedResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 100 },
            totalPages: { type: 'number', example: 5 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false }
          }
        }
      }
    }
  }
}

export async function crmRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  // Initialize controller
  const crmController = new CRMController(options.crmApplicationService)

  // Create a typed instance with Zod provider
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // Add authentication hook for protected routes
  const authenticate = async (request: any, reply: any) => {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        })
      }

      const token = authHeader.split(' ')[1]
      // In a real implementation, you would validate the token here
      // For now, we'll just set a mock user
      request.user = { id: 'mock-user-id' }
    } catch (error) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid authentication token'
        }
      })
    }
  }

  /**
   * Create a new contact
   * POST /crm/contacts
   */
  app.post(
    '/contacts',
    {
      preHandler: authenticate,
      schema: {
        description: 'Create a new contact',
        tags: ['CRM', 'Contacts'],
        body: createContactDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          201: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.createContact
  )

  /**
   * Get contacts with pagination and filtering
   * GET /crm/contacts
   */
  app.get(
    '/contacts',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get contacts with pagination and filtering',
        tags: ['CRM', 'Contacts'],
        querystring: getContactsDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: PaginatedResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.getContacts
  )

  /**
   * Get a specific contact with interactions
   * GET /crm/contacts/:id
   */
  app.get(
    '/contacts/:id',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get a specific contact with interactions',
        tags: ['CRM', 'Contacts'],
        params: idParamSchema,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.getContact
  )

  /**
   * Update a contact
   * PUT /crm/contacts/:id
   */
  app.put(
    '/contacts/:id',
    {
      preHandler: authenticate,
      schema: {
        description: 'Update a contact',
        tags: ['CRM', 'Contacts'],
        params: idParamSchema,
        body: updateContactDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.updateContact
  )

  /**
   * Delete a contact
   * DELETE /crm/contacts/:id
   */
  app.delete(
    '/contacts/:id',
    {
      preHandler: authenticate,
      schema: {
        description: 'Delete a contact',
        tags: ['CRM', 'Contacts'],
        params: idParamSchema,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.deleteContact
  )

  /**
   * Create a new company
   * POST /crm/companies
   */
  app.post(
    '/companies',
    {
      preHandler: authenticate,
      schema: {
        description: 'Create a new company',
        tags: ['CRM', 'Companies'],
        body: createCompanyDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          201: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.createCompany
  )

  /**
   * Get companies with pagination and filtering
   * GET /crm/companies
   */
  app.get(
    '/companies',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get companies with pagination and filtering',
        tags: ['CRM', 'Companies'],
        querystring: getCompaniesDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: PaginatedResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.getCompanies
  )

  /**
   * Get a specific company with contacts
   * GET /crm/companies/:id
   */
  app.get(
    '/companies/:id',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get a specific company with contacts',
        tags: ['CRM', 'Companies'],
        params: idParamSchema,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.getCompany
  )

  /**
   * Create a new interaction
   * POST /crm/interactions
   */
  app.post(
    '/interactions',
    {
      preHandler: authenticate,
      schema: {
        description: 'Create a new interaction',
        tags: ['CRM', 'Interactions'],
        body: createInteractionDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          201: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.createInteraction
  )

  /**
   * Search contacts and companies
   * GET /crm/search
   */
  app.get(
    '/search',
    {
      preHandler: authenticate,
      schema: {
        description: 'Search contacts and companies',
        tags: ['CRM', 'Search'],
        querystring: searchDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.search
  )

  /**
   * Get CRM statistics
   * GET /crm/statistics
   */
  app.get(
    '/statistics',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get CRM statistics and analytics',
        tags: ['CRM', 'Analytics'],
        querystring: getStatisticsDto,
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.getStatistics
  )

  /**
   * Get contact suggestions
   * GET /crm/suggestions
   */
  app.get(
    '/suggestions',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get contact suggestions based on interactions and activity',
        tags: ['CRM', 'Analytics'],
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'number', minimum: 1, maximum: 10, default: 5 }
          }
        },
        headers: {
          type: 'object',
          properties: {
            Authorization: { type: 'string', description: 'Bearer token' }
          },
          required: ['Authorization']
        },
        response: {
          200: SuccessResponseSchema,
          401: ErrorResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    crmController.getSuggestions
  )

  /**
   * Health check for CRM service
   * GET /crm/health
   */
  app.get(
    '/health',
    {
      schema: {
        description: 'Health check for CRM service',
        tags: ['CRM', 'Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              service: { type: 'string' },
              version: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'crm',
        version: '1.0.0'
      }
    }
  )

  done()
}

// Route registration helper
export const registerCRMRoutes = (
  fastify: FastifyInstance,
  crmApplicationService: any
) => {
  fastify.register(crmRoutes, {
    prefix: '/crm',
    crmApplicationService
  })
}