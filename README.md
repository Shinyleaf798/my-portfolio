# Portfolio — 公开学习日记

基于 [Astro](https://astro.build) 的个人 Portfolio / 学习日志网站, 含笔记、项目、资讯三大板块,
纯前端全文搜索 (Pagefind), 通过 GitHub Actions 部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
```

> 搜索索引在构建时生成, 因此 dev 模式下 `/search` 无结果。要预览搜索:
>
> ```bash
> npm run build && npm run preview
> ```

## 目录结构

```
src/
├── content.config.ts      内容集合 Schema (notes / projects / news)
├── content/
│   ├── notes/             笔记 (.md)  ← 生产环境由独立仓库注入
│   ├── projects/          项目 (.md)
│   └── news/              资讯 (.md)
├── components/            Hero / Nav / Footer / 卡片 / TOC / TagFilter
├── layouts/BaseLayout.astro
├── lib/                   url() 基路径助手 · 日期格式化
├── pages/                 路由页面
└── styles/global.css      设计 Token 与全局样式
```

## 内容 Schema

- **Notes** — `title, date, type(project|general), relatedProject?, category, tags[], summary`
- **Projects** — `title, date, summary, featured, tags[], repoUrl?`
- **News** — `title, date, sourceUrl, summary, relatedNotes[]?, tags[]`

项目详情页会自动聚合 `relatedProject` 指向它的所有笔记, 无需手动维护列表。

## 部署 (GitHub Pages)

1. 在 [astro.config.mjs](astro.config.mjs) 中设置 `site` 与 `base`:
   - 部署到 `https://<user>.github.io/<repo>/` → `site: 'https://<user>.github.io'`, `base: '/<repo>/'`
   - 部署到根路径或自定义域名 → `base: '/'`
2. 在 [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 中把 `your-name/portfolio-notes`
   换成你的笔记仓库。私有仓库需配置 `NOTES_REPO_TOKEN` secret。
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
4. 笔记仓库更新后, 到本仓库 Actions 页面点 **Run workflow** 手动触发重建。

## 待办 (交接文档第 9 节)

- [ ] 确认笔记仓库 / 网站仓库的实际命名
- [ ] 填写 [about.astro](src/pages/about.astro) 的个人真实信息
- [ ] 敲定 Hero 打字机文案 (`src/components/Hero.astro`)
- [ ] 为要精选的项目标记 `featured: true`
- [ ] 配置 `site` / `base` 与笔记仓库地址
