import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A folder may hold one entry plus its images: project/corddaily/index.md
// with screenshots beside it. Dropping the trailing "/index" keeps the URL
// at /projects/corddaily instead of /projects/corddaily/index.
const folderId = ({ entry }: { entry: string }) =>
  entry.replace(/\.mdx?$/, '').replace(/\/index$/, '');

// Facets: an entry sorts itself into the tag groups rather than relying on
// a lookup table in the site. `tags` stays free-form for anything that is
// not a language, framework, tool or domain.
const facets = {
  languages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
};

// `description` and `summary` mean the same thing; notes written in the
// notes repo use `description`. Normalise so pages only ever read `summary`.
const withSummary = <T extends { summary?: string; description?: string }>(
  d: T
) => ({ ...d, summary: d.summary ?? d.description ?? '' });

const prose = {
  summary: z.string().optional(),
  description: z.string().optional(),
};

// Notes: all notes live in this single collection. Project notes vs general
// notes are distinguished via the `type` field, not by physical folders.
// At build time, markdown from the separate notes repo gets injected into
// src/content/notes/.
const notes = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/notes',
    generateId: folderId,
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      type: z.enum(['project', 'general']).default('general'),
      // When type is "project", fill in the related project's slug
      relatedProject: z.string().optional(),
      // Optional: notes that declare domains get grouped by those instead
      category: z.string().optional(),
      // Slugs of notes this one builds on; the linked notes list it back
      relatedNotes: z.array(z.string()).optional(),
      ...prose,
      ...facets,
    })
    .transform((d) => ({
      ...withSummary(d),
      // The sidebar groups by category; fall back to the broadest facet
      category:
        d.category ?? d.domains[0] ?? d.frameworks[0] ?? d.languages[0] ?? '未分类',
    })),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
    generateId: folderId,
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
      repoUrl: z.string().url().optional(),
      ...prose,
      ...facets,
    })
    .transform(withSummary),
});

const news = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/news',
    generateId: folderId,
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      sourceUrl: z.string().url(),
      relatedNotes: z.array(z.string()).optional(),
      ...prose,
      ...facets,
    })
    .transform(withSummary),
});

export const collections = { notes, projects, news };
