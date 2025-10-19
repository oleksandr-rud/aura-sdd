/**
 * Workspace Domain Service
 * Domain layer - business logic for workspace operations
 */

import { Result } from '@/libs/utils'
import { Workspace, WorkspaceMember } from '../entities'
import type { WorkspaceRepository, WorkspaceMemberRepository } from '../repositories'

export interface WorkspaceServiceDependencies {
  workspaceRepository: WorkspaceRepository
  workspaceMemberRepository: WorkspaceMemberRepository
}

export class WorkspaceService {
  constructor(private deps: WorkspaceServiceDependencies) {}

  // Check if user can access workspace
  async canUserAccessWorkspace(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    try {
      // Check if user is a member
      const memberResult = await this.deps.workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId)

      if (memberResult.isErr()) {
        return Result.err(memberResult.unwrapErr())
      }

      const member = memberResult.unwrap()
      if (!member || !member.isActive) {
        return Result.ok(false)
      }

      return Result.ok(true)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Check if user can perform specific action
  async canUserPerformAction(
    workspaceId: string,
    userId: string,
    action: string
  ): Promise<Result<boolean, Error>> {
    try {
      const permissionResult = await this.deps.workspaceMemberRepository.hasPermission(workspaceId, userId, action)

      if (permissionResult.isErr()) {
        return Result.err(permissionResult.unwrapErr())
      }

      return Result.ok(permissionResult.unwrap())
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Get user's role in workspace
  async getUserRole(workspaceId: string, userId: string): Promise<Result<string | null, Error>> {
    try {
      const roleResult = await this.deps.workspaceMemberRepository.getUserRole(workspaceId, userId)

      if (roleResult.isErr()) {
        return Result.err(roleResult.unwrapErr())
      }

      return Result.ok(roleResult.unwrap())
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Check if workspace can accept new members
  async canAcceptNewMembers(workspaceId: string): Promise<Result<boolean, Error>> {
    try {
      const workspaceResult = await this.deps.workspaceRepository.findById(workspaceId)

      if (workspaceResult.isErr()) {
        return Result.err(workspaceResult.unwrapErr())
      }

      const workspace = workspaceResult.unwrap()
      if (!workspace || !workspace.isActive) {
        return Result.ok(false)
      }

      const memberCountResult = await this.deps.workspaceMemberRepository.countByWorkspace(workspaceId)

      if (memberCountResult.isErr()) {
        return Result.err(memberCountResult.unwrapErr())
      }

      const currentMemberCount = memberCountResult.unwrap()
      return Result.ok(workspace.canAddMembers(currentMemberCount))
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Validate workspace transfer
  async validateOwnershipTransfer(
    workspaceId: string,
    currentOwnerId: string,
    newOwnerId: string
  ): Promise<Result<boolean, Error>> {
    try {
      // Check if current user is the owner
      const isOwnerResult = await this.deps.workspaceRepository.isUserOwner(workspaceId, currentOwnerId)

      if (isOwnerResult.isErr()) {
        return Result.err(isOwnerResult.unwrapErr())
      }

      if (!isOwnerResult.unwrap()) {
        return Result.ok(false)
      }

      // Check if new user is a member
      const memberResult = await this.deps.workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, newOwnerId)

      if (memberResult.isErr()) {
        return Result.err(memberResult.unwrapErr())
      }

      const member = memberResult.unwrap()
      if (!member || !member.isActive) {
        return Result.ok(false)
      }

      return Result.ok(true)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Get workspace statistics
  async getWorkspaceStats(workspaceId: string): Promise<Result<{
    totalMembers: number
    activeMembers: number
    owners: number
    admins: number
    members: number
  }, Error>> {
    try {
      const workspaceResult = await this.deps.workspaceRepository.findById(workspaceId)

      if (workspaceResult.isErr()) {
        return Result.err(workspaceResult.unwrapErr())
      }

      const workspace = workspaceResult.unwrap()
      if (!workspace) {
        return Result.err(new Error('Workspace not found'))
      }

      const [totalResult, ownersResult, adminsResult, membersResult] = await Promise.all([
        this.deps.workspaceMemberRepository.countByWorkspace(workspaceId),
        this.deps.workspaceMemberRepository.countByRole(workspaceId, 'owner'),
        this.deps.workspaceMemberRepository.countByRole(workspaceId, 'admin'),
        this.deps.workspaceMemberRepository.countByRole(workspaceId, 'member')
      ])

      if (totalResult.isErr() || ownersResult.isErr() || adminsResult.isErr() || membersResult.isErr()) {
        return Result.err(new Error('Failed to fetch workspace statistics'))
      }

      return Result.ok({
        totalMembers: totalResult.unwrap(),
        activeMembers: totalResult.unwrap(), // Assuming all active members
        owners: ownersResult.unwrap(),
        admins: adminsResult.unwrap(),
        members: membersResult.unwrap()
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Validate workspace deletion
  async canDeleteWorkspace(workspaceId: string, userId: string): Promise<Result<boolean, Error>> {
    try {
      const roleResult = await this.deps.workspaceMemberRepository.getUserRole(workspaceId, userId)

      if (roleResult.isErr()) {
        return Result.err(roleResult.unwrapErr())
      }

      const role = roleResult.unwrap()
      return Result.ok(role === 'owner')
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}