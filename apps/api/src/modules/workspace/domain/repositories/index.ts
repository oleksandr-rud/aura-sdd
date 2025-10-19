/**
 * Workspace Domain Repositories
 * KISS principle: clean exports for all repository interfaces
 */

export type {
  WorkspaceRepository,
  FindWorkspacesByUserOptions,
  CreateWorkspaceData,
  UpdateWorkspaceData
} from './workspace-repository'

export type {
  WorkspaceMemberRepository,
  FindMembersOptions,
  CreateMemberData,
  UpdateMemberData
} from './workspace-member-repository'

export type {
  WorkspaceInvitationRepository,
  FindInvitationsOptions,
  CreateInvitationData,
  UpdateInvitationData
} from './workspace-invitation-repository'