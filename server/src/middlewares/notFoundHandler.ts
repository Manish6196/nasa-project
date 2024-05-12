import { Request, Response } from 'express'

export const notFoundHandler = (_: Request, res: Response) => {
  res.status(404).send('Route not found')
}
