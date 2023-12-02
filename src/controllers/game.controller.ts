/**
 * FILENAME: game.controller.ts
 * AUTHOR: Annija Karitone
 */

import { Request } from 'express'
import { GameService } from '../services'
import { GameOutput } from '../models/game.model'

/**
 * Class contains controllers for Game CRUD operations.
 */
export class GameController {
  private GameService = new GameService()

  update = async (request: Request): Promise<GameOutput> => {
    return await this.GameService.update(Number(request.params.id), request.body)
  }

  getById = async (request: Request): Promise<GameOutput> => {
    return await this.GameService.getById(Number(request.params.id))
  }

  deleteById = async (request: Request): Promise<Boolean> => {
    return await this.GameService.deleteById(Number(request.params.id))
  }

  getAll = async (): Promise<GameOutput[]> => {
    return await this.GameService.getAll()
  }
}
