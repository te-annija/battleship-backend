/**
 * FILENAME: game.service.ts
 * AUTHOR: Annija Karitone
 */

import Game, { GameInput, GameOutput } from '../models/game.model'

/**
 * Handle CRUD operations for the data in the Game table.
 */
export class GameService {
  /**
   * Creates a new game.
   * @param payload All required game model properties.
   * @returns The created game details.
   */
  create = async (payload: GameInput): Promise<GameOutput> => {
    return await Game.create(payload)
  }

  /**
   * Updates an existing game by ID.
   * @param gameId The ID of the game to be updated.
   * @param payload The properties of game that needs to be updated.
   * @returns The updated game details.
   */
  update = async (gameId: number, payload: Partial<GameInput>): Promise<GameOutput> => {
    const game: Game | null = await Game.findByPk(gameId)

    if (!game) {
      throw new Error('Could not update game. Game not found.')
    }
    return await game.update(payload)
  }

  /**
   * Retrieves a game by ID.
   * @param gameId The ID of the game to retrieve.
   * @returns The Game details of game with given ID details or null if not found.
   */
  getById = async (gameId: number): Promise<GameOutput> => {
    const game: Game | null = await Game.findByPk(gameId)
    if (!game) {
      throw new Error('Could get game. Game not found.')
    }
    return game
  }

  /**
   * Deletes a game by ID.
   * @param gameId The ID of the game to delete.
   * @returns Boolean indicating whether the deletion was successful.
   */
  deleteById = async (gameId: number): Promise<boolean> => {
    const deletedGameCount: number = await Game.destroy({
      where: { gameId }
    })
    return !!deletedGameCount
  }

  /**
   * Retrieves all games.
   * @returns Array of game objects containing all game details.
   */
  getAll = async (): Promise<GameOutput[]> => {
    return Game.findAll()
  }
}
