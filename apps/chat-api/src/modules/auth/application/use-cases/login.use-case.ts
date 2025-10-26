import { Injectable } from "@nestjs/common"
import type { UserRepository } from "../../domain/repositories/user.repository"
import type { JwtService } from "../../infrastructure/providers/jwt.service"
import type { PasswordService } from "../../infrastructure/providers/password.service"
import type { LoginDto } from "../dto/auth.dto"
import type { AuthResponseDto } from "../dto/auth.dto"

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(loginDto.email.toLowerCase().trim())
    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is deactivated")
    }

    // Verify password
    const isPasswordValid = await this.passwordService.verifyPassword(
      loginDto.password,
      user.passwordHash
    )
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    // Record login
    user.recordLogin()
    await this.userRepository.save(user)

    // Generate JWT tokens
    const tokens = await this.jwtService.generateTokenPair(user.id, user.email)

    // Return auth response
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        timezone: user.timezone,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    }
  }
}
