import { Request, Response, NextFunction } from 'express'

const allowedIPs = ['127.0.0.1', '::1'] // Example list of allowed IP addresses

export const ipWhitelist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIP = req.ip
  if (allowedIPs.includes(clientIP!)) {
    return next()
  } else {
    return res.status(403).send('Forbidden')
  }
}
