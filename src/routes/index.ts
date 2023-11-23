/**
 * FILENAME: index.ts
 * DESCRIPTION: File defines main used routes and allocates routers to them.
 * AUTHOR: Annija Karitone
 */
import router, { Request, Response } from 'express'
import AuthRouter from './auth.routes'
import UserRouter from './user.routes'

const apiRouter = router()

apiRouter.use('/auth', AuthRouter)
apiRouter.use('/user', UserRouter)

apiRouter.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Page not found' })
})

export default apiRouter
