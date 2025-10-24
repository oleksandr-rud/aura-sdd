import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/entities/user.entity';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { JwtService } from './infrastructure/providers/jwt.service';
import { PasswordService } from './infrastructure/providers/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    // Infrastructure
    UserRepositoryImpl,
    JwtService,
    PasswordService,

    // Application Use Cases
    RegisterUseCase,
    LoginUseCase,
  ],
  exports: [
    UserRepositoryImpl,
    JwtService,
    PasswordService,
    RegisterUseCase,
    LoginUseCase,
  ],
})
export class AuthModule {}