/**
 * Content Project Repository Interface
 * KISS principle: simple repository interface for content projects
 */

import { Repository, PaginatedRepository } from '@/shared/base-repository'
import { ContentProject, ContentType, ProjectStatus } from '../entities'

export interface ContentProjectRepository extends Repository<ContentProject>, PaginatedRepository<ContentProject> {
  findByUser(userId: string): Promise<ContentProject[]>
  findByWorkspace(workspaceId: string): Promise<ContentProject[]>
  findByUserAndWorkspace(userId: string, workspaceId: string): Promise<ContentProject[]>
  findByType(type: ContentType): Promise<ContentProject[]>
  findByStatus(status: ProjectStatus): Promise<ContentProject[]>
  findByTypeAndUser(type: ContentType, userId: string): Promise<ContentProject[]>
  findActiveProjects(userId: string): Promise<ContentProject[]>
  findCompletedProjects(userId: string): Promise<ContentProject[]>
  countByStatus(status: ProjectStatus): Promise<number>
  countByUser(userId: string): Promise<number>
  countByWorkspace(workspaceId: string): Promise<number>
  findRecentByUser(userId: string, limit: number): Promise<ContentProject[]>
  findByTitle(userId: string, title: string): Promise<ContentProject[]>
}