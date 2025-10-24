/**
 * Content Controller
 * KISS principle: simple controller for content management endpoints
 */

import { Request, Response } from 'express'
import { Result } from '@/libs/utils'
import { Validator } from '@/libs/validation'
import {
  ContentApplicationService,
  ContentServiceDependencies
} from '../../application/services'
import {
  ContentProjectRepositoryImpl,
  GeneratedContentRepositoryImpl,
  ContentTemplateRepositoryImpl
} from '../../infrastructure/repositories'
import {
  PresentationGenerator,
  ReportGenerator,
  DataAnalyzer
} from '../../infrastructure/services'
import * as dto from '../dto/content.dto'

export class ContentController {
  private readonly contentService: ContentApplicationService

  constructor() {
    // Initialize repositories
    const contentProjectRepository = new ContentProjectRepositoryImpl()
    const generatedContentRepository = new GeneratedContentRepositoryImpl()
    const contentTemplateRepository = new ContentTemplateRepositoryImpl()

    // Initialize infrastructure services
    const presentationGenerator = new PresentationGenerator()
    const reportGenerator = new ReportGenerator()
    const dataAnalyzer = new DataAnalyzer()

    // Create dependencies object
    const dependencies: ContentServiceDependencies = {
      contentProjectRepository,
      generatedContentRepository,
      contentTemplateRepository
    }

    // Initialize application service
    this.contentService = new ContentApplicationService(dependencies)
  }

  // Presentation generation
  async generatePresentation(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.GeneratePresentationDto, req.body)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request body',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.generatePresentation(validation.data)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Generation Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const response = result.unwrap()
      res.status(201).json({
        success: true,
        data: {
          project: response.project.toJSON(),
          content: response.content.toJSON(),
          presentation: response.presentation
        },
        message: 'Presentation generated successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Report generation
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.GenerateReportDto, req.body)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request body',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.generateReport(validation.data)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Generation Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const response = result.unwrap()
      res.status(201).json({
        success: true,
        data: {
          project: response.project.toJSON(),
          content: response.content.toJSON(),
          report: response.report
        },
        message: 'Report generated successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Data analysis
  async analyzeData(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.AnalyzeDataDto, req.body)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request body',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.analyzeData(validation.data)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Analysis Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const response = result.unwrap()
      res.status(201).json({
        success: true,
        data: {
          project: response.project.toJSON(),
          content: response.content.toJSON(),
          analysis: response.analysis
        },
        message: 'Data analysis completed successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Content history
  async getContentHistory(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.GetContentHistoryDto, {
        ...req.query,
        userId: req.user?.id, // Assuming user is attached to request
        workspaceId: req.headers['x-workspace-id'] as string
      })

      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request parameters',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.getContentHistory(validation.data)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Retrieval Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const response = result.unwrap()
      res.status(200).json({
        success: true,
        data: {
          items: response.items.map(item => ({
            project: item.project.toJSON(),
            content: item.content?.toJSON(),
            lastModified: item.lastModified.toISOString()
          })),
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Template management
  async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.CreateTemplateDto, req.body)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request body',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.createTemplate(validation.data)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Creation Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const response = result.unwrap()
      res.status(201).json({
        success: true,
        data: response.template.toJSON(),
        message: 'Template created successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Get project by ID
  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.GetProjectDto, req.params)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid project ID',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.getProjectById(validation.data.projectId)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Retrieval Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const project = result.unwrap()
      if (!project) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Project not found',
          timestamp: new Date().toISOString()
        })
        return
      }

      res.status(200).json({
        success: true,
        data: project.toJSON(),
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Get content by project ID
  async getContentByProject(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.GetProjectDto, req.params)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid project ID',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.getContentByProjectId(validation.data.projectId)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Retrieval Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const contents = result.unwrap()
      res.status(200).json({
        success: true,
        data: contents.map(content => content.toJSON()),
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Delete project
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validator.create(dto.DeleteProjectDto, req.params)
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid project ID',
          details: validation.errors,
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.deleteProject(validation.data.projectId)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Deletion Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Get project metrics
  async getProjectMetrics(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const workspaceId = req.headers['x-workspace-id'] as string

      if (!userId || !workspaceId) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'User ID and workspace ID are required',
          timestamp: new Date().toISOString()
        })
        return
      }

      const result = await this.contentService.getProjectMetrics(userId, workspaceId)

      if (result.isErr()) {
        res.status(500).json({
          error: 'Metrics Error',
          message: result.unwrapErr().message,
          timestamp: new Date().toISOString()
        })
        return
      }

      const metrics = result.unwrap()
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Health check
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          module: 'content',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        message: 'Content module is running',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        error: 'Health Check Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }
}