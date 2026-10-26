# Portfolio — 公开学习日记

基于 [Astro](https://astro.build) 的个人 Portfolio / 学习日志网站, 含笔记、项目、资讯三大板块,
纯前端全文搜索 (Pagefind), 通过 GitHub Actions 部署到 GitHub Pages。

**🌐 线上网站 → <https://shinyleaf798.github.io/my-portfolio/>**

[![Build and Deploy](https://github.com/Shinyleaf798/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shinyleaf798/my-portfolio/actions/workflows/deploy.yml)

上面的徽章显示最近一次部署状态, 点击进入 [Actions 页面](https://github.com/Shinyleaf798/my-portfolio/actions)
查看构建日志。

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
│   ├── notes/             笔记 (.md)  ← 生产环境由笔记仓库注入
│   ├── projects/          项目 (.md 或 文件夹/index.md + 图片)
│   └── news/              资讯 (.md)
├── components/            Hero / Nav / Footer / 条目 / TOC / TagFilter
├── layouts/BaseLayout.astro
├── lib/                   url() 基路径助手 · 日期格式化 · 标签分组
├── pages/                 路由页面
└── styles/global.css      设计 Token 与全局样式
scripts/
└── prune-invalid-content.mjs   构建前剔除草稿和 frontmatter 不合格的内容
```

## 内容 Schema

完整规则 (写作者视角) 在笔记仓库的
[docs/publishing-rules.md](https://github.com/Shinyleaf798/my-note/blob/main/docs/publishing-rules.md)。
权威定义是 [src/content.config.ts](src/content.config.ts)。

| | 必填 | 可选 |
| --- | --- | --- |
| 全部 | `title`, `date`, `description` (或 `summary`) | 分面 `languages[]` `frameworks[]` `tools[]` `domains[]`, `tags[]`, `draft` |
| Notes | | `type` + `relatedProject`, `category`, `relatedNotes[]` |
| Projects | | `featured`, `repoUrl` |
| News | `sourceUrl` | `relatedNotes[]` |

- **分面**直接生成标签筛选的分组行, 代码里不维护技术名对照表。每行超过 6 个时折叠。
- **`draft: true`** 的条目在构建前被拿掉, 不算错误。
- **`relatedNotes`** 在笔记之间是双向的: A 指向 B, 两篇底部都会列出对方。
- 项目页自动列出 `type: project` + `relatedProject` 指向它的笔记。
- 条目可以是文件夹 (`corddaily/index.md` + 图片), 图片用相对路径引用, 构建时自动压缩。

## 内容来源与自动部署

笔记、资讯、项目内容都来自独立的笔记仓库
([Shinyleaf798/my-note](https://github.com/Shinyleaf798/my-note)), 构建时注入。

**选择要发布的文件夹** — 在 [deploy.yml](.github/workflows/deploy.yml) 顶部的
`NOTES_SOURCES` / `NEWS_SOURCES` / `PROJECTS_SOURCES` 里列出, **一行一个**。
没列进去的文件夹根本不会被下载, 所以笔记仓库可以放草稿和私人笔记。

**自动重建** — 笔记仓库 push 后通过 `repository_dispatch` 触发本仓库构建。
配置方法见 [docs/notes-repo-workflow.yml](docs/notes-repo-workflow.yml) 开头的注释。

**出错时的行为**:

| 情况 | 结果 |
| --- | --- |
| 单个文件 frontmatter 不合格 | 跳过该文件, **其余照常部署**, 运行标红并列出原因 |
| 引用的图片不存在 | **构建失败, 不部署** |
| 清单里的文件夹拉不到 | **直接失败, 不部署** (配置错误, 否则会悄悄发布一个空站) |
| 笔记仓库检出失败 | **直接失败, 不部署** |

本地 `npm run build` 保持严格 — 仓库自己提交的内容出问题就该当场报错。
想手动检查注入内容: `npm run check:content`。

## 部署 (GitHub Pages)

1. [astro.config.mjs](astro.config.mjs) 里的 `site` 与 `base`:
   - 部署到 `https://<user>.github.io/<repo>/` → `site: 'https://<user>.github.io'`, `base: '/<repo>/'`
   - 根路径或自定义域名 → `base: '/'`
2. [deploy.yml](.github/workflows/deploy.yml) 里的 `NOTES_REPO` 指向笔记仓库。
   私有仓库需配置 `NOTES_REPO_TOKEN` secret。
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
