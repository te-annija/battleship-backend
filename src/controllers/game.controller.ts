/**
 * FILENAME: game.controller.ts
 * AUTHOR: Annija Karitone
 */

import { Request } from 'express'
import { GameService, GameUserService, UserService } from '../services'
import { GameInput, GameOutput } from '../models/game.model'

/**
 * Class contains controllers for Game CRUD operations.
 */
export class GameController {
  private gameService = new GameService()
  private gameUserService = new GameUserService()
  private userService = new UserService()

  create = async (req: Request): Promise<GameOutput> => {
    const { winnerId, gameType, player1, player2 } = req.body

    const gameData: GameInput = { winnerId, gameType }

    try {
      const user = await this.userService.getByUsername(winnerId)
      if (user) {
        gameData.winnerId = user.id
      } else {
        gameData.winnerId = null
      }
    } catch (error: any) {
      gameData.winnerId = null
    }

    const game = await this.gameService.create(gameData)

    try {
      const user = await this.userService.getByUsername(player1.userId)
      if (user) {
        player1.userId = user.id
        player1.rankId = user.rankId
        await this.gameUserService.create({ gameId: game.id, ...player1 })
        if (gameType === 'random' && player2.points) {
          let userPoints = user.points + player1.points
          if (userPoints < 0) {
            userPoints = 0
          }

          await this.userService.update(user.id, { points: userPoints })
        }
      }
    } catch (error: any) {
      /* empty */
    }

    try {
      const user = await this.userService.getByUsername(player2.userId)
      if (user) {
        player2.userId = user.id
        player2.rankId = user.rankId
        await this.gameUserService.create({ gameId: game.id, ...player2 })
        if (gameType === 'random' && player2.points) {
          let userPoints = user.points + player2.points
          if (userPoints < 0) {
            userPoints = 0
          }

          await this.userService.update(user.id, { points: userPoints })
        }
      }
    } catch (error: any) {
      /* empty */
    }
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
