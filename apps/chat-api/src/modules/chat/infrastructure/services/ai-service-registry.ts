/**
 * AI Service Registry
 * Infrastructure layer - manages and provides access to AI services
 */

import { Result } from "@/libs/utils"
import type { AIService } from "../../domain/services"
import { ClaudeService } from "./claude-service"
import { OpenAIService } from "./openai-service"

export class AIServiceRegistry {
  private static instance: AIServiceRegistry
  private services: Map<string, AIService> = new Map()

  private constructor() {
    this.initializeServices()
  }

  static getInstance(): AIServiceRegistry {
    if (!AIServiceRegistry.instance) {
      AIServiceRegistry.instance = new AIServiceRegistry()
    }
    return AIServiceRegistry.instance
  }

  private initializeServices(): void {
    // Initialize OpenAI service if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.services.set("openai", new OpenAIService())
    }

    // Initialize Claude service if API key is available
    if (process.env.CLAUDE_API_KEY) {
      this.services.set("claude", new ClaudeService())
    }
  }

  getService(provider: "openai" | "claude"): Result<AIService, Error> {
    const service = this.services.get(provider)
    if (!service) {
      return Result.err(new Error(`AI service '${provider}' is not available or not configured`))
    }
    return Result.ok(service)
  }

  getAvailableProviders(): Array<"openai" | "claude"> {
    const providers: Array<"openai" | "claude"> = []

    if (this.services.has("openai")) {
      providers.push("openai")
    }

    if (this.services.has("claude")) {
      providers.push("claude")
    }

    return providers
  }

  async getAvailableModels(provider?: "openai" | "claude"): Promise<Result<string[], Error>> {
    if (provider) {
      const serviceResult = this.getService(provider)
      if (serviceResult.isErr()) {
        return Result.err(serviceResult.unwrapErr())
      }
      return Result.ok(await serviceResult.unwrap().getAvailableModels())
    }

    // Get all available models from all providers
    const allModels: string[] = []
    const providers = this.getAvailableProviders()

    for (const p of providers) {
      const serviceResult = this.getService(p)
      if (serviceResult.isOk()) {
        const models = await serviceResult.unwrap().getAvailableModels()
        allModels.push(...models)
      }
    }

    return Result.ok(allModels)
  }

  isProviderAvailable(provider: "openai" | "claude"): boolean {
    return this.services.has(provider)
  }

  isModelSupported(model: string): boolean {
    for (const service of this.services.values()) {
      if (service.isModelSupported(model)) {
        return true
      }
    }
    return false
  }

  getProviderForModel(model: string): Result<"openai" | "claude", Error> {
    if (model.startsWith("gpt")) {
      const openaiService = this.services.get("openai")
      if (openaiService?.isModelSupported(model)) {
        return Result.ok("openai")
      }
    }

    if (model.startsWith("claude")) {
      const claudeService = this.services.get("claude")
      if (claudeService?.isModelSupported(model)) {
        return Result.ok("claude")
      }
    }

    // Check all services
    for (const [provider, service] of this.services.entries()) {
      if (service.isModelSupported(model)) {
        return Result.ok(provider as "openai" | "claude")
      }
    }

    return Result.err(new Error(`Model '${model}' is not supported by any available AI service`))
  }
}
