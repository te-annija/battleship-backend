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
        gameData.winnerId = user.userId
      } else {
        gameData.winnerId = null
      }
    } catch (error: any) {
      gameData.winnerId = null
    }

    const game = await this.gameService.create(gameData)

    await this.helperCreateGameUser(player1, game.gameId, gameType)
    await this.helperCreateGameUser(player2, game.gameId, gameType)
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

  /**
   * Helper method to save player game data to database.
   * @param player The player data.
   * @param gameId The identification of the game.
   * @param gameType The game type.
   */
  private async helperCreateGameUser(player: any, gameId: number, gameType: string): Promise<void> {
    try {
      const user = await this.userService.getByUsername(player.playerId)
      if (user) {
        player.userId = user.userId
        player.rankId = user.rankId
        await this.gameUserService.create({ gameId: gameId, ...player })
        if (gameType === 'online' && player.points) {
          let userPoints = user.points + player.points
          if (userPoints < 0) {
            userPoints = 0
          }

          await this.userService.update(user.userId, { points: userPoints })
        }
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
}
