/**
 * Auth DTOs (Data Transfer Objects)
 * API contracts for authentication operations
 */

import { z } from "zod"

// Base response schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// Success response with data
export const SuccessResponseSchema = <T extends z.ZodType<any>>(dataSchema: T) =>
  BaseResponseSchema.extend({
    success: z.literal(true),
    data: dataSchema,
  })

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
})

// Auth DTOs
export const AuthDTOs = {
  // Login DTOs
  LoginRequest: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),

  LoginResponse: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      isVerified: z.boolean(),
      createdAt: z.string(),
    }),
    tokens: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      expiresIn: z.number(),
    }),
  }),

  // Register DTOs
  RegisterRequest: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2).max(50),
    companyName: z.string().optional(),
  }),

  RegisterResponse: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      companyName: z.string().nullable(),
      isVerified: z.boolean(),
      createdAt: z.string(),
    }),
    message: z.string(),
  }),

  // Logout DTOs
  LogoutRequest: z.object({
    refreshToken: z.string(),
  }),

  LogoutResponse: z.object({
    message: z.string(),
  }),

  // Verify Email DTOs
  VerifyEmailRequest: z.object({
    token: z.string().min(1, "Token is required"),
  }),

  VerifyEmailResponse: z.object({
    message: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      isVerified: z.boolean(),
    }),
  }),

  // Forgot Password DTOs
  ForgotPasswordRequest: z.object({
    email: z.string().email("Invalid email address"),
  }),

  ForgotPasswordResponse: z.object({
    message: z.string(),
  }),

  // Reset Password DTOs
  ResetPasswordRequest: z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),

  ResetPasswordResponse: z.object({
    message: z.string(),
  }),

  // Get Current User DTOs
  GetUserResponse: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      companyName: z.string().nullable(),
      avatar: z.string().nullable(),
      phone: z.string().nullable(),
      timezone: z.string().nullable(),
      isVerified: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  }),

  // Update Profile DTOs
  UpdateProfileRequest: z.object({
    name: z.string().min(2).max(50).optional(),
    avatar: z.string().url().nullable().optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-()]+$/, "Invalid phone number")
      .nullable()
      .optional(),
    timezone: z.string().nullable().optional(),
  }),

  UpdateProfileResponse: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      companyName: z.string().nullable(),
      avatar: z.string().nullable(),
      phone: z.string().nullable(),
      timezone: z.string().nullable(),
      isVerified: z.boolean(),
      updatedAt: z.string(),
    }),
  }),

  // Refresh Token DTOs
  RefreshTokenRequest: z.object({
    refreshToken: z.string(),
  }),

  RefreshTokenResponse: z.object({
    accessToken: z.string(),
    expiresIn: z.number(),
  }),
}

// Type exports
export type LoginRequestDTO = z.infer<typeof AuthDTOs.LoginRequest>
export type LoginResponseDTO = z.infer<typeof AuthDTOs.LoginResponse>
export type RegisterRequestDTO = z.infer<typeof AuthDTOs.RegisterRequest>
export type RegisterResponseDTO = z.infer<typeof AuthDTOs.RegisterResponse>
export type LogoutRequestDTO = z.infer<typeof AuthDTOs.LogoutRequest>
export type LogoutResponseDTO = z.infer<typeof AuthDTOs.LogoutResponse>
export type VerifyEmailRequestDTO = z.infer<typeof AuthDTOs.VerifyEmailRequest>
export type VerifyEmailResponseDTO = z.infer<typeof AuthDTOs.VerifyEmailResponse>
export type ForgotPasswordRequestDTO = z.infer<typeof AuthDTOs.ForgotPasswordRequest>
export type ForgotPasswordResponseDTO = z.infer<typeof AuthDTOs.ForgotPasswordResponse>
export type ResetPasswordRequestDTO = z.infer<typeof AuthDTOs.ResetPasswordRequest>
export type ResetPasswordResponseDTO = z.infer<typeof AuthDTOs.ResetPasswordResponse>
export type GetUserResponseDTO = z.infer<typeof AuthDTOs.GetUserResponse>
export type UpdateProfileRequestDTO = z.infer<typeof AuthDTOs.UpdateProfileRequest>
export type UpdateProfileResponseDTO = z.infer<typeof AuthDTOs.UpdateProfileResponse>
export type RefreshTokenRequestDTO = z.infer<typeof AuthDTOs.RefreshTokenRequest>
export type RefreshTokenResponseDTO = z.infer<typeof AuthDTOs.RefreshTokenResponse>

// Common response types
export type SuccessResponse<T> = z.infer<ReturnType<typeof SuccessResponseSchema<T>>>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

// Response builders
export const ResponseBuilders = {
  success: <T>(data: T, message?: string) => ({
    success: true as const,
    data,
    message,
  }),

  error: (code: string, message: string, details?: any) => ({
    success: false as const,
    error: {
      code,
      message,
      details,
    },
  }),
}

// Error codes
export const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",

  // User errors
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_NOT_VERIFIED: "USER_NOT_VERIFIED",

  // Token errors
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  TOKEN_EXPIRED_OR_INVALID: "TOKEN_EXPIRED_OR_INVALID",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // Server errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const
