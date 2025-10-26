import { Exclude } from "class-transformer"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("users")
@Index(["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  @Index()
  email: string

  @Column({ length: 255 })
  @Exclude()
  passwordHash: string

  @Column({ length: 255 })
  name: string

  @Column({ length: 500, nullable: true })
  avatar?: string

  @Column({ length: 20, nullable: true })
  phone?: string

  @Column({ length: 50, default: "UTC" })
  timezone: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: false })
  isEmailVerified: boolean

  @Column({ length: 255, nullable: true })
  @Exclude()
  emailVerificationToken?: string

  @Column({ length: 255, nullable: true })
  @Exclude()
  passwordResetToken?: string

  @Column({ type: "timestamp", nullable: true })
  @Exclude()
  passwordResetExpires?: Date

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Domain behaviors
  verifyEmail(): void {
    if (this.isEmailVerified) {
      throw new Error("Email already verified")
    }
    this.isEmailVerified = true
    this.emailVerificationToken = undefined
  }

  generateEmailVerificationToken(): string {
    if (this.isEmailVerified) {
      throw new Error("Email already verified")
    }
    this.emailVerificationToken = crypto.randomUUID()
    return this.emailVerificationToken
  }

  generatePasswordResetToken(): string {
    this.passwordResetToken = crypto.randomUUID()
    this.passwordResetExpires = new Date(Date.now() + 3600 * 1000) // 1 hour
    return this.passwordResetToken
  }

  resetPassword(newPasswordHash: string, token: string): void {
    if (!this.passwordResetToken || this.passwordResetToken !== token) {
      throw new Error("Invalid or expired reset token")
    }

    if (!this.passwordResetExpires || this.passwordResetExpires < new Date()) {
      throw new Error("Reset token expired")
    }

    this.passwordHash = newPasswordHash
    this.passwordResetToken = undefined
    this.passwordResetExpires = undefined
  }

  updateProfile(data: Partial<Pick<User, "name" | "avatar" | "phone" | "timezone">>): void {
    Object.assign(this, data)
  }

  recordLogin(): void {
    this.lastLoginAt = new Date()
  }

  deactivate(): void {
    this.isActive = false
  }

  activate(): void {
    this.isActive = true
  }

  // TypeORM lifecycle hooks
  @BeforeInsert()
  @BeforeUpdate()
  validateEmail() {
    if (!this.email?.includes("@")) {
      throw new Error("Invalid email format")
    }
  }
}
