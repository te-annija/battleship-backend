/**
 * FILENAME: passport.ts
 * DESCRIPTION: Passport configuration for user authentication strategies.
 * AUTHOR: Annija Karitone
 */

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '../services'
import { UserOutput } from '../models/user.model'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const userService = new UserService()

// Strategy for user registration
passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        const { confirm, email } = req.body

        // Checking for required fields.
        if (!username || !password || !confirm || !email) {
          return done(null, false, { message: 'Please fill in all the fields.' })
        }

        // Checking if password matches the confirmation.
        if (password !== confirm) {
          return done(null, false, { message: 'Password must match.' })
        }

        // Creating a new user.
        const user: UserOutput = await userService.create({ username, password, email })
        return done(null, user, { message: 'User registered successfully!' })
      } catch (error) {
        return done(error)
      }
    }
  )
)

// Strategy for user login
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Checking for required fields.
        if (!username || !password) {
          throw new Error('Please fill in all the fields.')
        }

        // Fetching user by username.
        const user: UserOutput | null = await userService.getByUsername(username)
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' })
        }

        // Comparing passwords.
        const validate = await bcrypt.compare(password, user.password)
        if (!validate) {
          return done(null, false, { message: 'Invalid username or password' })
        }
        // Checking if user is not blocked.
        const currentDate = new Date()
        if (user.blockExpiresAt && user.blockExpiresAt > currentDate) {
          const formatedDate = new Date(user.blockExpiresAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          return done(null, false, {
            message: `Profile blocked. Block expires at ${formatedDate}`
          })
        }

        return done(null, user, { message: 'Logged in Successfully!' })
      } catch (error) {
        return done(error)
      }
    }
  )
)

// Strategy for JSON Web Token (JWT) authentication. Match registred users.
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
      try {
        // Fetching user by username from JWT payload.
        const user: UserOutput | null = await userService.getByUsername(jwt_payload.user.username)
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error: any) {
        return done(error)
      }
    }
  )
)

export const verifyUser = passport.authenticate('jwt', { session: false })

// Strategy for JSON Web Token (JWT) authentication. Match registred users.
passport.use(
  'websocket',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_WS
    },
    async (jwt_payload, done) => {
      return done(null, true)
    }
  )
)

export const verifyWebsocket = passport.authenticate('websocket', { session: false })
