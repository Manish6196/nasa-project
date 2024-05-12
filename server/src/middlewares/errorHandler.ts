import { Request, Response } from 'express'
import { logger } from './logger'

export const errorHandler = (err: Error, _: Request, res: Response) => {
  logger.error(err.stack)
  res.status(500).send('Internal Server Error')
}
