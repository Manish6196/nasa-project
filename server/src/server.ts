import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

import app from './app'
const { mongoConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
  await mongoConnect()
  await loadPlanetsData()
  await loadLaunchData()

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

startServer()
