/**
 * Content Project Repository Implementation
 * KISS principle: simple in-memory implementation for development
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { ContentProjectRepository } from '../../domain/repositories'
import { ContentProject, ContentType, ProjectStatus } from '../../domain/entities'

export class ContentProjectRepositoryImpl
  extends MemoryPaginatedRepository<ContentProject>
  implements ContentProjectRepository
{
  async findByUser(userId: string): Promise<ContentProject[]> {
    const result = await this.findBy({ userId })
    return result.unwrap()
  }

  async findByWorkspace(workspaceId: string): Promise<ContentProject[]> {
    const result = await this.findBy({ workspaceId })
    return result.unwrap()
  }

  async findByUserAndWorkspace(userId: string, workspaceId: string): Promise<ContentProject[]> {
    const result = await this.findBy({ userId, workspaceId })
    return result.unwrap()
  }

  async findByType(type: ContentType): Promise<ContentProject[]> {
    const result = await this.findBy({ type })
    return result.unwrap()
  }

  async findByStatus(status: ProjectStatus): Promise<ContentProject[]> {
    const result = await this.findBy({ status })
    return result.unwrap()
  }

  async findByTypeAndUser(type: ContentType, userId: string): Promise<ContentProject[]> {
    const result = await this.findBy({ type, userId })
    return result.unwrap()
  }

  async findActiveProjects(userId: string): Promise<ContentProject[]> {
    const allProjects = await this.findByUser(userId)
    return allProjects.filter(project => project.isActive())
  }

  async findCompletedProjects(userId: string): Promise<ContentProject[]> {
    const allProjects = await this.findByUser(userId)
    return allProjects.filter(project => project.isCompleted())
  }

  async countByStatus(status: ProjectStatus): Promise<number> {
    const result = await this.findBy({ status })
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

  async findRecentByUser(userId: string, limit: number): Promise<ContentProject[]> {
    const allProjects = await this.findByUser(userId)
    return allProjects
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
  }

  async findByTitle(userId: string, title: string): Promise<ContentProject[]> {
    const allProjects = await this.findByUser(userId)
    return allProjects.filter(project =>
      project.title.toLowerCase().includes(title.toLowerCase())
    )
  }
}