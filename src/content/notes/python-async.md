---
title: "Python asyncio 的心智模型"
date: 2026-06-28
type: "general"
category: "Python"
tags: ["Python", "异步", "并发"]
summary: "搞清楚 event loop、coroutine、await 到底在做什么, 而不是死记 async/await 语法。"
---

## 一句话理解

`async` 函数调用后不会立即执行, 而是返回一个 coroutine 对象;
真正跑它的是 event loop。`await` 表示"这里可能要等, 先把控制权交回去"。

## 常见误区

- `async` 不等于多线程, 它是单线程内的协作式调度
- CPU 密集任务用 asyncio 不会变快, 那是 I/O 密集的场景

## 一个例子

```python
import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return f"{name} done"

async def main():
    results = await asyncio.gather(
        fetch("a", 1),
        fetch("b", 2),
    )
    print(results)

asyncio.run(main())
```

两个任务总耗时约 2 秒而非 3 秒, 因为它们在等待时让出了控制权。
