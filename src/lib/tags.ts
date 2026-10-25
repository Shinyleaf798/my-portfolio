// Every entry describes itself with five facets. Four of them name a kind
// of thing (language / framework / tool / domain); `tags` is whatever is
// left — topics, techniques, anything free-form.
export interface Faceted {
  languages: string[];
  frameworks: string[];
  tools: string[];
  domains: string[];
  tags: string[];
}

/**
 * Flat, deduped tag list for an entry — what the filter matches against
 * and what the card displays. Facet order puts the concrete things first.
 */
export function allTags(d: Faceted): string[] {
  return [
    ...new Set([...d.languages, ...d.frameworks, ...d.tools, ...d.domains, ...d.tags]),
  ];
}
