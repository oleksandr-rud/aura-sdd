/**
 * User Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { Result } from "@/libs/utils"
import { BaseEntity } from "@/shared/base-entity"

export interface UserProps {
  email: string
  passwordHash: string
  name: string
  avatar?: string
  phone?: string
  timezone: string
  isActive: boolean
  isEmailVerified: boolean
  emailVerificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  lastLoginAt?: Date
}

export class User extends BaseEntity {
  constructor(
    public readonly props: UserProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id ?? BaseEntity.generateId(), createdAt ?? new Date(), updatedAt ?? new Date())
  }

  get email(): string {
    return this.props.email
  }

  get name(): string {
    return this.props.name
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified
  }

  // Domain behaviors
  verifyEmail(): Result<User, Error> {
    if (this.props.isEmailVerified) {
      return Result.err(new Error("Email already verified"))
    }

    const updatedUser = new User(
      {
        ...this.props,
        isEmailVerified: true,
        emailVerificationToken: undefined,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedUser)
  }

  generateEmailVerificationToken(): Result<User, Error> {
    if (this.props.isEmailVerified) {
      return Result.err(new Error("Email already verified"))
    }

    const token = crypto.randomUUID()

    const updatedUser = new User(
      {
        ...this.props,
        emailVerificationToken: token,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedUser)
  }

  generatePasswordResetToken(): Result<User, Error> {
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

    const updatedUser = new User(
      {
        ...this.props,
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedUser)
  }

  resetPassword(newPasswordHash: string, token: string): Result<User, Error> {
    if (!this.props.passwordResetToken || this.props.passwordResetToken !== token) {
      return Result.err(new Error("Invalid or expired reset token"))
    }

    if (!this.props.passwordResetExpires || this.props.passwordResetExpires < new Date()) {
      return Result.err(new Error("Reset token expired"))
    }

    const updatedUser = new User(
      {
        ...this.props,
        passwordHash: newPasswordHash,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedUser)
  }

  updateProfile(
    data: Partial<Pick<UserProps, "name" | "avatar" | "phone" | "timezone">>
  ): Result<User, Error> {
    const updatedUser = new User(
      {
        ...this.props,
        ...data,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedUser)
  }

  recordLogin(): User {
    return new User(
      {
        ...this.props,
        lastLoginAt: new Date(),
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  deactivate(): User {
    return new User(
      {
        ...this.props,
        isActive: false,
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  activate(): User {
    return new User(
      {
        ...this.props,
        isActive: true,
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  // Factory method
  static create(props: Omit<UserProps, "isActive" | "isEmailVerified">): User {
    return new User({
      ...props,
      isActive: true,
      isEmailVerified: false,
    })
  }
}
