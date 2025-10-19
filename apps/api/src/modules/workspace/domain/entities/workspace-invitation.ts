/**
 * Workspace Invitation Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { BaseEntity } from '@/shared/base-entity'
import { Result } from '@/libs/utils'

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export interface WorkspaceInvitationProps {
  email: string
  workspaceId: string
  role: 'admin' | 'member'
  token: string
  invitedBy: string
  expiresAt: Date
  status: InvitationStatus
  acceptedAt?: Date
  respondedBy?: string
}

export class WorkspaceInvitation extends BaseEntity {
  constructor(
    public readonly props: WorkspaceInvitationProps,
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

  get email(): string {
    return this.props.email
  }

  get workspaceId(): string {
    return this.props.workspaceId
  }

  get role(): 'admin' | 'member' {
    return this.props.role
  }

  get token(): string {
    return this.props.token
  }

  get invitedBy(): string {
    return this.props.invitedBy
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }

  get status(): InvitationStatus {
    return this.props.status
  }

  get acceptedAt(): Date | undefined {
    return this.props.acceptedAt
  }

  get respondedBy(): string | undefined {
    return this.props.respondedBy
  }

  // Domain behaviors
  accept(userId: string): Result<WorkspaceInvitation, Error> {
    if (this.props.status !== 'pending') {
      return Result.err(new Error('Invitation is not pending'))
    }

    if (this.isExpired()) {
      return Result.err(new Error('Invitation has expired'))
    }

    const updatedInvitation = new WorkspaceInvitation(
      {
        ...this.props,
        status: 'accepted',
        acceptedAt: new Date(),
        respondedBy: userId
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInvitation)
  }

  decline(userId: string): Result<WorkspaceInvitation, Error> {
    if (this.props.status !== 'pending') {
      return Result.err(new Error('Invitation is not pending'))
    }

    if (this.isExpired()) {
      return Result.err(new Error('Invitation has expired'))
    }

    const updatedInvitation = new WorkspaceInvitation(
      {
        ...this.props,
        status: 'declined',
        respondedBy: userId
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInvitation)
  }

  expire(): Result<WorkspaceInvitation, Error> {
    if (this.props.status !== 'pending') {
      return Result.err(new Error('Only pending invitations can be expired'))
    }

    const updatedInvitation = new WorkspaceInvitation(
      {
        ...this.props,
        status: 'expired'
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInvitation)
  }

  revoke(): Result<WorkspaceInvitation, Error> {
    if (this.props.status !== 'pending') {
      return Result.err(new Error('Only pending invitations can be revoked'))
    }

    const updatedInvitation = new WorkspaceInvitation(
      {
        ...this.props,
        status: 'declined'
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInvitation)
  }

  isValid(): boolean {
    return this.props.status === 'pending' && !this.isExpired()
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }

  isPending(): boolean {
    return this.props.status === 'pending'
  }

  isAccepted(): boolean {
    return this.props.status === 'accepted'
  }

  isDeclined(): boolean {
    return this.props.status === 'declined'
  }

  // Factory method
  static create(props: Omit<WorkspaceInvitationProps, 'token' | 'expiresAt' | 'status'>): WorkspaceInvitation {
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    return new WorkspaceInvitation({
      ...props,
      token,
      expiresAt,
      status: 'pending'
    })
  }

  // Factory method for creating with custom expiration
  static createWithExpiration(
    props: Omit<WorkspaceInvitationProps, 'token' | 'expiresAt' | 'status'>,
    expiresInDays: number = 7
  ): WorkspaceInvitation {
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)

    return new WorkspaceInvitation({
      ...props,
      token,
      expiresAt,
      status: 'pending'
    })
  }
}