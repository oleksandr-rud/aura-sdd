/**
 * Invite Member Use Case
 * Application layer - handles member invitations with validation
 */

import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { Command } from '@/shared/use-case'
import { WorkspaceInvitation } from '../../domain/entities'
import type { WorkspaceRepository, WorkspaceMemberRepository, WorkspaceInvitationRepository } from '../../domain/repositories'

export interface InviteMemberRequest {
  workspaceId: string
  inviterId: string
  email: string
  role: 'admin' | 'member'
}

export interface InviteMemberResponse {
  invitation: WorkspaceInvitation
}

export class InviteMemberUseCase extends Command<InviteMemberRequest, InviteMemberResponse> {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceInvitationRepository: WorkspaceInvitationRepository
  ) {
    super()
  }

  validate(request: InviteMemberRequest): Result<InviteMemberRequest, Error> {
    // Validate email and role
    const emailValidation = validateAndExtract(commonSchemas.email, request.email)
    if (emailValidation.isErr()) {
      return Result.err(emailValidation.unwrapErr() as Error)
    }

    if (!['admin', 'member'].includes(request.role)) {
      return Result.err(new Error('Role must be either admin or member'))
    }

    return Result.ok(request)
  }

  protected async executeValidated(request: InviteMemberRequest): Promise<Result<InviteMemberResponse, Error>> {
    try {
      // Check if workspace exists
      const workspaceResult = await this.workspaceRepository.findById(request.workspaceId)

      if (workspaceResult.isErr()) {
        return Result.err(workspaceResult.unwrapErr())
      }

      const workspace = workspaceResult.unwrap()
      if (!workspace || !workspace.isActive) {
        return Result.err(new Error('Workspace not found or inactive'))
      }

      // Check if inviter has permission to invite
      const canInviteResult = await this.workspaceMemberRepository.canUserInvite(request.workspaceId, request.inviterId)

      if (canInviteResult.isErr()) {
        return Result.err(canInviteResult.unwrapErr())
      }

      if (!canInviteResult.unwrap()) {
        return Result.err(new Error('You do not have permission to invite members'))
      }

      // Check if workspace can accept new members
      const memberCountResult = await this.workspaceMemberRepository.countByWorkspace(request.workspaceId)

      if (memberCountResult.isErr()) {
        return Result.err(memberCountResult.unwrapErr())
      }

      const currentMemberCount = memberCountResult.unwrap()
      if (!workspace.canAddMembers(currentMemberCount)) {
        return Result.err(new Error('Workspace has reached maximum member capacity'))
      }

      // Check if user is already a member
      const existingMemberResult = await this.workspaceMemberRepository.findByEmailAndWorkspace(request.email, request.workspaceId)

      if (existingMemberResult.isErr()) {
        return Result.err(existingMemberResult.unwrapErr())
      }

      const existingMember = existingMemberResult.unwrap()
      if (existingMember && existingMember.isActive) {
        return Result.err(new Error('User is already a member of this workspace'))
      }

      // Check if there's already a pending invitation
      const existingInvitationResult = await this.workspaceInvitationRepository.isInvitationPending(request.workspaceId, request.email)

      if (existingInvitationResult.isErr()) {
        return Result.err(existingInvitationResult.unwrapErr())
      }

      if (existingInvitationResult.unwrap()) {
        return Result.err(new Error('Invitation already sent to this email'))
      }

      // Create invitation
      const invitation = WorkspaceInvitation.create({
        email: request.email,
        workspaceId: request.workspaceId,
        role: request.role,
        invitedBy: request.inviterId
      })

      const invitationResult = await this.workspaceInvitationRepository.create({
        email: invitation.email,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
        invitedBy: invitation.invitedBy
      })

      if (invitationResult.isErr()) {
        return Result.err(invitationResult.unwrapErr())
      }

      return Result.ok({
        invitation: invitationResult.unwrap()
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}