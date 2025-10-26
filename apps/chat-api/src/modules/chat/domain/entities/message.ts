/**
 * Message Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { Result } from "@/libs/utils"
import { BaseEntity } from "@/shared/base-entity"

export type MessageRole = "user" | "assistant" | "system"

export interface MessageProps {
  sessionId: string
  role: MessageRole
  content: string
  metadata?: Record<string, any>
  tokens?: number
  model?: string
}

export class Message extends BaseEntity {
  constructor(
    public readonly props: MessageProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id ?? BaseEntity.generateId(), createdAt ?? new Date(), updatedAt ?? new Date())
  }

  get sessionId(): string {
    return this.props.sessionId
  }

  get role(): MessageRole {
    return this.props.role
  }

  get content(): string {
    return this.props.content
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata
  }

  get tokens(): number | undefined {
    return this.props.tokens
  }

  get model(): string | undefined {
    return this.props.model
  }

  // Domain behaviors
  updateContent(newContent: string): Result<Message, Error> {
    if (!newContent.trim()) {
      return Result.err(new Error("Content cannot be empty"))
    }

    if (newContent.length > 10000) {
      return Result.err(new Error("Content exceeds maximum length of 10,000 characters"))
    }

    const updatedMessage = new Message(
      {
        ...this.props,
        content: newContent.trim(),
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMessage)
  }

  updateMetadata(metadata: Record<string, any>): Result<Message, Error> {
    const updatedMessage = new Message(
      {
        ...this.props,
        metadata: { ...this.props.metadata, ...metadata },
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMessage)
  }

  setTokenCount(tokens: number): Result<Message, Error> {
    if (tokens < 0) {
      return Result.err(new Error("Token count cannot be negative"))
    }

    const updatedMessage = new Message(
      {
        ...this.props,
        tokens,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMessage)
  }

  setModel(model: string): Result<Message, Error> {
    if (!model.trim()) {
      return Result.err(new Error("Model name cannot be empty"))
    }

    const updatedMessage = new Message(
      {
        ...this.props,
        model: model.trim(),
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedMessage)
  }

  // Factory methods
  static createUserMessage(sessionId: string, content: string): Message {
    return new Message({
      sessionId,
      role: "user",
      content: content.trim(),
    })
  }

  static createAssistantMessage(
    sessionId: string,
    content: string,
    model?: string,
    tokens?: number
  ): Message {
    return new Message({
      sessionId,
      role: "assistant",
      content: content.trim(),
      model: model?.trim(),
      tokens,
    })
  }

  static createSystemMessage(sessionId: string, content: string): Message {
    return new Message({
      sessionId,
      role: "system",
      content: content.trim(),
    })
  }
}
