import { Todo } from '../../../shared/types'

const STORAGE_KEY = 'taskflow_todos'

export class StorageService {
  /**
   * 保存todos到本地存储
   */
  static saveTodos(todos: Todo[]): void {
    try {
      const data = JSON.stringify(todos)
      localStorage.setItem(STORAGE_KEY, data)
    } catch (error) {
      console.error('Failed to save todos:', error)
    }
  }

  /**
   * 从本地存储加载todos
   */
  static loadTodos(): Todo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      
      const todos = JSON.parse(data) as Todo[]
      
      // 验证数据格式
      return todos.filter(todo => 
        todo && 
        typeof todo.id === 'string' &&
        typeof todo.title === 'string' &&
        typeof todo.completed === 'boolean'
      )
    } catch (error) {
      console.error('Failed to load todos:', error)
      return []
    }
  }

  /**
   * 清空所有存储的数据
   */
  static clearTodos(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear todos:', error)
    }
  }

  /**
   * 导出todos数据为JSON文件
   */
  static exportTodos(todos: Todo[]): void {
    try {
      const data = JSON.stringify(todos, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `taskflow-todos-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export todos:', error)
    }
  }

  /**
   * 从JSON文件导入todos数据
   */
  static importTodos(file: File): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string
          const todos = JSON.parse(data) as Todo[]
          
          // 验证导入的数据格式
          const validTodos = todos.filter(todo => 
            todo && 
            typeof todo.id === 'string' &&
            typeof todo.title === 'string' &&
            typeof todo.completed === 'boolean'
          )
          
          resolve(validTodos)
        } catch (error) {
          reject(new Error('Invalid file format'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsText(file)
    })
  }

  /**
   * 获取存储使用情况统计
   */
  static getStorageStats(): { used: number; available: number; percentage: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || ''
      const used = new Blob([data]).size
      
      // 估算localStorage的可用空间（通常为5-10MB）
      const available = 5 * 1024 * 1024 // 5MB
      const percentage = (used / available) * 100
      
      return { used, available, percentage }
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return { used: 0, available: 0, percentage: 0 }
    }
  }
}