/**
 * FILENAME: rank.controller.ts
 * AUTHOR: Annija Karitone
 */

import { Request } from 'express'
import { RankService } from '../services'
import { RankOutput } from '../models/rank.model'
import { Op } from 'sequelize'

/**
 * Class contains controllers for Rank CRUD operations.
 */
export class RankController {
  private rankService = new RankService()

  create = async (req: Request): Promise<RankOutput> => {
    return await this.rankService.create(req.body)
  }

  update = async (req: Request): Promise<RankOutput> => {
    return await this.rankService.update(Number(req.params.id), req.body)
  }

  getById = async (req: Request): Promise<RankOutput> => {
    return await this.rankService.getById(Number(req.params.id))
  }

  deleteById = async (req: Request): Promise<boolean> => {
    return await this.rankService.deleteById(Number(req.params.id))
  }

  restoreById = async (req: Request): Promise<void> => {
    return await this.rankService.restoreById(Number(req.body.id))
  }

  getAll = async (req: Request): Promise<RankOutput[]> => {
    const { sortBy, sortOrder, filterBy, paranoid } = req.query as {
      sortBy?: string
      sortOrder?: string
      filterBy?: string
      paranoid?: string
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
    return await this.rankService.getAll({
      order: [[sortField, sortOrderValue]],
      where: filterCriteria,
      paranoid: paranoid == 'true'
    })
  }
}
