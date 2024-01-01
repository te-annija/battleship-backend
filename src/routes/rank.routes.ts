/**
 * FILENAME: rank.routes.ts
 * DESCRIPTION: File defines routes used for rank CRUD operations.
 * AUTHOR: Annija Karitone
 */

import { Router, Request, Response, NextFunction } from 'express'
import { RankController } from '../controllers'
import { RankOutput } from '../models/rank.model'
import multer from 'multer'
import cloudinary from 'cloudinary'
import * as middleware from '../middleware'

const router = Router()
const rankController = new RankController()

// Check allowed file extentions.
const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype === 'image/svg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// Initialize multer instance with defined storage.
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 } // Limiting file size to 1MB
})

/** Route to fetch all ranks. */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ranks: RankOutput[] = await rankController.getAll(req)
    res.status(200).json({ ranks })
  } catch (error: any) {
    next(error)
  }
})

/** Route to create a new rank. */
router.post(
  '/',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  upload.single('icon'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.')
      }

      const upload = await cloudinary.v2.uploader.upload(req.file.path)
      req.body.icon = upload.secure_url

      await rankController.create(req)
      res.status(200).json({ message: 'Rank created successfully!' })
    } catch (error: any) {
      next(error)
    }
  }
)

/** Route to fetch a rank by ID. */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rank: RankOutput = await rankController.getById(req)
    res.status(200).json({ rank })
  } catch (error: any) {
    next(error)
  }
})

/** Route to update a rank by ID. */
router.put(
  '/:id',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  upload.single('icon'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        const upload = await cloudinary.v2.uploader.upload(req.file.path)
        req.body.icon = upload.secure_url
      }

      const rank: RankOutput = await rankController.update(req)
      res.status(200).json({ message: 'Rank updated successfully!', rank: rank })
    } catch (error: any) {
      next(error)
    }
  }
)

/** Route to delete a rank by ID. */
router.delete(
  '/:id',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isDeleted: boolean = await rankController.deleteById(req)
      if (isDeleted) {
        res.status(200).json({ message: 'Rank deleted successfully!' })
      } else {
        next({ message: 'Failed to delete rank!', status: 500 })
      }
    } catch (error: any) {
      next(error)
    }
  }
)

/** Route to restore a rank by ID. */
router.post(
  '/restore',
  middleware.verifyUserToken,
  middleware.authorizeAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await rankController.restoreById(req)
      res.status(200).json({ message: 'Rank restored successfully!' })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
