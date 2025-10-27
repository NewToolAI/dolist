// Todo 相关类型
export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
  category?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'overdue'

export interface TodoStats {
  total: number
  completed: number
  active: number
  overdue: number
}

export interface DailyStats {
  todayCreated: number
  todayCompleted: number
  todayDue: number
  todayOverdue: number
  completionRate: number
}

// 应用设置类型
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  autoSave: boolean
  reminderMinutes: number[]
}

// 通知类型
export interface NotificationData {
  title: string
  body: string
  todoId?: string
  type: 'reminder' | 'deadline' | 'info'
}