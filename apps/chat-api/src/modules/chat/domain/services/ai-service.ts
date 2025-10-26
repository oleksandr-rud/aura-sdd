/**
 * AI Service Interface
 * Domain layer - defines contract for AI interactions
 */

import type { Result } from "@/libs/utils"
import type { Message } from "../entities/message"

export interface AIResponse {
  content: string
  model: string
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
  metadata?: Record<string, any>
}

export interface AIStreamResponse {
  content: string
  model: string
  done: boolean
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
}

export interface AIService {
  /**
   * Generate a response from the AI
   */
  generateResponse(
    messages: Message[],
    context?: string,
    options?: AIRequestOptions
  ): Promise<Result<AIResponse, Error>>

  /**
   * Generate a streaming response from the AI
   */
  generateStreamingResponse(
    messages: Message[],
    context?: string,
    options?: AIRequestOptions
  ): AsyncGenerator<Result<AIStreamResponse, Error>>

  /**
   * Get available models for this service
   */
  getAvailableModels(): Promise<string[]>

  /**
   * Validate if a model is supported
   */
  isModelSupported(model: string): boolean

  /**
   * Estimate token count for a message
   */
  estimateTokens(text: string): number
}

export interface AIRequestOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequences?: string[]
}
