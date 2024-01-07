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
}
