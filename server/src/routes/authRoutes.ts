import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()
const secretKey = 'your_secret_key' // Change this to a secure secret key

router.post('/login', (req: Request, res: Response) => {
  // Mock user authentication (replace with actual authentication logic)
  const { username, password } = req.body
  if (username === 'admin' && password === 'password') {
    // Generate JWT token
    const token = jwt.sign({ username: 'admin', role: 'admin' }, secretKey, {
      expiresIn: '1h',
    })
    res.json({ token })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

export { router as authRoutes }
