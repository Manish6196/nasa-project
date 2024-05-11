import express from 'express'
import {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} from './launches.controller'

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpAbortLaunch)

export default launchesRouter
