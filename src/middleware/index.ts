/**
 * FILENAME: index.ts
 * DESCRIPTION: File defines middlewares to authorize user for resource accessing.
 * AUTHOR: Annija Karitone
 */
import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { UserService } from '../services'

const userService = new UserService()

/** Verify if provided jwt token is valid and not malformed. */
export const verifyUserToken = passport.authenticate('jwt', { session: false })

/** Verify if user is authorized to access user provided in the params. */
export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  const authenticatedUser: any = req.user
  const requestedUserId: string = req.params.id

  if (
    authenticatedUser &&
    (authenticatedUser.id.toString() === requestedUserId || authenticatedUser.isAdmin)
  ) {
    next()
  } else {
    next({ status: 403, message: 'Forbidden.' }) // User is not authorized
  }
}

/** Verify if user is authorized to access admin resources. */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authenticatedUser: any = req.user

  if (authenticatedUser && authenticatedUser.isAdmin) {
    next()
  } else {
    next({ status: 403, message: 'Forbidden.' })
  }
}

/** Verify if user is authorized to modify protected fields. */
export const authorizeUserProtected = (req: Request, res: Response, next: NextFunction) => {
  const protectedFields = ['id', 'isAdmin', 'blockExpiresAt', 'points', 'rankId']
  const authenticatedUser: any = req.user

  if (!authenticatedUser) {
    next({ status: 403, message: 'Forbidden.' })
  } else {
    const isModifyingProtectedField = Object.keys(req.body).some((field) =>
      protectedFields.includes(field)
    )

    if (isModifyingProtectedField && !authenticatedUser.isAdmin) {
      next({ status: 403, message: 'Unauthorized: You cannot modify protected fields.' })
    } else {
      next()
    }
  }
}

/** Verify if user is not blocked. */
export const checkIfBlocked = async (req: Request, res: Response, next: NextFunction) => {
  const authenticatedUser: any = req.user
  if (!authenticatedUser) {
    next({ status: 403, message: 'Forbidden.' })
  } else {
    const user: any = await userService.getById(authenticatedUser.id)
    const currentDate = new Date()
    if (user.blockExpiresAt && user.blockExpiresAt > currentDate) {
      next({
        status: 403,
        message: `Unauthorized: User blocked.`
      })
    } else {
      next()
    }
  }
}
