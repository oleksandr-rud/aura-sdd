import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/domain/entities/user.entity';
import { ChatRoom } from './chat-room.entity';

export enum ParticipantRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  OWNER = 'owner',
}

@Entity('chat_participants')
@Unique(['roomId', 'userId'])
@Index(['roomId'])
@Index(['userId'])
export class ChatParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: ChatRoom;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastReadAt?: Date;

  @Column({ default: 0 })
  unreadCount: number;

  @Column({ type: 'jsonb', nullable: true })
  notifications?: {
    mentions: boolean;
    messages: boolean;
    [key: string]: boolean;
  };

  @Column({ type: 'timestamp', nullable: true })
  leftAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Domain behaviors
  updateRole(newRole: ParticipantRole): void {
    this.role = newRole;
  }

  leaveRoom(): void {
    if (!this.isActive) {
      throw new Error('Participant already left the room');
    }
    this.isActive = false;
    this.leftAt = new Date();
  }

  rejoinRoom(): void {
    if (this.isActive) {
      throw new Error('Participant is already active in the room');
    }
    this.isActive = true;
    this.leftAt = undefined;
  }

  markAsRead(lastReadAt?: Date): void {
    this.lastReadAt = lastReadAt || new Date();
    this.unreadCount = 0;
  }

  incrementUnreadCount(): void {
    this.unreadCount++;
  }

  updateNotificationSettings(settings: Partial<ChatParticipant['notifications']>): void {
    this.notifications = {
      mentions: true,
      messages: true,
      ...this.notifications,
      ...settings,
    };
  }

  // Factory methods
  static addParticipant(
    roomId: string,
    userId: string,
    role: ParticipantRole = ParticipantRole.MEMBER,
  ): ChatParticipant {
    const participant = new ChatParticipant();
    participant.roomId = roomId;
    participant.userId = userId;
    participant.role = role;
    participant.isActive = true;
    participant.joinedAt = new Date();
    participant.unreadCount = 0;
    participant.notifications = {
      mentions: true,
      messages: true,
    };
    return participant;
  }

  static addOwner(roomId: string, userId: string): ChatParticipant {
    const participant = new ChatParticipant();
    participant.roomId = roomId;
    participant.userId = userId;
    participant.role = ParticipantRole.OWNER;
    participant.isActive = true;
    participant.joinedAt = new Date();
    participant.unreadCount = 0;
    participant.notifications = {
      mentions: true,
      messages: true,
    };
    return participant;
  }
}