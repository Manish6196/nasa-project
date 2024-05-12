import { Request, Response } from 'express'
import {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} from '../../models/launches.model'

import { getPagination } from '../../services/query'
import { ILaunchPayload, IPaginationQuery, TypedRequest } from '../../types'

export async function httpGetAllLaunches(
  req: TypedRequest<IPaginationQuery, {}>,
  res: Response
) {
  const { skip, limit } = getPagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches)
}

export async function httpAddNewLaunch(
  req: TypedRequest<{}, ILaunchPayload>,
  res: Response
) {
  const launch = req.body

  const lauchToSave = Object.assign({}, launch, {
    launchDate: new Date(launch.launchDate),
  })

  await scheduleNewLaunch(lauchToSave)
  return res.status(201).json(lauchToSave)
}

export async function httpAbortLaunch(req: Request, res: Response) {
  const launchId = Number(req.params.id)

  const existsLaunch = await existsLaunchWithId(launchId)
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    })
  }

  const aborted = await abortLaunchById(launchId)
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    })
  }

  return res.status(200).json({
    ok: true,
  })
}
