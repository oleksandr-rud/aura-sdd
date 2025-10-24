/**
 * Content Application Use Cases
 * KISS principle: clean exports for all use cases
 */

export { GeneratePresentationUseCase } from './generate-presentation.use-case'
export type { GeneratePresentationRequest, GeneratePresentationResponse } from './generate-presentation.use-case'

export { GenerateReportUseCase } from './generate-report.use-case'
export type { GenerateReportRequest, GenerateReportResponse } from './generate-report.use-case'

export { AnalyzeDataUseCase } from './analyze-data.use-case'
export type { AnalyzeDataRequest, AnalyzeDataResponse } from './analyze-data.use-case'

export { GetContentHistoryUseCase } from './get-content-history.use-case'
export type { GetContentHistoryRequest, GetContentHistoryResponse, ContentHistoryItem } from './get-content-history.use-case'

export { CreateTemplateUseCase } from './create-template.use-case'
export type { CreateTemplateRequest, CreateTemplateResponse } from './create-template.use-case'