/**
 * FILENAME: auth.routes.ts
 * DESCRIPTION: File defines routes used form user authentification.
 * AUTHOR: Annija Karitone
 */
import { Router, Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from 'config'
import { User } from '../models'

const router = Router()

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
          const body = { id: user.id, username: user.username }
          const token = jwt.sign({ user: body }, config.get('jwt_secret'))
          return res.status(200).json({ message: info.message, token, user: body })
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  } catch (error: unknown) {
    return next(error)
  }
})

/** Test route for registered user authorization. */
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json('You have accessed a protected route!')
})
export default router
