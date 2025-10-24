/**
 * Analyze Data Use Case
 * KISS principle: simple use case for data analysis
 */

import { Result } from '@/libs/utils'
import { Command } from '@/shared/use-case'
import { validateAndExtract } from '@/libs/validation'
import { contentSchemas } from '@/libs/validation'
import { ContentProjectRepository, GeneratedContentRepository } from '../../domain/repositories'
import { ContentAnalysisService } from '../../domain/services'
import { ContentProject, GeneratedContent } from '../../domain/entities'

export interface AnalyzeDataRequest {
  userId: string
  workspaceId: string
  dataType: 'crm' | 'chat' | 'content' | 'custom'
  analysisType: 'trends' | 'sentiment' | 'patterns' | 'insights'
  dateRange: { start: string; end: string }
  filters?: Record<string, any>
  dataSources?: string[]
}

export interface AnalyzeDataResponse {
  project: ContentProject
  content: GeneratedContent
  analysis: any
}

export class AnalyzeDataUseCase extends Command<AnalyzeDataRequest, AnalyzeDataResponse> {
  constructor(
    private readonly contentProjectRepository: ContentProjectRepository,
    private readonly generatedContentRepository: GeneratedContentRepository,
    private readonly contentAnalysisService: ContentAnalysisService
  ) {
    super()
  }

  validate(input: AnalyzeDataRequest): Result<AnalyzeDataRequest, Error> {
    const validation = validateAndExtract(contentSchemas.analyzeData, {
      dataType: input.dataType,
      analysisType: input.analysisType,
      dateRange: input.dateRange,
      filters: input.filters
    })

    if (validation.isErr()) {
      return Result.err(new Error(`Validation error: ${JSON.stringify(validation.unwrapErr())}`))
    }

    return Result.ok(input)
  }

  async executeValidated(request: AnalyzeDataRequest): Promise<Result<AnalyzeDataResponse, Error>> {
    try {
      // Create content project
      const project = ContentProject.create({
        title: `${request.analysisType} analysis of ${request.dataType} data`,
        description: `Data analysis for ${request.dataType} from ${request.dateRange.start} to ${request.dateRange.end}`,
        type: 'analysis',
        status: 'in_progress',
        userId: request.userId,
        workspaceId: request.workspaceId,
        dataSources: request.dataSources || [],
        parameters: {
          dataType: request.dataType,
          analysisType: request.analysisType,
          dateRange: request.dateRange,
          filters: request.filters
        }
      })

      const savedProject = await this.contentProjectRepository.save(project)
      if (savedProject.isErr()) {
        return Result.err(savedProject.unwrapErr())
      }

      // Prepare data sources for analysis
      const dataSources = []
      if (request.dataSources) {
        for (const sourceId of request.dataSources) {
          // In a real implementation, you would fetch the actual data
          // For now, we'll use a placeholder
          dataSources.push({
            id: sourceId,
            type: request.dataType,
            name: `Data source: ${sourceId}`,
            data: {}, // Would be actual data
            metadata: { dateRange: request.dateRange }
          })
        }
      }

      const analysisRequest = {
        dataSources,
        analysisType: request.analysisType,
        parameters: {
          dataType: request.dataType,
          filters: request.filters
        },
        filters: request.filters
      }

      // Analyze data
      const analysisResult = await this.contentAnalysisService.analyzeData(analysisRequest)
      if (analysisResult.isErr()) {
        // Update project status to failed
        project.updateStatus('failed')
        await this.contentProjectRepository.save(project)
        return Result.err(analysisResult.unwrapErr())
      }

      const analysis = analysisResult.unwrap()

      // Create generated content record
      const content = GeneratedContent.create({
        projectId: project.id,
        type: 'analysis',
        format: 'json',
        title: `${request.analysisType} analysis results`,
        content: JSON.stringify(analysis),
        metadata: {
          dataType: request.dataType,
          analysisType: request.analysisType,
          dateRange: request.dateRange,
          insightsCount: analysis.insights.length,
          recommendationsCount: analysis.recommendations.length
        },
        quality: 'high',
        tokens: 0, // Would be calculated by the analysis service
        processingTime: analysis.processingTime
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
        analysis
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}