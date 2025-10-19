/**
 * CRM Domain Service
 * Domain layer - core CRM business logic
 */

import { Contact } from '../entities/contact'
import { Company } from '../entities/company'
import { Interaction } from '../entities/interaction'
import { Result } from '@/libs/utils'

export interface DuplicateDetectionOptions {
  checkEmail: boolean
  checkPhone: boolean
  checkName: boolean
  fuzzyThreshold?: number // 0-1, default 0.8
}

export interface DuplicateMatch {
  contact: Contact
  matchScore: number
  matchFields: string[]
}

export interface ContactDeduplicationResult {
  duplicateMatches: DuplicateMatch[]
  potentialDuplicates: DuplicateMatch[]
  isDuplicate: boolean
}

export interface CRMSearchFilters {
  tags?: string[]
  companies?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  interactionTypes?: string[]
  hasInteractions?: boolean
}

export class CRMService {
  constructor() {}

  // Contact deduplication logic
  async detectDuplicates(
    contact: Contact,
    existingContacts: Contact[],
    options: DuplicateDetectionOptions = {
      checkEmail: true,
      checkPhone: true,
      checkName: true,
      fuzzyThreshold: 0.8
    }
  ): Promise<Result<ContactDeduplicationResult, Error>> {
    try {
      const duplicateMatches: DuplicateMatch[] = []
      const potentialDuplicates: DuplicateMatch[] = []

      for (const existingContact of existingContacts) {
        if (existingContact.id === contact.id) continue

        const matchResult = this.calculateMatchScore(contact, existingContact, options)

        if (matchResult.matchScore >= 0.9) {
          duplicateMatches.push(matchResult)
        } else if (matchResult.matchScore >= 0.7) {
          potentialDuplicates.push(matchResult)
        }
      }

      return Result.ok({
        duplicateMatches,
        potentialDuplicates,
        isDuplicate: duplicateMatches.length > 0
      })
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Calculate match score between two contacts
  private calculateMatchScore(
    contact1: Contact,
    contact2: Contact,
    options: DuplicateDetectionOptions
  ): DuplicateMatch {
    let score = 0
    let totalWeight = 0
    const matchFields: string[] = []

    // Email match (highest weight)
    if (options.checkEmail && contact1.email && contact2.email) {
      totalWeight += 40
      if (contact1.email.toLowerCase() === contact2.email.toLowerCase()) {
        score += 40
        matchFields.push('email')
      }
    }

    // Phone match (high weight)
    if (options.checkPhone && contact1.phone && contact2.phone) {
      totalWeight += 30
      if (this.normalizePhone(contact1.phone) === this.normalizePhone(contact2.phone)) {
        score += 30
        matchFields.push('phone')
      }
    }

    // Name match (medium weight)
    if (options.checkName) {
      totalWeight += 30
      const nameSimilarity = this.calculateStringSimilarity(
        contact1.name.toLowerCase(),
        contact2.name.toLowerCase()
      )
      if (nameSimilarity >= (options.fuzzyThreshold || 0.8)) {
        score += 30 * nameSimilarity
        matchFields.push('name')
      }
    }

    const matchScore = totalWeight > 0 ? score / totalWeight : 0

    return {
      contact: contact2,
      matchScore,
      matchFields
    }
  }

  // Calculate string similarity (simple Levenshtein-based approach)
  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Normalize phone number for comparison
  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '').replace(/^\+?1?/, '')
  }

  // Generate contact suggestions based on interactions
  generateContactSuggestions(
    contacts: Contact[],
    interactions: Interaction[],
    limit: number = 5
  ): Contact[] {
    const contactScores = new Map<string, number>()

    // Score based on recent interactions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    interactions
      .filter(interaction => interaction.date >= thirtyDaysAgo)
      .forEach(interaction => {
        const currentScore = contactScores.get(interaction.contactId) || 0
        const daysSinceInteraction = Math.floor(
          (Date.now() - interaction.date.getTime()) / (24 * 60 * 60 * 1000)
        )

        // More recent interactions get higher scores
        const interactionScore = Math.max(1, 30 - daysSinceInteraction)
        contactScores.set(interaction.contactId, currentScore + interactionScore)
      })

    // Score based on contact activity (multiple factors)
    contacts.forEach(contact => {
      const currentScore = contactScores.get(contact.id) || 0

      // Boost score for contacts with emails and phones
      if (contact.email) currentScore += 5
      if (contact.phone) currentScore += 3

      // Boost score for contacts with companies
      if (contact.companyId) currentScore += 4

      // Boost score for contacts with tags
      currentScore += contact.tags.length * 2

      contactScores.set(contact.id, currentScore)
    })

    // Sort and return top contacts
    return contacts
      .sort((a, b) => (contactScores.get(b.id) || 0) - (contactScores.get(a.id) || 0))
      .slice(0, limit)
  }

