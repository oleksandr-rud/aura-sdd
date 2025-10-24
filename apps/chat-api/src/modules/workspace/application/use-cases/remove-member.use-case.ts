/**
 * Remove Member Use Case
 * Application layer - handles member removal with validation
 */

import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { Command } from '@/shared/use-case'
import { WorkspaceMember } from '../../domain/entities'
import type { WorkspaceMemberRepository } from '../../domain/repositories'

export interface RemoveMemberRequest {
  workspaceId: string
  removerId: string
  targetUserId: string
}

export interface RemoveMemberResponse {
  removed: boolean
  member?: WorkspaceMember
}

export class RemoveMemberUseCase extends Command<RemoveMemberRequest, RemoveMemberResponse> {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository
  ) {
    super()
  }

  validate(request: RemoveMemberRequest): Result<RemoveMemberRequest, Error> {
    // Validate UUIDs
    const workspaceIdValidation = validateAndExtract(commonSchemas.uuid, request.workspaceId)
    if (workspaceIdValidation.isErr()) {
      return Result.err(workspaceIdValidation.unwrapErr() as Error)
    }

    const removerIdValidation = validateAndExtract(commonSchemas.uuid, request.removerId)
    if (removerIdValidation.isErr()) {
      return Result.err(removerIdValidation.unwrapErr() as Error)
    }

    const targetUserIdValidation = validateAndExtract(commonSchemas.uuid, request.targetUserId)
    if (targetUserIdValidation.isErr()) {
      return Result.err(targetUserIdValidation.unwrapErr() as Error)
    }

    // Can't remove yourself
    if (request.removerId === request.targetUserId) {
      return Result.err(new Error('You cannot remove yourself from the workspace'))
    }

    return Result.ok(request)
  }

  protected async executeValidated(request: RemoveMemberRequest): Promise<Result<RemoveMemberResponse, Error>> {
    try {
      // Get remover's role
      const removerRoleResult = await this.workspaceMemberRepository.getUserRole(request.workspaceId, request.removerId)

      if (removerRoleResult.isErr()) {
        return Result.err(removerRoleResult.unwrapErr())
      }

      const removerRole = removerRoleResult.unwrap()
      if (!removerRole) {
        return Result.err(new Error('You are not a member of this workspace'))
      }

      // Get target member
      const targetMemberResult = await this.workspaceMemberRepository.findByWorkspaceAndUser(request.workspaceId, request.targetUserId)

      if (targetMemberResult.isErr()) {
        return Result.err(targetMemberResult.unwrapErr())
      }

      const targetMember = targetMemberResult.unwrap()
      if (!targetMember) {
        return Result.err(new Error('Target user is not a member of this workspace'))
      }

      // Check if remover has permission to remove target
      const canRemoveResult = await this.workspaceMemberRepository.canUserRemoveMember(
        request.workspaceId,
        request.removerId,
        request.targetUserId
      )

      if (canRemoveResult.isErr()) {
        return Result.err(canRemoveResult.unwrapErr())
      }

      if (!canRemoveResult.unwrap()) {
        return Result.err(new Error('You do not have permission to remove this member'))
      }

      // Remove the member (deactivate instead of delete)
      const removeResult = await this.workspaceMemberRepository.deactivate(targetMember.id)

      if (removeResult.isErr()) {
        return Result.err(removeResult.unwrapErr())
      }

      return Result.ok({
        removed: true,
        member: removeResult.unwrap()
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}