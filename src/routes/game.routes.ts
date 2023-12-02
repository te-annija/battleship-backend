/**
 * FILENAME: game.routes.ts
 * DESCRIPTION: File defines routes used for game CRUD operations.
 * AUTHOR: Annija Karitone
 */
import { Router, Request, Response, NextFunction } from 'express'
import { GameController } from '../controllers'
import { GameOutput } from '../models/game.model'

const router = Router()

const gameController = new GameController()

/** Route to fetch all games. */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const games: GameOutput[] = await gameController.getAll()
    res.status(200).json({ games })
  } catch (error: any) {
    next(error)
  }
})

/** Route to fetch a game by ID. */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const game: GameOutput = await gameController.getById(req)
    res.status(200).json({ game })
  } catch (error: any) {
    next(error)
  }
})

/** Route to update a game by ID. */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const game: GameOutput = await gameController.update(req)
    res.status(200).json({ message: 'Game updated successfully!', game })
  } catch (error: any) {
    next(error)
  }
})

/** Route to delete a game by ID. */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted: Boolean = await gameController.deleteById(req)
    if (isDeleted) {
      res.status(200).json({ message: 'Game deleted successfully!' })
    } else {
      next({ message: 'Failed to delete game!', status: 500 })
    }
  } catch (error: any) {
    next(error)
  }
})

export default router
