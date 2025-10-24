/**
 * OpenAI Service Implementation
 * Infrastructure layer - concrete implementation of OpenAI AI service
 */

import { Result } from '@/libs/utils'
import { openaiClient } from '@/libs/http-client'
import { AIService, AIResponse, AIStreamResponse, AIRequestOptions } from '../../domain/services'
import { Message } from '../../domain/entities'

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string[]
  stream?: boolean
}

interface OpenAIResponse {
  choices: Array<{
    message?: {
      content: string
      role: string
    }
    delta?: {
      content?: string
    }
    finish_reason?: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export class OpenAIService implements AIService {
  private readonly availableModels = [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4-turbo-preview',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k'
  ]

  async generateResponse(
    messages: Message[],
    context?: string,
    options?: AIRequestOptions
  ): Promise<Result<AIResponse, Error>> {
    try {
      const openAIMessages = this.convertToOpenAIMessages(messages, context)
      const model = options?.model ?? 'gpt-3.5-turbo'

      const requestBody: OpenAIRequest = {
        model,
        messages: openAIMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stop: options?.stopSequences
      }

      const response = await openaiClient.post<OpenAIResponse>('/chat/completions', requestBody)

      if (response.isErr()) {
        return Result.err(response.unwrapErr())
      }

      const data = response.unwrap().data

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        return Result.err(new Error('Invalid response from OpenAI'))
      }

      const choice = data.choices[0]
      const content = choice.message.content

      return Result.ok({
        content,
        model: data.model,
        tokens: data.usage ? {
          prompt: data.usage.prompt_tokens,
          completion: data.usage.completion_tokens,
          total: data.usage.total_tokens
        } : undefined
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
      const openAIMessages = this.convertToOpenAIMessages(messages, context)
      const model = options?.model ?? 'gpt-3.5-turbo'

      const requestBody: OpenAIRequest = {
        model,
        messages: openAIMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stop: options?.stopSequences,
        stream: true
      }

      // Note: This is a simplified implementation
      // In a real implementation, you'd need to handle Server-Sent Events properly
      const response = await fetch(`${openaiClient.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...openaiClient.config.headers
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        yield Result.err(new Error(`HTTP ${response.status}: ${response.statusText}`))
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        yield Result.err(new Error('No response body'))
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.trim() === '') continue
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              yield Result.ok({
                content: '',
                model,
                done: true
              })
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.choices && parsed.choices[0]?.delta?.content) {
                yield Result.ok({
                  content: parsed.choices[0].delta.content,
                  model: parsed.model || model,
                  done: false
                })
              }
            } catch (e) {
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
    // Simple estimation: ~4 characters per token for English
    return Math.ceil(text.length / 4)
  }

  private convertToOpenAIMessages(messages: Message[], context?: string): OpenAIMessage[] {
    const openAIMessages: OpenAIMessage[] = []

    // Add system context if provided
    if (context) {
      openAIMessages.push({
        role: 'system',
        content: context
      })
    }

    // Convert messages
    for (const message of messages) {
      openAIMessages.push({
        role: message.role,
        content: message.content
      })
    }

    return openAIMessages
  }
}