/**
 * Create Workspace Use Case
 * Application layer - handles workspace creation with validation
 */

import { Result } from '@/libs/utils'
import { validateAndExtract } from '@/libs/validation'
import { Command } from '@/shared/use-case'
import { Workspace } from '../../domain/entities'
import type { WorkspaceRepository, WorkspaceMemberRepository } from '../../domain/repositories'
import { userSchemas } from '@/libs/validation'

export interface CreateWorkspaceRequest {
  name: string
  description?: string
  ownerId: string
}

export interface CreateWorkspaceResponse {
  workspace: Workspace
  ownerMember: any
}

export class CreateWorkspaceUseCase extends Command<CreateWorkspaceRequest, CreateWorkspaceResponse> {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository
  ) {
    super()
  }

  validate(request: CreateWorkspaceRequest): Result<CreateWorkspaceRequest, Error> {
    const validation = validateAndExtract(userSchemas.createWorkspace, request)
    return validation
  }

  protected async executeValidated(request: CreateWorkspaceRequest): Promise<Result<CreateWorkspaceResponse, Error>> {
    try {
      // Check if workspace with same name already exists for this user
      const existingResult = await this.workspaceRepository.existsByNameAndOwner(request.name, request.ownerId)

      if (existingResult.isErr()) {
        return Result.err(existingResult.unwrapErr())
      }

      if (existingResult.unwrap()) {
        return Result.err(new Error('Workspace with this name already exists'))
      }

      // Create workspace
      const workspace = Workspace.create({
        name: request.name,
        description: request.description,
        ownerId: request.ownerId
      })

      const workspaceResult = await this.workspaceRepository.create({
        name: workspace.name,
        description: workspace.description,
        ownerId: workspace.ownerId
      })

      if (workspaceResult.isErr()) {
        return Result.err(workspaceResult.unwrapErr())
      }

      const createdWorkspace = workspaceResult.unwrap()

      // Create owner membership
      const ownerMember = await this.workspaceMemberRepository.create({
        userId: request.ownerId,
        workspaceId: createdWorkspace.id,
        role: 'owner',
        invitedBy: undefined // Owner doesn't need invitation
      })

      if (ownerMember.isErr()) {
        // Rollback workspace creation if member creation fails
        await this.workspaceRepository.delete(createdWorkspace.id)
        return Result.err(ownerMember.unwrapErr())
      }

      return Result.ok({
        workspace: createdWorkspace,
        ownerMember: ownerMember.unwrap()
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}