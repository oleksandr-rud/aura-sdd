/**
 * Content Template Repository Interface
 * KISS principle: simple repository interface for content templates
 */

import { Repository, PaginatedRepository } from '@/shared/base-repository'
import { ContentTemplate, TemplateCategory, TemplateStatus } from '../entities'

export interface ContentTemplateRepository extends Repository<ContentTemplate>, PaginatedRepository<ContentTemplate> {
  findByUser(userId: string): Promise<ContentTemplate[]>
  findByWorkspace(workspaceId: string): Promise<ContentTemplate[]>
  findByUserAndWorkspace(userId: string, workspaceId: string): Promise<ContentTemplate[]>
  findByCategory(category: TemplateCategory): Promise<ContentTemplate[]>
  findByStatus(status: TemplateStatus): Promise<ContentTemplate[]>
  findActiveTemplates(userId: string): Promise<ContentTemplate[]>
  findByCategoryAndStatus(category: TemplateCategory, status: TemplateStatus): Promise<ContentTemplate[]>
  findByWorkspaceAndCategory(workspaceId: string, category: TemplateCategory): Promise<ContentTemplate[]>
  findByName(userId: string, name: string): Promise<ContentTemplate | null>
  searchByDescription(userId: string, keywords: string): Promise<ContentTemplate[]>
  findSystemTemplates(): Promise<ContentTemplate[]>
  findUserTemplates(userId: string): Promise<ContentTemplate[]>
  countByCategory(category: TemplateCategory): Promise<number>
  countByUser(userId: string): Promise<number>
  countByWorkspace(workspaceId: string): Promise<number>
  findPopularTemplates(limit: number): Promise<ContentTemplate[]>
  findRecentlyUsed(userId: string, limit: number): Promise<ContentTemplate[]>
}