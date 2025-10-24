/**
 * Register Use Case
 * Handles user registration with email verification
 */

import { UseCaseWithValidation } from '@/shared/use-case'
import { Result } from '@/libs/utils'
import { authSchemas, validateAndExtract } from '@/libs/validation'
import { UserRepository } from '../../domain/repositories/user-repository'
import { AuthenticationService } from '../../domain/services/auth-service'
import { EmailService } from '@/libs/email'
import { User } from '../../domain/entities/user'

export interface RegisterRequest {
  email: string
  password: string
  name: string
  companyName?: string
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
    isEmailVerified: boolean
  }
  message: string
}

export class RegisterUseCase extends UseCaseWithValidation<RegisterRequest, RegisterResponse> {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthenticationService,
    private emailService: EmailService
  ) {
    super()
  }

  validate(input: RegisterRequest): Result<RegisterRequest, Error> {
    const validation = validateAndExtract(authSchemas.register, input)

    if (validation.isErr()) {
      const errors = validation.unwrapErr()
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return Result.err(new Error(errorMessage))
    }

    return Result.ok(validation.unwrap())
  }

  protected async executeValidated(input: RegisterRequest): Promise<Result<RegisterResponse, Error>> {
    try {
      const normalizedEmail = input.email.toLowerCase().trim()

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(normalizedEmail)
      if (existingUser) {
        return Result.err(new Error('User with this email already exists'))
      }

      // Hash password
      const passwordHashResult = await this.authService.hashPassword(input.password)
      if (passwordHashResult.isErr()) {
        return Result.err(passwordHashResult.unwrapErr())
      }

      const passwordHash = passwordHashResult.unwrap()

      // Create new user
      const newUser = User.create({
        email: normalizedEmail,
        passwordHash,
        name: input.name.trim(),
        timezone: 'UTC' // Default timezone
      })

      // Generate email verification token
      const tokenResult = newUser.generateEmailVerificationToken()
      if (tokenResult.isErr()) {
        return Result.err(tokenResult.unwrapErr())
      }

      const userWithToken = tokenResult.unwrap()

      // Save user to repository
      await this.userRepository.save(userWithToken)

      // Send verification email
      if (userWithToken.props.emailVerificationToken) {
        const emailResult = await this.emailService.sendVerificationEmail(
          normalizedEmail,
          userWithToken.props.emailVerificationToken
        )

        if (emailResult.isErr()) {
          // Log error but don't fail registration
          console.error('Failed to send verification email:', emailResult.unwrapErr())
        }
      }

      // Return response (without sensitive data)
      return Result.ok({
        user: {
          id: userWithToken.id,
          email: userWithToken.email,
          name: userWithToken.name,
          isEmailVerified: userWithToken.isEmailVerified
        },
        message: 'Registration successful. Please check your email to verify your account.'
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}