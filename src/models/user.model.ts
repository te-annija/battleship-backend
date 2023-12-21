/**
 * FILENAME: user.model.ts
 * DESCRIPTION: File defines User model (this will create a table in database).
 * AUTHOR: Annija Karitone
 */
import Rank from './rank.model'
import sequelize from './sequelize'
import { DataTypes, Model, Op, Optional } from 'sequelize'

/** Attributes stored in the User model */
interface UserAttributes {
  /** The primary key and identifier of the user. */
  id: number

  /** The user unique username. Used for identification. */
  username: string

  /** The user password stored as a hashed value. */
  password: string

  /** The total of user points. */
  points: number

  /** Reference to the user rank. */
  rankId: string

  /** True if user is a administrator, false otherwise. */
  isAdmin: boolean

  /** Date and time when the user's block will be lifted. */
  blockExpiresAt?: Date | null

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

/** User attributes that are necessary for creation of object and possible to update. */
export interface UserInput
  extends Optional<UserAttributes, 'id' | 'isAdmin' | 'rankId' | 'points'> {}

/** User attibutes returned when accessing the model. */
export interface UserOutput extends Required<UserAttributes> {}

/** The User model stored in the database. */
export default class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  /** The primary key and identifier of the user. */
  public id!: number

  /** The user unique username. Used for identification. */
  public username!: string

  /** The user password stored as a hashed value. */
  public password!: string

  /** The total of user points. */
  public points!: number

  /** Reference to the user rank. */
  public rankId!: string

  /** True if user is a administrator, false otherwise. */
  public isAdmin!: boolean

  /** Date and time when the user's block will be lifted. */
  public blockExpiresAt!: Date | null

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
  public readonly deletedAt!: Date

  // Define relations
  public static associate() {
    User.belongsTo(Rank, { foreignKey: 'rankId', as: 'rank' })
  }
}

/** Initilize User model fields and its properties. */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: {
        name: 'username',
        msg: 'This username is already taken.'
      },
      validate: {
        len: {
          args: [2, 32],
          msg: 'Username length must be between 2 and 32 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        len: {
          args: [8, 128],
          msg: 'Password length must be between 8 and 128 characters'
        }
      }
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Points must be an integer'
        },
        min: {
          args: [0],
          msg: 'Points must be greater than or equal to 0'
        }
      }
    },
    rankId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      references: {
        model: Rank,
        key: 'id'
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    blockExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  },
  { timestamps: true, sequelize, paranoid: true }
)

User.addHook('beforeDestroy', (user: User) => {
  /** Forbid deleting the first admin. */
  if (user.username === 'admin') {
    return Promise.reject(new Error('Unauthorized to delete this user.'))
  }
})

User.addHook('beforeUpdate', async (user: User) => {
  /** Forbid to change crutial data for the first admin. */
  if (
    user.id === 1 &&
    (user.changed('username') || user.changed('isAdmin') || user.changed('blockExpiresAt'))
  ) {
    return Promise.reject(new Error('Unauthorized to update this user data.'))
  }

  if (user.changed('points')) {
    try {
      const rank = await Rank.findOne({
        where: { minimumPoints: { [Op.lte]: user.points } },
        order: [['minimumPoints', 'DESC']]
      })

      if (rank) {
        user.rankId = rank.id.toString()
      }
    } catch (error: any) {
      /* empty */
    }
  }
})

// Define associations after all models are imported.
User.associate()
