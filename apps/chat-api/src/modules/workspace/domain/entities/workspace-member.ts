/**
 * Workspace Member Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { BaseEntity } from '@/shared/base-entity'
import { Result } from '@/libs/utils'

export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface WorkspaceMemberProps {
  userId: string
  workspaceId: string
  role: WorkspaceRole
  joinedAt: Date
  invitedBy?: string
  isActive: boolean
}

export class WorkspaceMember extends BaseEntity {
  constructor(
    public readonly props: WorkspaceMemberProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id ?? BaseEntity.generateId(),
      createdAt ?? new Date(),
      updatedAt ?? new Date()
    )
  }

  get userId(): string {
    return this.props.userId
  }

  get workspaceId(): string {
    return this.props.workspaceId
  }

  get role(): WorkspaceRole {
    return this.props.role
  }

  get joinedAt(): Date {
    return this.props.joinedAt
  }

  get invitedBy(): string | undefined {
    return this.props.invitedBy
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  // Domain behaviors
  updateRole(newRole: WorkspaceRole): Result<WorkspaceMember, Error> {
    if (this.props.role === newRole) {
      return Result.err(new Error('Role is already set to ' + newRole))
    }

    const updatedMember = new WorkspaceMember(
      {
        ...this.props,
        role: newRole
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMember)
  }

  deactivate(): Result<WorkspaceMember, Error> {
    if (!this.props.isActive) {
      return Result.err(new Error('Member is already deactivated'))
    }

    const updatedMember = new WorkspaceMember(
      {
        ...this.props,
        isActive: false
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMember)
  }

  reactivate(): Result<WorkspaceMember, Error> {
    if (this.props.isActive) {
      return Result.err(new Error('Member is already active'))
    }

    const updatedMember = new WorkspaceMember(
      {
        ...this.props,
        isActive: true
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMember)
  }

  // Permission checking methods
  canManageMembers(): boolean {
    return this.props.role === 'owner' || this.props.role === 'admin'
  }

  canManageSettings(): boolean {
    return this.props.role === 'owner' || this.props.role === 'admin'
  }

  canDeleteWorkspace(): boolean {
    return this.props.role === 'owner'
  }

  canInviteMembers(): boolean {
    return this.props.role === 'owner' || this.props.role === 'admin'
  }

  canRemoveMember(targetRole: WorkspaceRole): boolean {
    // Owner can remove anyone except themselves
    if (this.props.role === 'owner' && targetRole !== 'owner') {
      return true
    }

    // Admin can remove members but not other admins or owner
    if (this.props.role === 'admin' && targetRole === 'member') {
      return true
    }

    return false
  }

  canUpdateRole(targetRole: WorkspaceRole, newRole: WorkspaceRole): boolean {
    // Owner can update anyone's role
    if (this.props.role === 'owner') {
      return true
    }

    // Admin can update members to admin or member
    if (this.props.role === 'admin' && targetRole === 'member') {
      return newRole !== 'owner'
    }

    return false
  }

  // Factory method
  static create(props: Omit<WorkspaceMemberProps, 'joinedAt' | 'isActive'>): WorkspaceMember {
    return new WorkspaceMember({
      ...props,
      joinedAt: new Date(),
      isActive: true
    })
  }
}