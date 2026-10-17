import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Notes grouped by the project they were written for, newest first.
 * Drives the "notes written while building this" trail — the one thing
 * this site can show that a plain project list cannot.
 */
export async function notesByProject(): Promise<
  Map<string, CollectionEntry<'notes'>[]>
> {
  const notes = (await getCollection('notes'))
    .filter((n) => n.data.type === 'project' && n.data.relatedProject)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const map = new Map<string, CollectionEntry<'notes'>[]>();
  for (const n of notes) {
    const key = n.data.relatedProject!;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(n);
  }
  return map;
}

/** Title lookup for notes, used to name a news item's follow-up notes. */
export async function noteTitles(): Promise<Map<string, string>> {
  const notes = await getCollection('notes');
  return new Map(notes.map((n) => [n.id, n.data.title]));
}

/** Title lookup for projects, used on note rows. */
export async function projectTitles(): Promise<Map<string, string>> {
  const projects = await getCollection('projects');
  return new Map(projects.map((p) => [p.id, p.data.title]));
}
