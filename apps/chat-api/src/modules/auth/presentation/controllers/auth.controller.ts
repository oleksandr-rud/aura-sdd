import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto, type LoginDto, type RegisterDto } from '../../application/dto/auth.dto';
import type { LoginUseCase } from '../../application/use-cases/login.use-case';
import type { RegisterUseCase } from '../../application/use-cases/register.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or user already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for auth service' })
  @ApiResponse({
    status: 200,
    description: 'Auth service is healthy',
  })
  async health() {
    return { status: 'ok', service: 'auth', timestamp: new Date().toISOString() };
  }
}