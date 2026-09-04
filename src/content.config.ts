import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Notes: 所有笔记统一存放于此集合。项目笔记 vs 通用笔记通过 `type` 区分,
// 而非物理目录分离。构建时笔记独立仓库的 md 会被注入 src/content/notes/。
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['project', 'general']).default('general'),
    // 当 type 为 project 时, 填写关联项目的 slug
    relatedProject: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sourceUrl: z.string().url(),
    summary: z.string(),
    relatedNotes: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, projects, news };
