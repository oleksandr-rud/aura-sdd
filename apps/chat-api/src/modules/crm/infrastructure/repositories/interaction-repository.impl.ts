/**
 * Interaction Repository Implementation
 * Infrastructure layer - concrete implementation of InteractionRepository interface
 */

import { MemoryPaginatedRepository } from '@/shared/base-repository'
import {
  InteractionRepository,
  InteractionSearchParams,
  InteractionTimeline
} from '../../../domain/repositories/interaction-repository'
import { Interaction } from '../../../domain/entities/interaction'
import { Result, PaginatedResult } from '@/libs/utils'

export class InteractionRepositoryImpl extends MemoryPaginatedRepository<Interaction> implements InteractionRepository {

  async findByContact(contactId: string, userId: string): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap().filter(i =>
        i.contactId === contactId &&
        i.userId === userId
      ).sort((a, b) => b.date.getTime() - a.date.getTime())

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByCompany(companyId: string, userId: string): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap().filter(i =>
        i.companyId === companyId &&
        i.userId === userId
      ).sort((a, b) => b.date.getTime() - a.date.getTime())

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByType(type: string, userId: string): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap().filter(i =>
        i.type === type &&
        i.userId === userId
      ).sort((a, b) => b.date.getTime() - a.date.getTime())

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findByDateRange(from: Date, to: Date, userId: string): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap().filter(i =>
        i.date >= from &&
        i.date <= to &&
        i.userId === userId
      ).sort((a, b) => b.date.getTime() - a.date.getTime())

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findWithFollowUp(userId: string): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap().filter(i =>
        i.followUpDate &&
        i.userId === userId
      ).sort((a, b) => (a.followUpDate?.getTime() || 0) - (b.followUpDate?.getTime() || 0))

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async findOverdueFollowUp(userId: string): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const now = new Date()
      const interactions = allInteractions.unwrap().filter(i =>
        i.followUpDate &&
        i.followUpDate < now &&
        i.userId === userId
      ).sort((a, b) => (a.followUpDate?.getTime() || 0) - (b.followUpDate?.getTime() || 0))

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async searchInteractions(
    params: InteractionSearchParams,
    options: { page: number; limit: number }
  ): Promise<Result<PaginatedResult<Interaction>, Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      let filteredInteractions = allInteractions.unwrap().filter(i => i.userId === params.userId)

      // Apply filters
      if (params.contactId) {
        filteredInteractions = filteredInteractions.filter(i => i.contactId === params.contactId)
      }

      if (params.companyId) {
        filteredInteractions = filteredInteractions.filter(i => i.companyId === params.companyId)
      }

      if (params.type) {
        filteredInteractions = filteredInteractions.filter(i => i.type === params.type)
      }

      if (params.dateRange) {
        filteredInteractions = filteredInteractions.filter(i =>
          i.date >= params.dateRange!.from &&
          i.date <= params.dateRange!.to
        )
      }

      if (params.hasFollowUp !== undefined) {
        filteredInteractions = filteredInteractions.filter(i => !!i.followUpDate === params.hasFollowUp)
      }

      if (params.overdueFollowUp) {
        const now = new Date()
        filteredInteractions = filteredInteractions.filter(i =>
          i.followUpDate && i.followUpDate < now
        )
      }

      if (params.query) {
        const query = params.query.toLowerCase()
        filteredInteractions = filteredInteractions.filter(i => i.matchesSearch(query))
      }

      // Sort by date (most recent first)
      filteredInteractions.sort((a, b) => b.date.getTime() - a.date.getTime())

      // Apply pagination
      const startIndex = (options.page - 1) * options.limit
      const endIndex = startIndex + options.limit
      const paginatedInteractions = filteredInteractions.slice(startIndex, endIndex)

      const paginatedResult: PaginatedResult<Interaction> = {
        items: paginatedInteractions,
        total: filteredInteractions.length,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(filteredInteractions.length / options.limit)
      }

