/**
 * Workspace Member Repository Interface
 * Domain layer - defines contract for workspace member persistence
 */

import { Result } from '@/libs/utils'
import { WorkspaceMember, WorkspaceRole } from '../entities/workspace-member'

export interface FindMembersOptions {
  workspaceId: string
  page?: number
  limit?: number
  role?: WorkspaceRole
  includeInactive?: boolean
}

export interface CreateMemberData {
  userId: string
  workspaceId: string
  role: WorkspaceRole
  invitedBy?: string
}

export interface UpdateMemberData {
  role?: WorkspaceRole
  isActive?: boolean
}

export interface WorkspaceMemberRepository {
  // CRUD operations
  create(data: CreateMemberData): Promise<Result<WorkspaceMember, Error>>
  findById(id: string): Promise<Result<WorkspaceMember | null, Error>>
  findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<Result<WorkspaceMember | null, Error>>
  findByUserId(userId: string): Promise<Result<WorkspaceMember[], Error>>
  update(id: string, data: UpdateMemberData): Promise<Result<WorkspaceMember, Error>>
  delete(id: string): Promise<Result<boolean, Error>>

  // Workspace-specific queries
  findByWorkspace(workspaceId: string, options?: FindMembersOptions): Promise<Result<WorkspaceMember[], Error>>
  findActiveByWorkspace(workspaceId: string): Promise<Result<WorkspaceMember[], Error>>
  countByWorkspace(workspaceId: string): Promise<Result<number, Error>>
  countByRole(workspaceId: string, role: WorkspaceRole): Promise<Result<number, Error>>

  // User-specific queries
  findByUserAndWorkspace(userId: string, workspaceId: string): Promise<Result<WorkspaceMember | null, Error>>
  findActiveByUser(userId: string): Promise<Result<WorkspaceMember[], Error>>

  // Member management
  updateRole(id: string, role: WorkspaceRole): Promise<Result<WorkspaceMember, Error>>
  deactivate(id: string): Promise<Result<WorkspaceMember, Error>>
  reactivate(id: string): Promise<Result<WorkspaceMember, Error>>
  removeMember(workspaceId: string, userId: string): Promise<Result<boolean, Error>>

  // Permission checks
  isUserMember(workspaceId: string, userId: string): Promise<Result<boolean, Error>>
  getUserRole(workspaceId: string, userId: string): Promise<Result<WorkspaceRole | null, Error>>
  hasPermission(workspaceId: string, userId: string, permission: string): Promise<Result<boolean, Error>>

  // Validation queries
  canUserAddMember(workspaceId: string, userId: string): Promise<Result<boolean, Error>>
  canUserRemoveMember(workspaceId: string, userId: string, targetUserId: string): Promise<Result<boolean, Error>>
  canUserUpdateRole(workspaceId: string, userId: string, targetUserId: string, newRole: WorkspaceRole): Promise<Result<boolean, Error>>
}