/**
 * FILENAME: index.ts
 * DESCRIPTION: File defines associations between database models.
 * AUTHOR: Annija Karitone
 */
import { Game, GameUser, Rank, User } from '../index'

/** User has won the game.*/
Game.belongsTo(User, { foreignKey: 'winnerId', as: 'winner' })
User.hasMany(Game, { foreignKey: 'winnerId', as: 'wonGames' })

/** User participated in games. */
User.belongsToMany(Game, {
  through: GameUser,
  as: 'userGames',
  foreignKey: 'userId',
  otherKey: 'gameId'
})
Game.belongsToMany(User, {
  through: GameUser,
  as: 'players',
  foreignKey: 'gameId',
  otherKey: 'userId'
})
User.hasMany(GameUser, { foreignKey: 'userId', as: 'gameData' })
GameUser.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Game.hasMany(GameUser, { foreignKey: 'gameId', as: 'userData' })
GameUser.belongsTo(Game, { foreignKey: 'gameId', as: 'game' })

/** User have rank. */
User.belongsTo(Rank, { foreignKey: 'rankId', as: 'rank' })
Rank.hasMany(User, { foreignKey: 'rankId', as: 'users' })

/**  Users had rank in the game. */
GameUser.belongsTo(Rank, { foreignKey: 'rankId', as: 'rank' })
Rank.hasMany(User, { foreignKey: 'rankId', as: 'gameUsers' })
