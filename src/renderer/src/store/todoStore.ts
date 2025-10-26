import { create } from 'zustand'
import { Todo, TodoFilter, TodoStats } from '../../../shared/types'
import { StorageService } from '../services/storageService'
import NotificationService from '../services/notificationService'

interface TodoState {
  todos: Todo[]
  filter: TodoFilter
  searchQuery: string
  
  // Actions
  addTodo: (title: string, description?: string, dueDate?: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, updates: Partial<Todo>) => void
  setFilter: (filter: TodoFilter) => void
  setSearchQuery: (query: string) => void
  
  // 数据管理
  loadTodos: () => void
  exportTodos: () => void
  importTodos: (file: File) => Promise<void>
  clearAllTodos: () => void
  
  // 通知管理
  enableNotifications: () => Promise<boolean>
  scheduleReminders: (todoId?: string) => void
  checkOverdueTodos: () => void
  testNotification: () => void
  
  // Computed
  filteredTodos: () => Todo[]
  todoStats: () => TodoStats
}

// 初始化示例数据
const getInitialTodos = (): Todo[] => {
  const savedTodos = StorageService.loadTodos()
  
  // 如果没有保存的数据，返回空数组
  if (savedTodos.length === 0) {
    return []
  }
  
  return savedTodos
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: getInitialTodos(),
  filter: 'active',
  searchQuery: '',

  addTodo: (title: string, description?: string, dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description: description || '',
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
    }
    
    set((state) => {
      const newTodos = [...state.todos, newTodo]
      StorageService.saveTodos(newTodos)
      return { todos: newTodos }
    })
    
    // 如果有截止日期，设置提醒
    if (dueDate) {
      NotificationService.scheduleReminder(newTodo)
    }
  },

  toggleTodo: (id: string) => {
    set((state) => {
      const newTodos = state.todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      )
      StorageService.saveTodos(newTodos)
      return { todos: newTodos }
    })
  },

  deleteTodo: (id: string) => {
    set((state) => {
      const newTodos = state.todos.filter(todo => todo.id !== id)
      StorageService.saveTodos(newTodos)
      return { todos: newTodos }
    })
  },

  editTodo: (id: string, updates: Partial<Todo>) => {
    set((state) => {
      const newTodos = state.todos.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
      StorageService.saveTodos(newTodos)
      return { todos: newTodos }
    })
    
    // 如果更新了截止日期，重新设置提醒
    if (updates.dueDate) {
      const { todos } = get()
      const updatedTodo = todos.find(todo => todo.id === id)
      if (updatedTodo && !updatedTodo.completed) {
        NotificationService.scheduleReminder(updatedTodo)
      }
    }
  },

  setFilter: (filter: TodoFilter) => {
    set({ filter })
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },

  loadTodos: () => {
    const savedTodos = StorageService.loadTodos()
    set({ todos: savedTodos })
  },

  exportTodos: () => {
    const { todos } = get()
    StorageService.exportTodos(todos)
  },

  importTodos: async (file: File) => {
    try {
      const importedTodos = await StorageService.importTodos(file)
      set({ todos: importedTodos })
      StorageService.saveTodos(importedTodos)
    } catch (error) {
      console.error('Failed to import todos:', error)
      throw error
    }
  },

  clearAllTodos: () => {
    set({ todos: [] })
    StorageService.clearTodos()
    NotificationService.clearAllReminders()
  },

  // 通知管理
  enableNotifications: async () => {
    return await NotificationService.requestPermission()
  },

  scheduleReminders: (todoId?: string) => {
    const { todos } = get()
    if (todoId) {
      const todo = todos.find(t => t.id === todoId)
      if (todo) {
        NotificationService.scheduleReminder(todo)
      }
    } else {
      // 为所有未完成的有截止日期的任务设置提醒
      todos.forEach(todo => {
        if (!todo.completed && todo.dueDate) {
          NotificationService.scheduleReminder(todo)
        }
      })
    }
  },

  checkOverdueTodos: () => {
    const { todos } = get()
    NotificationService.checkOverdueTodos(todos)
  },

  testNotification: () => {
    NotificationService.testNotification()
  },

  filteredTodos: () => {
    const { todos, filter, searchQuery } = get()
    
    let filtered = todos
    
    // 按状态过滤
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed)
    } else if (filter === 'overdue') {
      const now = new Date()
      filtered = filtered.filter(todo => 
        !todo.completed && 
        todo.dueDate && 
        new Date(todo.dueDate) < now
      )
    }
    
    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query))
      )
    }
    
    return filtered
  },

  todoStats: () => {
    const { todos } = get()
    const now = new Date()
    
    return {
      total: todos.length,
      completed: todos.filter(todo => todo.completed).length,
      active: todos.filter(todo => !todo.completed).length,
      pending: todos.filter(todo => !todo.completed).length,
      overdue: todos.filter(todo => 
        !todo.completed && 
        todo.dueDate && 
        new Date(todo.dueDate) < now
      ).length,
    }
  },
}))