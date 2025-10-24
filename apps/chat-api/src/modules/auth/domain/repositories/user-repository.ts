/**
 * User Repository Interface
 * Domain layer - defines contract for user persistence
 */

import { Repository } from '@/shared/base-repository'
import { User } from '../entities/user'

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>
  findByEmailVerificationToken(token: string): Promise<User | null>
  findByPasswordResetToken(token: string): Promise<User | null>
  findByActiveSession(sessionId: string): Promise<User | null>
}