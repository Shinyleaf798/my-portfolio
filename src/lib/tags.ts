// Counts tag frequency, sorted by "count descending → alphabetical".
// Frequency first: the most-used tags come first, which is more useful
// than plain alphabetical order.
export function tagCounts<T extends { data: { tags: string[] } }>(
  items: T[]
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const it of items) {
    for (const t of it.data.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
