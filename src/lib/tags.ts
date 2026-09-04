// 统计标签频次, 按 "出现次数降序 → 字母序" 排序。
// 频次优先: 最常用的标签排前面, 比纯字母序更实用。
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
