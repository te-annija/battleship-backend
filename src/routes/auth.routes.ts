/**
 * FILENAME: auth.routes.ts
 * DESCRIPTION: File defines routes used form user authentification.
 * AUTHOR: Annija Karitone
 */
import { Router, Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import * as middleware from '../middleware'
import 'dotenv/config'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || ''

/** Route to register a new user. */
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate('register', { session: false }, (err: Error, user: User, info: any) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return next({ status: 400, message: info.message })
      }
      return res.status(200).json({ message: info.message, user: user })
    })(req, res, next)
  } catch (error: unknown) {
    return next(error)
  }
})

/** Route to login existing user. */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate('login', async (err: Error, user: User, info: any) => {
      try {
        if (err) {
          return next(err)
        }
        if (!user) {
          return next({ status: 400, message: info.message })
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error)
          const body = { id: user.id, username: user.username, isAdmin: user.isAdmin }
          const token = jwt.sign({ user: body }, JWT_SECRET)
          return res.status(200).json({ message: info.message, token, user: user })
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  } catch (error: unknown) {
    return next(error)
  }
})

/** Route to validate if user is authentificated and is not blocked. */
router.get('/', middleware.verifyUserToken, middleware.checkIfBlocked, (req, res) => {
  res.status(200).json('You have accessed a protected route!')
})

/** Route to validate if user is an admin. */
router.get(
  '/admin',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  middleware.checkIfBlocked,
  (req, res) => {
    res.status(200).json('You have accessed a protected route!')
  }
)

/** Test route for registered user authorization. */
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json('You have accessed a protected route!')
})
export default router
