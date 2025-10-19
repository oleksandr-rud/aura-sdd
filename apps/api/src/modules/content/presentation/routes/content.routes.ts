/**
 * Content Routes
 * KISS principle: simple route definitions for content module
 */

import { Router } from 'express'
import { ContentController } from '../controllers/content.controller'

const router = Router()
const contentController = new ContentController()

// Content generation routes
router.post('/generate/presentation', contentController.generatePresentation.bind(contentController))
router.post('/generate/report', contentController.generateReport.bind(contentController))
router.post('/analyze/data', contentController.analyzeData.bind(contentController))

// Content history and retrieval routes
router.get('/history', contentController.getContentHistory.bind(contentController))
router.get('/projects/:projectId', contentController.getProject.bind(contentController))
router.get('/projects/:projectId/content', contentController.getContentByProject.bind(contentController))
router.delete('/projects/:projectId', contentController.deleteProject.bind(contentController))

// Template management routes
router.post('/templates', contentController.createTemplate.bind(contentController))
// TODO: Add more template routes (get, update, delete)

// Metrics and analytics routes
router.get('/metrics', contentController.getProjectMetrics.bind(contentController))

// Health check route
router.get('/health', contentController.healthCheck.bind(contentController))

export default router