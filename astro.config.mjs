// @ts-check
import { defineConfig } from 'astro/config';

// Notes usually open with "# Title", which repeats the page header that
// already shows frontmatter `title`. Drop a level-1 heading only when it is
// the very first block, so a deliberate "#" further down is left alone.
function remarkDropLeadingH1() {
  return (tree) => {
    const i = tree.children.findIndex((n) => n.type !== 'yaml' && n.type !== 'toml');
    const first = tree.children[i];
    if (first && first.type === 'heading' && first.depth === 1) {
      tree.children.splice(i, 1);
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://shinyleaf798.github.io',
  base: '/my-portfolio/',

  markdown: {
    remarkPlugins: [remarkDropLeadingH1],
    // Shiki code highlighting, matched to the dark theme
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
