/**
 * Workspace Domain Entities
 * KISS principle: clean exports for all domain entities
 */

export { Workspace } from './workspace'
export { WorkspaceMember } from './workspace-member'
export { WorkspaceInvitation } from './workspace-invitation'
export type { WorkspaceProps, WorkspaceSettings } from './workspace'
export type { WorkspaceMemberProps, WorkspaceRole } from './workspace-member'
export type { WorkspaceInvitationProps, InvitationStatus } from './workspace-invitation'