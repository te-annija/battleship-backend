/**
 * FILENAME: passport.ts
 * DESCRIPTION: Passport configuration for user authentication strategies.
 * AUTHOR: Annija Karitone
 */

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '../services'
import config from 'config'
import { UserOutput } from '../models/user.model'
import bcrypt from 'bcryptjs'

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
        const { confirm } = req.body

        // Checking for required fields.
        if (!username || !password || !confirm) {
          return done(null, false, { message: 'Please fill in all the fields.' })
        }

        // Checking if the username already exists.
        const userExisting: UserOutput | null = await userService.getByUsername(username)
        if (userExisting) {
          return done(null, false, { message: 'Username is already taken.' })
        }

        // Checking if password matches the confirmation.
        if (password !== confirm) {
          return done(null, false, { message: 'Password must match.' })
        }

        // Creating a new user.
        const user: UserOutput = await userService.create({ username, password })
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
      secretOrKey: config.get('jwt_secret')
    },
    async (jwt_payload, done) => {
      // Fetching user by username from JWT payload.
      const user: UserOutput | null = await userService.getByUsername(jwt_payload.user.username)

      if (user) {
        return done(null, user) // User found, authorization successful.
      }

      return done(null, false) // User not found, authorization failed.
    }
  )
)
