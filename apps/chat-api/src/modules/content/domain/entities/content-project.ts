/**
 * Content Project Entity
 * KISS principle: simple entity for content generation projects
 */

import { BaseEntity } from '@/shared/base-entity'

export type ContentType = 'presentation' | 'report' | 'analysis' | 'document'
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'failed'

export interface ContentProjectData {
  title: string
  description?: string
  type: ContentType
  status: ProjectStatus
  userId: string
  workspaceId: string
  dataSources: string[]
  parameters: Record<string, any>
  metadata?: Record<string, any>
}

export class ContentProject extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly type: ContentType,
    public status: ProjectStatus,
    public readonly userId: string,
    public readonly workspaceId: string,
    public readonly dataSources: string[],
    public readonly parameters: Record<string, any>,
    public readonly metadata: Record<string, any> | undefined
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(data: ContentProjectData): ContentProject {
    const now = new Date()
    return new ContentProject(
      BaseEntity.generateId(),
      now,
      now,
      data.title,
      data.description,
      data.type,
      data.status,
      data.userId,
      data.workspaceId,
      data.dataSources,
      data.parameters,
      data.metadata
    )
  }

  updateStatus(status: ProjectStatus): void {
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
    return this.status !== 'failed'
  }

  isCompleted(): boolean {
    return this.status === 'completed'
  }

  toJSON(): ContentProjectData & { id: string; createdAt: Date; updatedAt: Date } {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status,
      userId: this.userId,
      workspaceId: this.workspaceId,
      dataSources: this.dataSources,
      parameters: this.parameters,
      metadata: this.metadata
    }
  }
}