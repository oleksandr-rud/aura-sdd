/**
 * Workspace Member Repository Implementation
 * Infrastructure layer - concrete implementation of workspace member persistence
 */

import { Result } from '@/libs/utils'
import { WorkspaceMember, WorkspaceRole } from '../../domain/entities'
import type {
  WorkspaceMemberRepository,
  FindMembersOptions,
  CreateMemberData,
  UpdateMemberData
} from '../../domain/repositories'

// Mock database for demonstration - in real implementation, this would use a real database
interface WorkspaceMemberRecord {
  id: string
  userId: string
  workspaceId: string
  role: WorkspaceRole
  joinedAt: Date
  invitedBy?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory storage (replace with actual database implementation)
const memberStore: Map<string, WorkspaceMemberRecord> = new Map()

export class WorkspaceMemberRepositoryImpl implements WorkspaceMemberRepository {
  async create(data: CreateMemberData): Promise<Result<WorkspaceMember, Error>> {
    try {
      const now = new Date()
      const id = crypto.randomUUID()

      const record: WorkspaceMemberRecord = {
        id,
        userId: data.userId,
        workspaceId: data.workspaceId,
        role: data.role,
        joinedAt: now,
        invitedBy: data.invitedBy,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }

      memberStore.set(id, record)

      const member = new WorkspaceMember(
        {
          userId: record.userId,
          workspaceId: record.workspaceId,
          role: record.role,
          joinedAt: record.joinedAt,
          invitedBy: record.invitedBy,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(member)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findById(id: string): Promise<Result<WorkspaceMember | null, Error>> {
    try {
      const record = memberStore.get(id)

      if (!record) {
        return Result.ok(null)
      }

      const member = new WorkspaceMember(
        {
          userId: record.userId,
          workspaceId: record.workspaceId,
          role: record.role,
          joinedAt: record.joinedAt,
          invitedBy: record.invitedBy,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(member)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<Result<WorkspaceMember | null, Error>> {
    try {
      const record = Array.from(memberStore.values())
        .find(r => r.workspaceId === workspaceId && r.userId === userId && r.isActive)

      if (!record) {
        return Result.ok(null)
      }

      const member = new WorkspaceMember(
        {
          userId: record.userId,
          workspaceId: record.workspaceId,
          role: record.role,
          joinedAt: record.joinedAt,
          invitedBy: record.invitedBy,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(member)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByUserId(userId: string): Promise<Result<WorkspaceMember[], Error>> {
    try {
      const userMemberships = Array.from(memberStore.values())
        .filter(record => record.userId === userId)
        .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime())

      const members = userMemberships.map(record => new WorkspaceMember(
        {
          userId: record.userId,
          workspaceId: record.workspaceId,
          role: record.role,
          joinedAt: record.joinedAt,
          invitedBy: record.invitedBy,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(members)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async update(id: string, data: UpdateMemberData): Promise<Result<WorkspaceMember, Error>> {
    try {
      const record = memberStore.get(id)

      if (!record) {
        return Result.err(new Error('Member not found'))
      }

      const updatedRecord: WorkspaceMemberRecord = {
        ...record,
        ...data,
        updatedAt: new Date()
      }

      memberStore.set(id, updatedRecord)

      const member = new WorkspaceMember(
        {
          userId: updatedRecord.userId,
          workspaceId: updatedRecord.workspaceId,
          role: updatedRecord.role,
          joinedAt: updatedRecord.joinedAt,
          invitedBy: updatedRecord.invitedBy,
          isActive: updatedRecord.isActive
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(member)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async delete(id: string): Promise<Result<boolean, Error>> {
    try {
      const deleted = memberStore.delete(id)
      return Result.ok(deleted)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByWorkspace(workspaceId: string, options?: FindMembersOptions): Promise<Result<WorkspaceMember[], Error>> {
    try {
      let workspaceMembers = Array.from(memberStore.values())
        .filter(record => record.workspaceId === workspaceId)
        .filter(record => options?.includeInactive || record.isActive)

      if (options?.role) {
        workspaceMembers = workspaceMembers.filter(record => record.role === options.role)
      }

      workspaceMembers.sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())

      const page = options?.page || 1
      const limit = options?.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedMembers = workspaceMembers.slice(startIndex, endIndex)

      const members = paginatedMembers.map(record => new WorkspaceMember(
        {
          userId: record.userId,
          workspaceId: record.workspaceId,
          role: record.role,
          joinedAt: record.joinedAt,
          invitedBy: record.invitedBy,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(members)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findActiveByWorkspace(workspaceId: string): Promise<Result<WorkspaceMember[], Error>> {
    return this.findByWorkspace(workspaceId, { includeInactive: false })
  }

  async countByWorkspace(workspaceId: string): Promise<Result<number, Error>> {
    try {
      const count = Array.from(memberStore.values())
        .filter(record => record.workspaceId === workspaceId && record.isActive).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByRole(workspaceId: string, role: WorkspaceRole): Promise<Result<number, Error>> {
    try {
      const count = Array.from(memberStore.values())
        .filter(record => record.workspaceId === workspaceId && record.role === role && record.isActive).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByUserAndWorkspace(userId: string, workspaceId: string): Promise<Result<WorkspaceMember | null, Error>> {
    return this.findByWorkspaceAndUser(workspaceId, userId)
  }

  async findActiveByUser(userId: string): Promise<Result<WorkspaceMember[], Error>> {
    try {
      const activeMemberships = Array.from(memberStore.values())
        .filter(record => record.userId === userId && record.isActive)
        .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime())

      const members = activeMemberships.map(record => new WorkspaceMember(
        {
          userId: record.userId,
          workspaceId: record.workspaceId,
          role: record.role,
          joinedAt: record.joinedAt,
          invitedBy: record.invitedBy,
          isActive: record.isActive
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(members)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async updateRole(id: string, role: WorkspaceRole): Promise<Result<WorkspaceMember, Error>> {
    return this.update(id, { role })
  }

  async deactivate(id: string): Promise<Result<WorkspaceMember, Error>> {
    return this.update(id, { isActive: false })
  }

  async reactivate(id: string): Promise<Result<WorkspaceMember, Error>> {
    return this.update(id, { isActive: true })
  }

  async removeMember(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    try {
      const record = Array.from(memberStore.values())
        .find(r => r.workspaceId === workspaceId && r.userId === userId)

      if (!record) {
        return Result.ok(false)
      }

      const deleted = memberStore.delete(record.id)
      return Result.ok(deleted)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async isUserMember(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    try {
      const record = Array.from(memberStore.values())
        .find(r => r.workspaceId === workspaceId && r.userId === userId && r.isActive)

      return Result.ok(!!record)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getUserRole(workspaceId: string, userId: string): Promise<Result<WorkspaceRole | null, Error>> {
    try {
      const record = Array.from(memberStore.values())
        .find(r => r.workspaceId === workspaceId && r.userId === userId && r.isActive)

      return Result.ok(record?.role || null)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async hasPermission(workspaceId: string, userId: string, permission: string): Promise<Result<boolean, Error>> {
    try {
      const roleResult = await this.getUserRole(workspaceId, userId)

      if (roleResult.isErr()) {
        return Result.err(roleResult.unwrapErr())
      }

      const role = roleResult.unwrap()
      if (!role) {
        return Result.ok(false)
      }

      // Check permissions based on role
      switch (permission) {
        case 'manage_members':
          return Result.ok(role === 'owner' || role === 'admin')
        case 'manage_settings':
          return Result.ok(role === 'owner' || role === 'admin')
        case 'delete_workspace':
          return Result.ok(role === 'owner')
        case 'invite_members':
          return Result.ok(role === 'owner' || role === 'admin')
        default:
          return Result.ok(false)
      }
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async canUserAddMember(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    return this.hasPermission(workspaceId, userId, 'invite_members')
  }

  async canUserRemoveMember(workspaceId: string, userId: string, targetUserId: string): Promise<Result<boolean, Error>> {
    try {
      const userRoleResult = await this.getUserRole(workspaceId, userId)
      const targetRoleResult = await this.getUserRole(workspaceId, targetUserId)

      if (userRoleResult.isErr() || targetRoleResult.isErr()) {
        return Result.err(new Error('Failed to get user roles'))
      }

      const userRole = userRoleResult.unwrap()
      const targetRole = targetRoleResult.unwrap()

      if (!userRole || !targetRole) {
        return Result.ok(false)
      }

      // Owner can remove anyone except themselves
      if (userRole === 'owner' && targetRole !== 'owner') {
        return Result.ok(true)
      }

      // Admin can remove members but not other admins or owner
      if (userRole === 'admin' && targetRole === 'member') {
        return Result.ok(true)
      }

      return Result.ok(false)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async canUserUpdateRole(workspaceId: string, userId: string, targetUserId: string, newRole: WorkspaceRole): Promise<Result<boolean, Error>> {
    try {
      const userRoleResult = await this.getUserRole(workspaceId, userId)
      const targetRoleResult = await this.getUserRole(workspaceId, targetUserId)

      if (userRoleResult.isErr() || targetRoleResult.isErr()) {
        return Result.err(new Error('Failed to get user roles'))
      }

      const userRole = userRoleResult.unwrap()
      const targetRole = targetRoleResult.unwrap()

      if (!userRole || !targetRole) {
        return Result.ok(false)
      }

      // Owner can update anyone's role
      if (userRole === 'owner') {
        return Result.ok(true)
      }

      // Admin can update members to admin or member (but not to owner)
      if (userRole === 'admin' && targetRole === 'member' && newRole !== 'owner') {
        return Result.ok(true)
      }

      return Result.ok(false)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Helper method for invitation repository (not in interface but needed)
  async findByEmailAndWorkspace(email: string, workspaceId: string): Promise<Result<WorkspaceMember | null, Error>> {
    // This would require user lookup by email - for now return null
    // In a real implementation, you'd join with users table
    return Result.ok(null)
  }
}