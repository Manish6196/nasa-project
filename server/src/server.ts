import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { mongoConnect } from './services/mongo'
import { loadPlanetsData } from './models/planets.model'
import { loadLaunchData } from './models/launches.model'
import { logger } from './middlewares'

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
  await mongoConnect()
  await loadPlanetsData()
  await loadLaunchData()

  server.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}...`)
  })
}

startServer()
