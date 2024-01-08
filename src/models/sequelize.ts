/**
 * FILENAME: user.model.ts
 * DESCRIPTION: File contains configurations for the database connection.
 * AUTHOR: Annija Karitone
 */
import { Dialect, Sequelize } from 'sequelize'
import 'dotenv/config'
console.log(process.env.DATABASE_DIALECT)
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: process.env.DATABASE_DIALECT as Dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

export default sequelize
