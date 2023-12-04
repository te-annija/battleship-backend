/**
 * FILENAME: gameUser.service.ts
 * AUTHOR: Annija Karitone
 */

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
  update = async (id: number, payload: Partial<GameUserInput>): Promise<GameUserOutput> => {
    const game: GameUser | null = await GameUser.findByPk(id)

    if (!game) {
      throw new Error('Could not update game. Game not found.')
    }
    return await game.update(payload)
  }

  /**
   * Retrieves a game user by ID.
   * @param id The ID of the game to retrieve.
   * @returns The Game details of game with given ID details or null if not found.
   */
  getById = async (id: number): Promise<GameUserOutput> => {
    const game: GameUser | null = await GameUser.findByPk(id)
    if (!game) {
      throw new Error('Could get game. Game not found.')
    }
    return game
  }

  /**
   * Deletes a game user by ID.
   * @param id The ID of the game user to delete.
   * @returns Boolean indicating whether the deletion was successful.
   */
  deleteById = async (id: number): Promise<boolean> => {
    const deletedGameCount: number = await GameUser.destroy({
      where: { id }
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
}
