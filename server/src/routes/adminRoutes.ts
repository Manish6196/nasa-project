import express, { Request, Response } from 'express'
import { roleMiddleware } from '../middlewares'

const router = express.Router()

// Secure route that requires admin role
router.get('/', roleMiddleware(['admin']), (req: Request, res: Response) => {
  const { user } = req.body
  res.json({ message: 'Admin route accessed successfully', user })
})

export { router as adminRoutes }
