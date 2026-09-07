import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Notes: all notes live in this single collection. Project notes vs general
// notes are distinguished via the `type` field, not by physical folders.
// At build time, markdown from the separate notes repo gets injected into
// src/content/notes/.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['project', 'general']).default('general'),
    // When type is "project", fill in the related project's slug
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
