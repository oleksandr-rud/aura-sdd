/**
 * Workspace Invitation Repository Interface
 * Domain layer - defines contract for workspace invitation persistence
 */

import { Result } from '@/libs/utils'
import { WorkspaceInvitation, InvitationStatus } from '../entities/workspace-invitation'

export interface FindInvitationsOptions {
  workspaceId?: string
  email?: string
  status?: InvitationStatus
  page?: number
  limit?: number
}

export interface CreateInvitationData {
  email: string
  workspaceId: string
  role: 'admin' | 'member'
  invitedBy: string
}

export interface UpdateInvitationData {
  status?: InvitationStatus
  acceptedAt?: Date
  respondedBy?: string
}

export interface WorkspaceInvitationRepository {
  // CRUD operations
  create(data: CreateInvitationData): Promise<Result<WorkspaceInvitation, Error>>
  findById(id: string): Promise<Result<WorkspaceInvitation | null, Error>>
  findByToken(token: string): Promise<Result<WorkspaceInvitation | null, Error>>
  update(id: string, data: UpdateInvitationData): Promise<Result<WorkspaceInvitation, Error>>
  delete(id: string): Promise<Result<boolean, Error>>

  // Workspace-specific queries
  findByWorkspace(workspaceId: string, options?: FindInvitationsOptions): Promise<Result<WorkspaceInvitation[], Error>>
  findPendingByWorkspace(workspaceId: string): Promise<Result<WorkspaceInvitation[], Error>>
  countByWorkspace(workspaceId: string, status?: InvitationStatus): Promise<Result<number, Error>>

  // Email-specific queries
  findByEmail(email: string): Promise<Result<WorkspaceInvitation[], Error>>
  findPendingByEmail(email: string): Promise<Result<WorkspaceInvitation[], Error>>
  findByEmailAndWorkspace(email: string, workspaceId: string): Promise<Result<WorkspaceInvitation | null, Error>>

  // Status-specific queries
  findByStatus(status: InvitationStatus, options?: FindInvitationsOptions): Promise<Result<WorkspaceInvitation[], Error>>
  findExpired(): Promise<Result<WorkspaceInvitation[], Error>>
  findExpiringSoon(hours: number): Promise<Result<WorkspaceInvitation[], Error>>

  // Invitation management
  accept(token: string, userId: string): Promise<Result<WorkspaceInvitation, Error>>
  decline(token: string, userId: string): Promise<Result<WorkspaceInvitation, Error>>
  revoke(id: string): Promise<Result<WorkspaceInvitation, Error>>
  expire(id: string): Promise<Result<WorkspaceInvitation, Error>>

  // Validation queries
  isInvitationPending(workspaceId: string, email: string): Promise<Result<boolean, Error>>
  isTokenValid(token: string): Promise<Result<boolean, Error>>
  canUserInvite(workspaceId: string, userId: string): Promise<Result<boolean, Error>>

  // Cleanup operations
  deleteExpired(): Promise<Result<number, Error>>
  deleteByWorkspace(workspaceId: string): Promise<Result<boolean, Error>>
}