import React from 'react'
import { DatePicker } from './DatePicker'

interface AddTodoFormProps {
  onAdd: (title: string, description?: string, dueDate?: string) => void
  // 新增：用于触发“新建任务”时聚焦标题输入框
  focusSignal?: number
  // 新增：当点击“新任务截止日期”并打开日期选择器时触发
  onDueDateOpen?: () => void
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, focusSignal, onDueDateOpen }) => {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [dueDate, setDueDate] = React.useState('')
  const [isExpanded, setIsExpanded] = React.useState(false)
  const titleInputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(
        title.trim(),
        description.trim() || undefined,
        dueDate || undefined
      )
      setTitle('')
      setDescription('')
      setDueDate('')
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setTitle('')
      setDescription('')
      setDueDate('')
      setIsExpanded(false)
      titleInputRef.current?.blur()
    }
  }

  // 当收到外部的 focusSignal 时，展开区域并聚焦标题输入框
  React.useEffect(() => {
    if (typeof focusSignal === 'number') {
      setIsExpanded(true)
      // 下一帧再聚焦，确保元素已渲染
      setTimeout(() => titleInputRef.current?.focus(), 0)
    }
  }, [focusSignal])

  return (
    <form onSubmit={handleSubmit} className={`relative space-y-4 ${isExpanded ? 'z-40' : 'z-0'}`}>
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true)
            setTimeout(() => titleInputRef.current?.focus(), 0)
          }}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          title="新建任务 (⌘N)"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新建任务
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">按 ⌘N 快速打开</span>
        </button>
      ) : (
        <>
          <div className="relative">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="新任务"
              className="w-full px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
            />
          </div>

          <div className="space-y-3 animate-slide-down">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="添加描述"
              rows={2}
              className="w-full px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DatePicker
                  value={dueDate}
                  onChange={setDueDate}
                  onKeyDown={handleKeyDown}
                  min={new Date().toISOString().split('T')[0]}
                  placeholder="截止日期"
                  size="small"
                  onOpen={onDueDateOpen}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false)
                    setTitle('')
                    setDescription('')
                    setDueDate('')
                    titleInputRef.current?.blur()
                  }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  添加任务
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </form>
  )
}