  // Merge contacts (business logic for contact consolidation)
  mergeContacts(
    primaryContact: Contact,
    secondaryContact: Contact
  ): Result<Contact, Error> {
    try {
      // Create merged contact data
      const mergedData = {
        name: primaryContact.name,
        email: primaryContact.email || secondaryContact.email,
        phone: primaryContact.phone || secondaryContact.phone,
        companyId: primaryContact.companyId || secondaryContact.companyId,
        // Merge tags, removing duplicates
        tags: [...new Set([...primaryContact.tags, ...secondaryContact.tags])],
        // Concatenate notes
        notes: this.mergeNotes(primaryContact.notes, secondaryContact.notes),
        // Merge custom fields, preferring primary contact
        customFields: {
          ...secondaryContact.customFields,
          ...primaryContact.customFields
        },
        userId: primaryContact.userId
      }

      const mergedContact = Contact.create(mergedData)
      return Result.ok(mergedContact)
    } catch (error) {
      return Result.err(error as Error)
    }
  }

  // Helper method to merge notes
  private mergeNotes(primaryNotes?: string, secondaryNotes?: string): string {
    if (!primaryNotes && !secondaryNotes) return ''
    if (!primaryNotes) return secondaryNotes || ''
    if (!secondaryNotes) return primaryNotes

    return `${primaryNotes}\n\n[Merged from duplicate contact]\n${secondaryNotes}`
  }

  // Validate email uniqueness (business rule)
  validateEmailUniqueness(
    email: string,
    existingContacts: Contact[],
    excludeId?: string
  ): Result<boolean, Error> {
    if (!email) return Result.ok(true) // Email is optional

    const duplicate = existingContacts.find(
      contact =>
        contact.email?.toLowerCase() === email.toLowerCase() &&
        contact.id !== excludeId
    )

    if (duplicate) {
      return Result.err(new Error('Email already exists'))
    }

    return Result.ok(true)
  }

  // Generate insights about contact engagement
  generateEngagementInsights(
    contact: Contact,
    interactions: Interaction[]
  ): {
    totalInteractions: number
    lastInteractionDate?: Date
    interactionTypes: Record<string, number>
    averageGap: number // days between interactions
    engagementScore: number // 0-100
  } {
    const contactInteractions = interactions
      .filter(interaction => interaction.contactId === contact.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    const totalInteractions = contactInteractions.length
    const lastInteractionDate = contactInteractions[0]?.date

    // Count interaction types
    const interactionTypes: Record<string, number> = {}
    contactInteractions.forEach(interaction => {
      interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1
    })

    // Calculate average gap between interactions
    let averageGap = 0
    if (totalInteractions > 1) {
      const gaps = []
      for (let i = 1; i < contactInteractions.length; i++) {
        const gap = Math.floor(
          (contactInteractions[i - 1].date.getTime() - contactInteractions[i].date.getTime())
          / (24 * 60 * 60 * 1000)
        )
        gaps.push(gap)
      }
      averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
    }

    // Calculate engagement score (0-100)
    const recencyScore = lastInteractionDate
      ? Math.max(0, 100 - (Date.now() - lastInteractionDate.getTime()) / (24 * 60 * 60 * 1000 * 7)) // Decay over weeks
      : 0

    const frequencyScore = Math.min(50, totalInteractions * 5) // 5 points per interaction, max 50
    const diversityScore = Math.min(30, Object.keys(interactionTypes).length * 10) // 10 points per interaction type, max 30
    const completenessScore = (contact.email ? 10 : 0) + (contact.phone ? 10 : 0) + (contact.companyId ? 10 : 0)

    const engagementScore = Math.min(100, recencyScore + frequencyScore + diversityScore + completenessScore)

    return {
      totalInteractions,
      lastInteractionDate,
      interactionTypes,
      averageGap,
      engagementScore
    }
  }
}