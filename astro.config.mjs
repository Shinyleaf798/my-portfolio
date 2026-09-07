// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://shinyleaf798.github.io',
  base: '/my-portfolio/',

  markdown: {
    // Shiki code highlighting, matched to the dark theme
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
