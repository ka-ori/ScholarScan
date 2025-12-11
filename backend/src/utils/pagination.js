export const parsePaginationParams = (query, defaultLimit = 10) => {
  const page = Math.max(1, Number.parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit) || defaultLimit))

  return {
    page,
    limit,
    skip: (page - 1) * limit
  }
}

export const buildPaginationResponse = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit)

  return {
    currentPage: page,
    pageSize: limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    startIndex: (page - 1) * limit + 1,
    endIndex: Math.min(page * limit, totalCount)
  }
}

export const parseSortParams = (sortBy, order, allowedFields = []) => {
  const validOrder = ['asc', 'desc'].includes(order?.toLowerCase()) ? order.toLowerCase() : 'desc'
  const validSortBy = allowedFields.includes(sortBy) ? sortBy : allowedFields[0] || 'createdAt'

  return {
    sortBy: validSortBy,
    order: validOrder
  }
}
