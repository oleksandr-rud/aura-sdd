/**
 * CRM Data Transfer Objects
 * Presentation layer - API request/response schemas
 */

import { z } from 'zod'

// Common schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
})

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

// Contact DTOs
export const createContactDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number').optional(),
  company: z.string().uuid('Invalid company ID').optional(),
  tags: z.array(z.string().min(1).max(20)).max(10, 'Maximum 10 tags allowed').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional()
})

export const updateContactDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number').optional(),
  company: z.string().uuid('Invalid company ID').or(z.literal('')).optional(),
  tags: z.array(z.string().min(1).max(20)).max(10, 'Maximum 10 tags allowed').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional()
})

export const getContactsDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  query: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  companyId: z.string().uuid().optional(),
  hasEmail: z.coerce.boolean().optional(),
  hasPhone: z.coerce.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo)
    }
    return true
  },
  {
    message: 'Start date must be before end date',
    path: ['dateFrom']
  }
)

// Company DTOs
export const createCompanyDto = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(50),
  website: z.string().url('Invalid website URL').optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number').optional(),
  address: z.object({
    street: z.string().max(100).optional(),
    city: z.string().max(50).optional(),
    state: z.string().max(50).optional(),
    zip: z.string().max(20).optional(),
    country: z.string().max(50).optional()
  }).optional(),
  industry: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  size: z.string().max(20).optional(),
  revenue: z.string().max(50).optional()
})

export const getCompaniesDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  query: z.string().min(1).max(100).optional(),
  industry: z.string().max(50).optional(),
  size: z.string().max(20).optional(),
  hasLocation: z.coerce.boolean().optional(),
  hasWebsite: z.coerce.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo)
    }
    return true
  },
  {
    message: 'Start date must be before end date',
    path: ['dateFrom']
  }
)

// Interaction DTOs
export const createInteractionDto = z.object({
  contactId: z.string().uuid('Invalid contact ID'),
  companyId: z.string().uuid('Invalid company ID').optional(),
  type: z.enum(['call', 'email', 'meeting', 'note'], {
    errorMap: () => ({ message: 'Type must be one of: call, email, meeting, note' })
  }),
  subject: z.string().min(1, 'Subject is required').max(100),
  content: z.string().min(1, 'Content is required').max(2000),
  date: z.string().datetime().optional(),
  duration: z.number().min(0).max(1440, 'Duration must be between 0 and 1440 minutes').optional(),
  outcome: z.string().max(200).optional(),
  followUpDate: z.string().datetime().optional()
}).refine(
  (data) => {
    if (data.followUpDate) {
      return new Date(data.followUpDate) > new Date()
    }
    return true
  },
  {
    message: 'Follow-up date must be in the future',
    path: ['followUpDate']
  }
)

export const getInteractionsDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  contactId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  type: z.enum(['call', 'email', 'meeting', 'note']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  hasFollowUp: z.coerce.boolean().optional(),
  overdueFollowUp: z.coerce.boolean().optional(),
  query: z.string().min(1).max(100).optional()
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo)
    }
    return true
  },
  {
    message: 'Start date must be before end date',
    path: ['dateFrom']
  }
)

// Search DTO
export const searchDto = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  type: z.enum(['contacts', 'companies', 'all']).default('all'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
})

// Statistics DTO
export const getStatisticsDto = z.object({
  type: z.enum(['overview', 'contacts', 'companies', 'interactions']).default('overview'),
  period: z.enum(['week', 'month', 'quarter', 'year']).default('month')
})

// Bulk operations DTO
export const bulkUpdateTagsDto = z.object({
  contactIds: z.array(z.string().uuid()).min(1, 'At least one contact ID is required').max(100, 'Maximum 100 contacts allowed'),
  tags: z.array(z.string().min(1).max(20)).max(10, 'Maximum 10 tags allowed'),
  action: z.enum(['add', 'replace', 'remove']).default('add')
})

export const bulkAssignToCompanyDto = z.object({
  contactIds: z.array(z.string().uuid()).min(1, 'At least one contact ID is required').max(100, 'Maximum 100 contacts allowed'),
  companyId: z.string().uuid('Invalid company ID')
})

export const bulkUpdateInteractionsDto = z.object({
  interactionIds: z.array(z.string().uuid()).min(1, 'At least one interaction ID is required').max(100, 'Maximum 100 interactions allowed'),
  outcome: z.string().max(200).optional(),
  followUpDate: z.string().datetime().optional(),
  clearFollowUp: z.boolean().default(false)
}).refine(
  (data) => {
    if (data.clearFollowUp && data.followUpDate) {
      return false
    }
    return true
  },
  {
    message: 'Cannot set follow-up date and clear follow-up at the same time',
    path: ['followUpDate']
  }
)

// Response types (for TypeScript)
export interface ContactResponse {
  id: string
  name: string
  email?: string
  phone?: string
  companyId?: string
  tags: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CompanyResponse {
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
  updatedAt: Date
}

export interface InteractionResponse {
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

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchResponse {
  contacts: ContactResponse[]
  companies: CompanyResponse[]
  total: {
    contacts: number
    companies: number
  }
}

export interface StatisticsResponse {
  totalContacts: number
  totalCompanies: number
  totalInteractions: number
  interactionTypes: Record<string, number>
  recentActivity: Array<{
    type: 'contact' | 'company' | 'interaction'
    id: string
    description: string
    date: Date
  }>
  trends?: {
    contacts: Array<{ date: string; count: number }>
    companies: Array<{ date: string; count: number }>
    interactions: Array<{ date: string; count: number }>
  }
}

export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}