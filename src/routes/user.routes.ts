/**
 * FILENAME: user.routes.ts
 * DESCRIPTION: File defines routes used for user CRUD operations.
 * AUTHOR: Annija Karitone
 */
import { Router, Request, Response, NextFunction } from 'express'
import { UserController } from '../controllers'
import { UserOutput } from '../models/user.model'

const router = Router()

const userController = new UserController()

/** Route to fetch all users. */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: UserOutput[] = await userController.getAll()
    res.status(200).json({ users })
  } catch (error: any) {
    next(error)
  }
})

/** Route to fetch a user by ID. */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserOutput = await userController.getById(req)
    res.status(200).json({ user })
  } catch (error: any) {
    next(error)
  }
})

/** Route to update a user by ID. */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserOutput = await userController.update(req)
    res.status(200).json({ message: 'User updated successfully!', user })
  } catch (error: any) {
    next(error)
  }
})

/** Route to delete a user by ID. */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted: Boolean = await userController.deleteById(req)
    if (isDeleted) {
      res.status(200).json({ message: 'User deleted successfully!' })
    } else {
      next({ message: 'Failed to delete user!', status: 500 })
    }
  } catch (error: any) {
    next(error)
  }
})

export default router
