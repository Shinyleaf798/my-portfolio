---
title: "Rust 命令行小工具"
date: 2026-07-11
summary: "一个用 Rust 写的文件批量重命名 CLI, 练手所有权、错误处理与 clap 参数解析。"
featured: true
tags: ["Rust", "CLI"]
repoUrl: "https://github.com/your-name/rename-cli"
---

## 为什么做这个

想找个足够小、又能覆盖 Rust 核心概念的项目练手, 文件批量重命名正好合适。

## 学到的东西

- `clap` 的 derive 宏定义参数非常顺手
- 所有权和借用在遍历目录时会逼你想清楚数据流向
- `anyhow` / `thiserror` 让错误处理不再痛苦
