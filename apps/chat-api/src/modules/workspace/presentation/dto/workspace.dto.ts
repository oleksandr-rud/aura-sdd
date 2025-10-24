/**
 * Workspace DTOs
 * Presentation layer - data transfer objects for workspace API
 */

import { z } from 'zod'
import { commonSchemas } from '@/libs/validation'

// Request DTOs
export const CreateWorkspaceDto = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional()
})

export const UpdateWorkspaceDto = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(200).optional(),
  settings: z.object({
    allowInvites: z.boolean().optional(),
    requireApproval: z.boolean().optional(),
    maxMembers: z.number().min(1).max(1000).optional(),
    defaultRole: z.enum(['admin', 'member']).optional()
  }).optional()
})

export const InviteMemberDto = z.object({
  email: commonSchemas.email,
  role: z.enum(['admin', 'member'])
})

export const UpdateMemberRoleDto = z.object({
  role: z.enum(['admin', 'member'])
})

export const AcceptInvitationDto = z.object({
  token: commonSchemas.uuid
})

export const DeclineInvitationDto = z.object({
  token: commonSchemas.uuid
})

export const GetWorkspacesDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  includeInactive: z.boolean().default(false)
})

export const GetWorkspaceMembersDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  role: z.enum(['owner', 'admin', 'member']).optional()
})

// Response DTOs
export interface WorkspaceResponse {
  id: string
  name: string
  description?: string
  ownerId: string
  settings: {
    allowInvites: boolean
    requireApproval: boolean
    maxMembers: number
    defaultRole: 'admin' | 'member'
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkspaceWithRoleResponse {
  workspace: WorkspaceResponse
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface WorkspaceMemberResponse {
  id: string
  userId: string
  workspaceId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
  invitedBy?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkspaceInvitationResponse {
  id: string
  email: string
  workspaceId: string
  workspaceName?: string
  role: 'admin' | 'member'
  invitedBy: string
  invitedByName?: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  acceptedAt?: string
  respondedBy?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedWorkspacesResponse {
  workspaces: WorkspaceWithRoleResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedMembersResponse {
  members: WorkspaceMemberResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedInvitationsResponse {
  invitations: WorkspaceInvitationResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Helper functions to transform domain entities to DTOs
export const toWorkspaceResponse = (workspace: any): WorkspaceResponse => ({
  id: workspace.id,
  name: workspace.name,
  description: workspace.description,
  ownerId: workspace.ownerId,
  settings: workspace.settings,
  isActive: workspace.isActive,
  createdAt: workspace.createdAt.toISOString(),
  updatedAt: workspace.updatedAt.toISOString()
})

export const toWorkspaceWithRoleResponse = (data: any): WorkspaceWithRoleResponse => ({
  workspace: toWorkspaceResponse(data.workspace),
  role: data.role,
  joinedAt: data.joinedAt.toISOString()
})

export const toWorkspaceMemberResponse = (member: any): WorkspaceMemberResponse => ({
  id: member.id,
  userId: member.userId,
  workspaceId: member.workspaceId,
  role: member.role,
  joinedAt: member.joinedAt.toISOString(),
  invitedBy: member.invitedBy,
  isActive: member.isActive,
  createdAt: member.createdAt.toISOString(),
  updatedAt: member.updatedAt.toISOString()
})

export const toWorkspaceInvitationResponse = (invitation: any, workspaceName?: string, invitedByName?: string): WorkspaceInvitationResponse => ({
  id: invitation.id,
  email: invitation.email,
  workspaceId: invitation.workspaceId,
  workspaceName,
  role: invitation.role,
  invitedBy: invitation.invitedBy,
  invitedByName,
  expiresAt: invitation.expiresAt.toISOString(),
  status: invitation.status,
  acceptedAt: invitation.acceptedAt?.toISOString(),
  respondedBy: invitation.respondedBy,
  createdAt: invitation.createdAt.toISOString(),
  updatedAt: invitation.updatedAt.toISOString()
})

// Validation schemas export
export const workspaceValidationSchemas = {
  createWorkspace: CreateWorkspaceDto,
  updateWorkspace: UpdateWorkspaceDto,
  inviteMember: InviteMemberDto,
  updateMemberRole: UpdateMemberRoleDto,
  acceptInvitation: AcceptInvitationDto,
  declineInvitation: DeclineInvitationDto,
  getWorkspaces: GetWorkspacesDto,
  getWorkspaceMembers: GetWorkspaceMembersDto
}