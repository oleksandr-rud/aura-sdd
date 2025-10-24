import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { User } from '../../users/domain/entities/user.entity';
import { UserRepository } from '../domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      return await this.typeOrmRepository.findOne({
        where: { id },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.typeOrmRepository.findOne({
        where: { email },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    try {
      return await this.typeOrmRepository.findOne({
        where: { emailVerificationToken: token },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Failed to find user by verification token: ${error.message}`);
    }
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    try {
      return await this.typeOrmRepository.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: { $gte: new Date() } as any,
        },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Failed to find user by reset token: ${error.message}`);
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = this.typeOrmRepository.create(userData);
      return await this.typeOrmRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      await this.typeOrmRepository.update(id, userData);
      const updatedUser = await this.findById(id);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async save(user: User): Promise<User> {
    try {
      return await this.typeOrmRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.typeOrmRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async findMany(options: FindManyOptions<User>): Promise<User[]> {
    try {
      return await this.typeOrmRepository.find(options);
    } catch (error) {
      throw new Error(`Failed to find users: ${error.message}`);
    }
  }

  async count(options: FindManyOptions<User>): Promise<number> {
    try {
      return await this.typeOrmRepository.count(options);
    } catch (error) {
      throw new Error(`Failed to count users: ${error.message}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.typeOrmRepository.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check if user exists: ${error.message}`);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const count = await this.typeOrmRepository.count({
        where: { email },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check if email exists: ${error.message}`);
    }
  }

  async findActiveUsers(limit?: number): Promise<User[]> {
    try {
      return await this.typeOrmRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      throw new Error(`Failed to find active users: ${error.message}`);
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.typeOrmRepository.update(id, {
        lastLoginAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  }
}