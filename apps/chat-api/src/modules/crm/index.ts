/**
 * CRM Module Index
 * Complete CRM module with hexagonal architecture
 */

export * from './domain'
export * from './application'
export * from './infrastructure'
export * from './presentation'

// Re-export main services for external use
export { CRMApplicationService } from './application/services/crm-application-service'
export { CRMService } from './domain/services/crm-service'

// Re-export repository implementations
export { ContactRepositoryImpl } from './infrastructure/repositories/contact-repository.impl'
export { CompanyRepositoryImpl } from './infrastructure/repositories/company-repository.impl'
export { InteractionRepositoryImpl } from './infrastructure/repositories/interaction-repository.impl'

// Re-export entities
export { Contact, Company, Interaction } from './domain/entities'

// Re-export controller and routes
export { CRMController } from './presentation/controllers/crm.controller'
export { registerCRMRoutes } from './presentation/routes/crm.routes'

// Re-export DTOs
export * from './presentation/dto/crm.dto'