/**
 * Workspace Controller
 * Presentation layer - handles HTTP requests for workspace operations
 */

import { Request, Response, NextFunction } from 'express'
import { Result } from '@/libs/utils'
import { WorkspaceApplicationService } from '../../application/services/workspace-application-service'
import {
  toWorkspaceResponse,
  toWorkspaceWithRoleResponse,
  toWorkspaceMemberResponse,
  toWorkspaceInvitationResponse,
  workspaceValidationSchemas,
  type WorkspaceResponse,
  type WorkspaceWithRoleResponse,
  type WorkspaceMemberResponse,
  type WorkspaceInvitationResponse,
  type PaginatedWorkspacesResponse,
  type PaginatedMembersResponse,
  type PaginatedInvitationsResponse
} from '../dto/workspace.dto'

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceApplicationService) {}

  // GET /workspace/workspaces - List user's workspaces
  async getUserWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.getWorkspaces.safeParse(req.query)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      const result = await this.workspaceService.getUserWorkspaces({
        userId,
        ...validationResult.data
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const response = result.unwrap()
      const workspacesWithRole = response.workspaces.map(toWorkspaceWithRoleResponse)

      const paginatedResponse: PaginatedWorkspacesResponse = {
        workspaces: workspacesWithRole,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      }

      res.status(200).json(paginatedResponse)
    } catch (error) {
      next(error)
    }
  }

  // POST /workspace/workspaces - Create new workspace
  async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.createWorkspace.safeParse(req.body)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      const result = await this.workspaceService.createWorkspace({
        ...validationResult.data,
        ownerId: userId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const response = result.unwrap()
      res.status(201).json({
        workspace: toWorkspaceResponse(response.workspace),
        ownerMember: toWorkspaceMemberResponse(response.ownerMember)
      })
    } catch (error) {
      next(error)
    }
  }

  // GET /workspace/workspaces/:id - Get specific workspace
  async getWorkspaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const result = await this.workspaceService.getWorkspaceById(workspaceId)

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const workspace = result.unwrap()
      if (!workspace) {
        res.status(404).json({ error: 'Workspace not found' })
        return
      }

      // TODO: Check if user has access to this workspace
      // For now, we'll assume they do if they found it

      res.status(200).json(toWorkspaceResponse(workspace))
    } catch (error) {
      next(error)
    }
  }

  // PUT /workspace/workspaces/:id - Update workspace
  async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.updateWorkspace.safeParse(req.body)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      const result = await this.workspaceService.updateWorkspace({
        workspaceId,
        userId,
        ...validationResult.data
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const response = result.unwrap()
      res.status(200).json(toWorkspaceResponse(response.workspace))
    } catch (error) {
      next(error)
    }
  }

  // DELETE /workspace/workspaces/:id - Delete workspace
  async deleteWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      // TODO: Implement delete workspace in application service
      res.status(501).json({ error: 'Not implemented yet' })
    } catch (error) {
      next(error)
    }
  }

  // GET /workspace/workspaces/:id/members - List workspace members
  async getWorkspaceMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.getWorkspaceMembers.safeParse(req.query)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      // TODO: Check if user has access to this workspace
      const result = await this.workspaceService.getWorkspaceMembers(workspaceId, validationResult.data)

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const members = result.unwrap()
      const memberResponses = members.map(toWorkspaceMemberResponse)

      const paginatedResponse: PaginatedMembersResponse = {
        members: memberResponses,
        total: memberResponses.length,
        page: validationResult.data.page,
        limit: validationResult.data.limit,
        totalPages: Math.ceil(memberResponses.length / validationResult.data.limit)
      }

      res.status(200).json(paginatedResponse)
    } catch (error) {
      next(error)
    }
  }

  // POST /workspace/workspaces/:id/invite - Invite member
  async inviteMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.inviteMember.safeParse(req.body)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      const result = await this.workspaceService.inviteMember({
        workspaceId,
        inviterId: userId,
        ...validationResult.data
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const response = result.unwrap()
      res.status(201).json({
        invitation: toWorkspaceInvitationResponse(response.invitation)
      })
    } catch (error) {
      next(error)
    }
  }

  // PUT /workspace/workspaces/:id/members/:userId - Update member role
  async updateMemberRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id
      const targetUserId = req.params.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.updateMemberRole.safeParse(req.body)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      const result = await this.workspaceService.updateMemberRole(
        workspaceId,
        targetUserId,
        validationResult.data.role,
        userId
      )

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const member = result.unwrap()
      res.status(200).json(toWorkspaceMemberResponse(member))
    } catch (error) {
      next(error)
    }
  }

  // DELETE /workspace/workspaces/:id/members/:userId - Remove member
  async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id
      const targetUserId = req.params.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const result = await this.workspaceService.removeMember({
        workspaceId,
        removerId: userId,
        targetUserId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const response = result.unwrap()
      res.status(200).json({
        removed: response.removed,
        member: response.member ? toWorkspaceMemberResponse(response.member) : undefined
      })
    } catch (error) {
      next(error)
    }
  }

  // POST /workspace/accept-invitation - Accept invitation
  async acceptInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.acceptInvitation.safeParse(req.body)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      const result = await this.workspaceService.acceptInvitation({
        token: validationResult.data.token,
        userId
      })

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      const response = result.unwrap()
      res.status(200).json({
        member: toWorkspaceMemberResponse(response.member),
        workspace: {
          id: response.workspace.id,
          name: response.workspace.name,
          description: response.workspace.description
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // POST /workspace/decline-invitation - Decline invitation
  async declineInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const validationResult = workspaceValidationSchemas.declineInvitation.safeParse(req.body)
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors
        })
        return
      }

      // TODO: Implement decline invitation in application service
      res.status(501).json({ error: 'Not implemented yet' })
    } catch (error) {
      next(error)
    }
  }

  // POST /workspace/workspaces/:id/leave - Leave workspace
  async leaveWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.params.id

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const result = await this.workspaceService.leaveWorkspace(workspaceId, userId)

      if (result.isErr()) {
        const error = result.unwrapErr()
        res.status(400).json({ error: error.message })
        return
      }

      res.status(200).json({ left: result.unwrap() })
    } catch (error) {
      next(error)
    }
  }
}