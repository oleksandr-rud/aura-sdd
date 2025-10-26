/**
 * Chat DTOs
 * Data Transfer Objects for chat operations
 */

import { z } from "zod"

// Error codes
export enum ChatErrorCodes {
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  ACCESS_DENIED = "ACCESS_DENIED",
  INVALID_SESSION_ID = "INVALID_SESSION_ID",
  MESSAGE_TOO_LONG = "MESSAGE_TOO_LONG",
  AI_SERVICE_ERROR = "AI_SERVICE_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

// Base response structure
export interface BaseResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Chat session DTOs
export interface ChatSessionDTO {
  id: string
  userId: string
  title: string
  context?: string
  aiProvider: "openai" | "claude"
  aiModel: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSessionRequestDTO {
  title?: string
  context?: string
  aiProvider?: "openai" | "claude"
  aiModel?: string
}

export interface CreateSessionResponseDTO {
  session: ChatSessionDTO
}

// Message DTOs
export interface MessageDTO {
  id: string
  sessionId: string
  role: "user" | "assistant" | "system"
  content: string
  tokens?: number
  model?: string
  createdAt: string
}

export interface SendMessageRequestDTO {
  content: string
  role?: "user" | "system"
}

export interface SendMessageResponseDTO {
  userMessage: MessageDTO
  aiMessage?: MessageDTO
}

// Get session DTOs
export interface GetSessionResponseDTO {
  session: ChatSessionDTO
  messages?: MessageDTO[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// List sessions DTOs
export interface ListSessionsResponseDTO {
  sessions: ChatSessionDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Delete session DTOs
export interface DeleteSessionResponseDTO {
  success: boolean
  message: string
}

// Update session DTOs
export interface UpdateSessionRequestDTO {
  title?: string
  context?: string
  aiProvider?: "openai" | "claude"
  aiModel?: string
}

export interface UpdateSessionResponseDTO {
  session: ChatSessionDTO
}

// Session stats DTOs
export interface SessionStatsResponseDTO {
  messageCount: number
  totalTokens: number
  firstMessageAt?: string
  lastMessageAt?: string
}

// Response builders
export class ResponseBuilders {
  static success<T>(data: T, message?: string): BaseResponse<T> {
    return {
      success: true,
      data,
      message,
    }
  }

  static error(code: ChatErrorCodes, message: string, details?: any): BaseResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
    }
  }
}

// Validation schemas
export const chatDTOs = {
  createSession: z.object({
    title: z.string().min(1).max(100).optional(),
    context: z.string().max(2000).optional(),
    aiProvider: z.enum(["openai", "claude"]).optional(),
    aiModel: z.string().min(1).max(50).optional(),
  }),

  sendMessage: z.object({
    content: z.string().min(1).max(4000),
    role: z.enum(["user", "system"]).optional(),
  }),

  updateSession: z.object({
    title: z.string().min(1).max(100).optional(),
    context: z.string().max(2000).optional(),
    aiProvider: z.enum(["openai", "claude"]).optional(),
    aiModel: z.string().min(1).max(50).optional(),
  }),

  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
  }),
}
