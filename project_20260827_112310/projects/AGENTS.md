# 项目上下文

## 项目概览

海龟汤题库网页 — 一个情境推理游戏题库平台，支持题库展示、AI 主持人互动推理、题目管理（增删改/导入导出）。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/
│   │   ├── (main)/         # 主布局组（含 Header）
│   │   │   ├── page.tsx              # 首页：题库展示 + 筛选
│   │   │   ├── game/[id]/page.tsx    # 推理游戏页：AI 聊天框
│   │   │   ├── settings/page.tsx     # 设置页：API Key 配置
│   │   │   └── manage/page.tsx       # 管理页：题目增删改 + 导入导出
│   │   ├── api/chat/route.ts         # AI 代理转发 API
│   │   ├── layout.tsx                # 根布局
│   │   └── globals.css               # 全局样式（深色主题）
│   ├── components/
│   │   ├── ui/             # Shadcn UI 组件库
│   │   ├── header.tsx      # 顶部导航
│   │   └── soup-card.tsx   # 题目卡片 + 标签组件
│   ├── data/
│   │   └── soups.json      # 题库 JSON 数据
│   ├── lib/
│   │   ├── utils.ts        # 通用工具函数 (cn)
│   │   └── types.ts        # 类型定义 + 标签分类
│   ├── hooks/
│   └── server.ts
├── DESIGN.md               # 设计规范
├── next.config.ts
├── package.json
└── tsconfig.json
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**
