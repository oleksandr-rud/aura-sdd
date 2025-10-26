/**
 * Base Repository Interface
 * KISS principle: simple repository interface for all modules
 */

import { Result } from "@/libs/utils"
import type { BaseEntity } from "./base-entity"

export interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<Result<T | null, Error>>
  findBy(filter: Partial<T>): Promise<Result<T[], Error>>
  findAll(): Promise<Result<T[], Error>>
  save(entity: T): Promise<Result<T, Error>>
  delete(id: string): Promise<Result<void, Error>>
  exists(id: string): Promise<boolean>
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedRepository<T extends BaseEntity> extends Repository<T> {
  findMany(options: PaginationOptions): Promise<Result<PaginatedResult<T>, Error>>
  findManyBy(
    filter: Partial<T>,
    options: PaginationOptions
  ): Promise<Result<PaginatedResult<T>, Error>>
}

// Simple in-memory implementation for development
export class MemoryRepository<T extends BaseEntity> implements Repository<T> {
  protected items = new Map<string, T>()

  async findById(id: string): Promise<Result<T | null, Error>> {
    const item = this.items.get(id)
    return Result.ok(item ?? null)
  }

  async findBy(filter: Partial<T>): Promise<Result<T[], Error>> {
    const results = Array.from(this.items.values()).filter(item => {
      return Object.entries(filter).every(([key, value]) => {
        return (item as any)[key] === value
      })
    })
    return Result.ok(results)
  }

  async findAll(): Promise<Result<T[], Error>> {
    return Result.ok(Array.from(this.items.values()))
  }

  async save(entity: T): Promise<Result<T, Error>> {
    entity.markAsUpdated()
    this.items.set(entity.id, entity)
    return Result.ok(entity)
  }

  async delete(id: string): Promise<Result<void, Error>> {
    this.items.delete(id)
    return Result.ok(undefined)
  }

  async exists(id: string): Promise<boolean> {
    return this.items.has(id)
  }
}

export class MemoryPaginatedRepository<T extends BaseEntity>
  extends MemoryRepository<T>
  implements PaginatedRepository<T>
{
  async findMany(options: PaginationOptions): Promise<Result<PaginatedResult<T>, Error>> {
    const allItems = Array.from(this.items.values())
    return this.paginate(allItems, options)
  }

  async findManyBy(
    filter: Partial<T>,
    options: PaginationOptions
  ): Promise<Result<PaginatedResult<T>, Error>> {
    const filteredItems = Array.from(this.items.values()).filter(item => {
      return Object.entries(filter).every(([key, value]) => {
        return (item as any)[key] === value
      })
    })
    return this.paginate(filteredItems, options)
  }

  private paginate(items: T[], options: PaginationOptions): Result<PaginatedResult<T>, Error> {
    const { page, limit } = options
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedItems = items.slice(startIndex, endIndex)

    return Result.ok({
      items: paginatedItems,
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
    })
  }
}
