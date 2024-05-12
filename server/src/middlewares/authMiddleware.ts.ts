import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const secretKey = 'your_secret_key' // Change this to a secure secret key

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from request headers
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, secretKey)
    req.body.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' })
  }
}

export { authMiddleware }