      return Result.ok(paginatedResult)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getContactTimeline(
    contactId: string,
    userId: string,
    options?: { page: number; limit: number }
  ): Promise<Result<PaginatedResult<InteractionTimeline>, Error>> {
    try {
      // Get interactions for this contact
      const interactionsResult = await this.findByContact(contactId, userId)
      if (interactionsResult.isErr()) {
        return Result.err(interactionsResult.unwrapErr())
      }

      const interactions = interactionsResult.unwrap()

      // Create timeline items (for now, just interaction data)
      const timelineItems: InteractionTimeline[] = interactions.map(interaction => ({
        interaction
      }))

      // Apply pagination if provided
      if (options) {
        const startIndex = (options.page - 1) * options.limit
        const endIndex = startIndex + options.limit
        const paginatedItems = timelineItems.slice(startIndex, endIndex)

        const paginatedResult: PaginatedResult<InteractionTimeline> = {
          items: paginatedItems,
          total: timelineItems.length,
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(timelineItems.length / options.limit)
        }

        return Result.ok(paginatedResult)
      }

      // Return all items if no pagination
      const paginatedResult: PaginatedResult<InteractionTimeline> = {
        items: timelineItems,
        total: timelineItems.length,
        page: 1,
        limit: timelineItems.length,
        totalPages: 1
      }

      return Result.ok(paginatedResult)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getCompanyTimeline(
    companyId: string,
    userId: string,
    options?: { page: number; limit: number }
  ): Promise<Result<PaginatedResult<InteractionTimeline>, Error>> {
    try {
      // Get interactions for this company
      const interactionsResult = await this.findByCompany(companyId, userId)
      if (interactionsResult.isErr()) {
        return Result.err(interactionsResult.unwrapErr())
      }

      const interactions = interactionsResult.unwrap()

      // Create timeline items (for now, just interaction data)
      const timelineItems: InteractionTimeline[] = interactions.map(interaction => ({
        interaction
      }))

      // Apply pagination if provided
      if (options) {
        const startIndex = (options.page - 1) * options.limit
        const endIndex = startIndex + options.limit
        const paginatedItems = timelineItems.slice(startIndex, endIndex)

        const paginatedResult: PaginatedResult<InteractionTimeline> = {
          items: paginatedItems,
          total: timelineItems.length,
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(timelineItems.length / options.limit)
        }

        return Result.ok(paginatedResult)
      }

      // Return all items if no pagination
      const paginatedResult: PaginatedResult<InteractionTimeline> = {
        items: timelineItems,
        total: timelineItems.length,
        page: 1,
        limit: timelineItems.length,
        totalPages: 1
      }

      return Result.ok(paginatedResult)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async getRecentInteractions(userId: string, limit: number = 10): Promise<Result<Interaction[], Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap()
        .filter(i => i.userId === userId)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit)

      return Result.ok(interactions)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByType(userId: string): Promise<Result<Record<string, number>, Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const interactions = allInteractions.unwrap().filter(i => i.userId === userId)
      const countByType: Record<string, number> = {}

      interactions.forEach(interaction => {
        countByType[interaction.type] = (countByType[interaction.type] || 0) + 1
      })

      return Result.ok(countByType)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByContact(contactId: string, userId: string): Promise<Result<number, Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const count = allInteractions.unwrap().filter(i =>
        i.contactId === contactId &&
        i.userId === userId
      ).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async countByCompany(companyId: string, userId: string): Promise<Result<number, Error>> {
    try {
      const allInteractionsResult = await this.findAll()
      if (allInteractionsResult.isErr()) {
        return Result.err(allInteractionsResult.unwrapErr())
      }

      const count = allInteractions.unwrap().filter(i =>
        i.companyId === companyId &&
        i.userId === userId
      ).length

      return Result.ok(count)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async bulkUpdateOutcome(
    interactionIds: string[],
    outcome: string,
    userId: string
  ): Promise<Result<void, Error>> {
    try {
      for (const interactionId of interactionIds) {
        const interactionResult = await this.findById(interactionId)
        if (interactionResult.isErr()) {
          return Result.err(interactionResult.unwrapErr())
        }

        const interaction = interactionResult.unwrap()
        if (!interaction || interaction.userId !== userId) {
          continue // Skip if not found or access denied
        }

        const updatedInteraction = interaction.updateOutcome(outcome)
        await this.save(updatedInteraction)
      }

      return Result.ok(undefined)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  async bulkSetFollowUp(
    interactionIds: string[],
    followUpDate: Date,
    userId: string
  ): Promise<Result<void, Error>> {
    try {
      for (const interactionId of interactionIds) {
        const interactionResult = await this.findById(interactionId)
        if (interactionResult.isErr()) {
          return Result.err(interactionResult.unwrapErr())
        }

        const interaction = interactionResult.unwrap()
        if (!interaction || interaction.userId !== userId) {
          continue // Skip if not found or access denied
        }

        const setFollowUpResult = interaction.setFollowUpDate(followUpDate)
        if (setFollowUpResult.isErr()) {
          return Result.err(setFollowUpResult.unwrapErr())
        }

        await this.save(setFollowUpResult.unwrap())
      }

      return Result.ok(undefined)
    } catch (error) {
      return Result.err(error as Error)
    }
  }
}