/**
 * FILENAME: game.routes.ts
 * DESCRIPTION: File defines routes used for game CRUD operations.
 * AUTHOR: Annija Karitone
 */
import { Router, Request, Response, NextFunction } from 'express'
import { GameController } from '../controllers'
import { GameOutput } from '../models/game.model'
import { verifyWebsocket } from '../auth/passport'

const router = Router()

const gameController = new GameController()

/** Route to create a new game. */
router.post('/', verifyWebsocket, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const game: GameOutput = await gameController.create(req)
    res.status(200).json({ message: 'Game saved successfully!', game })
  } catch (error: any) {
    next(error)
  }
})

export default router
