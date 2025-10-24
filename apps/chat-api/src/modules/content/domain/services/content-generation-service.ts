/**
 * Content Generation Service Interface
 * KISS principle: simple service interface for AI content generation
 */

import { Result } from '@/libs/utils'

export interface GenerationRequest {
  type: 'presentation' | 'report' | 'analysis' | 'document'
  prompt: string
  context?: string
  dataSources?: string[]
  parameters?: Record<string, any>
  template?: string
}

export interface GenerationOptions {
  maxTokens?: number
  temperature?: number
  model?: string
  format?: 'json' | 'markdown' | 'html'
  quality?: 'fast' | 'balanced' | 'quality'
}

export interface GenerationResult {
  content: string
  format: string
  metadata: Record<string, any>
  tokens: number
  processingTime: number
  quality: 'low' | 'medium' | 'high' | 'excellent'
}

export interface Slide {
  id: string
  title: string
  content: string
  speakerNotes?: string
  layout?: string
  order: number
}

export interface PresentationStructure {
  title: string
  subtitle?: string
  slides: Slide[]
  metadata: Record<string, any>
}

export interface ReportSection {
  id: string
  title: string
  content: string
  type: 'summary' | 'analysis' | 'chart' | 'recommendation'
  order: number
}

export interface ReportStructure {
  title: string
  executiveSummary: string
  sections: ReportSection[]
  recommendations: string[]
  metadata: Record<string, any>
}

export interface DataInsight {
  type: 'trend' | 'pattern' | 'anomaly' | 'recommendation'
  title: string
  description: string
  confidence: number
  data: any
}

export interface AnalysisResult {
  insights: DataInsight[]
  summary: string
  trends: any[]
  recommendations: string[]
  metadata: Record<string, any>
}

export interface ContentGenerationService {
  // Generic content generation
  generateContent(request: GenerationRequest, options?: GenerationOptions): Promise<Result<GenerationResult, Error>>

  // Presentation generation
  generatePresentation(request: GenerationRequest, options?: GenerationOptions): Promise<Result<PresentationStructure, Error>>
  generateSlides(topic: string, count: number, style?: string): Promise<Result<Slide[], Error>>

  // Report generation
  generateReport(request: GenerationRequest, options?: GenerationOptions): Promise<Result<ReportStructure, Error>>
  generateExecutiveSummary(data: any, context?: string): Promise<Result<string, Error>>

  // Data analysis
  analyzeData(data: any, analysisType?: string): Promise<Result<AnalysisResult, Error>>
  extractInsights(data: any): Promise<Result<DataInsight[], Error>>

  // Content enhancement
  enhanceContent(content: string, instructions: string): Promise<Result<string, Error>>
  summarizeContent(content: string, maxLength?: number): Promise<Result<string, Error>>
  expandContent(content: string, targetLength?: number): Promise<Result<string, Error>>

  // Template-based generation
  generateFromTemplate(templateId: string, variables: Record<string, any>): Promise<Result<GenerationResult, Error>>

  // Quality assessment
  assessQuality(content: string): Promise<Result<'low' | 'medium' | 'high' | 'excellent', Error>>
  improveQuality(content: string): Promise<Result<string, Error>>

  // Content validation
  validateStructure(content: string, expectedStructure: any): Promise<Result<boolean, Error>>
  extractMetadata(content: string): Promise<Result<Record<string, any>, Error>>
}