/**
 * Content Module
 * KISS principle: clean exports for the complete content module
 */

// Domain layer exports
export * from './domain'

// Application layer exports
export * from './application'

// Infrastructure layer exports
export * from './infrastructure'

// Presentation layer exports
export * from './presentation'

// Module metadata
export const CONTENT_MODULE_INFO = {
  name: 'content',
  version: '1.0.0',
  description: 'AI-powered content creation and analysis module',
  features: [
    'Presentation generation',
    'Report generation',
    'Data analysis',
    'Content templates',
    'Content history tracking'
  ],
  architecture: 'hexagonal',
  created: '2025-10-19',
  author: 'Claude AI Assistant'
}