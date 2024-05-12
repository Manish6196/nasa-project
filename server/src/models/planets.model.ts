import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'

import { Planet } from './planets.mongo'
import { IPlanetData } from '../types'
import { logger } from '../middlewares'

function isHabitablePlanet(planet: IPlanetData) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

export function loadPlanetsData() {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async data => {
        if (isHabitablePlanet(data)) {
          savePlanet(data)
        }
      })
      .on('error', err => {
        logger.error(err)
        reject(err)
      })
      .on('end', async () => {
        const foundPlanetsCount = await getPlanetsCount()
        logger.info(`${foundPlanetsCount} habitable planets found!`)
        resolve()
      })
  })
}

export async function getAllPlanets() {
  return await Planet.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
}

async function getPlanetsCount() {
  return await Planet.countDocuments({})
}

async function savePlanet(planet: IPlanetData) {
  try {
    await Planet.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    )
  } catch (err) {
    logger.error(`Could not save planet ${err}`)
  }
}
