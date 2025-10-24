/**
 * Content DTOs
 * KISS principle: simple data transfer objects for content module
 */

import { z } from 'zod'
import { commonSchemas, contentSchemas } from '@/libs/validation'

// Base DTOs
export const BaseContentDto = z.object({
  userId: commonSchemas.uuid,
  workspaceId: commonSchemas.uuid
})

// Presentation Generation DTOs
export const GeneratePresentationDto = BaseContentDto.extend({
  topic: z.string().min(5).max(200),
  audience: z.string().min(1).max(100),
  length: z.enum(['short', 'medium', 'long']),
  style: z.enum(['professional', 'casual', 'technical']),
  dataSources: z.array(z.string()).optional(),
  templateId: commonSchemas.uuid.optional()
})

export const GenerateReportDto = BaseContentDto.extend({
  title: z.string().min(5).max(200),
  dateRange: commonSchemas.dateRange,
  metrics: z.array(z.string()),
  includeCharts: z.boolean(),
  format: z.enum(['pdf', 'html', 'markdown']),
  dataSources: z.array(z.string()).optional(),
  templateId: commonSchemas.uuid.optional()
})

export const AnalyzeDataDto = BaseContentDto.extend({
  dataType: z.enum(['crm', 'chat', 'content', 'custom']),
  analysisType: z.enum(['trends', 'sentiment', 'patterns', 'insights']),
  dateRange: commonSchemas.dateRange,
  filters: z.record(z.any()).optional(),
  dataSources: z.array(z.string()).optional()
})

export const GetContentHistoryDto = BaseContentDto.extend({
  type: z.string().optional(),
  status: z.string().optional(),
  page: commonSchemas.pagination.shape.page.optional(),
  limit: commonSchemas.pagination.shape.limit.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
})

export const CreateTemplateDto = BaseContentDto.extend({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  category: z.enum(['presentation', 'report', 'analysis', 'document', 'custom']),
  structure: z.record(z.any()),
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
    description: z.string(),
    required: z.boolean(),
    defaultValue: z.any().optional(),
    options: z.array(z.string()).optional()
  })),
  aiPrompt: z.string().min(20),
  metadata: z.record(z.any()).optional()
})

export const UpdateTemplateDto = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(500).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  structure: z.record(z.any()).optional(),
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
    description: z.string(),
    required: z.boolean(),
    defaultValue: z.any().optional(),
    options: z.array(z.string()).optional()
  })).optional(),
  aiPrompt: z.string().min(20).optional(),
  metadata: z.record(z.any()).optional()
})

export const GetTemplateDto = z.object({
  category: z.enum(['presentation', 'report', 'analysis', 'document', 'custom']).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  search: z.string().optional(),
  page: commonSchemas.pagination.shape.page.optional(),
  limit: commonSchemas.pagination.shape.limit.optional()
})

export const GetProjectDto = z.object({
  projectId: commonSchemas.uuid
})

export const DeleteProjectDto = z.object({
  projectId: commonSchemas.uuid
})

// Response DTOs
export const ContentProjectResponseDto = z.object({
  id: commonSchemas.uuid,
  title: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  status: z.string(),
  userId: commonSchemas.uuid,
  workspaceId: commonSchemas.uuid,
  dataSources: z.array(z.string()),
  parameters: z.record(z.any()),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const GeneratedContentResponseDto = z.object({
  id: commonSchemas.uuid,
  projectId: commonSchemas.uuid,
  type: z.string(),
  format: z.string(),
  title: z.string(),
  content: z.string(),
  metadata: z.record(z.any()).nullable(),
  quality: z.string().nullable(),
  tokens: z.number().nullable(),
  processingTime: z.number().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const ContentTemplateResponseDto = z.object({
  id: commonSchemas.uuid,
  name: z.string(),
  description: z.string(),
  category: z.string(),
  status: z.string(),
  userId: commonSchemas.uuid,
  workspaceId: commonSchemas.uuid,
  structure: z.record(z.any()),
  variables: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    required: z.boolean(),
    defaultValue: z.any().nullable(),
    options: z.array(z.string()).nullable()
  })),
  aiPrompt: z.string(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const ContentHistoryResponseDto = z.object({
  items: z.array(z.object({
    project: ContentProjectResponseDto,
    content: GeneratedContentResponseDto.nullable(),
    lastModified: z.string().datetime()
  })),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const ContentMetricsResponseDto = z.object({
  totalProjects: z.number(),
  completedProjects: z.number(),
  failedProjects: z.number(),
  totalContent: z.number(),
  averageProcessingTime: z.number()
})

export const PaginationResponseDto = z.object({
  items: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

// Error Response DTO
export const ErrorResponseDto = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
  timestamp: z.string().datetime()
})

// Success Response DTO
export const SuccessResponseDto = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  timestamp: z.string().datetime()
})

// Type exports
export type GeneratePresentationRequest = z.infer<typeof GeneratePresentationDto>
export type GenerateReportRequest = z.infer<typeof GenerateReportDto>
export type AnalyzeDataRequest = z.infer<typeof AnalyzeDataDto>
export type GetContentHistoryRequest = z.infer<typeof GetContentHistoryDto>
export type CreateTemplateRequest = z.infer<typeof CreateTemplateDto>
export type UpdateTemplateRequest = z.infer<typeof UpdateTemplateDto>
export type GetTemplateRequest = z.infer<typeof GetTemplateDto>
export type GetProjectRequest = z.infer<typeof GetProjectDto>
export type DeleteProjectRequest = z.infer<typeof DeleteProjectDto>

export type ContentProjectResponse = z.infer<typeof ContentProjectResponseDto>
export type GeneratedContentResponse = z.infer<typeof GeneratedContentResponseDto>
export type ContentTemplateResponse = z.infer<typeof ContentTemplateResponseDto>
export type ContentHistoryResponse = z.infer<typeof ContentHistoryResponseDto>
export type ContentMetricsResponse = z.infer<typeof ContentMetricsResponseDto>
export type ErrorResponse = z.infer<typeof ErrorResponseDto>
export type SuccessResponse = z.infer<typeof SuccessResponseDto>