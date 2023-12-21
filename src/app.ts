/**
 * FILENAME: app.ts
 * DESCRIPTION: The Express framework configurations and main execution commands.
 * AUTHOR: Annija Karitone
 */

import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import passport from 'passport'
import config from 'config'
import apiRouter from './routes'
import './auth/passport'
import './cron/index'

/**
 * Class that contains all methods responsible for Express configuration.
 */
export class ExpressApp {
  /** The instance of the Express type application. */
  app: Express = express()

  constructor() {
    this.setAppSettings()
    this.setAppRouter()
    this.setErrorHandling()
  }

  /** Set up simple necessary settings for the app. */
  setAppSettings = (): void => {
    this.app.use(express.json()) // Parse incoming JSON data.
    this.app.use(express.urlencoded({ extended: true })) // Parse incoming URL-encoded data.
    this.app.use(passport.initialize()) // Initialize Passport for authentication.
    this.app.use(cors({ origin: config.get('app_url') })) // Enable CORS for a frontend server.
    this.app.use(express.static('public')) // Serve static content from the 'public' directory.
  }

  /** Set up application API entry point. */
  setAppRouter = (): void => {
    this.app.use('/api', apiRouter)
  }

  /** Set up global error handling for the application using middleware. */
  setErrorHandling = (): void => {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(err)
      }
      res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
    })
  }
}
