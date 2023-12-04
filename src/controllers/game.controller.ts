/**
 * FILENAME: game.controller.ts
 * AUTHOR: Annija Karitone
 */

import { Request } from 'express'
import { GameService, GameUserService } from '../services'
import { GameInput, GameOutput } from '../models/game.model'

/**
 * Class contains controllers for Game CRUD operations.
 */
export class GameController {
  private gameService = new GameService()
  private gameUserService = new GameUserService()

  create = async (req: Request): Promise<GameOutput> => {
    const { gameroomId, winnerId, gameType, player1, player2 } = req.body

    const gameData: GameInput = { gameroomId, winnerId, gameType }

    const game = await this.gameService.create(gameData)

    await this.gameUserService.create({ gameId: game.id, ...player1 })
    await this.gameUserService.create({ gameId: game.id, ...player2 })

    return game
  }

  update = async (request: Request): Promise<GameOutput> => {
    return await this.gameService.update(Number(request.params.id), request.body)
    /** TODO: Implement gameUserService update */
  }

  getById = async (request: Request): Promise<GameOutput> => {
    return await this.gameService.getById(Number(request.params.id))
    /** TODO: Implement gameUserService get */
  }

  deleteById = async (request: Request): Promise<Boolean> => {
    return await this.gameService.deleteById(Number(request.params.id))
    /** TODO: Implement gameUserService delete */
  }

  getAll = async (): Promise<GameOutput[]> => {
    return await this.gameService.getAll()
    /** TODO: Implement gameUserService getAll */
  }
}
