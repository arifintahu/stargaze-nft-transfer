export interface Pagination {
  next_key: string
  total: number
}

export interface QueryPagination {
  key?: string
  offset?: number
  limit?: number
  countTotal?: boolean
}
