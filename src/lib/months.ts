// Groups date-sorted entries into "2026 · 10 月" buckets for the
// timeline listings. Order is preserved, so sort before calling.
export interface MonthGroup<T> {
  key: string; // "2026-10", used as an id
  label: string; // "2026 · 10 月"
  items: T[];
}

export function groupByMonth<T>(items: T[], dateOf: (item: T) => Date): MonthGroup<T>[] {
  const groups: MonthGroup<T>[] = [];
  for (const item of items) {
    const d = dateOf(item);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${y}-${m}`;
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) {
      g = { key, label: `${y} · ${m} 月`, items: [] };
      groups.push(g);
    }
    g.items.push(item);
  }
  return groups;
}
