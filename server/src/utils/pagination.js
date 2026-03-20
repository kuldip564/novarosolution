export function parsePagination(query = {}, defaults = {}) {
  const page = Math.max(Number(query.page || defaults.page || 1), 1);
  const rawLimit = query.limit ?? defaults.limit;
  const limit =
    rawLimit === undefined || rawLimit === null || rawLimit === ''
      ? null
      : Math.min(Math.max(Number(rawLimit), 1), 100);
  const skip = limit ? (page - 1) * limit : 0;
  return { page, limit, skip };
}

export function buildPaginatedResult(items, page, limit, total) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  };
}

