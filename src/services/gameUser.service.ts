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
   * Updates an existing game user by ID.
   * @param id The ID of the game user to be updated.
   * @param payload The properties of game user that needs to be updated.
   * @returns The updated game user details.
   */
  update = async (gameUserId: number, payload: Partial<GameUserInput>): Promise<GameUserOutput> => {
    const game: GameUser | null = await GameUser.findByPk(gameUserId)

    if (!game) {
      throw new Error('Could not update game. Game not found.')
    }
    return await game.update(payload)
  }

  /**
   * Retrieves a game user by ID.
   * @param gameUserId The ID of the game to retrieve.
   * @returns The Game details of game with given ID details or null if not found.
   */
  getById = async (gameUserId: number): Promise<GameUserOutput> => {
    const game: GameUser | null = await GameUser.findByPk(gameUserId)
    if (!game) {
      throw new Error('Could get game. Game not found.')
    }
    return game
  }

  /**
   * Deletes a game user by ID.
   * @param gameUserId The ID of the game user to delete.
   * @returns Boolean indicating whether the deletion was successful.
   */
  deleteById = async (gameUserId: number): Promise<boolean> => {
    const deletedGameCount: number = await GameUser.destroy({
      where: { gameUserId }
    })
    return !!deletedGameCount
  }

  /**
   * Retrieves all game users.
   * @returns Array of game objects containing all game users details.
   */
  getAll = async (): Promise<GameUserOutput[]> => {
    return GameUser.findAll()
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
