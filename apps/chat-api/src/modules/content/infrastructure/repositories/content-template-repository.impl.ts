/**
 * Content Template Repository Implementation
 * KISS principle: simple in-memory implementation for development
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { ContentTemplateRepository } from '../../domain/repositories'
import { ContentTemplate, TemplateCategory, TemplateStatus } from '../../domain/entities'

export class ContentTemplateRepositoryImpl
  extends MemoryPaginatedRepository<ContentTemplate>
  implements ContentTemplateRepository
{
  async findByUser(userId: string): Promise<ContentTemplate[]> {
    const result = await this.findBy({ userId })
    return result.unwrap()
  }

  async findByWorkspace(workspaceId: string): Promise<ContentTemplate[]> {
    const result = await this.findBy({ workspaceId })
    return result.unwrap()
  }

  async findByUserAndWorkspace(userId: string, workspaceId: string): Promise<ContentTemplate[]> {
    const result = await this.findBy({ userId, workspaceId })
    return result.unwrap()
  }

  async findByCategory(category: TemplateCategory): Promise<ContentTemplate[]> {
    const result = await this.findBy({ category })
    return result.unwrap()
  }

  async findByStatus(status: TemplateStatus): Promise<ContentTemplate[]> {
    const result = await this.findBy({ status })
    return result.unwrap()
  }

  async findActiveTemplates(userId: string): Promise<ContentTemplate[]> {
    const userTemplates = await this.findByUser(userId)
    return userTemplates.filter(template => template.isActive())
  }

  async findByCategoryAndStatus(category: TemplateCategory, status: TemplateStatus): Promise<ContentTemplate[]> {
    const result = await this.findBy({ category, status })
    return result.unwrap()
  }

  async findByWorkspaceAndCategory(workspaceId: string, category: TemplateCategory): Promise<ContentTemplate[]> {
    const result = await this.findBy({ workspaceId, category })
    return result.unwrap()
  }

  async findByName(userId: string, name: string): Promise<ContentTemplate | null> {
    const userTemplates = await this.findByUser(userId)
    return userTemplates.find(template =>
      template.name.toLowerCase() === name.toLowerCase()
    ) || null
  }

  async searchByDescription(userId: string, keywords: string): Promise<ContentTemplate[]> {
    const userTemplates = await this.findByUser(userId)
    const keywordList = keywords.toLowerCase().split(' ')

    return userTemplates.filter(template => {
      const description = template.description.toLowerCase()
      return keywordList.some(keyword => description.includes(keyword))
    })
  }

  async findSystemTemplates(): Promise<ContentTemplate[]> {
    // System templates could be identified by a special userId or flag
    // For now, return empty array as placeholder
    return []
  }

  async findUserTemplates(userId: string): Promise<ContentTemplate[]> {
    return this.findByUser(userId)
  }

  async countByCategory(category: TemplateCategory): Promise<number> {
    const result = await this.findBy({ category })
    return result.unwrap().length
  }

  async countByUser(userId: string): Promise<number> {
    const result = await this.findBy({ userId })
    return result.unwrap().length
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    const result = await this.findBy({ workspaceId })
    return result.unwrap().length
  }

  async findPopularTemplates(limit: number): Promise<ContentTemplate[]> {
    // In a real implementation, this would track usage statistics
    // For now, return recent active templates as a proxy for popularity
    const allResult = await this.findAll()
    const allTemplates = allResult.unwrap()
    return allTemplates
      .filter(template => template.isActive())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
  }

  async findRecentlyUsed(userId: string, limit: number): Promise<ContentTemplate[]> {
    // In a real implementation, this would track actual usage
    // For now, return recently updated templates as a proxy
    const userTemplates = await this.findByUser(userId)
    return userTemplates
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
  }
}