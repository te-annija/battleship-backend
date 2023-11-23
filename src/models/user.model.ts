/**
 * FILENAME: user.model.ts
 * DESCRIPTION: File defines User model (this will create a table in database).
 * AUTHOR: Annija Karitone
 */
import sequelize from './sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

/** Attributes stored in the User model */
interface UserAttributes {
  /** The primary key and identifier of the user. */
  id: number

  /** The user unique username. Used for identification. */
  username: string

  /** The user password stored as a hashed value. */
  password: string

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

/** User attributes that are necessary for creation of object and possible to update. */
export interface UserInput extends Optional<UserAttributes, 'id'> {}

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

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
  public readonly deletedAt!: Date
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
      unique: true,
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
    }
  },
  { timestamps: true, sequelize, paranoid: true }
)
