---
title: "个人 Portfolio 网站"
date: 2026-08-20
summary: "基于 Astro 搭建的公开学习日志与知识库, 含笔记、项目、资讯三大板块与站内搜索。"
featured: true
tags: ["Astro", "TypeScript", "前端"]
repoUrl: "https://github.com/your-name/portfolio"
---

## 项目背景

一直想有个地方沉淀学习过程, 而不是零散地记在各处。于是用 Astro 做了这个站点,
把它当成一本公开的学习日记。

## 技术选型

- **Astro** — 内容驱动, 静态输出, Content Collections 管理 Markdown
- **Pagefind** — 纯前端全文搜索, 构建时生成索引
- **GitHub Actions + Pages** — 自动构建与部署

## 踩过的坑

Content Collections 在 Astro 5 里改用 glob loader, 配置文件也从 `src/content/config.ts`
迁移到 `src/content.config.ts`, 迁移时踩了一下。
