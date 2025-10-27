import React from 'react'
import { Todo } from '../../../shared/types'
import { DatePicker } from './DatePicker'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<Todo>) => void
  
  // 可选：拖拽相关
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  isDragOver?: boolean
  isDragging?: boolean
  
  // 新增：选择与快捷编辑
  onClick?: () => void
  isSelected?: boolean
  // 受控：编辑态（由父组件统一控制，确保同一时间只有一个处于编辑状态）
  isEditingExternal?: boolean
  onStartEdit?: () => void
  onCancelEdit?: () => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  isDragOver,
  isDragging,
  onClick,
  isSelected,
  isEditingExternal,
  onStartEdit,
  onCancelEdit,
}) => {
  const isEditing = !!isEditingExternal
  const [editTitle, setEditTitle] = React.useState(todo.title)
  const [editDescription, setEditDescription] = React.useState(todo.description || '')
  const [editDueDate, setEditDueDate] = React.useState(todo.dueDate || '')

  // 当退出编辑态时，重置本地编辑字段，丢弃未保存的更改
  React.useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title)
      setEditDescription(todo.description || '')
      setEditDueDate(todo.dueDate || '')
    }
  }, [isEditing, todo.title, todo.description, todo.dueDate])
  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      dueDate: editDueDate || undefined,
    })
    onCancelEdit?.()
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditDueDate(todo.dueDate || '')
    onCancelEdit?.()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <div
      className={`group relative ${isEditing ? 'z-40' : 'z-0'} flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 hover:scale-[1.02] hover:border-blue-300/50 dark:hover:border-blue-600/50 backdrop-blur-sm ${
        todo.completed 
          ? 'bg-gray-50/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 opacity-75 scale-95' 
          : isOverdue
          ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/50'
          : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50'
      } ${isDragOver ? 'ring-2 ring-blue-400 border-blue-400' : ''} ${isDragging ? 'opacity-60' : ''} ${isSelected ? 'ring-2 ring-blue-500 border-blue-400' : ''}`}
      draggable={draggable && !isEditing}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {/* 完成状态复选框 */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
          todo.completed
            ? 'bg-blue-500 border-blue-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 m-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* 任务内容 */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3 p-3 bg-white/90 dark:bg-gray-800/90 rounded-lg border border-blue-300 dark:border-blue-600">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="任务标题"
              className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="添加描述"
              rows={2}
              className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DatePicker
                  value={editDueDate}
                  onChange={setEditDueDate}
                  onKeyDown={handleKeyPress}
                  min={new Date().toISOString().split('T')[0]}
                  placeholder="截止日期"
                  size="small"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className={`text-sm font-medium transition-all duration-200 ${
              todo.completed 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`text-xs mt-1 transition-all duration-200 ${
                todo.completed 
                  ? 'text-gray-400 dark:text-gray-500 line-through' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {todo.description}
              </p>
            )}
            {todo.dueDate && (
              <p className={`text-xs mt-1 ${
                isOverdue 
                  ? 'text-red-600 dark:text-red-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                截止: {new Date(todo.dueDate).toLocaleDateString('zh-CN')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* 拖拽手柄 */}
          {draggable && (
            <div className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-600" title="拖动排序">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="7" r="1" /><circle cx="12" cy="7" r="1" /><circle cx="19" cy="7" r="1" />
                <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="17" r="1" /><circle cx="12" cy="17" r="1" /><circle cx="19" cy="17" r="1" />
              </svg>
            </div>
          )}
          <button
            onClick={() => onStartEdit?.()}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all duration-200"
            title="编辑"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
            title="删除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}