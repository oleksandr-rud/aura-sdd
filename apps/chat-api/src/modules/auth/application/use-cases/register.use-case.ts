import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordService } from '../../infrastructure/providers/password.service';
import { JwtService } from '../../infrastructure/providers/jwt.service';
import { RegisterDto } from '../dto/auth.dto';
import { User } from '../../../users/domain/entities/user.entity';
import { AuthResponseDto } from '../dto/auth.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    const passwordValidation = this.passwordService.validatePasswordStrength(registerDto.password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash the password
    const passwordHash = await this.passwordService.hashPassword(registerDto.password);

    // Create new user
    const user = new User();
    user.email = registerDto.email.toLowerCase().trim();
    user.passwordHash = passwordHash;
    user.name = registerDto.name.trim();
    user.phone = registerDto.phone?.trim();
    user.timezone = registerDto.timezone || 'UTC';
    user.isActive = true;
    user.isEmailVerified = false;

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await this.userRepository.save(user);

    // Generate JWT tokens
    const tokens = await this.jwtService.generateTokenPair(user.id, user.email);

    // TODO: Send verification email with verificationToken
    console.log(`Verification token for ${user.email}: ${verificationToken}`);

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
    };
  }
}