/**
 * FILENAME: rank.service.ts
 * AUTHOR: Annija Karitone
 */

import { RankInput, RankOutput } from '../models/rank.model'
import { Rank } from '../models'

/**
 * Handle CRUD operations for the data in the Rank table.
 */
export class RankService {
  /**
   * Creates a new rank.
   * @param payload All required Rank model properties.
   * @returns The created rank details.
   */
  create = async (payload: RankInput): Promise<RankOutput> => {
    return await Rank.create(payload)
  }

  /**
   * Updates an existing rank by ID.
   * @param rankId The ID of the rank to be updated.
   * @param payload The properties of rank that need to be updated.
   * @returns The updated rank details.
   */
  update = async (rankId: number, payload: Partial<RankInput>): Promise<RankOutput> => {
    const rank: Rank | null = await Rank.findByPk(rankId)
    if (!rank) {
      throw new Error('Could not update rank. Rank not found.')
    }
    return await rank.update(payload)
  }

  /**
   * Retrieves a rank by ID.
   * @param rankId The ID of the rank to retrieve.
   * @returns The rank details of the rank with the given ID or null if not found.
   */
  getById = async (rankId: number): Promise<RankOutput> => {
    const rank: Rank | null = await Rank.findByPk(rankId)
    if (!rank) {
      throw new Error('Could not get rank. Rank not found.')
    }
    return rank
  }

  /**
   * Deletes a rank by ID.
   * @param rankId The ID of the rank to delete.
   * @returns Boolean indicating whether the deletion was successful.
   */
  deleteById = async (rankId: number): Promise<boolean> => {
    const deletedRankCount: number = await Rank.destroy({
      where: { rankId },
      individualHooks: true
    })
    return !!deletedRankCount
  }

  /**
   * Restores a rank by ID from soft-delete.
   * @param rankId The ID of the rank to restore.
   * @returns
   */
  restoreById = async (rankId: number): Promise<void> => {
    return await Rank.restore({
      where: { rankId }
    })
  }

  /**
   * Retrieves all ranks.
   * @returns Array of rank objects containing all rank details.
   */
  getAll = async (options?: any): Promise<RankOutput[]> => {
    return Rank.findAll(options)
  }
}
