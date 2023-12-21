/**
 * FILENAME: index.ts
 * DESCRIPTION: File contains all defined models.
 * AUTHOR: Annija Karitone
 */

import sequelize from './sequelize'
import User from './user.model'
import Game from './game.model'
import GameUser from './gameUser.model'
import Rank from './rank.model'

export { sequelize, User, Game, GameUser, Rank }
