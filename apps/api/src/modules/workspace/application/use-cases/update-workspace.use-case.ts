/**
 * Update Workspace Use Case
 * Application layer - handles workspace updates with validation
 */

import { Result } from '@/libs/utils'
import { validateAndExtract } from '@/libs/validation'
import { Command } from '@/shared/use-case'
import { Workspace } from '../../domain/entities'
import type { WorkspaceRepository } from '../../domain/repositories'

export interface UpdateWorkspaceRequest {
  workspaceId: string
  userId: string
  name?: string
  description?: string
  settings?: any
}

export interface UpdateWorkspaceResponse {
  workspace: Workspace
}

export class UpdateWorkspaceUseCase extends Command<UpdateWorkspaceRequest, UpdateWorkspaceResponse> {
  constructor(
    private workspaceRepository: WorkspaceRepository
  ) {
    super()
  }

  validate(request: UpdateWorkspaceRequest): Result<UpdateWorkspaceRequest, Error> {
    // Basic validation
    if (!request.workspaceId || !request.userId) {
      return Result.err(new Error('Workspace ID and user ID are required'))
    }

    if (request.name && request.name.trim().length < 2) {
      return Result.err(new Error('Workspace name must be at least 2 characters'))
    }

    return Result.ok(request)
  }

  protected async executeValidated(request: UpdateWorkspaceRequest): Promise<Result<UpdateWorkspaceResponse, Error>> {
    try {
      // Get workspace
      const workspaceResult = await this.workspaceRepository.findById(request.workspaceId)

      if (workspaceResult.isErr()) {
        return Result.err(workspaceResult.unwrapErr())
      }

      const workspace = workspaceResult.unwrap()
      if (!workspace) {
        return Result.err(new Error('Workspace not found'))
      }

      // Check if user has permission to update
      const isOwnerResult = await this.workspaceRepository.isUserOwner(request.workspaceId, request.userId)

      if (isOwnerResult.isErr()) {
        return Result.err(isOwnerResult.unwrapErr())
      }

      if (!isOwnerResult.unwrap()) {
        return Result.err(new Error('Only workspace owners can update workspace details'))
      }

      // Check if name is being changed and if it already exists
      if (request.name && request.name !== workspace.name) {
        const existingResult = await this.workspaceRepository.existsByNameAndOwner(request.name, workspace.ownerId)

        if (existingResult.isErr()) {
          return Result.err(existingResult.unwrapErr())
        }

        if (existingResult.unwrap()) {
          return Result.err(new Error('Workspace with this name already exists'))
        }
      }

      // Update workspace
      const updateData: any = {}
      if (request.name !== undefined) updateData.name = request.name
      if (request.description !== undefined) updateData.description = request.description
      if (request.settings !== undefined) updateData.settings = request.settings

      const updateResult = await this.workspaceRepository.update(request.workspaceId, updateData)

      if (updateResult.isErr()) {
        return Result.err(updateResult.unwrapErr())
      }

      return Result.ok({
        workspace: updateResult.unwrap()
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}