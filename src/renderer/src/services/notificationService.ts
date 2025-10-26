import { Todo, NotificationData } from '../../../shared/types'

export class NotificationService {
  private static instance: NotificationService
  private notificationPermission: NotificationPermission = 'default'
  private reminderTimeouts: Map<string, NodeJS.Timeout> = new Map()

  private constructor() {
    this.requestPermission()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      this.notificationPermission = 'granted'
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      this.notificationPermission = permission
      return permission === 'granted'
    }

    return false
  }

  showNotification(data: NotificationData): void {
    if (this.notificationPermission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: '/icon.png', // 应用图标
      badge: '/icon.png',
      tag: data.todoId || 'general',
      requireInteraction: true,
      silent: false
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
      
      // 如果有todoId，可以跳转到对应的todo
      if (data.todoId) {
        // 这里可以添加跳转逻辑
        console.log('Navigate to todo:', data.todoId)
      }
    }

    // 5秒后自动关闭
    setTimeout(() => {
      notification.close()
    }, 5000)
  }

  scheduleReminder(todo: Todo, reminderMinutes: number[] = [15, 60, 1440]): void {
    if (!todo.dueDate) return

    const dueDate = new Date(todo.dueDate)
    const now = new Date()

    // 清除之前的提醒
    this.clearReminder(todo.id)

    reminderMinutes.forEach(minutes => {
      const reminderTime = new Date(dueDate.getTime() - minutes * 60 * 1000)
      
      if (reminderTime > now) {
        const timeout = setTimeout(() => {
          this.showNotification({
            title: '任务提醒',
            body: `任务"${todo.title}"将在${minutes < 60 ? minutes + '分钟' : Math.floor(minutes / 60) + '小时'}后到期`,
            todoId: todo.id,
            type: 'reminder'
          })
        }, reminderTime.getTime() - now.getTime())

        this.reminderTimeouts.set(`${todo.id}-${minutes}`, timeout)
      }
    })

    // 设置到期提醒
    if (dueDate > now) {
      const timeout = setTimeout(() => {
        this.showNotification({
          title: '任务到期',
          body: `任务"${todo.title}"已到期`,
          todoId: todo.id,
          type: 'deadline'
        })
      }, dueDate.getTime() - now.getTime())

      this.reminderTimeouts.set(`${todo.id}-deadline`, timeout)
    }
  }

  clearReminder(todoId: string): void {
    // 清除所有与该todo相关的提醒
    for (const [key, timeout] of this.reminderTimeouts.entries()) {
      if (key.startsWith(todoId)) {
        clearTimeout(timeout)
        this.reminderTimeouts.delete(key)
      }
    }
  }

  clearAllReminders(): void {
    this.reminderTimeouts.forEach(timeout => clearTimeout(timeout))
    this.reminderTimeouts.clear()
  }

  checkOverdueTodos(todos: Todo[]): void {
    const now = new Date()
    
    todos.forEach(todo => {
      if (!todo.completed && todo.dueDate) {
        const dueDate = new Date(todo.dueDate)
        if (dueDate < now) {
          // 检查是否已经发送过逾期通知
          const lastNotified = localStorage.getItem(`overdue-notified-${todo.id}`)
          const today = now.toDateString()
          
          if (lastNotified !== today) {
            this.showNotification({
              title: '任务逾期',
              body: `任务"${todo.title}"已逾期`,
              todoId: todo.id,
              type: 'deadline'
            })
            
            localStorage.setItem(`overdue-notified-${todo.id}`, today)
          }
        }
      }
    })
  }

  // 获取通知权限状态
  getPermissionStatus(): NotificationPermission {
    return this.notificationPermission
  }

  // 测试通知
  testNotification(): void {
    this.showNotification({
      title: '测试通知',
      body: '这是一个测试通知，用于验证通知功能是否正常工作',
      type: 'info'
    })
  }
}

export default NotificationService.getInstance()