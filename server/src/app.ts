import path from 'node:path'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import api from './routes/api'
import { errorHandler, notFoundHandler } from './middlewares'
import { helmetConfig } from './config'

const app = express()

// Middleware to allow cross-origin requests only from specified origin (http://localhost:3000)
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  })
)

// Middleware to limit the number of requests per IP address within a specified time window
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  })
)

// Middleware to set HTTP headers securely, including additional security headers
app.use(helmet(helmetConfig))

// Middleware to log HTTP requests
app.use(morgan('combined'))

// Use Compression middleware to compress HTTP responses
app.use(compression())

// Middleware to parse incoming JSON requests
app.use(express.json())

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')))

// API routes
app.use('/v1', api)

// Middleware to serve React application for all routes except API routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

// Error handling middleware for handling 404 errors (Route not found)
app.use(notFoundHandler)

// Error handling middleware for handling generic server errors (status 500)
app.use(errorHandler)

export default app
