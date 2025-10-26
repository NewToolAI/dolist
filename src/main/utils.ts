import { app } from 'electron'

// 使用 Electron 的打包状态来判断是否为开发模式
export const isDev = !app.isPackaged