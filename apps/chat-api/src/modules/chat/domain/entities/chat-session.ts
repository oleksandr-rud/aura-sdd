/**
 * Chat Session Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { Result } from "@/libs/utils"
import { BaseEntity } from "@/shared/base-entity"

export interface ChatSessionProps {
  userId: string
  title: string
  context?: string
  aiProvider: "openai" | "claude"
  aiModel: string
  metadata?: Record<string, any>
  isActive: boolean
}

export class ChatSession extends BaseEntity {
  constructor(
    public readonly props: ChatSessionProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id ?? BaseEntity.generateId(), createdAt ?? new Date(), updatedAt ?? new Date())
  }

  get userId(): string {
    return this.props.userId
  }

  get title(): string {
    return this.props.title
  }

  get context(): string | undefined {
    return this.props.context
  }

  get aiProvider(): "openai" | "claude" {
    return this.props.aiProvider
  }

  get aiModel(): string {
    return this.props.aiModel
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  // Domain behaviors
  updateTitle(newTitle: string): Result<ChatSession, Error> {
    if (!newTitle.trim() || newTitle.length > 100) {
      return Result.err(new Error("Title must be between 1 and 100 characters"))
    }

    const updatedSession = new ChatSession(
      {
        ...this.props,
        title: newTitle.trim(),
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedSession)
  }

  updateContext(newContext: string): Result<ChatSession, Error> {
    const updatedSession = new ChatSession(
      {
        ...this.props,
        context: newContext,
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedSession)
  }

  updateAIProvider(provider: "openai" | "claude", model: string): Result<ChatSession, Error> {
    if (!model.trim()) {
      return Result.err(new Error("Model name is required"))
    }

    const updatedSession = new ChatSession(
      {
        ...this.props,
        aiProvider: provider,
        aiModel: model.trim(),
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedSession)
  }

  updateMetadata(metadata: Record<string, any>): Result<ChatSession, Error> {
    const updatedSession = new ChatSession(
      {
        ...this.props,
        metadata: { ...this.props.metadata, ...metadata },
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedSession)
  }

  activate(): ChatSession {
    return new ChatSession(
      {
        ...this.props,
        isActive: true,
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  deactivate(): ChatSession {
    return new ChatSession(
      {
        ...this.props,
        isActive: false,
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  // Factory method
  static create(props: Omit<ChatSessionProps, "isActive">): ChatSession {
    // Generate default title if not provided
    const title = props.title || "New Chat Session"

    return new ChatSession({
      ...props,
      title,
      isActive: true,
    })
  }
}
