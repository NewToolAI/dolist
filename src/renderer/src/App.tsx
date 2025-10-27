import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useTodoStore } from './store/todoStore'
import { TodoItem } from './components/TodoItem'
import { AddTodoForm } from './components/AddTodoForm'
import { SettingsModal } from './components/SettingsModal'
import { DailyStats } from './components/DailyStats'

function App() {
  // 主题模式：system 跟随系统，light 亮模式，dark 暗模式
  type ThemeMode = 'system' | 'light' | 'dark'
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode') as ThemeMode | null
    return saved ?? 'system'
  })
  const [systemPrefDark, setSystemPrefDark] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  
  const {
    filteredTodos,
    todoStats,
    filter,
    searchQuery,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    setSearchQuery,
    reorderTodos,
  } = useTodoStore()

  const todos = filteredTodos()
  const stats = todoStats()

  // 选择状态
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  // 搜索框引用
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // AddTodoForm 聚焦信号（Cmd+N）
  const [createFocusSignal, setCreateFocusSignal] = React.useState<number | undefined>(undefined)
  // 当前处于编辑态的任务 id（确保同一时间只有一个编辑）
  const [editingId, setEditingId] = React.useState<string | null>(null)
  // TodoItem 快捷编辑信号（Cmd+E，仅对选中项生效）
  // removed: editSignal no longer used

  // 键盘快捷键
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return

      const key = e.key.toLowerCase()
      switch (key) {
        case 'n':
          e.preventDefault()
          setCreateFocusSignal((t) => (t ?? 0) + 1)
          break
        case 'd':
          if (selectedId) {
            e.preventDefault()
            deleteTodo(selectedId)
            setSelectedId(null)
            setEditingId((prev) => (prev === selectedId ? null : prev))
          }
          break
        case 'e':
          if (selectedId) {
            e.preventDefault()
            setEditingId(selectedId)
          }
          break
        case 'f':
          e.preventDefault()
          searchInputRef.current?.focus()
          break
        case ',':
          e.preventDefault()
          setShowSettings(true)
          break
        case 't':
          e.preventDefault()
          setThemeMode((m) => (m === 'system' ? 'light' : m === 'light' ? 'dark' : 'system'))
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, deleteTodo])

  // 拖拽状态
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dragOverId, setDragOverId] = React.useState<string | null>(null)

  const createDragStart = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(id)
  }
  const createDragOver = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverId(id)
  }
  const createDrop = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (sourceId && sourceId !== id) {
      reorderTodos(sourceId, id)
    }
    setDragOverId(null)
    setDraggingId(null)
  }
  const handleDragEnd = () => {
    setDragOverId(null)
    setDraggingId(null)
  }
  const createDragEnter = (id: string) => () => setDragOverId(id)
  const createDragLeave = (id: string) => () => {
    if (dragOverId === id) setDragOverId(null)
  }

  // 检测系统主题偏好
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPrefDark(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefDark(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 应用主题类（根据 ThemeMode 与系统偏好）
  const isDarkEffective = themeMode === 'dark' || (themeMode === 'system' && systemPrefDark)
  React.useEffect(() => {
    if (isDarkEffective) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('themeMode', themeMode)
  }, [isDarkEffective, themeMode])

  const cycleThemeMode = () => {
    setThemeMode((m) => (m === 'system' ? 'light' : m === 'light' ? 'dark' : 'system'))
  }

  const renderThemeIcon = () => {
    switch (themeMode) {
      case 'system':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="12" rx="2" strokeWidth="2" />
            <path d="M9 21h6M12 17v4" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )
      case 'light':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )
      case 'dark':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`h-screen flex flex-col transition-all duration-500 ${isDarkEffective ? 'dark' : ''}`}>
      <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
        {/* 标题栏 */}
        <div className="app-drag flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm flex-shrink-0">
          <div></div>
          <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-200">DoList</h1>
          <div className="app-no-drag flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="设置"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={cycleThemeMode}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={themeMode === 'system' ? '跟随系统' : themeMode === 'light' ? '亮模式' : '暗模式'}
            >
              {renderThemeIcon()}
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* 侧边栏 */}
           <div className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 flex flex-col">
            {/* 上部分：搜索和过滤 */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {/* 搜索框 */}
                <div>
                  <input
                     ref={searchInputRef}
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="搜索"
                     className="w-full px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                   />
                </div>

                {/* 任务过滤 */}
                <div>
                  <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    任务列表
                  </h2>
                  <nav className="space-y-1">
                    <button
                       onClick={() => setFilter('all')}
                       className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                         filter === 'all'
                           ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                       }`}
                     >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        所有任务
                      </span>
                      <span className="text-xs">{stats.total}</span>
                    </button>
                    <button
                       onClick={() => setFilter('active')}
                       className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                         filter === 'active'
                           ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                       }`}
                     >
                       <span className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                         进行中
                       </span>
                       <span className="text-xs font-semibold">{stats.active}</span>
                     </button>
                     <button
                       onClick={() => setFilter('completed')}
                       className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                         filter === 'completed'
                           ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                       }`}
                     >
                       <span className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                         已完成
                       </span>
                       <span className="text-xs font-semibold">{stats.completed}</span>
                     </button>
                     <button
                       onClick={() => setFilter('overdue')}
                       className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                         filter === 'overdue'
                           ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                       }`}
                     >
                       <span className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>
                         已逾期
                       </span>
                       <span className="text-xs font-semibold">{stats.overdue}</span>
                     </button>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* 底部：每日任务统计 */}
            <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <DailyStats />
            </div>
          </div>

          {/* 主内容区域 */}
           <div className="flex-1 flex flex-col bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm overflow-y-auto">
             <div className="p-8">
              {/* 添加任务表单 */}
              <div className="mb-6">
                <AddTodoForm onAdd={addTodo} focusSignal={createFocusSignal} />
              </div>

              {/* 任务列表 */}
              <div className="space-y-3">
                {todos.length === 0 ? (
                   <div className="text-center py-16">
                     <div className="text-gray-400 dark:text-gray-500 mb-4">
                       <svg className="w-20 h-20 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                       {searchQuery ? '没有找到匹配的任务' : '开始您的第一个任务'}
                     </h3>
                     <p className="text-gray-500 dark:text-gray-500 text-sm">
                       {searchQuery ? '尝试使用不同的关键词搜索' : '添加一个任务来开始您的高效工作流程'}
                     </p>
                   </div>
                ) : (
                  todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                      draggable
                      onDragStart={createDragStart(todo.id)}
                      onDragOver={createDragOver(todo.id)}
                      onDrop={createDrop(todo.id)}
                      onDragEnd={handleDragEnd}
                      onDragEnter={createDragEnter(todo.id)}
                      onDragLeave={createDragLeave(todo.id)}
                      isDragOver={dragOverId === todo.id}
                      isDragging={draggingId === todo.id}
                      onClick={() => setSelectedId(todo.id)}
                      isSelected={selectedId === todo.id}
                      isEditingExternal={editingId === todo.id}
                      onStartEdit={() => setEditingId(todo.id)}
                      onCancelEdit={() => setEditingId(null)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />

      {/* 设置模态框 */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
}

export default App