/**
 * Generic multi-field text search filter helper
 */
export function filterBySearchQuery<T>(
  items: T[],
  query: string,
  searchableFields: (keyof T)[]
): T[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;

  return items.filter((item) =>
    searchableFields.some((field) => {
      const val = item[field];
      return val !== undefined && val !== null && String(val).toLowerCase().includes(trimmed);
    })
  );
}
