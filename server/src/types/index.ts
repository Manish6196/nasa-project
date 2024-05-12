export interface TypedRequest<T, U> extends Express.Request {
  body: U
  query: T
}

export interface IPaginationQuery {
  page: number
  limit: number
}

export interface ILaunchPayload {
  launchDate: string
  mission: string
  rocket: string
  target: string
}

export interface ILaunchToSave extends Omit<ILaunchPayload, 'launchDate'> {
  launchDate: Date
}

export interface ILaunch {
  flightNumber: number
  launchDate: Date
  mission: string
  rocket: string
  target: string
  success: boolean
  upcoming: boolean
  customers: string[]
}

export interface IPlanetData {
  kepler_name: string
  koi_disposition: string
  koi_insol: number
  koi_prad: number
}
