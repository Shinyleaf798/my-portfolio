---
title: "Rust 所有权与借用初步理解"
date: 2026-07-15
type: "project"
relatedProject: "rust-cli-tool"
category: "Rust"
tags: ["Rust", "所有权", "内存"]
summary: "在写 CLI 工具时被借用检查器拦下, 借机把所有权、借用、生命周期理了一遍。"
---

## 所有权三原则

1. 每个值有且只有一个所有者
2. 同一时刻只能有一个所有者
3. 所有者离开作用域时, 值被丢弃

## 借用

借用分为不可变借用 `&T` 和可变借用 `&mut T`。规则是:
在同一作用域内, 要么有多个不可变借用, 要么只有一个可变借用, 二者不可兼得。

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s;      // ok
    let r2 = &s;      // ok
    println!("{r1} {r2}");
    let r3 = &mut s;  // 前面的不可变借用已不再使用, 这里 ok
    r3.push_str(" world");
}
```

## 我踩的坑

遍历目录时想同时读取和修改同一个 `Vec`, 被借用检查器拦下。
最后用索引循环 + 先收集再修改的方式绕开了。
