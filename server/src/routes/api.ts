import express from 'express'

import { authRoutes } from './authRoutes'
import { adminRoutes } from './adminRoutes'
import planetsRouter from './planets/planets.router'
import launchesRouter from './launches/launches.router'
import { authMiddleware } from '../middlewares'

const api = express.Router()

api.use('/auth', authRoutes)
api.use('/admin', authMiddleware, adminRoutes)

api.use('/planets', planetsRouter)
api.use('/launches', launchesRouter)

export default api
