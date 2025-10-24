/**
 * Workspace Application Service
 * Application layer - orchestrates workspace use cases
 */

import { Result } from '@/libs/utils'
import {
  CreateWorkspaceUseCase,
  UpdateWorkspaceUseCase,
  InviteMemberUseCase,
  AcceptInvitationUseCase,
  RemoveMemberUseCase,
  GetWorkspacesUseCase
} from '../use-cases'
import type {
  WorkspaceRepository,
  WorkspaceMemberRepository,
  WorkspaceInvitationRepository
} from '../../domain/repositories'
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  InviteMemberRequest,
  AcceptInvitationRequest,
  RemoveMemberRequest,
  GetWorkspacesRequest,
  CreateWorkspaceResponse,
  UpdateWorkspaceResponse,
  InviteMemberResponse,
  AcceptInvitationResponse,
  RemoveMemberResponse,
  GetWorkspacesResponse
} from '../use-cases'

export class WorkspaceApplicationService {
  private readonly createWorkspaceUseCase: CreateWorkspaceUseCase
  private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase
  private readonly inviteMemberUseCase: InviteMemberUseCase
  private readonly acceptInvitationUseCase: AcceptInvitationUseCase
  private readonly removeMemberUseCase: RemoveMemberUseCase
  private readonly getWorkspacesUseCase: GetWorkspacesUseCase

  constructor(
    workspaceRepository: WorkspaceRepository,
    workspaceMemberRepository: WorkspaceMemberRepository,
    workspaceInvitationRepository: WorkspaceInvitationRepository
  ) {
    this.createWorkspaceUseCase = new CreateWorkspaceUseCase(
      workspaceRepository,
      workspaceMemberRepository
    )
    this.updateWorkspaceUseCase = new UpdateWorkspaceUseCase(workspaceRepository)
    this.inviteMemberUseCase = new InviteMemberUseCase(
      workspaceRepository,
      workspaceMemberRepository,
      workspaceInvitationRepository
    )
    this.acceptInvitationUseCase = new AcceptInvitationUseCase(
      workspaceRepository,
      workspaceMemberRepository,
      workspaceInvitationRepository
    )
    this.removeMemberUseCase = new RemoveMemberUseCase(workspaceMemberRepository)
    this.getWorkspacesUseCase = new GetWorkspacesUseCase(
      workspaceRepository,
      workspaceMemberRepository
    )
  }

  // Workspace CRUD operations
  async createWorkspace(request: CreateWorkspaceRequest): Promise<Result<CreateWorkspaceResponse, Error>> {
    return this.createWorkspaceUseCase.execute(request)
  }

  async updateWorkspace(request: UpdateWorkspaceRequest): Promise<Result<UpdateWorkspaceResponse, Error>> {
    return this.updateWorkspaceUseCase.execute(request)
  }

  async getUserWorkspaces(request: GetWorkspacesRequest): Promise<Result<GetWorkspacesResponse, Error>> {
    return this.getWorkspacesUseCase.execute(request)
  }

  // Member management
  async inviteMember(request: InviteMemberRequest): Promise<Result<InviteMemberResponse, Error>> {
    return this.inviteMemberUseCase.execute(request)
  }

  async acceptInvitation(request: AcceptInvitationRequest): Promise<Result<AcceptInvitationResponse, Error>> {
    return this.acceptInvitationUseCase.execute(request)
  }

  async removeMember(request: RemoveMemberRequest): Promise<Result<RemoveMemberResponse, Error>> {
    return this.removeMemberUseCase.execute(request)
  }

  // Additional helper methods for common operations

  async getWorkspaceById(workspaceId: string): Promise<Result<any, Error>> {
    // This would typically be implemented as a separate use case
    // For now, we'll use the repository directly
    try {
      const workspaceRepository = (this.createWorkspaceUseCase as any).workspaceRepository
      const result = await workspaceRepository.findById(workspaceId)
      return result
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getWorkspaceMembers(workspaceId: string, options?: {
    page?: number
    limit?: number
    role?: string
  }): Promise<Result<any, Error>> {
    // This would typically be implemented as a separate use case
    try {
      const workspaceMemberRepository = (this.inviteMemberUseCase as any).workspaceMemberRepository
      const result = await workspaceMemberRepository.findByWorkspace(workspaceId, options)
      return result
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    newRole: string,
    updatedBy: string
  ): Promise<Result<any, Error>> {
    // This would typically be implemented as a separate use case
    try {
      const workspaceMemberRepository = (this.removeMemberUseCase as any).workspaceMemberRepository

      // Check if updater has permission
      const canUpdateResult = await workspaceMemberRepository.canUserUpdateRole(
        workspaceId,
        updatedBy,
        userId,
        newRole as any
      )

      if (canUpdateResult.isErr()) {
        return Result.err(canUpdateResult.unwrapErr())
      }

      if (!canUpdateResult.unwrap()) {
        return Result.err(new Error('You do not have permission to update this member\'s role'))
      }

      // Find the member
      const memberResult = await workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId)

      if (memberResult.isErr()) {
        return Result.err(memberResult.unwrapErr())
      }

      const member = memberResult.unwrap()
      if (!member) {
        return Result.err(new Error('Member not found'))
      }

      // Update role
      const updateResult = await workspaceMemberRepository.updateRole(member.id, newRole as any)

      if (updateResult.isErr()) {
        return Result.err(updateResult.unwrapErr())
      }

      return Result.ok(updateResult.unwrap())
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async leaveWorkspace(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    // This would typically be implemented as a separate use case
    try {
      const workspaceMemberRepository = (this.removeMemberUseCase as any).workspaceMemberRepository

      // Check if user is the owner
      const roleResult = await workspaceMemberRepository.getUserRole(workspaceId, userId)

      if (roleResult.isErr()) {
        return Result.err(roleResult.unwrapErr())
      }

      const role = roleResult.unwrap()
      if (role === 'owner') {
        return Result.err(new Error('Workspace owners cannot leave the workspace. Transfer ownership first.'))
      }

      // Remove member
      const removeResult = await workspaceMemberRepository.removeMember(workspaceId, userId)

      if (removeResult.isErr()) {
        return Result.err(removeResult.unwrapErr())
      }

      return Result.ok(true)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}