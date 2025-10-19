/**
 * Content Analysis Service Interface
 * KISS principle: simple service interface for content analysis
 */

import { Result } from '@/libs/utils'

export interface DataSource {
  id: string
  type: 'crm' | 'chat' | 'content' | 'file' | 'api'
  name: string
  data: any
  metadata?: Record<string, any>
}

export interface AnalysisRequest {
  dataSources: DataSource[]
  analysisType: 'trends' | 'sentiment' | 'patterns' | 'insights' | 'summary'
  parameters?: Record<string, any>
  filters?: Record<string, any>
}

export interface AnalysisOptions {
  depth?: 'basic' | 'detailed' | 'comprehensive'
  includeVisualizations?: boolean
  timeRange?: { start: Date; end: Date }
  focus?: string[]
}

export interface Trend {
  metric: string
  direction: 'up' | 'down' | 'stable'
  change: number
  period: string
  significance: 'low' | 'medium' | 'high'
}

export interface Sentiment {
  overall: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions: Record<string, number>
  breakdown: Array<{ segment: string; sentiment: string; confidence: number }>
}

export interface Pattern {
  type: string
  description: string
  frequency: number
  confidence: number
  examples: string[]
}

export interface Insight {
  category: string
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  confidence: number
  evidence: string[]
  recommendations?: string[]
}

export interface AnalysisResult {
  summary: string
  keyFindings: string[]
  trends?: Trend[]
  sentiment?: Sentiment
  patterns?: Pattern[]
  insights: Insight[]
  recommendations: string[]
  metadata: Record<string, any>
  processingTime: number
}

export interface ContentMetrics {
  wordCount: number
  readabilityScore: number
  complexityScore: number
  sentimentScore: number
  topicRelevance: number
  qualityScore: number
}

export interface ComparisonResult {
  similarity: number
  differences: string[]
  commonalities: string[]
  recommendations: string[]
}

export interface ContentAnalysisService {
  // Data analysis
  analyzeData(request: AnalysisRequest, options?: AnalysisOptions): Promise<Result<AnalysisResult, Error>>
  analyzeTrends(data: any, timeRange?: { start: Date; end: Date }): Promise<Result<Trend[], Error>>
  analyzeSentiment(text: string): Promise<Result<Sentiment, Error>>
  detectPatterns(data: any, patternTypes?: string[]): Promise<Result<Pattern[], Error>>
  extractInsights(data: any, context?: string): Promise<Result<Insight[], Error>>

  // Content metrics
  calculateMetrics(content: string): Promise<Result<ContentMetrics, Error>>
  assessReadability(content: string): Promise<Result<number, Error>>
  evaluateQuality(content: string): Promise<Result<number, Error>>
  analyzeRelevance(content: string, topic: string): Promise<Result<number, Error>>

  // Content comparison
  compareContent(content1: string, content2: string): Promise<Result<ComparisonResult, Error>>
  findSimilarContent(content: string, corpus: string[]): Promise<Result<Array<{ content: string; similarity: number }>, Error>>

  // Data source integration
  analyzeCRMData(data: any): Promise<Result<AnalysisResult, Error>>
  analyzeChatHistory(messages: any[]): Promise<Result<AnalysisResult, Error>>
  analyzeUploadedFile(fileData: any, fileType: string): Promise<Result<AnalysisResult, Error>>

  // Visualization suggestions
  suggestVisualizations(data: any, analysisType: string): Promise<Result<string[], Error>>
  generateChartData(data: any, chartType: string): Promise<Result<any, Error>>

  // Report generation
  generateAnalysisReport(analysis: AnalysisResult, format?: 'markdown' | 'html' | 'json'): Promise<Result<string, Error>>
  summarizeFindings(analysis: AnalysisResult): Promise<Result<string, Error>>

  // Quality assurance
  validateAnalysis(analysis: AnalysisResult): Promise<Result<boolean, Error>>
  improveAnalysis(analysis: AnalysisResult): Promise<Result<AnalysisResult, Error>>
}