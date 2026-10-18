---
title: 'CordDaily - 记账 App'
date: 2026-10-04
description: '用 TypeScript 写的移动端日常开销记录应用。'
featured: true
languages: ["TypeScript"]
frameworks: ["React Native"]
domains: ["前端", "移动端"]
tags: ["记账", "本地存储"]
repoUrl: "https://github.com/Shinyleaf798/CordDaily"
---

## 项目背景

写为什么做这个。

## 界面

图片和这个 md 放同一个文件夹, 用相对路径引用。
构建时会自动压成 WebP 并带上宽高:

![记账主界面](./screenshot-home.png)

## 技术选型

- 框架 / 状态管理 / 数据怎么存

## 踩过的坑

在 my-note 的 `notes/` 里写笔记, frontmatter 填上
`type: project` 和 `relatedProject: corddaily`,
就会自动出现在这个项目页底部的「做这个时写的笔记」。
