/**
 * Workspace Module
 * KISS principle: clean exports for all workspace components
 */

// Domain layer
export * from './domain/entities'
export * from './domain/repositories'
export * from './domain/services'

// Application layer
export * from './application'

// Infrastructure layer
export * from './infrastructure'

// Presentation layer
export * from './presentation'