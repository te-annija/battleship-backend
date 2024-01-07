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
   * @param userId The ID of the user to be updated.
   * @param payload The properties of user that needs to be updated.
   * @returns The updated user details.
   */
  update = async (userId: number, payload: Partial<UserInput>): Promise<UserOutput> => {
    if (payload.password) {
      const salt: string = await bcrypt.genSalt(10)
      const hash: string = await bcrypt.hash(payload.password, salt)
      payload.password = hash
    }

    const user: User | null = await User.findByPk(userId)
    if (!user) {
      throw new Error('Could not update user. User not found.')
    }
    return await user.update(payload)
  }

  /**
   * Retrieves a user by ID.
   * @param userId The ID of the user to retrieve.
   * @returns The user details of user with given ID details or null if not found.
   */
  getById = async (userId: number): Promise<User> => {
    const user: User | null = await User.findByPk(userId, {
      include: [
        {
          model: Rank,
          as: 'rank',
          paranoid: false
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
          as: 'rank',
          paranoid: false
        }
      ]
    })
  }

  /**
   * Deletes a user by ID.
   * @param userId The ID of the user to delete.
   * @returns Boolean indicating whether the deletion was successful.
   */
  deleteById = async (userId: number): Promise<boolean> => {
    const deletedUserCount: number = await User.destroy({
      where: { userId },
      individualHooks: true
    })
    return !!deletedUserCount
  }

  /**
   * Restores a user by ID from soft-delete.
   * @param userId The ID of the user to restore.
   * @returns
   */
  restoreById = async (userId: number): Promise<void> => {
    return await User.restore({
      where: { userId }
    })
  }

  /**
   * Retrieves all users.
   * @returns Array of user objects containing all user details.
   */
  getAll = async (options?: any): Promise<UserOutput[]> => {
    return User.findAll({
      ...options,
      include: [
        {
          model: Rank,
          as: 'rank',
          paranoid: false
        }
      ]
    })
  }

  /**
   * Retrieves user leaderboard position based on total gained points.
   * @param userId The ID of the user.
   * @returns The leaderboard position of the user.
   */
  getCurrentLeaderboardPosition = async (userId: number): Promise<number> => {
    try {
      // Fetch users sorted by points in descending order
      const users = await User.findAll({
        order: [['points', 'DESC']]
      })

      // Find the index of the user in the sorted list (adding 1 to get 1-based position)
      return users.findIndex((user) => user.userId === userId) + 1
    } catch (error) {
      console.error('Error occurred while fetching leaderboard position:', error)
      throw error
    }
  }
}
