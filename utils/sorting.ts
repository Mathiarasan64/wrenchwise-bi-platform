/**
 * Generic array sorting helper for objects
 */
export function sortObjects<T>(
  items: T[],
  field: keyof T,
  ascending: boolean = true
): T[] {
  return [...items].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return ascending ? valA - valB : valB - valA;
    }

    const strA = String(valA || '').toLowerCase();
    const strB = String(valB || '').toLowerCase();
    return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
}
