/**
 * FILENAME: game.model.ts
 * DESCRIPTION: File defines Game model (this will create a table in database).
 * AUTHOR: Annija Karitone
 */
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from './sequelize'
import User from './user.model'

interface GameAttributes {
  /** The primary key and identifier of the game. */
  id: number

  /** The identifier of the gameroom from the websocket. */
  gameroomId: string

  /** The type of the game (computer, friend or random). */
  gameType: string

  /** Reference to the winning user. */
  winnerId?: number | null

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

/** Game attributes that are necessary for creation of object and possible to update. */
export interface GameInput extends Optional<GameAttributes, 'id' | 'winnerId'> {}

/** Game attibutes returned when accessing the model. */
export interface GameOutput extends Required<GameAttributes> {}

export default class Game extends Model<GameAttributes, GameInput> implements GameAttributes {
  /** The primary key and identifier of the game. */
  public id!: number

  /** The identifier of the gameroom from the websocket. */
  public gameroomId!: string

  /** The type of the game (computer, friend or random). */
  public gameType!: string

  /** Reference to the winning user. */
  public winnerId!: number | null

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
  public readonly deletedAt!: Date

  // Define relations
  public static associate() {
    Game.belongsTo(User, { foreignKey: 'winnerId', as: 'winner' })
  }
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    gameroomId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gameType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  { timestamps: true, sequelize, paranoid: true }
)
