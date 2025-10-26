import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/domain/entities/user.entity"
import { ChatRoom } from "./chat-room.entity"

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  SYSTEM = "system",
}

@Entity("chat_messages")
@Index(["roomId", "createdAt"])
@Index(["userId", "createdAt"])
export class ChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  roomId: string

  @ManyToOne(() => ChatRoom, { onDelete: "CASCADE" })
  @JoinColumn({ name: "roomId" })
  room: ChatRoom

  @Column()
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ type: "text" })
  content: string

  @Column({
    type: "enum",
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType

  @Column({ type: "jsonb", nullable: true })
  metadata?: {
    fileName?: string
    fileSize?: number
    mimeType?: string
    imageUrl?: string
    thumbnailUrl?: string
    [key: string]: any
  }

  @Column({ default: false })
  isEdited: boolean

  @Column({ type: "timestamp", nullable: true })
  editedAt?: Date

  @Column({ default: false })
  isDeleted: boolean

  @Column({ type: "timestamp", nullable: true })
  deletedAt?: Date

  @Column({ nullable: true })
  replyToId?: string

  @ManyToOne(() => ChatMessage, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "replyToId" })
  replyTo?: ChatMessage

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Domain behaviors
  editContent(newContent: string): void {
    if (this.isDeleted) {
      throw new Error("Cannot edit deleted message")
    }
    this.content = newContent
    this.isEdited = true
    this.editedAt = new Date()
  }

  softDelete(): void {
    if (this.isDeleted) {
      throw new Error("Message already deleted")
    }
    this.isDeleted = true
    this.deletedAt = new Date()
  }

  restore(): void {
    if (!this.isDeleted) {
      throw new Error("Message is not deleted")
    }
    this.isDeleted = false
    this.deletedAt = undefined
  }

  setReplyTo(replyToMessage: ChatMessage): void {
    if (replyToMessage.isDeleted) {
      throw new Error("Cannot reply to deleted message")
    }
    this.replyToId = replyToMessage.id
    this.replyTo = replyToMessage
  }

  // Factory methods
  static createTextMessage(content: string, roomId: string, userId: string): ChatMessage {
    const message = new ChatMessage()
    message.content = content
    message.roomId = roomId
    message.userId = userId
    message.messageType = MessageType.TEXT
    return message
  }

  static createImageMessage(
    content: string,
    imageUrl: string,
    roomId: string,
    userId: string
  ): ChatMessage {
    const message = new ChatMessage()
    message.content = content
    message.roomId = roomId
    message.userId = userId
    message.messageType = MessageType.IMAGE
    message.metadata = { imageUrl }
    return message
  }

  static createFileMessage(
    content: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    roomId: string,
    userId: string
  ): ChatMessage {
    const message = new ChatMessage()
    message.content = content
    message.roomId = roomId
    message.userId = userId
    message.messageType = MessageType.FILE
    message.metadata = { fileName, fileSize, mimeType }
    return message
  }

  static createSystemMessage(content: string, roomId: string): ChatMessage {
    const message = new ChatMessage()
    message.content = content
    message.roomId = roomId
    message.userId = null // System messages don't have a user
    message.messageType = MessageType.SYSTEM
    return message
  }
}
