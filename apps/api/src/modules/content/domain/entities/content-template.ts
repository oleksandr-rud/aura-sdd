/**
 * Content Template Entity
 * KISS principle: simple entity for reusable content templates
 */

import { BaseEntity } from '@/shared/base-entity'

export type TemplateCategory = 'presentation' | 'report' | 'analysis' | 'document' | 'custom'
export type TemplateStatus = 'draft' | 'active' | 'archived'

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  required: boolean
  defaultValue?: any
  options?: string[]
}

export interface ContentTemplateData {
  name: string
  description: string
  category: TemplateCategory
  status: TemplateStatus
  userId: string
  workspaceId: string
  structure: Record<string, any>
  variables: TemplateVariable[]
  aiPrompt: string
  metadata?: Record<string, any>
}

export class ContentTemplate extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly description: string,
    public readonly category: TemplateCategory,
    public status: TemplateStatus,
    public readonly userId: string,
    public readonly workspaceId: string,
    public readonly structure: Record<string, any>,
    public readonly variables: TemplateVariable[],
    public aiPrompt: string,
    public readonly metadata: Record<string, any> | undefined
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(data: ContentTemplateData): ContentTemplate {
    const now = new Date()
    return new ContentTemplate(
      BaseEntity.generateId(),
      now,
      now,
      data.name,
      data.description,
      data.category,
      data.status,
      data.userId,
      data.workspaceId,
      data.structure,
      data.variables,
      data.aiPrompt,
      data.metadata
    )
  }

  updatePrompt(prompt: string): void {
    this.aiPrompt = prompt
    this.markAsUpdated()
  }

  updateStatus(status: TemplateStatus): void {
    this.status = status
    this.markAsUpdated()
  }

  isOwnedBy(userId: string): boolean {
    return this.userId === userId
  }

  isInWorkspace(workspaceId: string): boolean {
    return this.workspaceId === workspaceId
  }

  isActive(): boolean {
    return this.status === 'active'
  }

  validateVariables(values: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (const variable of this.variables) {
      const value = values[variable.name]

      if (variable.required && (value === undefined || value === null || value === '')) {
        errors.push(`Required variable '${variable.name}' is missing`)
        continue
      }

      if (value !== undefined && value !== null) {
        // Type validation
        const actualType = Array.isArray(value) ? 'array' : typeof value
        if (actualType !== variable.type) {
          errors.push(`Variable '${variable.name}' must be of type ${variable.type}, got ${actualType}`)
        }

        // Options validation
        if (variable.options && !variable.options.includes(value)) {
          errors.push(`Variable '${variable.name}' must be one of: ${variable.options.join(', ')}`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  getRequiredVariables(): TemplateVariable[] {
    return this.variables.filter(v => v.required)
  }

  getOptionalVariables(): TemplateVariable[] {
    return this.variables.filter(v => !v.required)
  }

  toJSON(): ContentTemplateData & { id: string; createdAt: Date; updatedAt: Date } {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      description: this.description,
      category: this.category,
      status: this.status,
      userId: this.userId,
      workspaceId: this.workspaceId,
      structure: this.structure,
      variables: this.variables,
      aiPrompt: this.aiPrompt,
      metadata: this.metadata
    }
  }
}