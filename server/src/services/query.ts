import { PaginationQuery } from '../types'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 0

export function getPagination(query: PaginationQuery) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT
  const skip = (page - 1) * limit

  return {
    skip,
    limit,
  }
}
