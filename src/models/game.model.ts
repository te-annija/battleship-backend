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
  gameId: number

  /** The type of the game (computer, friend or online). */
  gameType: string

  /** Reference to the winning user. */
  winnerId?: number | null

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

/** Game attributes that are necessary for creation of object and possible to update. */
export interface GameInput extends Optional<GameAttributes, 'gameId' | 'winnerId'> {}

/** Game attibutes returned when accessing the model. */
export interface GameOutput extends Required<GameAttributes> {}

export default class Game extends Model<GameAttributes, GameInput> implements GameAttributes {
  /** The primary key and identifier of the game. */
  public gameId!: number

  /** The type of the game (computer, friend or random). */
  public gameType!: string

  /** Reference to the winning user. */
  public winnerId!: number | null

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
  public readonly deletedAt!: Date
}

Game.init(
  {
    gameId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    gameType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'userId'
      }
    }
  },
  { timestamps: true, sequelize, paranoid: true }
)
