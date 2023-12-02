/**
 * FILENAME: user.routes.ts
 * DESCRIPTION: File defines routes used for user CRUD operations.
 * AUTHOR: Annija Karitone
 */
import { Router, Request, Response, NextFunction } from 'express'
import { UserController } from '../controllers'
import { UserOutput } from '../models/user.model'
import * as middleware from '../middleware'

const router = Router()

const userController = new UserController()

/** Route to fetch all users. */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: UserOutput[] = await userController.getAll(req)
    res.status(200).json({ users })
  } catch (error: any) {
    next(error)
  }
})

/** Route to create a new user. */
router.post(
  '/',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.create(req)
      res.status(200).json({ message: 'User created successfully!' })
    } catch (error: any) {
      next(error)
    }
  }
)

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
router.put(
  '/:id',
  middleware.verifyUserToken,
  middleware.authorizeUser,
  middleware.authorizeUserProtected,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: UserOutput = await userController.update(req)
      res.status(200).json({ message: 'User updated successfully!', user: user })
    } catch (error: any) {
      next(error)
    }
  }
)

/** Route to delete a user by ID. */
router.delete(
  '/:id',
  middleware.verifyUserToken,
  middleware.authorizeUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isDeleted: Boolean = await userController.deleteById(req)
      if (isDeleted) {
        res.status(200).json({ message: 'User deactivated successfully!' })
      } else {
        next({ message: 'Failed to deactivated user!', status: 500 })
      }
    } catch (error: any) {
      next(error)
    }
  }
)

/** Route to restore a user by ID. */
router.post(
  '/restore',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.restoreById(req)
      res.status(200).json({ message: 'User restored successfully!' })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
