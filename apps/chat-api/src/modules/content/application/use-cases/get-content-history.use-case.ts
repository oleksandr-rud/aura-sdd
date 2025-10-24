/**
 * Get Content History Use Case
 * KISS principle: simple use case for retrieving content history
 */

import { Result } from '@/libs/utils'
import { Query } from '@/shared/use-case'
import { commonSchemas } from '@/libs/validation'
import { validateAndExtract } from '@/libs/validation'
import {
  ContentProjectRepository,
  GeneratedContentRepository
} from '../../domain/repositories'
import { ContentProject, GeneratedContent } from '../../domain/entities'

export interface GetContentHistoryRequest {
  userId: string
  workspaceId: string
  type?: string
  status?: string
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface ContentHistoryItem {
  project: ContentProject
  content?: GeneratedContent
  lastModified: Date
}

export interface GetContentHistoryResponse {
  items: ContentHistoryItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class GetContentHistoryUseCase extends Query<GetContentHistoryRequest, GetContentHistoryResponse> {
  constructor(
    private readonly contentProjectRepository: ContentProjectRepository,
    private readonly generatedContentRepository: GeneratedContentRepository
  ) {
    super()
  }

  validate(input: GetContentHistoryRequest): Result<GetContentHistoryRequest, Error> {
    const validation = validateAndExtract(commonSchemas.pagination, {
      page: input.page || 1,
      limit: input.limit || 20
    })

    if (validation.isErr()) {
      return Result.err(new Error(`Validation error: ${JSON.stringify(validation.unwrapErr())}`))
    }

    return Result.ok(input)
  }

  async executeValidated(request: GetContentHistoryRequest): Promise<Result<GetContentHistoryResponse, Error>> {
    try {
      const page = request.page || 1
      const limit = request.limit || 20

      // Build filter criteria
      const filter: Partial<ContentProject> = {
        userId: request.userId,
        workspaceId: request.workspaceId
      }

      if (request.type) {
        (filter as any).type = request.type
      }

      if (request.status) {
        (filter as any).status = request.status
      }

      // Get paginated projects
      const projectsResult = await this.contentProjectRepository.findManyBy(filter, { page, limit })
      if (projectsResult.isErr()) {
        return Result.err(projectsResult.unwrapErr())
      }

      const paginatedProjects = projectsResult.unwrap()

      // For each project, get the latest generated content
      const historyItems: ContentHistoryItem[] = []

      for (const project of paginatedProjects.items) {
        const latestContent = await this.generatedContentRepository.findLatestByProject(project.id)

        historyItems.push({
          project,
          content: latestContent.isOk() ? latestContent.unwrap() : undefined,
          lastModified: project.updatedAt
        })
      }

      // Sort by last modified date (newest first)
      historyItems.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

      return Result.ok({
        items: historyItems,
        total: paginatedProjects.total,
        page: paginatedProjects.page,
        limit: paginatedProjects.limit,
        totalPages: paginatedProjects.totalPages
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}