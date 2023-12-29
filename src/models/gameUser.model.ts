/**
 * FILENAME: gameUser.model.ts
 * DESCRIPTION: File defines Game User model (this will create a table in database).
 * AUTHOR: Annija Karitone
 */
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from './sequelize'
import User from './user.model'
import Game from './game.model'
import Rank from './rank.model'

interface GameUserAttributes {
  /** The primary key and identifier of the game user record. */
  id: number

  /** Reference to the game. */
  gameId: number

  /** Reference to the user. */
  userId: number

  /** JSON string containing data of the player gameboard and enemy actions on it. */
  gameboard: string

  /** JSON string containing data of the user enemy gameboard and user actions on it. */
  attackGameboard: string

  /** Points earned in the game. */
  points?: number

  /** User rank when game took place. */
  rankId?: number

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

/** Game User attributes that are necessary for creation of object and possible to update. */
export interface GameUserInput extends Optional<GameUserAttributes, 'id' | 'points' | 'rankId'> {}

/** Game User attibutes returned when accessing the model. */
export interface GameUserOutput extends Required<GameUserAttributes> {}

export default class GameUser
  extends Model<GameUserAttributes, GameUserInput>
  implements GameUserAttributes
{
  /** The primary key and identifier of the game user record. */
  public id!: number

  /** Reference to the game. */
  public gameId!: number

  /** Reference to the user. */
  public userId!: number

  /** JSON string containing data of the player gameboard and enemy actions on it. */
  public gameboard!: string

  /** JSON string containing data of the user enemy gameboard and user actions on it. */
  public attackGameboard!: string

  /** Points earned in the game. */
  public points!: number

  /** User rank when game took place. */
  public rankId!: number

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
  public readonly deletedAt!: Date
}

GameUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Game,
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    gameboard: {
      type: DataTypes.JSON,
      allowNull: false
    },
    attackGameboard: {
      type: DataTypes.JSON,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    rankId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Rank,
        key: 'id'
      }
    }
  },
  { timestamps: true, sequelize, paranoid: true }
)
