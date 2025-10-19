/**
 * Workspace Repository Implementation
 * Infrastructure layer - concrete implementation of workspace persistence
 */

import { Result } from '@/libs/utils'
import { Workspace } from '../../domain/entities'
import type {
  WorkspaceRepository,
  FindWorkspacesByUserOptions,
  CreateWorkspaceData,
  UpdateWorkspaceData
} from '../../domain/repositories'

// Mock database for demonstration - in real implementation, this would use a real database
interface WorkspaceRecord {
  id: string
  name: string
  description?: string
  ownerId: string
  settings: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory storage (replace with actual database implementation)
const workspaceStore: Map<string, WorkspaceRecord> = new Map()

export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  async create(data: CreateWorkspaceData): Promise<Result<Workspace, Error>> {
    try {
      const now = new Date()
      const id = crypto.randomUUID()

      const record: WorkspaceRecord = {
        id,
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        settings: {
          allowInvites: true,
          requireApproval: false,
          maxMembers: 50,
          defaultRole: 'member'
        },
        isActive: true,
        createdAt: now,
        updatedAt: now
      }

      workspaceStore.set(id, record)

      const workspace = new Workspace(
        {
          name: record.name,
          description: record.description,
          ownerId: record.ownerId,
          settings: record.settings,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(workspace)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findById(id: string): Promise<Result<Workspace | null, Error>> {
    try {
      const record = workspaceStore.get(id)

      if (!record) {
        return Result.ok(null)
      }

      const workspace = new Workspace(
        {
          name: record.name,
          description: record.description,
          ownerId: record.ownerId,
          settings: record.settings,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(workspace)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByUserId(userId: string, options?: FindWorkspacesByUserOptions): Promise<Result<Workspace[], Error>> {
    try {
      const userWorkspaces = Array.from(workspaceStore.values())
        .filter(record => record.ownerId === userId)
        .filter(record => options?.includeInactive || record.isActive)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      const page = options?.page || 1
      const limit = options?.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedWorkspaces = userWorkspaces.slice(startIndex, endIndex)

      const workspaces = paginatedWorkspaces.map(record => new Workspace(
        {
          name: record.name,
          description: record.description,
          ownerId: record.ownerId,
          settings: record.settings,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(workspaces)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async update(id: string, data: UpdateWorkspaceData): Promise<Result<Workspace, Error>> {
    try {
      const record = workspaceStore.get(id)

      if (!record) {
        return Result.err(new Error('Workspace not found'))
      }

      const updatedRecord: WorkspaceRecord = {
        ...record,
        ...data,
        updatedAt: new Date()
      }

      workspaceStore.set(id, updatedRecord)

      const workspace = new Workspace(
        {
          name: updatedRecord.name,
          description: updatedRecord.description,
          ownerId: updatedRecord.ownerId,
          settings: updatedRecord.settings,
          isActive: updatedRecord.isActive
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(workspace)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async delete(id: string): Promise<Result<boolean, Error>> {
    try {
      const deleted = workspaceStore.delete(id)
      return Result.ok(deleted)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findActiveByUserId(userId: string): Promise<Result<Workspace[], Error>> {
    return this.findByUserId(userId, { includeInactive: false })
  }

  async findByOwner(ownerId: string): Promise<Result<Workspace[], Error>> {
    try {
      const ownerWorkspaces = Array.from(workspaceStore.values())
        .filter(record => record.ownerId === ownerId)
        .filter(record => record.isActive)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      const workspaces = ownerWorkspaces.map(record => new Workspace(
        {
          name: record.name,
          description: record.description,
          ownerId: record.ownerId,
          settings: record.settings,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(workspaces)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByUserId(userId: string): Promise<Result<number, Error>> {
    try {
      const count = Array.from(workspaceStore.values())
        .filter(record => record.ownerId === userId)
        .filter(record => record.isActive).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async updateSettings(id: string, settings: any): Promise<Result<Workspace, Error>> {
    return this.update(id, { settings })
  }

  async transferOwnership(id: string, newOwnerId: string): Promise<Result<Workspace, Error>> {
    return this.update(id, { ownerId: newOwnerId } as any)
  }

  async deactivate(id: string): Promise<Result<Workspace, Error>> {
    return this.update(id, { isActive: false })
  }

  async activate(id: string): Promise<Result<Workspace, Error>> {
    return this.update(id, { isActive: true })
  }

  async existsByNameAndOwner(name: string, ownerId: string): Promise<Result<boolean, Error>> {
    try {
      const exists = Array.from(workspaceStore.values())
        .some(record => record.name === name && record.ownerId === ownerId && record.isActive)

      return Result.ok(exists)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async isUserOwner(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    try {
      const record = workspaceStore.get(workspaceId)
      const isOwner = record?.ownerId === userId && record.isActive
      return Result.ok(isOwner || false)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}