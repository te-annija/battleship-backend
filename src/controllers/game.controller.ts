/**
 * FILENAME: game.controller.ts
 * AUTHOR: Annija Karitone
 */

import { Request } from 'express'
import { GameService, GameUserService, UserService } from '../services'
import { GameInput, GameOutput } from '../models/game.model'

/**
 * Class contains controllers for Game operations.
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
