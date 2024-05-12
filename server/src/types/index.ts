export interface TypedRequest<T, U> extends Express.Request {
  body: U
  query: T
}

export interface PaginationQuery {
  page: number
  limit: number
}

export interface LaunchPayload {
  launchDate: string
  mission: string
  rocket: string
  target: string
}

export interface LaunchToSave extends Omit<LaunchPayload, 'launchDate'> {
  launchDate: Date
}

export interface Launch {
  flightNumber: number
  launchDate: Date
  mission: string
  rocket: string
  target: string
  success: boolean
  upcoming: boolean
  customers: string[]
}

export interface PlanetData {
  kepler_name: string
  koi_disposition: string
  koi_insol: number
  koi_prad: number
}
