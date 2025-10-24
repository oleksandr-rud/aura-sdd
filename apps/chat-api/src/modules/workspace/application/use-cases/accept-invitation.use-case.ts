/**
 * Accept Invitation Use Case
 * Application layer - handles invitation acceptance with validation
 */

import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { Command } from '@/shared/use-case'
import { WorkspaceMember } from '../../domain/entities'
import type { WorkspaceRepository, WorkspaceMemberRepository, WorkspaceInvitationRepository } from '../../domain/repositories'

export interface AcceptInvitationRequest {
  token: string
  userId: string
}

export interface AcceptInvitationResponse {
  member: WorkspaceMember
  workspace: any
}

export class AcceptInvitationUseCase extends Command<AcceptInvitationRequest, AcceptInvitationResponse> {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceInvitationRepository: WorkspaceInvitationRepository
  ) {
    super()
  }

  validate(request: AcceptInvitationRequest): Result<AcceptInvitationRequest, Error> {
    const tokenValidation = validateAndExtract(commonSchemas.uuid, request.token)
    if (tokenValidation.isErr()) {
      return Result.err(tokenValidation.unwrapErr() as Error)
    }

    const userIdValidation = validateAndExtract(commonSchemas.uuid, request.userId)
    if (userIdValidation.isErr()) {
      return Result.err(userIdValidation.unwrapErr() as Error)
    }

    return Result.ok(request)
  }

  protected async executeValidated(request: AcceptInvitationRequest): Promise<Result<AcceptInvitationResponse, Error>> {
    try {
      // Find invitation by token
      const invitationResult = await this.workspaceInvitationRepository.findByToken(request.token)

      if (invitationResult.isErr()) {
        return Result.err(invitationResult.unwrapErr())
      }

      const invitation = invitationResult.unwrap()
      if (!invitation) {
        return Result.err(new Error('Invalid invitation token'))
      }

      // Check if invitation is still valid
      if (!invitation.isValid()) {
        if (invitation.isExpired()) {
          // Mark as expired
          await this.workspaceInvitationRepository.expire(invitation.id)
        }
        return Result.err(new Error('Invitation is no longer valid'))
      }

      // Check if workspace is still active
      const workspaceResult = await this.workspaceRepository.findById(invitation.workspaceId)

      if (workspaceResult.isErr()) {
        return Result.err(workspaceResult.unwrapErr())
      }

      const workspace = workspaceResult.unwrap()
      if (!workspace || !workspace.isActive) {
        return Result.err(new Error('Workspace is no longer active'))
      }

      // Check if workspace can accept new members
      const memberCountResult = await this.workspaceMemberRepository.countByWorkspace(invitation.workspaceId)

      if (memberCountResult.isErr()) {
        return Result.err(memberCountResult.unwrapErr())
      }

      const currentMemberCount = memberCountResult.unwrap()
      if (!workspace.canAddMembers(currentMemberCount)) {
        return Result.err(new Error('Workspace has reached maximum member capacity'))
      }

      // Check if user is already a member
      const existingMemberResult = await this.workspaceMemberRepository.findByWorkspaceAndUser(invitation.workspaceId, request.userId)

      if (existingMemberResult.isErr()) {
        return Result.err(existingMemberResult.unwrapErr())
      }

      const existingMember = existingMemberResult.unwrap()
      if (existingMember && existingMember.isActive) {
        return Result.err(new Error('You are already a member of this workspace'))
      }

      // Accept the invitation
      const acceptResult = await this.workspaceInvitationRepository.accept(invitation.token, request.userId)

      if (acceptResult.isErr()) {
        return Result.err(acceptResult.unwrapErr())
      }

      // Create workspace member
      const memberResult = await this.workspaceMemberRepository.create({
        userId: request.userId,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
        invitedBy: invitation.invitedBy
      })

      if (memberResult.isErr()) {
        return Result.err(memberResult.unwrapErr())
      }

      const member = memberResult.unwrap()

      return Result.ok({
        member,
        workspace: {
          id: workspace.id,
          name: workspace.name,
          description: workspace.description
        }
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}