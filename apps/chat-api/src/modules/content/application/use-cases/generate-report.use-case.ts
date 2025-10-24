/**
 * Generate Report Use Case
 * KISS principle: simple use case for report generation
 */

import { Result } from '@/libs/utils'
import { Command } from '@/shared/use-case'
import { validateAndExtract } from '@/libs/validation'
import { contentSchemas } from '@/libs/validation'
import {
  ContentProjectRepository,
  GeneratedContentRepository,
  ContentTemplateRepository
} from '../../domain/repositories'
import { ContentGenerationService } from '../../domain/services'
import { ContentProject, GeneratedContent } from '../../domain/entities'

export interface GenerateReportRequest {
  userId: string
  workspaceId: string
  title: string
  dateRange: { start: string; end: string }
  metrics: string[]
  includeCharts: boolean
  format: 'pdf' | 'html' | 'markdown'
  dataSources?: string[]
  templateId?: string
}

export interface GenerateReportResponse {
  project: ContentProject
  content: GeneratedContent
  report: any
}

export class GenerateReportUseCase extends Command<GenerateReportRequest, GenerateReportResponse> {
  constructor(
    private readonly contentProjectRepository: ContentProjectRepository,
    private readonly generatedContentRepository: GeneratedContentRepository,
    private readonly contentTemplateRepository: ContentTemplateRepository,
    private readonly contentGenerationService: ContentGenerationService
  ) {
    super()
  }

  validate(input: GenerateReportRequest): Result<GenerateReportRequest, Error> {
    const validation = validateAndExtract(contentSchemas.generateReport, {
      title: input.title,
      dateRange: input.dateRange,
      metrics: input.metrics,
      includeCharts: input.includeCharts,
      format: input.format
    })

    if (validation.isErr()) {
      return Result.err(new Error(`Validation error: ${JSON.stringify(validation.unwrapErr())}`))
    }

    return Result.ok(input)
  }

  async executeValidated(request: GenerateReportRequest): Promise<Result<GenerateReportResponse, Error>> {
    try {
      // Create content project
      const project = ContentProject.create({
        title: `Report: ${request.title}`,
        description: `Generated report with metrics: ${request.metrics.join(', ')}`,
        type: 'report',
        status: 'in_progress',
        userId: request.userId,
        workspaceId: request.workspaceId,
        dataSources: request.dataSources || [],
        parameters: {
          title: request.title,
          dateRange: request.dateRange,
          metrics: request.metrics,
          includeCharts: request.includeCharts,
          format: request.format
        }
      })

      const savedProject = await this.contentProjectRepository.save(project)
      if (savedProject.isErr()) {
        return Result.err(savedProject.unwrapErr())
      }

      // Prepare generation request
      let prompt = `Generate a comprehensive report titled "${request.title}" covering the period from ${request.dateRange.start} to ${request.dateRange.end}. Include analysis of the following metrics: ${request.metrics.join(', ')}.`

      if (request.includeCharts) {
        prompt += ' Include data visualizations and charts where appropriate.'
      }

      if (request.templateId) {
        const template = await this.contentTemplateRepository.findById(request.templateId)
        if (template.isOk() && template.unwrap()) {
          prompt = template.unwrap().aiPrompt
        }
      }

      const generationRequest = {
        type: 'report' as const,
        prompt,
        dataSources: request.dataSources,
        parameters: {
          title: request.title,
          dateRange: request.dateRange,
          metrics: request.metrics,
          includeCharts: request.includeCharts,
          format: request.format
        }
      }

      // Generate report
      const generationResult = await this.contentGenerationService.generateReport(generationRequest)
      if (generationResult.isErr()) {
        // Update project status to failed
        project.updateStatus('failed')
        await this.contentProjectRepository.save(project)
        return Result.err(generationResult.unwrapErr())
      }

      const report = generationResult.unwrap()

      // Create generated content record
      const content = GeneratedContent.create({
        projectId: project.id,
        type: 'report',
        format: request.format,
        title: request.title,
        content: JSON.stringify(report),
        metadata: {
          sectionCount: report.sections.length,
          metrics: request.metrics,
          dateRange: request.dateRange,
          includeCharts: request.includeCharts
        },
        quality: 'high',
        tokens: 0, // Would be calculated by the generation service
        processingTime: 0 // Would be calculated by the generation service
      })

      const savedContent = await this.generatedContentRepository.save(content)
      if (savedContent.isErr()) {
        return Result.err(savedContent.unwrapErr())
      }

      // Update project status to completed
      project.updateStatus('completed')
      await this.contentProjectRepository.save(project)

      return Result.ok({
        project: savedProject.unwrap(),
        content: savedContent.unwrap(),
        report
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}