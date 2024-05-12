import axios from 'axios'

import { Launch } from './launches.mongo'
import { Planet } from './planets.mongo'
import { ILaunch, ILaunchToSave } from '../types'
import { logger } from '../middlewares'

const DEFAULT_FLIGHT_NUMBER = 100

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
  logger.info('Downloading launch data...')
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  })

  if (response.status !== 200) {
    logger.info('Problem downloading launch data')
    throw new Error('ILaunch data download failed')
  }

  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap((payload: ILaunch) => {
      return payload['customers']
    })

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    } as ILaunch

    logger.info(`${launch.flightNumber} ${launch.mission}`)

    await saveLaunch(launch)
  }
}

export async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  })
  if (firstLaunch) {
    logger.info('ILaunch data already loaded!')
  } else {
    await populateLaunches()
  }
}

async function findLaunch(filter: any) {
  return await Launch.findOne(filter)
}

export async function existsLaunchWithId(launchId: number) {
  return await findLaunch({
    flightNumber: launchId,
  })
}

async function getLatestFlightNumber() {
  const latestLaunch = await Launch.findOne().sort('-flightNumber')

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}

export async function getAllLaunches(skip: number, limit: number) {
  return await Launch.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch: ILaunch) {
  await Launch.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  )
}

export async function scheduleNewLaunch(launch: ILaunchToSave) {
  const planet = await Planet.findOne({
    keplerName: launch.target,
  })

  if (!planet) {
    throw new Error('No matching planet found')
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  })

  await saveLaunch(newLaunch)
}

export async function abortLaunchById(launchId: number) {
  const aborted = await Launch.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  )

  return aborted.modifiedCount === 1
}
