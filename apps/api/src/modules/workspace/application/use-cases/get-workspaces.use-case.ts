/**
 * Get Workspaces Use Case
 * Application layer - handles workspace retrieval with validation
 */

import { Result } from '@/libs/utils'
import { commonSchemas, validateAndExtract } from '@/libs/validation'
import { Query } from '@/shared/use-case'
import { Workspace, WorkspaceMember } from '../../domain/entities'
import type { WorkspaceRepository, WorkspaceMemberRepository } from '../../domain/repositories'

export interface GetWorkspacesRequest {
  userId: string
  page?: number
  limit?: number
  includeInactive?: boolean
}

export interface WorkspaceWithRole {
  workspace: Workspace
  role: string
  joinedAt: Date
}

export interface GetWorkspacesResponse {
  workspaces: WorkspaceWithRole[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class GetWorkspacesUseCase extends Query<GetWorkspacesRequest, GetWorkspacesResponse> {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository
  ) {
    super()
  }

  validate(request: GetWorkspacesRequest): Result<GetWorkspacesRequest, Error> {
    const userIdValidation = validateAndExtract(commonSchemas.uuid, request.userId)
    if (userIdValidation.isErr()) {
      return Result.err(userIdValidation.unwrapErr() as Error)
    }

    return Result.ok(request)
  }

  protected async executeValidated(request: GetWorkspacesRequest): Promise<Result<GetWorkspacesResponse, Error>> {
    try {
      // Get user's workspace memberships
      const membershipsResult = await this.workspaceMemberRepository.findByUserId(request.userId)

      if (membershipsResult.isErr()) {
        return Result.err(membershipsResult.unwrapErr())
      }

      const memberships = membershipsResult.unwrap()
      const activeMemberships = request.includeInactive
        ? memberships
        : memberships.filter(member => member.isActive)

      if (activeMemberships.length === 0) {
        return Result.ok({
          workspaces: [],
          total: 0,
          page: request.page || 1,
          limit: request.limit || 20,
          totalPages: 0
        })
      }

      // Get workspace IDs
      const workspaceIds = activeMemberships.map(member => member.workspaceId)

      // Fetch workspaces
      const workspaces: Workspace[] = []
      for (const workspaceId of workspaceIds) {
        const workspaceResult = await this.workspaceRepository.findById(workspaceId)
        if (workspaceResult.isOk() && workspaceResult.unwrap()) {
          const workspace = workspaceResult.unwrap()
          if (request.includeInactive || workspace.isActive) {
            workspaces.push(workspace)
          }
        }
      }

      // Combine workspace data with member role information
      const workspacesWithRole: WorkspaceWithRole[] = workspaces.map(workspace => {
        const membership = activeMemberships.find(member => member.workspaceId === workspace.id)!
        return {
          workspace,
          role: membership.role,
          joinedAt: membership.joinedAt
        }
      })

      // Sort by joined date (newest first)
      workspacesWithRole.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime())

      // Apply pagination
      const page = request.page || 1
      const limit = request.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedWorkspaces = workspacesWithRole.slice(startIndex, endIndex)

      return Result.ok({
        workspaces: paginatedWorkspaces,
        total: workspacesWithRole.length,
        page,
        limit,
        totalPages: Math.ceil(workspacesWithRole.length / limit)
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}