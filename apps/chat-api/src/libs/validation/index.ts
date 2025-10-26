/**
 * Validation Library
 * KISS principle: simple, composable validation with Zod
 */

import { Result } from "@/libs/utils"
import { z } from "zod"

export interface ValidationErrors {
  [field: string]: string[]
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationErrors
}

export class Validator {
  static create<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
    const result = schema.safeParse(data)

    if (result.success) {
      return {
        success: true,
        data: result.data,
      }
    }

    const errors: ValidationErrors = {}

    result.error.issues.forEach(issue => {
      const path = issue.path.join(".")
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(issue.message)
    })

    return {
      success: false,
      errors,
    }
  }

  static async validateAsync<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): Promise<ValidationResult<T>> {
    return Validator.create(schema, data)
  }
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  uuid: z.string().uuid("Invalid ID format"),
  url: z.string().url("Invalid URL format"),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, "Invalid phone number"),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
  }),

  // Search
  search: z.object({
    query: z.string().min(1).max(100),
    filters: z.record(z.any()).optional(),
  }),

  // Date range
  dateRange: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    })
    .refine(data => new Date(data.start) <= new Date(data.end), {
      message: "Start date must be before end date",
    }),
}

// Auth schemas
export const authSchemas = {
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),

  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: z.string().min(2).max(50),
    companyName: z.string().optional(),
  }),

  resetPassword: z.object({
    token: z.string().min(1),
    password: commonSchemas.password,
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: commonSchemas.password,
  }),

  verifyEmail: z.object({
    token: z.string().min(1),
  }),
}

// User schemas
export const userSchemas = {
  updateProfile: z.object({
    name: z.string().min(2).max(50).optional(),
    avatar: z.string().url().optional(),
    phone: commonSchemas.phone.optional(),
    timezone: z.string().optional(),
  }),

  createWorkspace: z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(200).optional(),
  }),

  updateWorkspace: z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(200).optional(),
  }),
}

// Chat schemas
export const chatSchemas = {
  createSession: z.object({
    title: z.string().min(1).max(100).optional(),
    context: z.string().optional(),
  }),

  sendMessage: z.object({
    content: z.string().min(1).max(4000),
    sessionId: commonSchemas.uuid,
    attachments: z.array(z.string()).optional(),
  }),

  updateSession: z.object({
    title: z.string().min(1).max(100).optional(),
  }),
}

// CRM schemas
export const crmSchemas = {
  createContact: z.object({
    name: z.string().min(2).max(50),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    company: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(1000).optional(),
  }),

  updateContact: z.object({
    name: z.string().min(2).max(50).optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    company: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(1000).optional(),
  }),

  createCompany: z.object({
    name: z.string().min(2).max(50),
    website: commonSchemas.url.optional(),
    phone: commonSchemas.phone.optional(),
    address: z.string().optional(),
    industry: z.string().optional(),
  }),

  createInteraction: z.object({
    contactId: commonSchemas.uuid,
    type: z.enum(["call", "email", "meeting", "note"]),
    subject: z.string().min(1).max(100),
    content: z.string().max(2000),
    date: z.string().datetime().optional(),
  }),
}

// Content schemas
export const contentSchemas = {
  generatePresentation: z.object({
    topic: z.string().min(5).max(200),
    audience: z.string().min(1).max(100),
    length: z.enum(["short", "medium", "long"]),
    style: z.enum(["professional", "casual", "technical"]),
    dataSources: z.array(z.string()).optional(),
  }),

  generateReport: z.object({
    title: z.string().min(5).max(200),
    dateRange: commonSchemas.dateRange,
    metrics: z.array(z.string()),
    includeCharts: z.boolean(),
    format: z.enum(["pdf", "html", "markdown"]),
  }),

  analyzeData: z.object({
    dataType: z.enum(["crm", "chat", "content", "custom"]),
    analysisType: z.enum(["trends", "sentiment", "patterns", "insights"]),
    dateRange: commonSchemas.dateRange,
    filters: z.record(z.any()).optional(),
  }),
}

// Workspace schemas
export const workspaceSchemas = {
  createWorkspace: z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(200).optional(),
  }),

  updateWorkspace: z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(200).optional(),
    settings: z
      .object({
        allowInvites: z.boolean().optional(),
        requireApproval: z.boolean().optional(),
        maxMembers: z.number().min(1).max(1000).optional(),
        defaultRole: z.enum(["admin", "member"]).optional(),
      })
      .optional(),
  }),

  inviteMember: z.object({
    email: commonSchemas.email,
    role: z.enum(["admin", "member"]),
  }),

  updateMemberRole: z.object({
    role: z.enum(["admin", "member"]),
  }),

  acceptInvitation: z.object({
    token: commonSchemas.uuid,
  }),

  declineInvitation: z.object({
    token: commonSchemas.uuid,
  }),

  getWorkspaces: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    includeInactive: z.boolean().default(false),
  }),

  getWorkspaceMembers: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    role: z.enum(["owner", "admin", "member"]).optional(),
  }),
}

// Helper function to validate and extract data
export const validateAndExtract = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Result<T, ValidationErrors> => {
  const result = Validator.create(schema, data)

  if (result.success && result.data) {
    return Result.ok(result.data)
  }

  return Result.err(result.errors ?? {})
}
