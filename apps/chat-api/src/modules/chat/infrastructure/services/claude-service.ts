/**
 * Claude Service Implementation
 * Infrastructure layer - concrete implementation of Claude AI service
 */

import { claudeClient } from "@/libs/http-client"
import { Result } from "@/libs/utils"
import type { Message } from "../../domain/entities"
import type {
  AIRequestOptions,
  AIResponse,
  AIService,
  AIStreamResponse,
} from "../../domain/services"

interface ClaudeMessage {
  role: "user" | "assistant"
  content: string
}

interface ClaudeRequest {
  model: string
  messages: ClaudeMessage[]
  system?: string
  temperature?: number
  max_tokens?: number
  top_p?: number
  top_k?: number
  stop_sequences?: string[]
  stream?: boolean
}

interface ClaudeResponse {
  content: Array<{
    type: "text"
    text: string
  }>
  role: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
  model: string
  stop_reason?: string
}

export class ClaudeService implements AIService {
  private readonly availableModels = [
    "claude-3-sonnet-20241022",
    "claude-3-haiku-20240307",
    "claude-3-opus-20240229",
    "claude-2.1",
    "claude-2.0",
  ]

  async generateResponse(
    messages: Message[],
    context?: string,
    options?: AIRequestOptions
  ): Promise<Result<AIResponse, Error>> {
    try {
      const claudeMessages = this.convertToClaudeMessages(messages)
      const model = options?.model ?? "claude-3-sonnet-20241022"

      const requestBody: ClaudeRequest = {
        model,
        messages: claudeMessages,
        system: context,
        temperature: options?.temperature,
        max_tokens: options?.maxTokens ?? 1000,
        top_p: options?.topP,
        top_k: options?.presencePenalty
          ? Math.floor((1 - options.presencePenalty) * 100)
          : undefined,
        stop_sequences: options?.stopSequences,
      }

      const response = await claudeClient.post<ClaudeResponse>("/messages", requestBody)

      if (response.isErr()) {
        return Result.err(response.unwrapErr())
      }

      const data = response.unwrap().data

      if (!data.content || data.content.length === 0) {
        return Result.err(new Error("Invalid response from Claude"))
      }

      const content = data.content[0].text

      return Result.ok({
        content,
        model: data.model,
        tokens: data.usage
          ? {
              prompt: data.usage.input_tokens,
              completion: data.usage.output_tokens,
              total: data.usage.input_tokens + data.usage.output_tokens,
            }
          : undefined,
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async *generateStreamingResponse(
    messages: Message[],
    context?: string,
    options?: AIRequestOptions
  ): AsyncGenerator<Result<AIStreamResponse, Error>> {
    try {
      const claudeMessages = this.convertToClaudeMessages(messages)
      const model = options?.model ?? "claude-3-sonnet-20241022"

      const requestBody: ClaudeRequest = {
        model,
        messages: claudeMessages,
        system: context,
        temperature: options?.temperature,
        max_tokens: options?.maxTokens ?? 1000,
        top_p: options?.topP,
        top_k: options?.presencePenalty
          ? Math.floor((1 - options.presencePenalty) * 100)
          : undefined,
        stop_sequences: options?.stopSequences,
        stream: true,
      }

      // Note: This is a simplified implementation
      // In a real implementation, you'd need to handle Server-Sent Events properly
      const response = await fetch(`${claudeClient.config.baseURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLAUDE_API_KEY ?? "",
          "anthropic-version": "2023-06-01",
          ...claudeClient.config.headers,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        yield Result.err(new Error(`HTTP ${response.status}: ${response.statusText}`))
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        yield Result.err(new Error("No response body"))
        return
      }

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (line.trim() === "") {
            continue
          }
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              yield Result.ok({
                content: "",
                model,
                done: true,
              })
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                yield Result.ok({
                  content: parsed.delta.text,
                  model: parsed.model || model,
                  done: false,
                })
              }
            } catch (_e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      yield Result.err(error as Error)
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return this.availableModels
  }

  isModelSupported(model: string): boolean {
    return this.availableModels.includes(model)
  }

  estimateTokens(text: string): number {
    // Claude's tokenization is similar to GPT
    // Simple estimation: ~4 characters per token for English
    return Math.ceil(text.length / 4)
  }

  private convertToClaudeMessages(messages: Message[]): ClaudeMessage[] {
    // Filter out system messages and convert the rest
    return messages
      .filter(msg => msg.role !== "system")
      .map(message => ({
        role: message.role as "user" | "assistant",
        content: message.content,
      }))
  }
}
