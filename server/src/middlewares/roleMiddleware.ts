import { Request, Response, NextFunction } from 'express'

const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}

export { roleMiddleware }
