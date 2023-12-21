/**
 * FILENAME: user.service.ts
 * AUTHOR: Annija Karitone
 */

import { UserInput, UserOutput } from '../models/user.model'
import { Rank, User } from '../models'
import bcrypt from 'bcryptjs'

/**
 * Handle CRUD operations for the data in the User table.
 */
export class UserService {
  /**
   * Creates a new user after hashing the password.
   * @param payload All required User model properties.
   * @returns The created user details.
   */
  create = async (payload: UserInput): Promise<UserOutput> => {
    // Encrypt the password.
    const salt: string = await bcrypt.genSalt(10)
    const hash: string = await bcrypt.hash(payload.password, salt)
    payload.password = hash
    return await User.create(payload)
  }

  /**
   * Updates an existing user by ID.
   * @param id The ID of the user to be updated.
   * @param payload The properties of user that needs to be updated.
   * @returns The updated user details.
   */
  update = async (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
    if (payload.password) {
      const salt: string = await bcrypt.genSalt(10)
      const hash: string = await bcrypt.hash(payload.password, salt)
      payload.password = hash
    }

    const user: User | null = await User.findByPk(id)
    if (!user) {
      throw new Error('Could not update user. User not found.')
    }
    return await user.update(payload)
  }

  /**
   * Retrieves a user by ID.
   * @param id The ID of the user to retrieve.
   * @returns The user details of user with given ID details or null if not found.
   */
  getById = async (id: number): Promise<UserOutput> => {
    const user: User | null = await User.findByPk(id, {
      include: [
        {
          model: Rank,
          as: 'rank'
        }
      ]
    })
    if (!user) {
      throw new Error('Could get user. User not found.')
    }
    return user
  }

  /**
   * Retrieves a user by username.
   * @param username The username of the user to retrieve.
   * @returns The user details of user with given username details or null if not found.
   */
  getByUsername = async (username: string): Promise<UserOutput | null> => {
    return await User.findOne({
      where: {
        username: username
      },
      include: [
        {
          model: Rank,
          as: 'rank'
        }
      ]
    })
  }

  /**
   * Deletes a user by ID.
   * @param id The ID of the user to delete.
   * @returns Boolean indicating whether the deletion was successful.
   */
  deleteById = async (id: number): Promise<boolean> => {
    const deletedUserCount: number = await User.destroy({
      where: { id },
      individualHooks: true
    })
    return !!deletedUserCount
  }

  /**
   * Restores a user by ID from soft-delete.
   * @param id The ID of the user to restore.
   * @returns
   */
  restoreById = async (id: number): Promise<void> => {
    return await User.restore({
      where: { id }
    })
  }

  /**
   * Retrieves all users.
   * @returns Array of user objects containing all user details.
   */
  getAll = async (options?: any): Promise<UserOutput[]> => {
    return User.findAll(options)
  }
}
