/**
 * FILENAME: server.ts
 * DESCRIPTION: Backend server configurations and main execution commands.
 * AUTHOR: Annija Karitone
 */

import { ExpressApp } from './app'
import { sequelize } from './models'
import { Sequelize } from 'sequelize'
import Http from 'http'
import 'dotenv/config'

/**
 * Class that contains all methods responsible for server configuration.
 */
export class Server {
  /** The instance of the Express type application. */
  expressApp: ExpressApp = new ExpressApp()

  /** The instance of the HTTP server. */
  httpServer: Http.Server

  constructor() {
    this.httpServer = new Http.Server(this.expressApp.app) // Create an HTTP server using Express.
  }

  /** Start the server and necessary processes. */
  runServer = (): Promise<void | Http.Server> => {
    return this.databaseConnection().then(this.serverListen).catch(this.serverErrorHandler)
  }

  /** Establish a connection with the database. */
  databaseConnection = (): Promise<Sequelize> => {
    return sequelize.authenticate().then(this.sequelizeSync)
  }

  /** Automatically synchronize Sequelize models with the database on development. */
  sequelizeSync = (): Promise<Sequelize> => {
    return sequelize.sync({ alter: false && process.env.ENV === 'development' })
  }

  /** Open server listening for incoming request on port. */
  serverListen = (): Http.Server => {
    const port: number = Number(process.env.PORT) || 8000

    return this.httpServer.listen(port, (): void => {
      console.log(`Server is running on port: ${port}`)
    })
  }

  /** Handle errors occurring during server execution. */
  serverErrorHandler = (error: Error): void => {
    console.log('Server run error: ', error.message)
  }
}

// Create an instance and start the server
const server = new Server()
server.runServer()
