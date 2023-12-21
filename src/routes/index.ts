/**
 * FILENAME: index.ts
 * DESCRIPTION: File defines main used routes and allocates routers to them.
 * AUTHOR: Annija Karitone
 */
import router, { Request, Response } from 'express'
import AuthRouter from './auth.routes'
import UserRouter from './user.routes'
import GameRouter from './game.routes'
import RankRouter from './rank.routes'

const apiRouter = router()

apiRouter.use('/auth', AuthRouter)
apiRouter.use('/user', UserRouter)
apiRouter.use('/game', GameRouter)
apiRouter.use('/rank', RankRouter)
apiRouter.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Page not found' })
})

export default apiRouter
