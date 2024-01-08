/**
 * FILENAME: gameUser.service.ts
 * AUTHOR: Annija Karitone
 */

import { Op } from 'sequelize'
import { Game } from '../models'
import GameUser, { GameUserInput, GameUserOutput } from '../models/gameUser.model'

/**
 * Handle CRUD operations for the data in the GameUser table.
 */
export class GameUserService {
  /**
   * Creates a new game user.
   * @param payload All required game user model properties.
   * @returns The created game user details.
   */
  create = async (payload: GameUserInput): Promise<GameUserOutput> => {
    return await GameUser.create(payload)
  }

  /**
   * Retrieve quantitative information about user games.
   * @param userId The unique identifier of the user.
   * @param where Conditions to count
   * @returns Count of the records with specified conditions.
   */
  getUserStatistics = async (userId: number, where: any): Promise<number> => {
    try {
      return await GameUser.count({
        where: {
          userId
        },
        include: [
          {
            model: Game,
            as: 'game',
            where
          }
        ]
      })
    } catch (error) {
      console.error('Error occurred while fetching game statistics:', error)
      return 0
    }
  }

  /**
   * Retrieve user total gaied points in the given interval.
   * @param userId The unique identifier of the user.
   * @param startDate The start date of the interval.
   * @param endDate The end date of the interval.
   * @returns The total gained points in the interval.
   */
  async countPointsInInterval(userId: number, startDate: Date, endDate: Date): Promise<number> {
    try {
      const pointsInInterval = await GameUser.sum('points', {
        where: {
          userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      })

      return pointsInInterval || 0 // Return 0 if no points gained in the interval
    } catch (error) {
      console.error('Error occurred while counting points in interval:', error)
      throw error
    }
  }
}
