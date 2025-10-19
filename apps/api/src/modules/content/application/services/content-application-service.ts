/**
 * Content Application Service
 * KISS principle: simple service that orchestrates use cases
 */

import { Result } from '@/libs/utils'
import {
  ContentProjectRepository,
  GeneratedContentRepository,
  ContentTemplateRepository
} from '../../domain/repositories'
import {
  GeneratePresentationUseCase,
  GenerateReportUseCase,
  AnalyzeDataUseCase,
  GetContentHistoryUseCase,
  CreateTemplateUseCase
} from '../use-cases'

export interface ContentServiceDependencies {
  contentProjectRepository: ContentProjectRepository
  generatedContentRepository: GeneratedContentRepository
  contentTemplateRepository: ContentTemplateRepository
}

export class ContentApplicationService {
  private readonly generatePresentationUseCase: GeneratePresentationUseCase
  private readonly generateReportUseCase: GenerateReportUseCase
  private readonly analyzeDataUseCase: AnalyzeDataUseCase
  private readonly getContentHistoryUseCase: GetContentHistoryUseCase
  private readonly createTemplateUseCase: CreateTemplateUseCase

  constructor(dependencies: ContentServiceDependencies) {
    // Note: In a real implementation, you would inject the content generation and analysis services
    // For now, we'll create the use cases with just the repositories
    this.generatePresentationUseCase = new GeneratePresentationUseCase(
      dependencies.contentProjectRepository,
      dependencies.generatedContentRepository,
      dependencies.contentTemplateRepository,
      // Would inject ContentGenerationService here
      {} as any
    )

    this.generateReportUseCase = new GenerateReportUseCase(
      dependencies.contentProjectRepository,
      dependencies.generatedContentRepository,
      dependencies.contentTemplateRepository,
      // Would inject ContentGenerationService here
      {} as any
    )

    this.analyzeDataUseCase = new AnalyzeDataUseCase(
      dependencies.contentProjectRepository,
      dependencies.generatedContentRepository,
      // Would inject ContentAnalysisService here
      {} as any
    )

    this.getContentHistoryUseCase = new GetContentHistoryUseCase(
      dependencies.contentProjectRepository,
      dependencies.generatedContentRepository
    )

    this.createTemplateUseCase = new CreateTemplateUseCase(
      dependencies.contentTemplateRepository
    )
  }

  // Presentation generation
  async generatePresentation(request: Parameters<typeof this.generatePresentationUseCase.execute>[0]) {
    return this.generatePresentationUseCase.execute(request)
  }

  // Report generation
  async generateReport(request: Parameters<typeof this.generateReportUseCase.execute>[0]) {
    return this.generateReportUseCase.execute(request)
  }

  // Data analysis
  async analyzeData(request: Parameters<typeof this.analyzeDataUseCase.execute>[0]) {
    return this.analyzeDataUseCase.execute(request)
  }

  // Content history
  async getContentHistory(request: Parameters<typeof this.getContentHistoryUseCase.execute>[0]) {
    return this.getContentHistoryUseCase.execute(request)
  }

  // Template management
  async createTemplate(request: Parameters<typeof this.createTemplateUseCase.execute>[0]) {
    return this.createTemplateUseCase.execute(request)
  }

  // Additional convenience methods

  async getProjectById(projectId: string) {
    return this.generatePresentationUseCase['contentProjectRepository'].findById(projectId)
  }

  async getContentByProjectId(projectId: string) {
    return this.generatePresentationUseCase['generatedContentRepository'].findByProject(projectId)
  }

  async getTemplatesByCategory(userId: string, workspaceId: string, category: string) {
    // Implementation would depend on the repository interface
    return Result.ok([])
  }

  async deleteProject(projectId: string) {
    const projectResult = await this.getProjectById(projectId)
    if (projectResult.isErr() || !projectResult.unwrap()) {
      return Result.err(new Error('Project not found'))
    }

    // Delete project and associated content
    const projectDeleteResult = await this.generatePresentationUseCase['contentProjectRepository'].delete(projectId)
    if (projectDeleteResult.isErr()) {
      return projectDeleteResult
    }

    // Delete all content associated with the project
    const contentResult = await this.getContentByProjectId(projectId)
    if (contentResult.isOk()) {
      const contents = contentResult.unwrap()
      for (const content of contents) {
        await this.generatePresentationUseCase['generatedContentRepository'].delete(content.id)
      }
    }

    return Result.ok(undefined)
  }

  async getProjectMetrics(userId: string, workspaceId: string) {
    try {
      // Get projects by user and workspace
      const projects = await this.generatePresentationUseCase['contentProjectRepository'].findByUserAndWorkspace(
        userId,
        workspaceId
      )

      if (!Array.isArray(projects)) {
        return Result.ok({
          totalProjects: 0,
          completedProjects: 0,
          failedProjects: 0,
          totalContent: 0,
          averageProcessingTime: 0
        })
      }

      const completedProjects = projects.filter(p => p.status === 'completed').length
      const failedProjects = projects.filter(p => p.status === 'failed').length

      // Get total content count
      let totalContent = 0
      let totalProcessingTime = 0
      let contentCount = 0

      for (const project of projects) {
        const contents = await this.generatePresentationUseCase['generatedContentRepository'].findByProject(project.id)
        if (Array.isArray(contents)) {
          totalContent += contents.length
          for (const content of contents) {
            if (content.processingTime) {
              totalProcessingTime += content.processingTime
              contentCount++
            }
          }
        }
      }

      const averageProcessingTime = contentCount > 0 ? totalProcessingTime / contentCount : 0

      return Result.ok({
        totalProjects: projects.length,
        completedProjects,
        failedProjects,
        totalContent,
        averageProcessingTime
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}