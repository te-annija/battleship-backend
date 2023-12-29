/**
 * FILENAME: user.controller.ts
 * AUTHOR: Annija Karitone
 */
import { Request } from 'express'
import { GameUserService, UserService } from '../services'
import User, { UserOutput } from '../models/user.model'
import { Op } from 'sequelize'
import { GameUser, Rank } from '../models'

/**
 * Class contains controllers for user CRUD operations.
 */
export class UserController {
  private userService = new UserService()
  private gameUserService = new GameUserService()

  create = async (req: Request): Promise<UserOutput> => {
    return await this.userService.create(req.body)
  }

  update = async (req: Request): Promise<UserOutput> => {
    if (req.body.blockExpiresAt === '') {
      req.body.blockExpiresAt = null // Set the attribute to null if it's an empty string for the right formating.
    }

    return await this.userService.update(Number(req.params.id), req.body)
  }

  getById = async (req: Request): Promise<UserOutput> => {
    return await this.userService.getById(Number(req.params.id))
  }

  getByUsername = async (req: Request): Promise<UserOutput | null> => {
    return await this.userService.getByUsername(req.params.username)
  }

  deleteById = async (req: Request): Promise<Boolean> => {
    return await this.userService.deleteById(Number(req.params.id))
  }

  restoreById = async (req: Request): Promise<void> => {
    return await this.userService.restoreById(Number(req.body.id))
  }

  getAll = async (req: Request): Promise<UserOutput[]> => {
    const { sortBy, sortOrder, filterBy, paranoid, limit } = req.query as {
      sortBy?: string
      sortOrder?: string
      filterBy?: string
      paranoid?: string
      limit?: string
    }

    // Handle sorting parameters.
    const sortField: string = sortBy || 'createdAt'
    const sortOrderValue: string = sortOrder === 'desc' ? 'DESC' : 'ASC'

    // Handle filter parameters.
    let filterCriteria: { [key: string]: any } = {}

    if (filterBy) {
      const filters: string[] = filterBy.split(',')
      filters.forEach((filter) => {
        const filterParts: string[] = filter.split(':')
        if (filterParts.length === 2) {
          const [key, value] = filterParts
          if (key === 'createdAt' || key === 'updatedAt' || key === 'deletedAt') {
            // Handle date filtering.
            const date = new Date(value)

            if (!isNaN(date.getTime())) {
              filterCriteria[key] = {
                [Op.gte]: new Date(date.setUTCHours(0, 0, 0)),
                [Op.lte]: new Date(date.setUTCHours(23, 59, 59))
              }
            }
          } else {
            // Handle other types of filters (non-date fields)
            filterCriteria[key] = { [Op.like]: `%${value}%` }
          }
        }
      })
    }

    // Handle result fetching.
    const fetchOptions: any = {
      order: [[sortField, sortOrderValue]],
      where: filterCriteria,
      paranoid: paranoid === 'true'
    }

    if (limit && Number(limit) > 0) {
      fetchOptions.limit = Number(limit)
    }

    return await this.userService.getAll(fetchOptions)
  }

  getUserStatistics = async (req: Request): Promise<any | null> => {
    if (!req.params.id) {
      return null
    }
    const userId: number = Number(req.params.id)

    const statistics: any = {}

    statistics.totalGamesPlayed = await this.gameUserService.getUserStatistics(userId, {})

    statistics.totalGamesWon = await this.gameUserService.getUserStatistics(userId, {
      winnerId: userId
    })

    statistics.onlineGamesPlayed = await this.gameUserService.getUserStatistics(userId, {
      gameType: 'random'
    })

    statistics.onlineGamesWon = await this.gameUserService.getUserStatistics(userId, {
      winnerId: userId,
      gameType: 'random'
    })

    statistics.leaderboardPosition = await this.userService.getCurrentLeaderboardPosition(userId)
    const today = new Date()

    today.setHours(0, 0, 0, 0) // Set the time to the beginning of the day
    let date = new Date()
    date.setDate(today.getDate() - 8)

    statistics.weekPoints = await GameUser.sum('points', {
      where: {
        userId,
        createdAt: {
          [Op.between]: [date, today]
        }
      }
    })

    // Retrieve points for each day over the last 5 days
    const pointsByDay = []
    for (let i = 0; i < 7; i++) {
      date.setDate(date.getDate() + 1)

      const endDate = new Date(date)
      endDate.setDate(date.getDate() + 1)
      const pointsForDay = await GameUser.sum('points', {
        where: {
          userId,
          createdAt: {
            [Op.between]: [date, endDate]
          }
        }
      })

      pointsByDay.push({
        date: endDate.getDate(),
        points: pointsForDay || 0
      })
    }
    statistics.pointsByDay = pointsByDay

    return statistics
  }

  getUserGames = async (req: Request) => {
    const user: User = await this.userService.getById(Number(req.params.id))
    const filterCriteria: { [key: string]: any } = {}

    if (req.query.filterBy && typeof req.query.filterBy === 'string') {
      req.query.filterBy.split(',').forEach((filter) => {
        const [key, value] = filter.split(':')
        if (key === 'winner') {
          filterCriteria[key] = value === '1' ? user.username : { [Op.ne]: user.username }
        } else {
          filterCriteria[key] = { [Op.like]: `%${value}%` }
        }
      })
    }

    return user.getUserGames({
      where: {
        gameType: filterCriteria.gameType || { [Op.like]: `%%` }
      },
      include: [
        {
          model: User,
          as: 'winner',
          attributes: ['username'],
          required: false,
          where: {
            username: filterCriteria.winner || { [Op.like]: `%%` }
          }
        },
        {
          model: User,
          as: 'players',
          attributes: ['username'],
          include: {
            model: Rank,
            as: 'rank'
          }
        }
      ]
    })
  }
}
