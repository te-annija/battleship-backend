/**
 * FILENAME: user.model.ts
 * DESCRIPTION: File contains configurations for the database connection.
 * AUTHOR: Annija Karitone
 */
import config from 'config'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  config.get('db.db'),
  config.get('db.user'),
  config.get('db.password'),
  {
    host: config.get('db.host'),
    dialect: config.get('db.dialect')
  }
)

export default sequelize
