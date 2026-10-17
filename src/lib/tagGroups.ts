import { allTags, type Faceted } from './tags';

/**
 * Groups shown in the tag filter, in display order.
 *
 * The first three come straight from an entry's own frontmatter: a note
 * saying `languages: ["TypeScript"]` puts TypeScript under 编程语言 without
 * this file knowing anything about TypeScript.
 *
 * The lists below only route free-form `tags`. Add a word here when it
 * deserves its own group rather than landing in 主题; leave it out and
 * nothing breaks.
 */
export const TAG_GROUPS: { label: string; from?: keyof Faceted; tags?: string[] }[] = [
  { label: '编程语言', from: 'languages' },
  { label: '框架 & 库', from: 'frameworks' },
  { label: '领域', from: 'domains' },
  {
    label: '工具 & 平台',
    tags: ['CLI', 'Git', 'GitHub', 'Docker', 'VS Code', 'Linux', 'Windows'],
  },
  {
    label: '硬件 & 软件修复',
    tags: ['数据储存', '硬盘', '内存', '系统修复', '驱动', '装机'],
  },
  {
    label: '语言学习',
    tags: ['日语', '英语', 'SRS', '单词', '语法'],
  },
];

/** Everything else from `tags` — techniques, topics, one-offs. */
export const OTHER_LABEL = '主题';

type Counted = { tag: string; count: number };

/**
 * Counts every tag across the given entries and sorts them into groups.
 * Empty groups are dropped, so a page only shows rows it has tags for.
 */
export function facetGroups<T extends { data: Faceted }>(
  items: T[]
): { label: string; tags: Counted[] }[] {
  // Which group a free-form tag belongs to, matched case-insensitively
  const routed = new Map<string, string>();
  for (const g of TAG_GROUPS) {
    for (const t of g.tags ?? []) routed.set(t.toLowerCase(), g.label);
  }

  // label -> tag -> count
  const counts = new Map<string, Map<string, number>>();
  const bump = (label: string, tag: string) => {
    if (!counts.has(label)) counts.set(label, new Map());
    const bucket = counts.get(label)!;
    bucket.set(tag, (bucket.get(tag) ?? 0) + 1);
  };

  for (const item of items) {
    const d = item.data;
    const seen = new Set<string>();
    for (const g of TAG_GROUPS) {
      if (!g.from) continue;
      for (const tag of d[g.from]) {
        if (seen.has(tag)) continue;
        seen.add(tag);
        bump(g.label, tag);
      }
    }
    for (const tag of d.tags) {
      if (seen.has(tag)) continue;
      seen.add(tag);
      bump(routed.get(tag.toLowerCase()) ?? OTHER_LABEL, tag);
    }
  }

  const order = [...TAG_GROUPS.map((g) => g.label), OTHER_LABEL];
  return order
    .map((label) => ({
      label,
      tags: [...(counts.get(label) ?? new Map<string, number>())]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag)),
    }))
    .filter((g) => g.tags.length > 0);
}

/** Total distinct tags across every group — drives the collapse threshold. */
export function countTags<T extends { data: Faceted }>(items: T[]): number {
  return new Set(items.flatMap((i) => allTags(i.data))).size;
}
