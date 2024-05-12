import express from 'express'
import {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} from './launches.controller'
import { validateRequest } from '../../middlewares'
import { launchPayloadSchema } from './launches.schema'

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', validateRequest(launchPayloadSchema), httpAddNewLaunch)
launchesRouter.delete('/:id', httpAbortLaunch)

export default launchesRouter
