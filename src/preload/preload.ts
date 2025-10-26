import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getVersion: () => ipcRenderer.invoke('app-version'),
  
  // 通知相关
  showNotification: (title: string, body: string) => 
    ipcRenderer.invoke('show-notification', title, body),
  
  onNotification: (callback: (data: { title: string; body: string }) => void) => {
    ipcRenderer.on('show-notification', (_, data) => callback(data))
  },
  
  // 移除监听器
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
})

// 类型声明
declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>
      showNotification: (title: string, body: string) => Promise<void>
      onNotification: (callback: (data: { title: string; body: string }) => void) => void
      removeAllListeners: (channel: string) => void
    }
  }
}