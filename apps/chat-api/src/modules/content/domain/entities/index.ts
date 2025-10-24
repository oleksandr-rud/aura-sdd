/**
 * Content Domain Entities
 * KISS principle: clean exports for all domain entities
 */

export { ContentProject } from './content-project'
export type { ContentProjectData, ContentType, ProjectStatus } from './content-project'

export { GeneratedContent } from './generated-content'
export type { GeneratedContentData, ContentFormat, ContentQuality } from './generated-content'

export { ContentTemplate } from './content-template'
export type {
  ContentTemplateData,
  TemplateVariable,
  TemplateCategory,
  TemplateStatus
} from './content-template'