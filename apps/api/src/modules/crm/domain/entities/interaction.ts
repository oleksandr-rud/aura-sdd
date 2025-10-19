/**
 * Interaction Entity
 * Domain layer - pure business logic, no external dependencies
 */

import { BaseEntity } from '@/shared/base-entity'
import { Result } from '@/libs/utils'

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'deal'

export interface InteractionProps {
  contactId: string
  companyId?: string
  type: InteractionType
  subject: string
  content: string
  date: Date
  duration?: number // in minutes
  outcome?: string
  followUpDate?: Date
  userId: string // Owner user
  metadata?: Record<string, any>
}

export class Interaction extends BaseEntity {
  constructor(
    public readonly props: InteractionProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id ?? BaseEntity.generateId(),
      createdAt ?? new Date(),
      updatedAt ?? new Date()
    )
  }

  get contactId(): string {
    return this.props.contactId
  }

  get companyId(): string | undefined {
    return this.props.companyId
  }

  get type(): InteractionType {
    return this.props.type
  }

  get subject(): string {
    return this.props.subject
  }

  get content(): string {
    return this.props.content
  }

  get date(): Date {
    return this.props.date
  }

  get duration(): number | undefined {
    return this.props.duration
  }

  get outcome(): string | undefined {
    return this.props.outcome
  }

  get followUpDate(): Date | undefined {
    return this.props.followUpDate
  }

  get userId(): string {
    return this.props.userId
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata ? { ...this.props.metadata } : undefined
  }

  // Domain behaviors
  updateSubject(subject: string): Result<Interaction, Error> {
    if (!subject || subject.trim().length < 1) {
      return Result.err(new Error('Subject is required'))
    }

    const updatedInteraction = new Interaction(
      {
        ...this.props,
        subject: subject.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInteraction)
  }

  updateContent(content: string): Result<Interaction, Error> {
    if (!content || content.trim().length < 1) {
      return Result.err(new Error('Content is required'))
    }

    const updatedInteraction = new Interaction(
      {
        ...this.props,
        content: content.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInteraction)
  }

  updateDate(date: Date): Result<Interaction, Error> {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return Result.err(new Error('Invalid date'))
    }

    const updatedInteraction = new Interaction(
      {
        ...this.props,
        date
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInteraction)
  }

  updateDuration(duration: number): Result<Interaction, Error> {
    if (duration !== undefined && (duration < 0 || duration > 24 * 60)) {
      return Result.err(new Error('Duration must be between 0 and 1440 minutes'))
    }

    const updatedInteraction = new Interaction(
      {
        ...this.props,
        duration
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInteraction)
  }

  updateOutcome(outcome: string): Interaction {
    return new Interaction(
      {
        ...this.props,
        outcome: outcome?.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  setFollowUpDate(date: Date): Result<Interaction, Error> {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return Result.err(new Error('Invalid follow-up date'))
    }

    if (date <= new Date()) {
      return Result.err(new Error('Follow-up date must be in the future'))
    }

    const updatedInteraction = new Interaction(
      {
        ...this.props,
        followUpDate: date
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInteraction)
  }

  clearFollowUpDate(): Interaction {
    return new Interaction(
      {
        ...this.props,
        followUpDate: undefined
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  assignToCompany(companyId: string): Result<Interaction, Error> {
    if (!companyId || companyId.trim().length === 0) {
      return Result.err(new Error('Company ID is required'))
    }

    const updatedInteraction = new Interaction(
      {
        ...this.props,
        companyId: companyId.trim()
      },
      this.id,
      this.createdAt,
      new Date()
    )

    return Result.ok(updatedInteraction)
  }

  unassignFromCompany(): Interaction {
    return new Interaction(
      {
        ...this.props,
        companyId: undefined
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  updateMetadata(metadata: Record<string, any>): Interaction {
    return new Interaction(
      {
        ...this.props,
        metadata: { ...this.props.metadata, ...metadata }
      },
      this.id,
      this.createdAt,
      new Date()
    )
  }

  // Business logic methods
  isOverdue(): boolean {
    return this.props.followUpDate ? this.props.followUpDate < new Date() : false
  }

  isScheduled(): boolean {
    return this.props.date > new Date()
  }

  isCompleted(): boolean {
    return this.props.date <= new Date()
  }

  getDurationInHours(): number | undefined {
    return this.props.duration ? this.props.duration / 60 : undefined
  }

  getFormattedDate(): string {
    return this.props.date.toISOString()
  }

  getFormattedFollowUpDate(): string | undefined {
    return this.props.followUpDate?.toISOString()
  }

  matchesSearch(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return true

    return (
      this.props.subject.toLowerCase().includes(normalizedQuery) ||
      this.props.content.toLowerCase().includes(normalizedQuery) ||
      (this.props.outcome?.toLowerCase().includes(normalizedQuery) ?? false) ||
      this.props.type.toLowerCase().includes(normalizedQuery)
    )
  }

  // Validation for interaction type
  static isValidType(type: string): type is InteractionType {
    return ['call', 'email', 'meeting', 'note', 'task', 'deal'].includes(type)
  }

  // Factory method
  static create(props: Omit<InteractionProps, 'date'> & { date?: Date }): Interaction {
    return new Interaction({
      ...props,
      date: props.date ?? new Date()
    })
  }

  // Static method for creating from existing data
  static fromExisting(
    props: InteractionProps,
    id: string,
    createdAt: Date,
    updatedAt: Date
  ): Interaction {
    return new Interaction(props, id, createdAt, updatedAt)
  }
}