/**
 * Workspace Repository Interface
 * Domain layer - defines contract for workspace persistence
 */

import { Result } from '@/libs/utils'
import { Workspace } from '../entities/workspace'

export interface FindWorkspacesByUserOptions {
  userId: string
  page?: number
  limit?: number
  includeInactive?: boolean
}

export interface CreateWorkspaceData {
  name: string
  description?: string
  ownerId: string
}

export interface UpdateWorkspaceData {
  name?: string
  description?: string
  settings?: any
}

export interface WorkspaceRepository {
  // CRUD operations
  create(data: CreateWorkspaceData): Promise<Result<Workspace, Error>>
  findById(id: string): Promise<Result<Workspace | null, Error>>
  findByUserId(userId: string, options?: FindWorkspacesByUserOptions): Promise<Result<Workspace[], Error>>
  update(id: string, data: UpdateWorkspaceData): Promise<Result<Workspace, Error>>
  delete(id: string): Promise<Result<boolean, Error>>

  // Business-specific queries
  findActiveByUserId(userId: string): Promise<Result<Workspace[], Error>>
  findByOwner(ownerId: string): Promise<Result<Workspace[], Error>>
  countByUserId(userId: string): Promise<Result<number, Error>>

  // Workspace management
  updateSettings(id: string, settings: any): Promise<Result<Workspace, Error>>
  transferOwnership(id: string, newOwnerId: string): Promise<Result<Workspace, Error>>
  deactivate(id: string): Promise<Result<Workspace, Error>>
  activate(id: string): Promise<Result<Workspace, Error>>

  // Validation queries
  existsByNameAndOwner(name: string, ownerId: string): Promise<Result<boolean, Error>>
  isUserOwner(workspaceId: string, userId: string): Promise<Result<boolean, Error>>
}