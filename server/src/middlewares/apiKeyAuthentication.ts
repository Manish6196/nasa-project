import { Request, Response, NextFunction } from 'express'

const API_KEY = 'your_api_key' // Example API key

export const apiKeyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const providedApiKey = req.headers['api-key']
  if (providedApiKey === API_KEY) {
    return next()
  } else {
    return res.status(401).send('Unauthorized')
  }
}
