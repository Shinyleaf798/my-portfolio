# Portfolio — 公开学习日记

我的个人网站：笔记、项目、资讯三个板块，加上站内搜索。用 [Astro](https://astro.build) 做，部署在 GitHub Pages。

**🌐 网站 → <https://shinyleaf798.github.io/my-portfolio/>**

[![Build and Deploy](https://github.com/Shinyleaf798/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shinyleaf798/my-portfolio/actions/workflows/deploy.yml)

徽章是绿色就代表最近一次更新成功。点进去能看到每次更新的记录。

## 在自己电脑上跑

```bash
npm install
npm run dev        # 打开 http://localhost:4321/my-portfolio/
```

搜索只在正式构建后才有结果。想试搜索：

```bash
npm run build && npm run preview
```

## 内容从哪来

笔记、资讯、项目介绍都**不写在这个仓库**，而是在笔记仓库
[Shinyleaf798/my-note](https://github.com/Shinyleaf798/my-note)。
怎么写、能填哪些字段，看那边的 [README](https://github.com/Shinyleaf798/my-note#readme)。

笔记仓库一 push，这个网站就会自动重新构建。

- 要发布哪些文件夹：在 [deploy.yml](.github/workflows/deploy.yml) 顶部的 `*_SOURCES` 里列出，一行一个。
- 自动重建怎么设置：见 [docs/notes-repo-workflow.yml](docs/notes-repo-workflow.yml) 开头的注释。
- 字段的正式定义：[src/content.config.ts](src/content.config.ts)。改这里时，记得同步更新笔记仓库的 README。

## 更新失败时

| 情况 | 结果 |
| --- | --- |
| 某篇笔记少了必填字段 | 那篇不发布，其他照常上线，Actions 显示红叉 |
| `draft: true` 的笔记 | 不发布，不算错 |
| 项目的 `cover` 图片不存在 | 那个项目不发布，其他照常上线，Actions 显示红叉 |
| 正文里引用的图片不存在 | **整个网站更新失败** |
| `sourceUrl` / `repoUrl` 不是完整网址 | **整个网站更新失败** |
| 要发布的文件夹是空的或拉不到 | **整个网站更新失败** |

手动检查内容：`npm run check:content`。注意它会**直接删除**草稿和不合格的文件，本地跑之前先确认 `src/content/` 里没有要保留的东西。

## 代码放在哪

```
src/
├── content.config.ts   内容有哪些字段
├── content/            笔记、项目、资讯（正式环境由笔记仓库放进来）
├── components/         页面上的组件（首页、导航、标签筛选……）
├── pages/              每个网址对应的页面
├── lib/                小工具函数
└── styles/global.css   颜色、字体等全局样式
scripts/
└── prune-invalid-content.mjs   构建前拿掉草稿和格式不对的内容
```

## 部署设置（只在第一次需要）

1. [astro.config.mjs](astro.config.mjs) 的 `site` 和 `base` 要对应网址：
   网址是 `https://<user>.github.io/<repo>/` 时，`base` 填 `'/<repo>/'`。
2. [deploy.yml](.github/workflows/deploy.yml) 的 `NOTES_REPO` 指向笔记仓库。
3. GitHub 仓库 Settings → Pages → Source 选 **GitHub Actions**。
