/**
 * FILENAME: user.controller.ts
 * AUTHOR: Annija Karitone
 */
import { Request } from 'express'
import { UserService } from '../services'
import { UserOutput } from '../models/user.model'

/**
 * Class contains controllers for user CRUD operations.
 */
export class UserController {
  private userService = new UserService()

  update = async (request: Request): Promise<UserOutput> => {
    return await this.userService.update(Number(request.params.id), request.body)
  }

  getById = async (request: Request): Promise<UserOutput> => {
    return await this.userService.getById(Number(request.params.id))
  }

  deleteById = async (request: Request): Promise<Boolean> => {
    return await this.userService.deleteById(Number(request.params.id))
  }

  getAll = async (): Promise<UserOutput[]> => {
    return await this.userService.getAll()
  }
}
