/**
 * Reset Password Use Case
 * Handles password reset confirmation
 */

import type { CacheService } from "@/libs/cache"
import type { EmailService } from "@/libs/email"
import { Result } from "@/libs/utils"
import { authSchemas, validateAndExtract } from "@/libs/validation"
import { UseCaseWithValidation } from "@/shared/use-case"
import type { UserRepository } from "../../domain/repositories/user-repository"
import type { AuthenticationService } from "../../domain/services/auth-service"

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}

export class ResetPasswordUseCase extends UseCaseWithValidation<
  ResetPasswordRequest,
  ResetPasswordResponse
> {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthenticationService,
    private cacheService: CacheService,
    private emailService: EmailService
  ) {
    super()
  }

  validate(input: ResetPasswordRequest): Result<ResetPasswordRequest, Error> {
    const validation = validateAndExtract(authSchemas.resetPassword, input)

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
    input: ResetPasswordRequest
  ): Promise<Result<ResetPasswordResponse, Error>> {
    try {
      // Find user by password reset token
      const user = await this.userRepository.findByPasswordResetToken(input.token)
      if (!user) {
        return Result.err(new Error("Invalid or expired reset token"))
      }

      // Hash new password
      const passwordHashResult = await this.authService.hashPassword(input.password)
      if (passwordHashResult.isErr()) {
        return Result.err(passwordHashResult.unwrapErr())
      }

      const newPasswordHash = passwordHashResult.unwrap()

      // Reset password using domain behavior
      const resetResult = user.resetPassword(newPasswordHash, input.token)
      if (resetResult.isErr()) {
        return Result.err(resetResult.unwrapErr())
      }

      const updatedUser = resetResult.unwrap()

      // Save updated user
      await this.userRepository.save(updatedUser)

      // Clear all user sessions to force re-login
      const sessionDeleteResult = await this.cacheService.delete(`session:${updatedUser.id}`)
      if (sessionDeleteResult.isErr()) {
        console.error("Failed to clear user sessions:", sessionDeleteResult.unwrapErr())
      }

      // Send password reset confirmation email
      const confirmationResult = await this.emailService.sendCustomEmail({
        to: updatedUser.email,
        subject: "Password Reset Successful",
        html: `
          <h1>Password Reset Successful</h1>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <p>You can now <a href="${process.env.FRONTEND_URL}/login">log in</a> with your new password.</p>
        `,
        text: "Your password has been successfully reset. If you didn't make this change, please contact support immediately.",
      })

      if (confirmationResult.isErr()) {
        console.error(
          "Failed to send password reset confirmation email:",
          confirmationResult.unwrapErr()
        )
      }

      return Result.ok({
        message: "Password reset successful. You can now log in with your new password.",
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}
