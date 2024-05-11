import { Request, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).send('Route not found')
}