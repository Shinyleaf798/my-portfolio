---
title: "Astro 5 Content Collections 迁移记录"
date: 2026-08-18
type: "project"
relatedProject: "astro-portfolio"
category: "Astro"
tags: ["Astro", "前端", "内容管理"]
summary: "Astro 5 的 Content Collections 改用 glob loader, 记录一下配置写法与迁移要点。"
---

## 变化点

Astro 5 里内容集合配置从 `src/content/config.ts` 迁移到了 `src/content.config.ts`,
并引入 loader 概念。

## 新写法

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({ title: z.string() }),
});
```

## 读取集合

```ts
import { getCollection } from 'astro:content';
const allNotes = await getCollection('notes');
```

注意 entry 现在用 `entry.id` 作为 slug, 渲染正文用 `render(entry)`。
