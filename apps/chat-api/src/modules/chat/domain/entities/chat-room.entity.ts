import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/domain/entities/user.entity"
import { ChatMessage } from "./chat-message.entity"
import { ChatParticipant } from "./chat-participant.entity"

export enum ChatRoomType {
  DIRECT = "direct",
  GROUP = "group",
  CHANNEL = "channel",
}

@Entity("chat_rooms")
@Index(["createdBy"])
export class ChatRoom {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  name: string

  @Column({
    type: "enum",
    enum: ChatRoomType,
    default: ChatRoomType.DIRECT,
  })
  type: ChatRoomType

  @Column({ type: "text", nullable: true })
  description?: string

  @Column({ length: 255, nullable: true })
  avatar?: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: false })
  isPublic: boolean

  @Column({ nullable: true })
  createdBy: string

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "createdBy" })
  creator?: User

  @OneToMany(
    () => ChatMessage,
    message => message.room
  )
  messages: ChatMessage[]

  @OneToMany(
    () => ChatParticipant,
    participant => participant.room
  )
  participants: ChatParticipant[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Domain behaviors
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Room name cannot be empty")
    }
    this.name = name.trim()
  }

  updateDescription(description?: string): void {
    this.description = description?.trim() || undefined
  }

  deactivate(): void {
    this.isActive = false
  }

  activate(): void {
    this.isActive = true
  }

  setPublic(isPublic: boolean): void {
    this.isPublic = isPublic
  }

  // Factory methods
  static createDirectRoom(name: string, createdBy?: string): ChatRoom {
    const room = new ChatRoom()
    room.name = name
    room.type = ChatRoomType.DIRECT
    room.createdBy = createdBy
    room.isActive = true
    room.isPublic = false
    return room
  }

  static createGroupRoom(name: string, description?: string, createdBy?: string): ChatRoom {
    const room = new ChatRoom()
    room.name = name
    room.description = description
    room.type = ChatRoomType.GROUP
    room.createdBy = createdBy
    room.isActive = true
    room.isPublic = false
    return room
  }

  static createChannel(name: string, description?: string, createdBy?: string): ChatRoom {
    const room = new ChatRoom()
    room.name = name
    room.description = description
    room.type = ChatRoomType.CHANNEL
    room.createdBy = createdBy
    room.isActive = true
    room.isPublic = true
    return room
  }
}
