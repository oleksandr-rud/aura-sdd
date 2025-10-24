/**
 * Generate Presentation Use Case
 * KISS principle: simple use case for presentation generation
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

export interface GeneratePresentationRequest {
  userId: string
  workspaceId: string
  topic: string
  audience: string
  length: 'short' | 'medium' | 'long'
  style: 'professional' | 'casual' | 'technical'
  dataSources?: string[]
  templateId?: string
}

export interface GeneratePresentationResponse {
  project: ContentProject
  content: GeneratedContent
  presentation: any
}

export class GeneratePresentationUseCase extends Command<GeneratePresentationRequest, GeneratePresentationResponse> {
  constructor(
    private readonly contentProjectRepository: ContentProjectRepository,
    private readonly generatedContentRepository: GeneratedContentRepository,
    private readonly contentTemplateRepository: ContentTemplateRepository,
    private readonly contentGenerationService: ContentGenerationService
  ) {
    super()
  }

  validate(input: GeneratePresentationRequest): Result<GeneratePresentationRequest, Error> {
    const validation = validateAndExtract(contentSchemas.generatePresentation, {
      topic: input.topic,
      audience: input.audience,
      length: input.length,
      style: input.style,
      dataSources: input.dataSources
    })

    if (validation.isErr()) {
      return Result.err(new Error(`Validation error: ${JSON.stringify(validation.unwrapErr())}`))
    }

    return Result.ok(input)
  }

  async executeValidated(request: GeneratePresentationRequest): Promise<Result<GeneratePresentationResponse, Error>> {
    try {
      // Create content project
      const project = ContentProject.create({
        title: `Presentation: ${request.topic}`,
        description: `Generated presentation for ${request.audience}`,
        type: 'presentation',
        status: 'in_progress',
        userId: request.userId,
        workspaceId: request.workspaceId,
        dataSources: request.dataSources || [],
        parameters: {
          topic: request.topic,
          audience: request.audience,
          length: request.length,
          style: request.style
        }
      })

      const savedProject = await this.contentProjectRepository.save(project)
      if (savedProject.isErr()) {
        return Result.err(savedProject.unwrapErr())
      }

      // Prepare generation request
      let prompt = `Create a ${request.length} presentation about "${request.topic}" for a ${request.audience} audience in a ${request.style} style.`

      if (request.templateId) {
        const template = await this.contentTemplateRepository.findById(request.templateId)
        if (template.isOk() && template.unwrap()) {
          prompt = template.unwrap().aiPrompt
        }
      }

      const generationRequest = {
        type: 'presentation' as const,
        prompt,
        dataSources: request.dataSources,
        parameters: {
          topic: request.topic,
          audience: request.audience,
          length: request.length,
          style: request.style
        }
      }

      // Generate presentation
      const generationResult = await this.contentGenerationService.generatePresentation(generationRequest)
      if (generationResult.isErr()) {
        // Update project status to failed
        project.updateStatus('failed')
        await this.contentProjectRepository.save(project)
        return Result.err(generationResult.unwrapErr())
      }

      const presentation = generationResult.unwrap()

      // Create generated content record
      const content = GeneratedContent.create({
        projectId: project.id,
        type: 'presentation',
        format: 'json',
        title: request.topic,
        content: JSON.stringify(presentation),
        metadata: {
          slideCount: presentation.slides.length,
          audience: request.audience,
          style: request.style,
          length: request.length
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
        presentation
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}