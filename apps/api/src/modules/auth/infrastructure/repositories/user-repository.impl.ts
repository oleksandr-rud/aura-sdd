/**
 * User Repository Implementation
 * Infrastructure layer - concrete implementation of UserRepository interface
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import { UserRepository } from '../../../domain/repositories/user-repository'
import { User } from '../../../domain/entities/user'
import { Result } from '@/libs/utils'

export class UserRepositoryImpl extends MemoryPaginatedRepository<User> implements UserRepository {

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.findBy({ props: { email } } as any)
    if (result.isErr()) {
      return null
    }

    const users = result.value
    return users.length > 0 ? users[0] : null
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const allUsersResult = await this.findAll()
    if (allUsersResult.isErr()) {
      return null
    }

    const user = allUsersResult.value.find(u =>
      u.props.emailVerificationToken === token
    )

    return user || null
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const allUsersResult = await this.findAll()
    if (allUsersResult.isErr()) {
      return null
    }

    const user = allUsersResult.value.find(u =>
      u.props.passwordResetToken === token &&
      u.props.passwordResetExpires &&
      u.props.passwordResetExpires > new Date()
    )

    return user || null
  }

  async findByActiveSession(sessionId: string): Promise<User | null> {
    // For in-memory implementation, we'll use a simple approach
    // In a real implementation, this would query a sessions table
    const allUsersResult = await this.findAll()
    if (allUsersResult.isErr()) {
      return null
    }

    // This is a simplified implementation - in production, you'd have
    // a separate sessions table or use the cache service
    const user = allUsersResult.value.find(u =>
      u.props.lastLoginAt && // Simple heuristic - could be enhanced
      u.isActive
    )

    return user || null
  }

  // Enhanced save method to handle user-specific validation
  async save(entity: User): Promise<Result<User, Error>> {
    try {
      // Check for email uniqueness on create
      if (entity.createdAt.getTime() === entity.updatedAt.getTime()) {
        const existingUser = await this.findByEmail(entity.email)
        if (existingUser && existingUser.id !== entity.id) {
          return Result.err(new Error('Email already exists'))
        }
      }

      // Use parent save method
      return await super.save(entity)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}