/**
 * Forgot Password Use Case
 * Handles password reset request
 */

import type { CacheService } from "@/libs/cache"
import type { EmailService } from "@/libs/email"
import { Result } from "@/libs/utils"
import { commonSchemas, validateAndExtract } from "@/libs/validation"
import { UseCaseWithValidation } from "@/shared/use-case"
import type { UserRepository } from "../../domain/repositories/user-repository"

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export class ForgotPasswordUseCase extends UseCaseWithValidation<
  ForgotPasswordRequest,
  ForgotPasswordResponse
> {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private cacheService: CacheService
  ) {
    super()
  }

  validate(input: ForgotPasswordRequest): Result<ForgotPasswordRequest, Error> {
    const schema = commonSchemas.email.transform(email => ({ email }))

    const validation = validateAndExtract(schema, { email: input.email })

    if (validation.isErr()) {
      const errors = validation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ")
      return Result.err(new Error(errorMessage))
    }

    return Result.ok(validation.unwrap())
  }

  protected async executeValidated(
    input: ForgotPasswordRequest
  ): Promise<Result<ForgotPasswordResponse, Error>> {
    try {
      const normalizedEmail = input.email.toLowerCase().trim()

      // Find user by email
      const user = await this.userRepository.findByEmail(normalizedEmail)
      if (!user) {
        // Always return success message to prevent email enumeration attacks
        return Result.ok({
          message: "If an account with this email exists, a password reset link has been sent.",
        })
      }

      // Check rate limiting
      const rateLimitKey = `password-reset:${normalizedEmail}`
      const isAllowed = await this.cacheService.checkRateLimit(rateLimitKey, 3, 3600) // 3 requests per hour

      if (!isAllowed) {
        return Result.err(new Error("Too many password reset requests. Please try again later."))
      }

      // Generate password reset token
      const tokenResult = user.generatePasswordResetToken()
      if (tokenResult.isErr()) {
        return Result.err(tokenResult.unwrapErr())
      }

      const userWithToken = tokenResult.unwrap()

      // Save user with reset token
      await this.userRepository.save(userWithToken)

      // Send password reset email
      if (userWithToken.props.passwordResetToken) {
        const emailResult = await this.emailService.sendPasswordResetEmail(
          normalizedEmail,
          userWithToken.props.passwordResetToken
        )

        if (emailResult.isErr()) {
          console.error("Failed to send password reset email:", emailResult.unwrapErr())
          // Don't fail the operation if email fails, user can try again
        }
      }

      return Result.ok({
        message: "If an account with this email exists, a password reset link has been sent.",
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}
