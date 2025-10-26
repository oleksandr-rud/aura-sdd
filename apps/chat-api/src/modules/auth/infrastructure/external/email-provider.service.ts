/**
 * Email Provider Service
 * Infrastructure layer - adapter for external email service
 */

import { EmailService } from "@/libs/email"
import { Result } from "@/libs/utils"

export interface EmailProviderPort {
  sendWelcomeEmail(email: string, name?: string): Promise<Result<void, Error>>
  sendPasswordResetEmail(email: string, resetToken: string): Promise<Result<void, Error>>
  sendVerificationEmail(email: string, verificationToken: string): Promise<Result<void, Error>>
}

/**
 * Adapter for the external email service
 * Wraps the email library to provide auth-specific email functionality
 */
export class EmailProviderService implements EmailProviderPort {
  private emailService: EmailService

  constructor(emailService?: EmailService) {
    this.emailService = emailService || new EmailService()
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<Result<void, Error>> {
    try {
      return await this.emailService.sendWelcomeEmail(email, name)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<Result<void, Error>> {
    try {
      return await this.emailService.sendPasswordResetEmail(email, resetToken)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string
  ): Promise<Result<void, Error>> {
    try {
      return await this.emailService.sendVerificationEmail(email, verificationToken)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  /**
   * Send custom email for auth-related notifications
   * This can be extended for future auth email needs
   */
  async sendAuthNotification(
    email: string,
    subject: string,
    content: string
  ): Promise<Result<void, Error>> {
    try {
      return await this.emailService.sendCustomEmail({
        to: email,
        subject: `[Auth] ${subject}`,
        html: content,
        text: content.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}
