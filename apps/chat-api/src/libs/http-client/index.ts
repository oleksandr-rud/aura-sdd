/**
 * HTTP Client Library
 * KISS principle: simple, reliable HTTP client with proper error handling
 */

import { Result } from '@/libs/utils'

export interface HttpClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  retries?: number
}

export interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export class HttpClient {
  private config: Required<HttpClientConfig>

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL ?? '',
      timeout: config.timeout ?? 10000,
      headers: config.headers ?? {},
      retries: config.retries ?? 3
    }
  }

  private async request<T>(
    url: string,
    options: RequestInit
  ): Promise<Result<HttpResponse<T>, Error>> {
    const fullUrl = this.config.baseURL + url

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.config.headers,
          ...options.headers
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
        return Result.err(error)
      }

      const data = await response.json().catch(() => ({}))

      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      return Result.ok({
        data,
        status: response.status,
        statusText: response.statusText,
        headers
      })
    } catch (error) {
      clearTimeout(timeoutId)
      return Result.err(error as Error)
    }
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<Result<HttpResponse<T>, Error>> {
    return this.request<T>(url, {
      method: 'GET',
      headers
    })
  }

  async post<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<Result<HttpResponse<T>, Error>> {
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<Result<HttpResponse<T>, Error>> {
    return this.request<T>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<Result<HttpResponse<T>, Error>> {
    return this.request<T>(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<Result<HttpResponse<T>, Error>> {
    return this.request<T>(url, {
      method: 'DELETE',
      headers
    })
  }
}

// Default client instance
export const httpClient = new HttpClient()

// AI service clients
export const openaiClient = new HttpClient({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
})

export const claudeClient = new HttpClient({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY ?? '',
    'anthropic-version': '2023-06-01'
  }
})