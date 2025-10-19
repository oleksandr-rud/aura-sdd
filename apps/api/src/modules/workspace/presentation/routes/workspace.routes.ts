/**
 * Workspace Routes
 * Presentation layer - defines workspace API routes
 */

import { Router } from 'express'
import { WorkspaceController } from '../controllers/workspace.controller'
import { authenticate } from '@/shared/middleware/auth'

export function createWorkspaceRoutes(controller: WorkspaceController): Router {
  const router = Router()

  // Apply authentication middleware to all routes
  router.use(authenticate)

  // Workspace CRUD operations
  router.get('/workspaces', controller.getUserWorkspaces.bind(controller))
  router.post('/workspaces', controller.createWorkspace.bind(controller))
  router.get('/workspaces/:id', controller.getWorkspaceById.bind(controller))
  router.put('/workspaces/:id', controller.updateWorkspace.bind(controller))
  router.delete('/workspaces/:id', controller.deleteWorkspace.bind(controller))

  // Workspace member management
  router.get('/workspaces/:id/members', controller.getWorkspaceMembers.bind(controller))
  router.post('/workspaces/:id/invite', controller.inviteMember.bind(controller))
  router.put('/workspaces/:id/members/:userId', controller.updateMemberRole.bind(controller))
  router.delete('/workspaces/:id/members/:userId', controller.removeMember.bind(controller))
  router.post('/workspaces/:id/leave', controller.leaveWorkspace.bind(controller))

  // Invitation management
  router.post('/accept-invitation', controller.acceptInvitation.bind(controller))
  router.post('/decline-invitation', controller.declineInvitation.bind(controller))

  return router
}