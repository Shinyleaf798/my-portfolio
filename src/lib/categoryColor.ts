// One colour per category, used as a small dot or label — never as a card
// background — so a long list can be scanned by kind without getting loud.
// The actual colours live in global.css as --cat-1 … --cat-6, with darker
// variants for the light theme. They avoid the three section hues
// (teal / amber / violet) so a category never reads as a section.

const KNOWN: Record<string, number> = {
  后端: 1,
  前端: 2,
  DevOps: 3,
  AI辅助开发: 4,
  AI工程: 5,
  移动端: 6,
};
const SLOTS = 6;

/** CSS colour for a category; unknown names get a stable slot by hash. */
export function categoryColor(name: string | undefined): string {
  if (!name) return 'var(--text-muted)';
  let slot = KNOWN[name];
  if (!slot) {
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
    slot = (h % SLOTS) + 1;
  }
  return `var(--cat-${slot})`;
}
