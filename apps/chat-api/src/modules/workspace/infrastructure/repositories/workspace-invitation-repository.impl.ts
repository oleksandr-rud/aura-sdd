/**
 * Workspace Invitation Repository Implementation
 * Infrastructure layer - concrete implementation of workspace invitation persistence
 */

import { Result } from '@/libs/utils'
import { WorkspaceInvitation, InvitationStatus } from '../../domain/entities'
import type {
  WorkspaceInvitationRepository,
  FindInvitationsOptions,
  CreateInvitationData,
  UpdateInvitationData
} from '../../domain/repositories'

// Mock database for demonstration - in real implementation, this would use a real database
interface WorkspaceInvitationRecord {
  id: string
  email: string
  workspaceId: string
  role: 'admin' | 'member'
  token: string
  invitedBy: string
  expiresAt: Date
  status: InvitationStatus
  acceptedAt?: Date
  respondedBy?: string
  createdAt: Date
  updatedAt: Date
}

// In-memory storage (replace with actual database implementation)
const invitationStore: Map<string, WorkspaceInvitationRecord> = new Map()

export class WorkspaceInvitationRepositoryImpl implements WorkspaceInvitationRepository {
  async create(data: CreateInvitationData): Promise<Result<WorkspaceInvitation, Error>> {
    try {
      const now = new Date()
      const id = crypto.randomUUID()
      const token = crypto.randomUUID()
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const record: WorkspaceInvitationRecord = {
        id,
        email: data.email,
        workspaceId: data.workspaceId,
        role: data.role,
        token,
        invitedBy: data.invitedBy,
        expiresAt,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      }

      invitationStore.set(id, record)

      const invitation = new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findById(id: string): Promise<Result<WorkspaceInvitation | null, Error>> {
    try {
      const record = invitationStore.get(id)

      if (!record) {
        return Result.ok(null)
      }

      const invitation = new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByToken(token: string): Promise<Result<WorkspaceInvitation | null, Error>> {
    try {
      const record = Array.from(invitationStore.values())
        .find(r => r.token === token)

      if (!record) {
        return Result.ok(null)
      }

      const invitation = new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async update(id: string, data: UpdateInvitationData): Promise<Result<WorkspaceInvitation, Error>> {
    try {
      const record = invitationStore.get(id)

      if (!record) {
        return Result.err(new Error('Invitation not found'))
      }

      const updatedRecord: WorkspaceInvitationRecord = {
        ...record,
        ...data,
        updatedAt: new Date()
      }

      invitationStore.set(id, updatedRecord)

      const invitation = new WorkspaceInvitation(
        {
          email: updatedRecord.email,
          workspaceId: updatedRecord.workspaceId,
          role: updatedRecord.role,
          token: updatedRecord.token,
          invitedBy: updatedRecord.invitedBy,
          expiresAt: updatedRecord.expiresAt,
          status: updatedRecord.status,
          acceptedAt: updatedRecord.acceptedAt,
          respondedBy: updatedRecord.respondedBy
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async delete(id: string): Promise<Result<boolean, Error>> {
    try {
      const deleted = invitationStore.delete(id)
      return Result.ok(deleted)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByWorkspace(workspaceId: string, options?: FindInvitationsOptions): Promise<Result<WorkspaceInvitation[], Error>> {
    try {
      let workspaceInvitations = Array.from(invitationStore.values())
        .filter(record => record.workspaceId === workspaceId)

      if (options?.status) {
        workspaceInvitations = workspaceInvitations.filter(record => record.status === options.status)
      }

      if (options?.email) {
        workspaceInvitations = workspaceInvitations.filter(record => record.email === options.email)
      }

      workspaceInvitations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const page = options?.page || 1
      const limit = options?.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedInvitations = workspaceInvitations.slice(startIndex, endIndex)

      const invitations = paginatedInvitations.map(record => new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(invitations)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findPendingByWorkspace(workspaceId: string): Promise<Result<WorkspaceInvitation[], Error>> {
    return this.findByWorkspace(workspaceId, { status: 'pending' })
  }

  async countByWorkspace(workspaceId: string, status?: InvitationStatus): Promise<Result<number, Error>> {
    try {
      let count = Array.from(invitationStore.values())
        .filter(record => record.workspaceId === workspaceId)

      if (status) {
        count = count.filter(record => record.status === status)
      }

      return Result.ok(count.length)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByEmail(email: string): Promise<Result<WorkspaceInvitation[], Error>> {
    try {
      const emailInvitations = Array.from(invitationStore.values())
        .filter(record => record.email === email)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const invitations = emailInvitations.map(record => new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(invitations)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findPendingByEmail(email: string): Promise<Result<WorkspaceInvitation[], Error>> {
    try {
      const pendingInvitations = Array.from(invitationStore.values())
        .filter(record => record.email === email && record.status === 'pending')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const invitations = pendingInvitations.map(record => new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(invitations)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByEmailAndWorkspace(email: string, workspaceId: string): Promise<Result<WorkspaceInvitation | null, Error>> {
    try {
      const record = Array.from(invitationStore.values())
        .find(r => r.email === email && r.workspaceId === workspaceId)

      if (!record) {
        return Result.ok(null)
      }

      const invitation = new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByStatus(status: InvitationStatus, options?: FindInvitationsOptions): Promise<Result<WorkspaceInvitation[], Error>> {
    try {
      let statusInvitations = Array.from(invitationStore.values())
        .filter(record => record.status === status)

      if (options?.workspaceId) {
        statusInvitations = statusInvitations.filter(record => record.workspaceId === options.workspaceId)
      }

      if (options?.email) {
        statusInvitations = statusInvitations.filter(record => record.email === options.email)
      }

      statusInvitations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const page = options?.page || 1
      const limit = options?.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedInvitations = statusInvitations.slice(startIndex, endIndex)

      const invitations = paginatedInvitations.map(record => new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(invitations)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findExpired(): Promise<Result<WorkspaceInvitation[], Error>> {
    try {
      const now = new Date()
      const expiredInvitations = Array.from(invitationStore.values())
        .filter(record => record.expiresAt < now && record.status === 'pending')
        .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime())

      const invitations = expiredInvitations.map(record => new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(invitations)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findExpiringSoon(hours: number): Promise<Result<WorkspaceInvitation[], Error>> {
    try {
      const now = new Date()
      const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000)

      const expiringInvitations = Array.from(invitationStore.values())
        .filter(record => record.expiresAt <= cutoff && record.expiresAt > now && record.status === 'pending')
        .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime())

      const invitations = expiringInvitations.map(record => new WorkspaceInvitation(
        {
          email: record.email,
          workspaceId: record.workspaceId,
          role: record.role,
          token: record.token,
          invitedBy: record.invitedBy,
          expiresAt: record.expiresAt,
          status: record.status,
          acceptedAt: record.acceptedAt,
          respondedBy: record.respondedBy
        },
        record.id,
        record.createdAt,
        record.updatedAt
      ))

      return Result.ok(invitations)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async accept(token: string, userId: string): Promise<Result<WorkspaceInvitation, Error>> {
    try {
      const record = Array.from(invitationStore.values())
        .find(r => r.token === token)

      if (!record) {
        return Result.err(new Error('Invitation not found'))
      }

      if (record.status !== 'pending') {
        return Result.err(new Error('Invitation is not pending'))
      }

      if (record.expiresAt < new Date()) {
        return Result.err(new Error('Invitation has expired'))
      }

      const updatedRecord: WorkspaceInvitationRecord = {
        ...record,
        status: 'accepted',
        acceptedAt: new Date(),
        respondedBy: userId,
        updatedAt: new Date()
      }

      invitationStore.set(record.id, updatedRecord)

      const invitation = new WorkspaceInvitation(
        {
          email: updatedRecord.email,
          workspaceId: updatedRecord.workspaceId,
          role: updatedRecord.role,
          token: updatedRecord.token,
          invitedBy: updatedRecord.invitedBy,
          expiresAt: updatedRecord.expiresAt,
          status: updatedRecord.status,
          acceptedAt: updatedRecord.acceptedAt,
          respondedBy: updatedRecord.respondedBy
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async decline(token: string, userId: string): Promise<Result<WorkspaceInvitation, Error>> {
    try {
      const record = Array.from(invitationStore.values())
        .find(r => r.token === token)

      if (!record) {
        return Result.err(new Error('Invitation not found'))
      }

      if (record.status !== 'pending') {
        return Result.err(new Error('Invitation is not pending'))
      }

      if (record.expiresAt < new Date()) {
        return Result.err(new Error('Invitation has expired'))
      }

      const updatedRecord: WorkspaceInvitationRecord = {
        ...record,
        status: 'declined',
        respondedBy: userId,
        updatedAt: new Date()
      }

      invitationStore.set(record.id, updatedRecord)

      const invitation = new WorkspaceInvitation(
        {
          email: updatedRecord.email,
          workspaceId: updatedRecord.workspaceId,
          role: updatedRecord.role,
          token: updatedRecord.token,
          invitedBy: updatedRecord.invitedBy,
          expiresAt: updatedRecord.expiresAt,
          status: updatedRecord.status,
          acceptedAt: updatedRecord.acceptedAt,
          respondedBy: updatedRecord.respondedBy
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async revoke(id: string): Promise<Result<WorkspaceInvitation, Error>> {
    try {
      const record = invitationStore.get(id)

      if (!record) {
        return Result.err(new Error('Invitation not found'))
      }

      if (record.status !== 'pending') {
        return Result.err(new Error('Only pending invitations can be revoked'))
      }

      const updatedRecord: WorkspaceInvitationRecord = {
        ...record,
        status: 'declined',
        updatedAt: new Date()
      }

      invitationStore.set(id, updatedRecord)

      const invitation = new WorkspaceInvitation(
        {
          email: updatedRecord.email,
          workspaceId: updatedRecord.workspaceId,
          role: updatedRecord.role,
          token: updatedRecord.token,
          invitedBy: updatedRecord.invitedBy,
          expiresAt: updatedRecord.expiresAt,
          status: updatedRecord.status,
          acceptedAt: updatedRecord.acceptedAt,
          respondedBy: updatedRecord.respondedBy
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async expire(id: string): Promise<Result<WorkspaceInvitation, Error>> {
    try {
      const record = invitationStore.get(id)

      if (!record) {
        return Result.err(new Error('Invitation not found'))
      }

      if (record.status !== 'pending') {
        return Result.err(new Error('Only pending invitations can be expired'))
      }

      const updatedRecord: WorkspaceInvitationRecord = {
        ...record,
        status: 'expired',
        updatedAt: new Date()
      }

      invitationStore.set(id, updatedRecord)

      const invitation = new WorkspaceInvitation(
        {
          email: updatedRecord.email,
          workspaceId: updatedRecord.workspaceId,
          role: updatedRecord.role,
          token: updatedRecord.token,
          invitedBy: updatedRecord.invitedBy,
          expiresAt: updatedRecord.expiresAt,
          status: updatedRecord.status,
          acceptedAt: updatedRecord.acceptedAt,
          respondedBy: updatedRecord.respondedBy
        },
        updatedRecord.id,
        updatedRecord.createdAt,
        updatedRecord.updatedAt
      )

      return Result.ok(invitation)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async isInvitationPending(workspaceId: string, email: string): Promise<Result<boolean, Error>> {
    try {
      const pending = Array.from(invitationStore.values())
        .some(record => record.workspaceId === workspaceId && record.email === email && record.status === 'pending')

      return Result.ok(pending)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async isTokenValid(token: string): Promise<Result<boolean, Error>> {
    try {
      const record = Array.from(invitationStore.values())
        .find(r => r.token === token)

      if (!record) {
        return Result.ok(false)
      }

      const isValid = record.status === 'pending' && record.expiresAt > new Date()
      return Result.ok(isValid)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async canUserInvite(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    // This would typically check against workspace member repository
    // For now, we'll assume the user can invite if they have a valid invitation
    return Result.ok(true)
  }

  async deleteExpired(): Promise<Result<number, Error>> {
    try {
      const now = new Date()
      const expiredRecords = Array.from(invitationStore.values())
        .filter(record => record.expiresAt < now)

      let deletedCount = 0
      for (const record of expiredRecords) {
        if (invitationStore.delete(record.id)) {
          deletedCount++
        }
      }

      return Result.ok(deletedCount)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async deleteByWorkspace(workspaceId: string): Promise<Result<boolean, Error>> {
    try {
      const workspaceInvitations = Array.from(invitationStore.values())
        .filter(record => record.workspaceId === workspaceId)

      let deletedAll = true
      for (const record of workspaceInvitations) {
        if (!invitationStore.delete(record.id)) {
          deletedAll = false
        }
      }

      return Result.ok(deletedAll)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}