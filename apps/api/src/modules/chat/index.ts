/**
 * Chat Module
 * Complete hexagonal architecture implementation for AI chat functionality
 */

export * from './domain'
export * from './application'
export * from './infrastructure'
export * from './presentation'

// Module factory function for dependency injection
import { ChatApplicationService } from './application'
import { ChatSessionRepositoryImpl, MessageRepositoryImpl } from './infrastructure/repositories'
import { ChatServiceImpl, AIServiceRegistry } from './infrastructure/services'

export interface ChatModuleDependencies {
  // Can be extended for additional dependencies
}

export interface ChatModuleExports {
  chatApplicationService: ChatApplicationService
  chatSessionRepository: ChatSessionRepositoryImpl
  messageRepository: MessageRepositoryImpl
  chatService: ChatServiceImpl
  aiServiceRegistry: AIServiceRegistry
}

export function createChatModule(dependencies?: ChatModuleDependencies): ChatModuleExports {
  // Initialize repositories
  const chatSessionRepository = new ChatSessionRepositoryImpl()
  const messageRepository = new MessageRepositoryImpl()

  // Initialize AI service registry
  const aiServiceRegistry = AIServiceRegistry.getInstance()

  // Initialize chat service
  const chatService = new ChatServiceImpl(
    chatSessionRepository,
    messageRepository,
    aiServiceRegistry
  )

  // Initialize application service
  const chatApplicationService = new ChatApplicationService(
    chatSessionRepository,
    messageRepository,
    chatService,
    // Note: AI service will be resolved per request through the registry
  )

  return {
    chatApplicationService,
    chatSessionRepository,
    messageRepository,
    chatService,
    aiServiceRegistry
  }
}

// Default export for easy consumption
export default createChatModule