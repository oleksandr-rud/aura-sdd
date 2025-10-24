/**
 * Password Hasher Service Implementation
 * Infrastructure layer - bcrypt implementation of PasswordHasher interface
 */

import bcrypt from 'bcrypt'
import { PasswordHasher } from '../../../domain/services/auth-service'

export class PasswordHasherService implements PasswordHasher {
  private readonly saltRounds: number

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds
  }

  async hash(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds)
      return await bcrypt.hash(password, salt)
    } catch (error) {
      throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async verify(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      throw new Error(`Failed to verify password: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}