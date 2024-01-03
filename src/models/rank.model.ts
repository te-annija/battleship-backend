import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from './sequelize'

/** Attributes stored in the Rank model */
interface RankAttributes {
  /** The primary key and identifier of the rank. */
  rankId: number

  /** The title of the rank. */
  title: string

  /** The path to the rank icon. */
  icon: string

  /** The difficulty of the rank. */
  difficulty: number

  /** Minimum points required to achieve this rank. */
  minimumPoints: number

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export interface RankInput extends Optional<RankAttributes, 'rankId'> {}

export interface RankOutput extends Required<RankAttributes> {}

export default class Rank extends Model<RankAttributes, RankInput> implements RankAttributes {
  /** The primary key and identifier of the rank. */
  public rankId!: number

  /** The title of the rank. */
  public title!: string

  /** The path to the rank icon. */
  public icon!: string

  /** The difficulty level of the rank. */
  public difficulty!: number

  /** Minimum points required to achieve this rank. */
  public minimumPoints!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date
}

/** Initilize Rank model fields and its properties. */
Rank.init(
  {
    rankId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: {
        name: 'title',
        msg: 'This title is already taken.'
      }
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Icon path cannot be empty'
        }
      }
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Difficulty must be an integer'
        },
        min: {
          args: [1],
          msg: 'Difficulty must be greater than or equal to 1'
        },
        max: {
          args: [7],
          msg: 'Difficulty must be less than or equal to 7'
        }
      }
    },
    minimumPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: {
        name: 'minimumPoints',
        msg: 'Minimum points must be a unique value.'
      },
      validate: {
        isInt: {
          msg: 'Minimum points must be an integer'
        },
        min: {
          args: [0],
          msg: 'Minimum points must be greater than or equal to 0'
        }
      }
    }
  },
  { timestamps: true, sequelize, paranoid: true }
)
