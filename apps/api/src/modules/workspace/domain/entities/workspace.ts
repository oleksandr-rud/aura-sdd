/**
 * Workspace Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { BaseEntity } from '@/shared/base-entity'
import { Result } from '@/libs/utils'

export interface WorkspaceSettings {
  allowInvites: boolean
  requireApproval: boolean
  maxMembers: number
  defaultRole: 'admin' | 'member'
}

export interface WorkspaceProps {
  name: string
  description?: string
  ownerId: string
  settings: WorkspaceSettings
  isActive: boolean
}

export class Workspace extends BaseEntity {
  constructor(
    public readonly props: WorkspaceProps,
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

  get name(): string {
    return this.props.name
  }

  get description(): string | undefined {
    return this.props.description
  }

  get ownerId(): string {
    return this.props.ownerId
  }

  get settings(): WorkspaceSettings {
    return this.props.settings
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  // Domain behaviors
  updateDetails(data: Partial<Pick<WorkspaceProps, 'name' | 'description'>>): Result<Workspace, Error> {
    if (data.name && data.name.trim().length < 2) {
      return Result.err(new Error('Workspace name must be at least 2 characters'))
    }

    const updatedWorkspace = new Workspace(
      {
        ...this.props,
        ...data
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedWorkspace)
  }

  updateSettings(settings: Partial<WorkspaceSettings>): Result<Workspace, Error> {
    const updatedWorkspace = new Workspace(
      {
        ...this.props,
        settings: {
          ...this.props.settings,
          ...settings
        }
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedWorkspace)
  }

  transferOwnership(newOwnerId: string): Result<Workspace, Error> {
    if (!newOwnerId || newOwnerId.trim().length === 0) {
      return Result.err(new Error('New owner ID is required'))
    }

    const updatedWorkspace = new Workspace(
      {
        ...this.props,
        ownerId: newOwnerId
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedWorkspace)
  }

  deactivate(): Result<Workspace, Error> {
    if (!this.props.isActive) {
      return Result.err(new Error('Workspace is already deactivated'))
    }

    const updatedWorkspace = new Workspace(
      {
        ...this.props,
        isActive: false
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedWorkspace)
  }

  activate(): Result<Workspace, Error> {
    if (this.props.isActive) {
      return Result.err(new Error('Workspace is already active'))
    }

    const updatedWorkspace = new Workspace(
      {
        ...this.props,
        isActive: true
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedWorkspace)
  }

  canAddMembers(currentMemberCount: number): boolean {
    return currentMemberCount < this.props.settings.maxMembers
  }

  // Factory method
  static create(props: Omit<WorkspaceProps, 'isActive' | 'settings'>): Workspace {
    const defaultSettings: WorkspaceSettings = {
      allowInvites: true,
      requireApproval: false,
      maxMembers: 50,
      defaultRole: 'member'
    }

    return new Workspace({
      ...props,
      settings: defaultSettings,
      isActive: true
    })
  }
}