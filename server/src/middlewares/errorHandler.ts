import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error occurred: ${err.stack}`)

  if (res.headersSent) {
    return next(err)
  }

  res.status(500).send('Internal Server Error')
}
