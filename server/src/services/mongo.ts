import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import { logger } from '../middlewares'

// Update below to match your own MongoDB connection string.
const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
  logger.info('MongoDB connection ready!')
})

mongoose.connection.on('error', err => {
  logger.error(err)
})

export async function mongoConnect() {
  await mongoose.connect(MONGO_URL || '')
}

export async function mongoDisconnect() {
  await mongoose.disconnect()
}
