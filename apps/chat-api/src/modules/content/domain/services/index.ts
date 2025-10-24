/**
 * Content Domain Services
 * KISS principle: clean exports for all domain services
 */

export type {
  ContentGenerationService,
  GenerationRequest,
  GenerationOptions,
  GenerationResult,
  Slide,
  PresentationStructure,
  ReportSection,
  ReportStructure,
  DataInsight,
  AnalysisResult
} from './content-generation-service'

export type {
  ContentAnalysisService,
  DataSource,
  AnalysisRequest,
  AnalysisOptions,
  Trend,
  Sentiment,
  Pattern,
  Insight,
  AnalysisResult as ContentAnalysisResult,
  ContentMetrics,
  ComparisonResult
} from './content-analysis-service'