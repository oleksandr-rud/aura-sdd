/**
 * Generated Content Repository Interface
 * KISS principle: simple repository interface for generated content
 */

import { Repository, PaginatedRepository } from '@/shared/base-repository'
import { GeneratedContent, ContentFormat, ContentQuality } from '../entities'

export interface GeneratedContentRepository extends Repository<GeneratedContent>, PaginatedRepository<GeneratedContent> {
  findByProject(projectId: string): Promise<GeneratedContent[]>
  findByType(type: string): Promise<GeneratedContent[]>
  findByFormat(format: ContentFormat): Promise<GeneratedContent[]>
  findByQuality(quality: ContentQuality): Promise<GeneratedContent[]>
  findByProjectAndType(projectId: string, type: string): Promise<GeneratedContent[]>
  findLatestByProject(projectId: string): Promise<GeneratedContent | null>
  findByDateRange(startDate: Date, endDate: Date): Promise<GeneratedContent[]>
  findByUser(userId: string): Promise<GeneratedContent[]>
  countByProject(projectId: string): Promise<number>
  countByType(type: string): Promise<number>
  countByFormat(format: ContentFormat): Promise<number>
  findLargeContent(limit: number): Promise<GeneratedContent[]>
  findByTitle(title: string): Promise<GeneratedContent[]>
  getTotalTokens(): Promise<number>
  getAverageProcessingTime(): Promise<number>
}