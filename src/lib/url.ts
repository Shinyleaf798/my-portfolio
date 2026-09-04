// 拼接 base 前缀, 保证部署到 GitHub Pages 子路径时链接正确。
const base = import.meta.env.BASE_URL; // 形如 '/' 或 '/repo/'

export function url(path = ''): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}` || '/';
}
