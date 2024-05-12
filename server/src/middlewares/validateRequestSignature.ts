import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

const SECRET_KEY = 'your_secret_key' // Example secret key for request signature

export const validateRequestSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { signature, ...payload } = req.body
  const computedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex')
  if (signature === computedSignature) {
    return next()
  } else {
    return res.status(403).send('Invalid signature')
  }
}
