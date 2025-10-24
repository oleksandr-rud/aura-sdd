/**
 * Generated Content Repository Implementation
 * KISS principle: simple in-memory implementation for development
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { GeneratedContentRepository } from '../../domain/repositories'
import { GeneratedContent, ContentFormat, ContentQuality } from '../../domain/entities'

export class GeneratedContentRepositoryImpl
  extends MemoryPaginatedRepository<GeneratedContent>
  implements GeneratedContentRepository
{
  async findByProject(projectId: string): Promise<GeneratedContent[]> {
    const result = await this.findBy({ projectId })
    return result.unwrap()
  }

  async findByType(type: string): Promise<GeneratedContent[]> {
    const result = await this.findBy({ type })
    return result.unwrap()
  }

  async findByFormat(format: ContentFormat): Promise<GeneratedContent[]> {
    const result = await this.findBy({ format })
    return result.unwrap()
  }

  async findByQuality(quality: ContentQuality): Promise<GeneratedContent[]> {
    const result = await this.findBy({ quality })
    return result.unwrap()
  }

  async findByProjectAndType(projectId: string, type: string): Promise<GeneratedContent[]> {
    const result = await this.findBy({ projectId, type })
    return result.unwrap()
  }

  async findLatestByProject(projectId: string): Promise<GeneratedContent | null> {
    const result = await this.findByProject(projectId)
    const contents = result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    return contents.length > 0 ? contents[0] : null
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<GeneratedContent[]> {
    const allResult = await this.findAll()
    const allContents = allResult.unwrap()
    return allContents.filter(content =>
      content.createdAt >= startDate && content.createdAt <= endDate
    )
  }

  async findByUser(userId: string): Promise<GeneratedContent[]> {
    // This would require joining with projects in a real database
    // For now, return empty array as a placeholder
    return []
  }

  async countByProject(projectId: string): Promise<number> {
    const result = await this.findByProject(projectId)
    return result.length
  }

  async countByType(type: string): Promise<number> {
    const result = await this.findBy({ type })
    return result.unwrap().length
  }

  async countByFormat(format: ContentFormat): Promise<number> {
    const result = await this.findBy({ format })
    return result.unwrap().length
  }

  async findLargeContent(limit: number): Promise<GeneratedContent[]> {
    const allResult = await this.findAll()
    const allContents = allResult.unwrap()
    return allContents
      .filter(content => content.isLarge())
      .sort((a, b) => b.getSize() - a.getSize())
      .slice(0, limit)
  }

  async findByTitle(title: string): Promise<GeneratedContent[]> {
    const allResult = await this.findAll()
    const allContents = allResult.unwrap()
    return allContents.filter(content =>
      content.title.toLowerCase().includes(title.toLowerCase())
    )
  }

  async getTotalTokens(): Promise<number> {
    const allResult = await this.findAll()
    const allContents = allResult.unwrap()
    return allContents.reduce((total, content) => total + (content.tokens || 0), 0)
  }

  async getAverageProcessingTime(): Promise<number> {
    const allResult = await this.findAll()
    const allContents = allResult.unwrap()
    const contentsWithTime = allContents.filter(content => content.processingTime !== undefined)

    if (contentsWithTime.length === 0) return 0

    const totalTime = contentsWithTime.reduce((total, content) => total + (content.processingTime || 0), 0)
    return totalTime / contentsWithTime.length
  }
}