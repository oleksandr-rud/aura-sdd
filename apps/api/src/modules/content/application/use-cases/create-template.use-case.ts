/**
 * Create Template Use Case
 * KISS principle: simple use case for creating content templates
 */

import { Result } from '@/libs/utils'
import { Command } from '@/shared/use-case'
import { ContentTemplateRepository } from '../../domain/repositories'
import { ContentTemplate } from '../../domain/entities'

export interface CreateTemplateRequest {
  userId: string
  workspaceId: string
  name: string
  description: string
  category: 'presentation' | 'report' | 'analysis' | 'document' | 'custom'
  structure: Record<string, any>
  variables: Array<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    description: string
    required: boolean
    defaultValue?: any
    options?: string[]
  }>
  aiPrompt: string
  metadata?: Record<string, any>
}

export interface CreateTemplateResponse {
  template: ContentTemplate
}

export class CreateTemplateUseCase extends Command<CreateTemplateRequest, CreateTemplateResponse> {
  constructor(
    private readonly contentTemplateRepository: ContentTemplateRepository
  ) {
    super()
  }

  validate(input: CreateTemplateRequest): Result<CreateTemplateRequest, Error> {
    // Basic validation
    if (!input.name || input.name.trim().length < 2) {
      return Result.err(new Error('Template name must be at least 2 characters long'))
    }

    if (!input.description || input.description.trim().length < 10) {
      return Result.err(new Error('Template description must be at least 10 characters long'))
    }

    if (!input.aiPrompt || input.aiPrompt.trim().length < 20) {
      return Result.err(new Error('AI prompt must be at least 20 characters long'))
    }

    if (!input.variables || input.variables.length === 0) {
      return Result.err(new Error('Template must have at least one variable'))
    }

    // Validate variables
    for (const variable of input.variables) {
      if (!variable.name || variable.name.trim().length < 1) {
        return Result.err(new Error('All variables must have a name'))
      }

      if (!variable.description || variable.description.trim().length < 1) {
        return Result.err(new Error('All variables must have a description'))
      }

      if (!['string', 'number', 'boolean', 'array', 'object'].includes(variable.type)) {
        return Result.err(new Error(`Invalid variable type: ${variable.type}`))
      }
    }

    // Check if template with same name already exists for this user
    return Result.ok(input)
  }

  async executeValidated(request: CreateTemplateRequest): Promise<Result<CreateTemplateResponse, Error>> {
    try {
      // Check if template with same name already exists
      const existingTemplate = await this.contentTemplateRepository.findByName(
        request.userId,
        request.name.trim()
      )

      if (existingTemplate.isOk() && existingTemplate.unwrap()) {
        return Result.err(new Error(`Template with name '${request.name}' already exists`))
      }

      // Create template
      const template = ContentTemplate.create({
        name: request.name.trim(),
        description: request.description.trim(),
        category: request.category,
        status: 'draft',
        userId: request.userId,
        workspaceId: request.workspaceId,
        structure: request.structure,
        variables: request.variables,
        aiPrompt: request.aiPrompt.trim(),
        metadata: request.metadata
      })

      const savedTemplate = await this.contentTemplateRepository.save(template)
      if (savedTemplate.isErr()) {
        return Result.err(savedTemplate.unwrapErr())
      }

      return Result.ok({
        template: savedTemplate.unwrap()
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}