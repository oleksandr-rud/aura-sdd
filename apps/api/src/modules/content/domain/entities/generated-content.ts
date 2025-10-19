/**
 * Generated Content Entity
 * KISS principle: simple entity for AI-generated content
 */

import { BaseEntity } from '@/shared/base-entity'

export type ContentFormat = 'json' | 'markdown' | 'html' | 'pdf' | 'text'
export type ContentQuality = 'low' | 'medium' | 'high' | 'excellent'

export interface GeneratedContentData {
  projectId: string
  type: string
  format: ContentFormat
  title: string
  content: string
  metadata?: Record<string, any>
  quality?: ContentQuality
  tokens?: number
  processingTime?: number
}

export class GeneratedContent extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly projectId: string,
    public readonly type: string,
    public readonly format: ContentFormat,
    public readonly title: string,
    public content: string,
    public readonly metadata: Record<string, any> | undefined,
    public quality: ContentQuality | undefined,
    public tokens: number | undefined,
    public processingTime: number | undefined
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(data: GeneratedContentData): GeneratedContent {
    const now = new Date()
    return new GeneratedContent(
      BaseEntity.generateId(),
      now,
      now,
      data.projectId,
      data.type,
      data.format,
      data.title,
      data.content,
      data.metadata,
      data.quality,
      data.tokens,
      data.processingTime
    )
  }

  updateContent(content: string): void {
    this.content = content
    this.markAsUpdated()
  }

  updateQuality(quality: ContentQuality): void {
    this.quality = quality
    this.markAsUpdated()
  }

  updateMetrics(tokens: number, processingTime: number): void {
    this.tokens = tokens
    this.processingTime = processingTime
    this.markAsUpdated()
  }

  getSize(): number {
    return this.content.length
  }

  getEstimatedReadingTime(): number {
    // Average reading speed: 200 words per minute
    const words = this.content.split(/\s+/).length
    return Math.ceil(words / 200)
  }

  isLarge(): boolean {
    return this.getSize() > 100000 // 100KB
  }

  toJSON(): GeneratedContentData & { id: string; createdAt: Date; updatedAt: Date } {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      projectId: this.projectId,
      type: this.type,
      format: this.format,
      title: this.title,
      content: this.content,
      metadata: this.metadata,
      quality: this.quality,
      tokens: this.tokens,
      processingTime: this.processingTime
    }
  }
}