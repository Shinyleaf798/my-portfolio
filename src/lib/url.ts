// Prepends the base path so links stay correct when deployed to a
// GitHub Pages subpath.
const base = import.meta.env.BASE_URL; // e.g. '/' or '/repo/'

export function url(path = ''): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}` || '/';
}
