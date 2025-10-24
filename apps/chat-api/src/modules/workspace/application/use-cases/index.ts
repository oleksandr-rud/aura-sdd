/**
 * Workspace Application Use Cases
 * KISS principle: clean exports for all use cases
 */

export { CreateWorkspaceUseCase } from './create-workspace.use-case'
export { UpdateWorkspaceUseCase } from './update-workspace.use-case'
export { InviteMemberUseCase } from './invite-member.use-case'
export { AcceptInvitationUseCase } from './accept-invitation.use-case'
export { RemoveMemberUseCase } from './remove-member.use-case'
export { GetWorkspacesUseCase } from './get-workspaces.use-case'

export type {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse
} from './create-workspace.use-case'

export type {
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse
} from './update-workspace.use-case'

export type {
  InviteMemberRequest,
  InviteMemberResponse
} from './invite-member.use-case'

export type {
  AcceptInvitationRequest,
  AcceptInvitationResponse
} from './accept-invitation.use-case'

export type {
  RemoveMemberRequest,
  RemoveMemberResponse
} from './remove-member.use-case'

export type {
  GetWorkspacesRequest,
  GetWorkspacesResponse,
  WorkspaceWithRole
} from './get-workspaces.use-case'