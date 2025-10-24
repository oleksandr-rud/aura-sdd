/**
 * Verify Email Use Case
 * Handles email verification with token
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { authSchemas, validateAndExtract } from '@/libs/validation'
import { UserRepository } from '../../domain/repositories/user-repository'
import { EmailService } from '@/libs/email'

export interface VerifyEmailRequest {
  token: string
}

export interface VerifyEmailResponse {
  message: string
  isEmailVerified: boolean
}

export class VerifyEmailUseCase extends UseCaseWithValidation<VerifyEmailRequest, VerifyEmailResponse> {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {
    super()
  }

  validate(input: VerifyEmailRequest): Result<VerifyEmailRequest, Error> {
    const validation = validateAndExtract(authSchemas.verifyEmail, input)

    if (validation.isErr()) {
      const errors = validation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return Result.err(new Error(errorMessage))
    }

    return Result.ok(validation.unwrap())
  }

  protected async executeValidated(input: VerifyEmailRequest): Promise<Result<VerifyEmailResponse, Error>> {
    try {
      // Find user by email verification token
      const user = await this.userRepository.findByEmailVerificationToken(input.token)
      if (!user) {
        return Result.err(new Error('Invalid or expired verification token'))
      }

      // Verify email using domain behavior
      const verificationResult = user.verifyEmail()
      if (verificationResult.isErr()) {
        return Result.err(verificationResult.unwrapErr())
      }

      const verifiedUser = verificationResult.unwrap()

      // Save updated user
      await this.userRepository.save(verifiedUser)

      // Send welcome email for newly verified users
      const welcomeEmailResult = await this.emailService.sendWelcomeEmail(
        verifiedUser.email,
        verifiedUser.name
      )

      if (welcomeEmailResult.isErr()) {
        console.error('Failed to send welcome email:', welcomeEmailResult.unwrapErr())
      }

      return Result.ok({
        message: 'Email verified successfully',
        isEmailVerified: verifiedUser.isEmailVerified
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}