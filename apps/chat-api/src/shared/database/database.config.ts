import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../modules/users/domain/entities/user.entity';
import { ChatRoom } from '../../modules/chat/domain/entities/chat-room.entity';
import { ChatMessage } from '../../modules/chat/domain/entities/chat-message.entity';
import { ChatParticipant } from '../../modules/chat/domain/entities/chat-participant.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [User, ChatRoom, ChatMessage, ChatParticipant],
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
});