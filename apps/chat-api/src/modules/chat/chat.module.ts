import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './domain/entities/chat-room.entity';
import { ChatMessage } from './domain/entities/chat-message.entity';
import { ChatParticipant } from './domain/entities/chat-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage, ChatParticipant])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage, ChatParticipant])],
})
export class ChatModule {}