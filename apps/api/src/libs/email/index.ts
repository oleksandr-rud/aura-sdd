/**
 * Email Library
 * KISS principle: simple email sending with multiple providers
 */

import { Result } from '@/libs/utils'
import { httpClient } from '@/libs/http-client'

export interface EmailMessage {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<Result<void, Error>>
}

// Simple console email provider for development
export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<Result<void, Error>> {
    console.log('📧 Email sent:', {
      to: message.to,
      subject: message.subject,
      timestamp: new Date().toISOString()
    })
    return Result.ok(undefined)
  }
}

// SMTP provider (simplified interface)
export class SMTPEmailProvider implements EmailProvider {
  constructor(
    private config: {
      host: string
      port: number
      user: string
      password: string
      from: string
    }
  ) {}

  async send(message: EmailMessage): Promise<Result<void, Error>> {
    // In real implementation, use nodemailer or similar
    console.log('📧 SMTP Email:', {
      to: message.to,
      subject: message.subject,
      via: `${this.config.host}:${this.config.port}`
    })
    return Result.ok(undefined)
  }
}

// Resend provider (modern email service)
export class ResendEmailProvider implements EmailProvider {
  constructor(private apiKey: string) {}

  async send(message: EmailMessage): Promise<Result<void, Error>> {
    const response = await httpClient.post('https://api.resend.com/emails', {
      from: message.from ?? 'noreply@yourapp.com',
      to: Array.isArray(message.to) ? message.to : [message.to],
      cc: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : undefined,
      bcc: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : undefined,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo
    }, {
      'Authorization': `Bearer ${this.apiKey}`
    })

    return response.map(() => undefined)
  }
}

export class EmailService {
  private provider: EmailProvider

  constructor(provider?: EmailProvider) {
    // Auto-select provider based on environment
    if (provider) {
      this.provider = provider
    } else if (process.env.RESEND_API_KEY) {
      this.provider = new ResendEmailProvider(process.env.RESEND_API_KEY)
    } else if (process.env.SMTP_HOST) {
      this.provider = new SMTPEmailProvider({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT ?? '587'),
        user: process.env.SMTP_USER ?? '',
        password: process.env.SMTP_PASSWORD ?? '',
        from: process.env.SMTP_FROM ?? 'noreply@yourapp.com'
      })
    } else {
      this.provider = new ConsoleEmailProvider()
    }
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<Result<void, Error>> {
    const message: EmailMessage = {
      to: email,
      subject: 'Welcome to AI Workspace!',
      html: `
        <h1>Welcome${name ? `, ${name}` : ''}! 🎉</h1>
        <p>Your AI workspace is ready to use.</p>
        <p>Start chatting with AI, manage your contacts, and generate amazing content.</p>
        <br>
        <p>Best regards,<br>The AI Workspace Team</p>
      `,
      text: `Welcome${name ? `, ${name}` : ''}! Your AI workspace is ready to use.`
    }

    return this.provider.send(message)
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<Result<void, Error>> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    const message: EmailMessage = {
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      text: `Reset your password: ${resetUrl}\nThis link will expire in 1 hour.`
    }

    return this.provider.send(message)
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<Result<void, Error>> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

    const message: EmailMessage = {
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
      text: `Verify your email: ${verifyUrl}\nThis link will expire in 24 hours.`
    }

    return this.provider.send(message)
  }

  async sendCustomEmail(message: EmailMessage): Promise<Result<void, Error>> {
    return this.provider.send(message)
  }
}

// Default instance
export const emailService = new EmailService()