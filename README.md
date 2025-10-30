# DoList

一个基于 Electron + React + Vite 的简单、可用的桌面待办应用（面向 macOS），支持基础的任务管理、筛选、搜索、到期提醒、导入导出和深浅色主题。

## 预览截图

![应用截图](docs/app-demo.png)

## 功能

- 添加、编辑、删除、勾选完成任务
- 任务筛选：全部、进行中、已完成、已逾期
- 关键词搜索（标题与描述）
- 可选截止日期，支持到期与提前提醒（默认 15 分钟、1 小时、24 小时）
- 日常统计（今日创建、今日完成、今日到期、今日逾期及完成率）
- 拖拽调整任务顺序
- 数据导入/导出（JSON 文件）
- 深色/浅色/跟随系统主题

> 说明：当前版本的数据保存在浏览器的 `localStorage` 中，未接入云同步或账号体系。`sqlite3` 依赖存在，但目前代码中未使用。

## 快速开始

- 环境要求：建议使用 `Node.js 18+` 与 `npm`
- 安装依赖：
  - `npm install`
- 开发模式（自动启动渲染端和主进程）
  - `npm run dev`
- 构建生产包（渲染端与主进程）
  - `npm run build`
- 打包为 macOS 应用（DMG）
  - `npm run dist`
  - 产物位于 `release/` 目录

## 技术栈

- 桌面框架：`Electron`
- 前端：`React 18`、`Vite`、`TypeScript`
- 样式：`Tailwind CSS`
- 状态管理：`Zustand`
- 交互与工具：`react-hook-form`、`react-hot-toast`、`date-fns`、`lucide-react`

## 目录结构（简要）

- `src/main/` Electron 主进程代码（窗口、菜单、环境判断等）
- `src/preload/` 预加载脚本（安全暴露 API）
- `src/renderer/` 前端界面（React + Tailwind）
- `src/shared/` 共享类型定义
- `dist/` 构建输出（开发/生产）
- `release/` 打包输出（DMG 等）

## 已知限制

- 打包配置当前主要面向 `macOS (arm64)`，其他平台未验证
- 通知功能依赖系统/浏览器通知权限，需要用户允许后才会生效
- `localStorage` 容量有限，不适合大量数据或多设备同步场景
- 暂不包含用户登录、云同步、多设备协同等功能

## 许可证

- 采用 `MIT` 许可证，详见 `package.json` 中的 `license` 字段