// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://shinyleaf798.github.io',
  base: '/my-portfolio/',

  markdown: {
    // Shiki 代码高亮, 匹配深色主题
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
