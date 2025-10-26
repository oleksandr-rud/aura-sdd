/**
 * Base Entity
 * KISS principle: simple base class for all domain entities
 */

export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  markAsUpdated(): void {
    this.updatedAt = new Date()
  }

  equals(other: BaseEntity): boolean {
    return this.id === other.id
  }

  static generateId(): string {
    return crypto.randomUUID()
  }
}
